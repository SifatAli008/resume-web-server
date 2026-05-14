import { mountResumeApp } from "../features/resume/render-resume-app.js";

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
      <ul class="mt-8 space-y-3">
        <li>
          <a class="block rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-100" href="/resume">Resume builder →</a>
        </li>
      </ul>
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

  document.title = "Resume builder · Resume Web Server";
  mountResumeApp(app);
}

render();
