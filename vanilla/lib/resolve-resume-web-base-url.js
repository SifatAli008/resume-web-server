/** Public base URL for Puppeteer to load /resume?embed=pdf */
export function resolveResumeWebBaseUrl(req) {
  const env = process.env.RESUME_WEB_BASE_URL || process.env.INVOICE_WEB_BASE_URL;
  if (env) return String(env).replace(/\/$/, "");

  const host = req.headers?.["x-forwarded-host"] || req.headers?.host;
  const proto = req.headers?.["x-forwarded-proto"] || "http";
  if (host) return `${proto}://${host}`.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`.replace(/\/$/, "");

  return `http://localhost:${process.env.PORT || 3000}`;
}
