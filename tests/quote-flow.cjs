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
const sent = [];
const route = load('src/app/api/quote/route.ts', {
  '@/lib/quote-validation': validation,
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
const valid = { name: 'Jane Smith', email: 'jane@example.com', eventDate: '2026-10-24', eventTime: '18:30', eventDuration: '4', eventType: 'Wedding', guestCount: '75', location: 'Houston, TX' };
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
  console.log('PASS: all eight required controls; missing/invalid values blocked in form and API; valid component → JSON → API → HTML/text email includes all eight values. No real emails sent.');
})().catch(error => { console.error(error); process.exitCode = 1; });
