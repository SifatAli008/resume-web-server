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

/** Thumbnail: first page only, scale to fit inside WebView (contain + padding). */
export function fitResumeThumbEmbed(container) {
  const root = container?.querySelector?.("#resume-print-root");
  if (!root) return false;

  root.querySelectorAll(".cv-page").forEach((page, i) => {
    page.style.setProperty("display", i === 0 ? "block" : "none", "important");
  });

  const page = root.querySelector(".cv-page") || root;
  const vw = window.innerWidth || document.documentElement.clientWidth || 360;
  const vh = window.innerHeight || document.documentElement.clientHeight || 480;
  const pad = 16;
  const pageW = page.offsetWidth || page.scrollWidth || root.scrollWidth || 1;
  const pageH = page.offsetHeight || page.scrollHeight || 1;
  let scale = Math.min((vw - pad * 2) / pageW, (vh - pad * 2) / pageH);
  if (!Number.isFinite(scale) || scale <= 0) scale = 0.28;
  scale = Math.min(scale, 1);

  root.style.transformOrigin = "center center";
  root.style.transform = `scale(${scale})`;
  root.style.margin = "0";
  root.style.willChange = "transform";

  const scaledW = pageW * scale;
  const scaledH = pageH * scale;
  const wrap = root.closest(".cv-pdf-embed") || container;
  if (wrap) {
    wrap.style.width = `${scaledW}px`;
    wrap.style.height = `${scaledH}px`;
    wrap.style.maxWidth = "100%";
    wrap.style.maxHeight = "100%";
    wrap.style.flexShrink = "0";
  }

  const app = document.getElementById("app");
  for (const el of [wrap, app, container].filter(Boolean)) {
    el.style.overflow = "hidden";
    if (el !== wrap) {
      el.style.width = "100%";
      el.style.height = "100%";
    }
    el.style.display = "flex";
    el.style.alignItems = "center";
    el.style.justifyContent = "center";
  }

  if (typeof ResumeMetrics !== "undefined") {
    ResumeMetrics.postMessage(
      JSON.stringify({ ready: 1, w: vw, h: vh, pageW, pageH, scale }),
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

/** Scale CV to fit viewport width and height in Flutter WebView. */
export function fitResumePreviewToViewport(root) {
  const article = root?.querySelector?.("#resume-print-root") || root;
  if (!article) return;

  const run = () => {
    const shell = article.closest("#rf-preview-shell") || article.parentElement;
    const vw = document.documentElement.clientWidth || window.innerWidth;
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const pad = 16;
    const naturalW = article.scrollWidth || article.offsetWidth || 1;
    const naturalH = article.scrollHeight || article.offsetHeight || 1;
    const scale = Math.min(
      1,
      (vw - pad) / naturalW,
      (vh - pad) / naturalH,
    );
    if (!Number.isFinite(scale) || scale <= 0) return false;

    article.style.transformOrigin = "top center";
    article.style.transform = `scale(${scale})`;
    if (shell) {
      shell.style.overflow = "hidden";
      shell.style.height = `${naturalH * scale}px`;
      shell.style.minHeight = `${naturalH * scale}px`;
    }
    return true;
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
