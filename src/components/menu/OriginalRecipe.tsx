// Use the official Solamada Sun artwork without cropping or recoloring.
function SolamadaSun() {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-4 w-4 shrink-0 align-middle"
      style={{
        backgroundImage: "url('/images/logos/solamada-sun-official.png')",
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}

export function OriginalRecipeMark({ slug }: { slug: string }) {
  if (slug !== "cielito-anaranjado") return null;
  return (
    <span className="ml-1.5 inline-flex align-middle" role="img" aria-label="Solamada Original Recipe" title="Solamada Original Recipe">
      <SolamadaSun />
    </span>
  );
}

export function OriginalRecipeLegend() {
  return (
    <p className="mx-auto flex max-w-5xl items-center justify-center gap-2 px-6 pb-6 text-xs text-warm-gray">
      <SolamadaSun /> Solamada Original Recipe
    </p>
  );
}
