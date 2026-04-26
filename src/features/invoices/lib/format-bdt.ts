export function formatBdt(amount: number): string {
  const n = Number.isFinite(amount) ? amount : 0;
  return `$${n.toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatBdtSigned(amount: number): string {
  const n = Number.isFinite(amount) ? amount : 0;
  const sign = n < 0 ? "-" : "";
  return `${sign}${formatBdt(Math.abs(n))}`;
}
