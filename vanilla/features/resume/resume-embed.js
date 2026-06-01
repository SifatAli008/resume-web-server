/** Embed modes: app (WebView), thumb, pdf (Puppeteer capture). */

export function getResumeEmbedMode(searchParams) {
  const embed = searchParams?.get("embed");
  const src = searchParams?.get("src");
  if (embed === "app" || embed === "pdf" || embed === "thumb") return embed;
  if (src === "app") return "app";
  return null;
}

export function isResumeEmbedFromUrl(searchParams) {
  return getResumeEmbedMode(searchParams) === "app";
}

import { normalizeTemplateId } from "./constants.js";

export function parseTemplateIdFromPath(pathname = "") {
  const path = String(pathname || "").replace(/\/$/, "") || "/";
  const m = /^\/resume\/(resume_\d{1,2}|resume_fluvo_\d+)$/.exec(path);
  return m ? normalizeTemplateId(m[1]) : null;
}

export function applyEmbedHtmlAttrs(mode) {
  const html = document.documentElement;
  delete html.dataset.embedApp;
  delete html.dataset.embedPdf;
  delete html.dataset.embedThumb;
  if (mode === "app") html.dataset.embedApp = "true";
  if (mode === "pdf") html.dataset.embedPdf = "true";
  if (mode === "thumb") html.dataset.embedThumb = "true";
}

/** Fixed layout width for mobile WebView embeds. */
export const EMBED_LAYOUT_WIDTH = 820;

export function lockEmbedViewport(width = EMBED_LAYOUT_WIDTH) {
  let meta = document.querySelector('meta[name="viewport"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "viewport";
    document.head.appendChild(meta);
  }
  meta.content = `width=${width}, initial-scale=1, maximum-scale=1, user-scalable=no`;
}

/** Thumbnail: first page only, scale to layout width, notify Flutter via ResumeMetrics. */
export function fitResumeThumbEmbed(container, layoutWidth = EMBED_LAYOUT_WIDTH) {
  const root = container?.querySelector?.("#resume-print-root");
  if (!root) return false;

  root.querySelectorAll(".cv-page").forEach((page, i) => {
    page.style.setProperty("display", i === 0 ? "block" : "none", "important");
  });

  const page = root.querySelector(".cv-page") || root;
  const pageW = page.offsetWidth || root.scrollWidth || layoutWidth;
  const pageH = page.offsetHeight || 1100;
  const scale = Math.min(1, layoutWidth / Math.max(pageW, 1));

  root.style.transformOrigin = "top center";
  root.style.transform = `scale(${scale})`;
  root.style.margin = "0 auto";

  const wrap = root.closest(".cv-pdf-embed") || container;
  if (wrap) {
    wrap.style.overflow = "hidden";
    wrap.style.width = `${layoutWidth}px`;
    wrap.style.margin = "0 auto";
  }

  const scaledH = pageH * scale;
  if (typeof ResumeMetrics !== "undefined") {
    ResumeMetrics.postMessage(
      JSON.stringify({ w: layoutWidth, h: scaledH, pageW, pageH }),
    );
  }
  return true;
}

export function scheduleEmbedFit(fn, { attempts = 32, intervalMs = 140 } = {}) {
  let n = 0;
  const timer = setInterval(() => {
    n += 1;
    if (fn() || n >= attempts) clearInterval(timer);
  }, intervalMs);
  if (document.fonts?.ready) document.fonts.ready.then(fn);
  window.addEventListener("resize", fn);
}

/** Scale CV to viewport width in Flutter WebView. */
export function fitResumePreviewToViewport(root) {
  const article = root?.querySelector?.("#resume-print-root") || root;
  if (!article) return;

  const run = () => {
    const shell = article.closest("#rf-preview-shell") || article.parentElement;
    const vw = document.documentElement.clientWidth || window.innerWidth;
    const natural = article.scrollWidth || article.offsetWidth;
    if (!natural || natural <= vw) {
      article.style.transform = "";
      article.style.transformOrigin = "";
      if (shell) shell.style.height = "";
      return;
    }
    const scale = Math.min(1, (vw - 16) / natural);
    article.style.transformOrigin = "top center";
    article.style.transform = `scale(${scale})`;
    if (shell) shell.style.height = `${article.offsetHeight * scale}px`;
  };

  run();
  window.addEventListener("resize", run);
  if (document.fonts?.ready) document.fonts.ready.then(run);
}

export function markPdfReady() {
  let el = document.getElementById("pdf-ready");
  if (!el) {
    el = document.createElement("div");
    el.id = "pdf-ready";
    el.hidden = true;
    document.body.appendChild(el);
  }
  el.setAttribute("data-ready", "1");
  el.textContent = "ready";
}

/** Flutter / native bridge (optional). */
export function postResumePdfToApp(base64Pdf, fileName = "resume.pdf") {
  const bridge = globalThis.FluvoResumeApp || globalThis.FluvoInvoiceApp;
  if (bridge?.postMessage) {
    bridge.postMessage(JSON.stringify({ type: "resume_pdf", fileName, pdf: base64Pdf }));
    return true;
  }
  return false;
}
