const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

// Execute the actual component and route with only React rendering and email delivery mocked.
function load(file, dependencies, globals = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  vm.runInNewContext(code, { exports, require: id => {
    if (!(id in dependencies)) throw new Error(`Unexpected import: ${id}`);
    return dependencies[id];
  }, console, ...globals }, { filename: file });
  return exports;
}
const validation = load('src/lib/quote-validation.ts', {});
const mixologyValidation = load('src/lib/mixology-validation.ts', { '@/lib/quote-validation': validation });
const sent = [];
const route = load('src/app/api/quote/route.ts', {
  '@/lib/quote-validation': validation,
  '@/lib/mixology-validation': mixologyValidation,
  'next/server': { NextResponse: { json: (body, options) => new Response(JSON.stringify(body), options) } },
  resend: { Resend: class { emails = { send: async message => { sent.push(message); return {}; } }; } },
}, { process: { env: { RESEND_API_KEY: 'test-only' } } });
let states = [], cursor = 0, requests = [], focused;
const jsx = (type, props) => ({ type, props });
const Form = load('src/components/booking/QuoteForm.tsx', {
  '@/lib/quote-validation': validation,
  '@/lib/packages': { packages: [{ minHours: 3 }], addOns: [] },
  'next/image': { default: 'img' },
  'react/jsx-runtime': { jsx, jsxs: jsx },
  react: { useCallback: fn => fn, useState: initial => {
    const index = cursor++;
    if (!(index in states)) states[index] = typeof initial === 'function' ? initial() : initial;
    return [states[index], value => { states[index] = typeof value === 'function' ? value(states[index]) : value; }];
  } },
}, { document: { getElementById: id => ({ focus: () => { focused = id; } }) },
  fetch: async (url, options) => { requests.push(JSON.parse(options.body)); return route.POST(new Request('http://localhost/api/quote', options)); } }).default;
