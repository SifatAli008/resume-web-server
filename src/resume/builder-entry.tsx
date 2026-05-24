import { createRoot, type Root } from "react-dom/client";
import { ResumeBuilderApp } from "./builder/ResumeBuilderApp.js";
import { renderResumeV2Static, mountResumeV2 } from "./client-entry.js";

export type BuilderMountOptions = {
  initial: Record<string, unknown>;
  onDraftChange?: (draft: Record<string, unknown>) => void;
  onTemplateChange?: (templateId: string) => void;
};

export function mountResumeBuilder(host: HTMLElement, options: BuilderMountOptions): Root {
  const root = createRoot(host);
  root.render(
    <ResumeBuilderApp
      initial={options.initial}
      onDraftChange={options.onDraftChange}
      onTemplateChange={options.onTemplateChange}
    />,
  );
  return root;
}

declare global {
  interface Window {
    ResumeV2?: {
      mount: typeof mountResumeV2;
      renderStatic: typeof renderResumeV2Static;
      mountBuilder: typeof mountResumeBuilder;
    };
  }
}

if (typeof window !== "undefined") {
  window.ResumeV2 = {
    mount: mountResumeV2,
    renderStatic: renderResumeV2Static,
    mountBuilder: mountResumeBuilder,
  };
}
