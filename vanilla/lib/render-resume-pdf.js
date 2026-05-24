import { normalizeResumeDraft } from "../features/resume/draft.js";
import { resumePdfCaptureUrl } from "./render-resume-static.js";

async function launchBrowser() {
  const isServerless = Boolean(process.env.AWS_REGION || process.env.VERCEL);

  if (isServerless) {
    const chromium = (await import("@sparticuz/chromium-min")).default;
    const puppeteer = await import("puppeteer-core");
    return puppeteer.default.launch({
      args: chromium.args,
      defaultViewport: { width: 1280, height: 1800 },
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }

  try {
    const puppeteer = await import("puppeteer");
    return puppeteer.default.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  } catch {
    const puppeteer = await import("puppeteer-core");
    return puppeteer.default.launch({
      headless: true,
      channel: "chrome",
      args: ["--no-sandbox"],
    });
  }
}

/**
 * Puppeteer PDF via embed=pdf page (pixel-accurate designed layout).
 */
export async function renderDesignedResumeToPdf({ templateId, draft, baseUrl, invoiceShell = false }) {
  const normalized = normalizeResumeDraft({ ...draft, templateId });
  const url = resumePdfCaptureUrl(baseUrl, templateId, normalized, { invoiceShell });
  const browser = await launchBrowser();

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0", timeout: 90_000 });

    await page.evaluate((d) => {
      window.dispatchEvent(new CustomEvent("resumeData", { detail: d }));
    }, normalized);

    await page.waitForSelector("#resume-print-root", { timeout: 60_000 });
    await page.waitForSelector('#pdf-ready[data-ready="1"]', { timeout: 60_000 });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
