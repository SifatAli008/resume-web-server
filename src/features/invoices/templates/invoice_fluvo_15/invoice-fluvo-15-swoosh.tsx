/**
 * Decorative white curved band (SVG) separating header left/right zones.
 */
export function InvoiceFluvo15HeaderSwoosh() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
      viewBox="0 0 800 220"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        fill="rgba(255, 255, 255, 0.12)"
        d="M 420 0 C 460 55 480 110 450 165 C 430 200 400 220 380 220 L 800 220 L 800 0 Z"
      />
      <path
        fill="none"
        stroke="rgba(255, 255, 255, 0.28)"
        strokeWidth={1.25}
        d="M 418 0 C 458 58 476 112 448 168 C 432 198 405 218 382 218"
      />
    </svg>
  );
}
