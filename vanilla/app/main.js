import { bootstrapResumeDraftFromUrl, mountResumeView } from "../features/resume/mount-resume-view.js";

function routeKind() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  if (path === "/resume" || path.startsWith("/resume/")) return "resume";
  return "home";
}

function renderHome(app) {
  document.title = "Resume Web Server";
  app.innerHTML = `
    <div class="mx-auto max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
      <h1 class="text-2xl font-bold tracking-tight text-zinc-900">Resume Web Server</h1>
      <p class="mt-2 text-sm leading-relaxed text-zinc-600">
        Build a resume in the browser, keep a local draft, and export with your system print dialog (Save as PDF).
      </p>
      <div class="mt-8">
        <a class="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-100" href="/resume">Open resume builder</a>
      </div>
    </div>
  `;
}

function render() {
  const app = document.getElementById("app");
  if (!app) return;

  const kind = routeKind();
  app.replaceChildren();

  if (kind === "home") {
    renderHome(app);
    return;
  }

  bootstrapResumeDraftFromUrl();
  mountResumeView(app);
}

render();