const cocktails = [{ slug: 'margarita', name: 'Margarita', category: 'classic', ingredients: [] }];
function render() { cursor = 0; return Form({ cocktails, initialSlugs: ['margarita'] }); }
function nodes(node) {
  if (!node || typeof node !== 'object') return [];
  if (Array.isArray(node)) return node.flatMap(nodes);
  return [node, ...nodes(node.props?.children)];
}
function input(field) { return nodes(render()).find(n => n.props?.id === `quote-${field}`); }
function set(field, value) { input(field).props.onChange({ target: { value } }); }
async function submit() { await nodes(render()).find(n => n.props?.onClick?.name === 'handleSubmit').props.onClick(); }
const valid = { name: 'Jane Smith', email: 'jane@example.com', eventDate: '2026-10-24', eventTime: '18:30', eventDuration: '4', eventType: 'Wedding', guestCount: '75', eventAddress: '123 Main St, Suite 4', city: 'Houston', zipCode: '77002' };
(async () => {
  render(); states[0] = 2;
  for (const [field, value] of Object.entries(valid)) { assert.equal(input(field).props.required, true); set(field, value); }
  for (const field of Object.keys(valid)) {
    set(field, ''); await submit(); assert.equal(requests.length, 0); assert.equal(focused, `quote-${field}`);
    assert.equal(input(field).props['aria-invalid'], true);
    set(field, valid[field]);
    for (const bad of ['', '   ', null, 42]) {
      const response = await route.POST(new Request('http://localhost/api/quote', { method: 'POST', body: JSON.stringify({ ...valid, cocktails: [], [field]: bad }) }));
      assert.equal(response.status, 400); assert.ok((await response.json()).fieldErrors[field]);
    }
  }
  for (const [field, bad] of [['email','bad@'], ['eventDate','2026-02-30'], ['eventTime','24:00'], ['eventTime','12:60'], ['eventDuration','0'], ['eventDuration','25'], ['eventDuration','1.5'], ['guestCount','0'], ['guestCount','1000'], ['guestCount','2.5']]) {
    set(field,bad); await submit(); assert.equal(requests.length,0); set(field,valid[field]);
    const response = await route.POST(new Request('http://localhost/api/quote', { method:'POST', body:JSON.stringify({...valid,cocktails:[],[field]:bad}) }));
    assert.equal(response.status,400);
  }
  assert.equal(sent.length,0);
  for (const [field, bad] of [['eventAddress','Houston, TX'], ['eventAddress','12345'], ['city','123'], ['zipCode','7700'], ['zipCode','770001'], ['zipCode','ABCDE'], ['zipCode','77002-123']]) {
    set(field,bad); await submit(); assert.equal(requests.length,0); set(field,valid[field]);
    const response = await route.POST(new Request('http://localhost/api/quote', { method:'POST', body:JSON.stringify({...valid,cocktails:[],[field]:bad}) }));
    assert.equal(response.status,400);
  }
  await submit(); assert.equal(requests.length,1); assert.equal(sent.length,1);
  for (const [field,value] of Object.entries(valid)) {
    assert.equal(requests[0][field],value);
    assert.ok(sent[0].html.includes(value), `HTML missing ${field}`);
    assert.ok(sent[0].text.includes(value), `Text missing ${field}`);
  }
  assert.ok(sent[0].text.includes('Event Start Time: 18:30'));
  assert.ok(sent[0].html.includes('Event Start Time'));
  assert.equal(sent[0].replyTo,valid.email);
  assert.ok(nodes(render()).some(n => n.props?.children === 'Request received!'));
  const catalog = load('src/lib/cocktails.ts', {}).cocktails;
  assert.ok(catalog.some(c => c.slug === 'cielito-anaranjado'));
  assert.deepEqual(catalog.filter(mixologyValidation.isMixologyCocktailAvailable).map(c => c.slug),
    catalog.filter(c => c.category === 'classic' && c.slug !== 'cielito-anaranjado').map(c => c.slug));
  const classPayload = { ...valid, service: 'Cocktail & Mixology Experience', participantCount: '10', cocktails: [{ name: 'Margarita', tag: 'Included' }] };
  const post = payload => route.POST(new Request('http://localhost/api/quote', { method: 'POST', body: JSON.stringify(payload) }));
  for (const zipCode of ['00501', '77002-1234']) {
    for (const payload of [classPayload, { ...valid, cocktails: [] }]) {
      assert.equal((await post({ ...payload, zipCode })).status, 200);
      assert.ok(sent.at(-1).text.includes(`ZIP Code: ${zipCode}`));
    }
  }
  for (const value of ['', '0', '11', '999', '1.5', '-1', 'abc', null, 10]) {
    assert.equal((await post({ ...classPayload, participantCount: value })).status, 400);
  }
  for (const value of ['1', '10']) assert.equal((await post({ ...classPayload, participantCount: value })).status, 200);
  assert.ok(sent.at(-1).text.includes('Participants: 10'));
  const excluded = [{ name: 'Cielito Anaranjado', tag: 'Included' }];
  assert.equal((await post({ ...classPayload, cocktails: excluded })).status, 400);
  assert.equal((await post({ ...valid, guestCount: '75', cocktails: excluded })).status, 200);
  assert.ok(sent.at(-1).text.includes('Cielito Anaranjado'));

  let classStates = [], classCursor = 0;
  const ClassForm = load('src/components/booking/MixologyQuoteForm.tsx', {
    '@/lib/mixology-validation': mixologyValidation,
    'next/image': { default: 'img' },
    'react/jsx-runtime': { jsx, jsxs: jsx },
    react: { useCallback: fn => fn, useState: initial => {
      const index = classCursor++;
      if (!(index in classStates)) classStates[index] = initial;
      return [classStates[index], value => { classStates[index] = typeof value === 'function' ? value(classStates[index]) : value; }];
    } },
  }, { document: { getElementById: id => ({ focus: () => { focused = id; } }) },
    fetch: async (url, options) => { requests.push(JSON.parse(options.body)); return route.POST(new Request('http://localhost/api/quote', options)); } }).default;
  const classRender = () => { classCursor = 0; return nodes(ClassForm({ cocktails: catalog })); };
  const participantInput = () => classRender().find(n => n.props?.['aria-label'] === 'Number of participants');
  const next = () => classRender().find(n => n.props?.children === 'Next: Choose Cocktails →');
  assert.equal(participantInput().props.max, 10);
  for (const value of ['', '0', '11', '1.5', '999']) {
    participantInput().props.onChange({ target: { value } });
    assert.equal(next().props.disabled, true);
    next().props.onClick(); assert.equal(classStates[0], 1);
  }
  participantInput().props.onChange({ target: { value: '10' } });
  const plus = classRender().find(n => n.props?.['aria-label'] === 'Add one participant');
  assert.equal(plus.props.disabled, true); plus.props.onClick(); assert.equal(classStates[1], '10');
  assert.equal(next().props.disabled, false); next().props.onClick();
  assert.deepEqual(classRender().filter(n => n.props?.cocktail).map(n => n.props.cocktail.slug),
    Array.from(catalog.filter(mixologyValidation.isMixologyCocktailAvailable), c => c.slug));
  classRender().find(n => n.props?.cocktail).props.onToggle('margarita');
  classRender().find(n => n.props?.children === 'Next: Event Details →').props.onClick();
  const classInput = field => classRender().find(n => n.props?.id === `mixology-${field}`);
  const classSet = (field, value) => classInput(field).props.onChange({ target: { value } });
  const classSubmit = () => classRender().find(n => n.props?.onClick?.name === 'handleSubmit').props.onClick();
  classRender().find(n => n.props?.placeholder === 'Jane Smith').props.onChange({ target: { value: valid.name } });
  classRender().find(n => n.props?.type === 'email').props.onChange({ target: { value: valid.email } });
  for (const field of mixologyValidation.mixologyEventFields) {
    assert.equal(classInput(field).props.required, true);
    classSet(field, valid[field]);
  }
  for (const field of mixologyValidation.mixologyEventFields) {
    for (const value of ['', '   ', ...(field === 'eventDate' ? ['2026-02-30'] : field === 'eventTime' ? ['24:00', '12:60'] : field === 'eventAddress' ? ['Houston, TX', '12345'] : field === 'city' ? ['123'] : field === 'zipCode' ? ['7700', '770001', 'ABCDE', '77002-123'] : [])]) {
      const before = requests.length, emailCount = sent.length;
      classSet(field, value); await classSubmit();
      assert.equal(requests.length, before); assert.equal(focused, `mixology-${field}`);
      assert.equal(classInput(field).props['aria-invalid'], true);
      const response = await post({ ...classPayload, [field]: value });
      assert.equal(response.status, 400); assert.ok((await response.json()).fieldErrors[field]);
      assert.equal(sent.length, emailCount);
      classSet(field, valid[field]);
    }
  }
  await classSubmit();
  for (const label of ['Event Address', 'City', 'ZIP Code']) {
    assert.ok(sent.at(-1).html.includes(label));
    assert.ok(sent.at(-1).text.includes(`${label}:`));
  }
  assert.equal('location' in requests.at(-1), false);
  for (const field of mixologyValidation.mixologyEventFields) {
    assert.equal(requests.at(-1)[field], valid[field]);
    assert.ok(sent.at(-1).html.includes(valid[field]));
    assert.ok(sent.at(-1).text.includes(valid[field]));
  }
  console.log('PASS: required class event fields blocked in component and API; valid class submission includes every required event value in HTML and text email.');
  console.log('PASS: class UI and API enforce 1–10 whole participants; class options exclude only Cielito Anaranjado; Mobile Bar still accepts 75 guests and Cielito Anaranjado.');
  console.log('PASS: all required controls; missing/invalid values blocked in both forms and API; valid component → JSON → API → HTML/text email includes address, city and ZIP. ZIP+4 and leading zeros accepted. No real emails sent.');
})().catch(error => { console.error(error); process.exitCode = 1; });
