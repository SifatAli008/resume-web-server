import { useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { draftToResumeData, mergeWithSample } from "./draft-mapper.js";
import { ResumeDocument } from "./ResumeDocument.js";
import type { ResumeData } from "./types.js";

function toData(raw: Record<string, unknown>, fill = true): ResumeData {
  let data = draftToResumeData(raw);
  if (fill) data = mergeWithSample(data);
  return data;
}

export function renderResumeV2Static(host: HTMLElement, raw: Record<string, unknown>) {
  const root = createRoot(host);
  root.render(<ResumeDocument data={toData(raw)} editable={false} />);
  return root;
}

function ResumeV2Editor({ initial }: { initial: Record<string, unknown> }) {
  const [data, setData] = useState<ResumeData>(() => toData(initial, true));

  const onFieldChange = (path: string, value: string) => {
    setData((prev) => {
      const next = structuredClone(prev);
      const parts = path.split(".");
      let cur: Record<string, unknown> = next as unknown as Record<string, unknown>;
      for (let i = 0; i < parts.length - 1; i++) {
        const p = parts[i]!;
        const idx = Number(p);
        if (!Number.isNaN(idx) && Array.isArray(cur)) {
          cur = (cur as unknown[])[idx] as Record<string, unknown>;
        } else {
          cur = cur[p] as Record<string, unknown>;
        }
      }
      const leaf = parts[parts.length - 1]!;
      const li = Number(leaf);
      if (!Number.isNaN(li) && Array.isArray(cur)) {
        (cur as unknown[])[li] = value;
      } else {
        cur[leaf] = value;
      }
      return next;
    });
  };

  return <ResumeDocument data={data} editable onFieldChange={onFieldChange} />;
}

export function mountResumeV2(host: HTMLElement, initial: Record<string, unknown>): Root {
  const root = createRoot(host);
  root.render(<ResumeV2Editor initial={initial} />);
  return root;
}

declare global {
  interface Window {
    ResumeV2?: {
      mount: typeof mountResumeV2;
      renderStatic: typeof renderResumeV2Static;
    };
  }
}

if (typeof window !== "undefined") {
  window.ResumeV2 = { mount: mountResumeV2, renderStatic: renderResumeV2Static };
}
