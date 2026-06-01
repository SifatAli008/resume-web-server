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

export const EMBED_LAYOUT_WIDTH = 820;

export function lockEmbedViewport(width = EMBED_LAYOUT_WIDTH) {
  let meta = document.querySelector('meta[name="viewport"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "viewport";
    document.head.appendChild(meta);
  }
  const w = typeof width === "number" ? String(width) : width;
  meta.content = `width=${w}, initial-scale=1, maximum-scale=1, user-scalable=no`;
}

const EMBED_STAGE = "cv-embed-fit-stage";

function ensureEmbedStage(content) {
  const parent = content.parentElement;
  if (parent?.classList?.contains(EMBED_STAGE)) return parent;
  const stage = document.createElement("div");
  stage.className = EMBED_STAGE;
  parent.insertBefore(stage, content);
  stage.appendChild(content);
  return stage;
}

export function fitEmbedContain(content, { vw, vh, pad = 10 } = {}) {
  if (!content) return null;
  vw = vw ?? window.innerWidth ?? document.documentElement.clientWidth ?? 360;
  vh = vh ?? window.innerHeight ?? document.documentElement.clientHeight ?? 480;

  const naturalW = content.scrollWidth || content.offsetWidth || 1;
  const naturalH = content.scrollHeight || content.offsetHeight || 1;
  const scale = Math.min((vw - pad * 2) / naturalW, (vh - pad * 2) / naturalH, 1);
  if (!Number.isFinite(scale) || scale <= 0) return null;

  const stage = ensureEmbedStage(content);
  const scaledW = naturalW * scale;
  const scaledH = naturalH * scale;

  stage.style.cssText = [
    "box-sizing:border-box",
    `width:${scaledW}px`,
    `height:${scaledH}px`,
    "overflow:hidden",
    "flex-shrink:0",
    "margin:auto",
    "position:relative",
  ].join(";");

  content.style.boxSizing = "border-box";
  content.style.width = `${naturalW}px`;
  content.style.height = `${naturalH}px`;
  content.style.maxWidth = "none";
  content.style.transform = `scale(${scale})`;
  content.style.transformOrigin = "0 0";
  content.style.margin = "0";

  return { scale, naturalW, naturalH, scaledW, scaledH };
}

function layoutEmbedHost(el) {
  if (!el) return;
  el.style.overflow = "hidden";
  el.style.width = "100%";
  el.style.height = "100%";
  el.style.display = "flex";
  el.style.alignItems = "center";
  el.style.justifyContent = "center";
  el.style.boxSizing = "border-box";
}

export function fitResumeThumbEmbed(container) {
  const root = container?.querySelector?.("#resume-print-root");
  if (!root) return false;

  root.querySelectorAll(".cv-page").forEach((page, i) => {
    page.style.setProperty("display", i === 0 ? "block" : "none", "important");
  });

  const page = root.querySelector(".cv-page");
  if (page) {
    page.style.width = "210mm";
    page.style.minWidth = "210mm";
    page.style.maxWidth = "210mm";
    page.style.boxSizing = "border-box";
  }
  root.style.width = "210mm";
  root.style.maxWidth = "210mm";
  root.style.margin = "0";

  const target = page || root;
  const vw = window.innerWidth || document.documentElement.clientWidth || 360;
  const vh = window.innerHeight || document.documentElement.clientHeight || 480;
  const fit = fitEmbedContain(target, { vw, vh, pad: 8 });
  if (!fit) return false;

  const wrap = root.closest(".cv-pdf-embed") || container;
  const app = document.getElementById("app");
  layoutEmbedHost(wrap);
  layoutEmbedHost(app);
  if (container && container !== wrap) layoutEmbedHost(container);

  if (typeof ResumeMetrics !== "undefined") {
    ResumeMetrics.postMessage(
      JSON.stringify({
        ready: 1,
        w: vw,
        h: vh,
        pageW: fit.naturalW,
        pageH: fit.naturalH,
        scale: fit.scale,
      }),
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

export function fitResumePreviewToViewport(shell) {
  const article = shell?.querySelector?.("#resume-print-root");
  if (!article) return;

  const run = () => {
    const preview = shell?.querySelector?.("#rf-preview");
    if (preview) {
      preview.style.width = "auto";
      preview.style.minWidth = "0";
      preview.style.maxWidth = "none";
      preview.style.padding = "0";
      preview.style.margin = "0";
    }
    layoutEmbedHost(shell);
    layoutEmbedHost(document.getElementById("app"));

    const vw = document.documentElement.clientWidth || window.innerWidth || 360;
    const vh = window.innerHeight || document.documentElement.clientHeight || 600;
    return !!fitEmbedContain(article, { vw, vh, pad: 12 });
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

export function postResumePdfToApp(base64Pdf, fileName = "resume.pdf") {
  const bridge = globalThis.FluvoResumeApp || globalThis.FluvoInvoiceApp;
  if (bridge?.postMessage) {
    bridge.postMessage(JSON.stringify({ type: "resume_pdf", fileName, pdf: base64Pdf }));
    return true;
  }
  return false;
}
