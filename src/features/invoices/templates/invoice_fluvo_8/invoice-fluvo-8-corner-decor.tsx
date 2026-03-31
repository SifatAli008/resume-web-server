/** Soft overlapping circles — top-right & bottom-right (reference artwork). */
export function InvoiceFluvo8CornerDecor() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute -right-10 -top-14 h-60 w-60 rounded-full bg-[#6b6ba3]/25 blur-3xl" />
      <div className="absolute right-2 top-0 h-44 w-44 rounded-full bg-sky-200/55 blur-3xl" />
      <div className="absolute right-20 top-14 h-36 w-36 rounded-full bg-violet-300/45 blur-3xl" />
      <div className="absolute right-6 top-32 h-28 w-28 rounded-full bg-amber-200/50 blur-2xl" />

      <div className="absolute -bottom-12 -right-8 h-56 w-56 rounded-full bg-[#6b6ba3]/22 blur-3xl" />
      <div className="absolute bottom-4 right-2 h-40 w-40 rounded-full bg-sky-200/50 blur-3xl" />
      <div className="absolute bottom-16 right-24 h-32 w-32 rounded-full bg-violet-200/40 blur-3xl" />
      <div className="absolute bottom-8 right-12 h-24 w-24 rounded-full bg-amber-200/45 blur-2xl" />
    </div>
  );
}
