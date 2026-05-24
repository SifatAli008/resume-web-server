import { useCallback, useEffect, useRef, useState } from "react";
import { PDF_DESIGN_NAMES } from "../pdf-design-map.js";
import { TEMPLATE_CONFIGS } from "../template-configs.js";
import { draftToResumeData, mergeWithSample } from "../draft-mapper.js";
import { resumeDataToDraft } from "../data-to-draft.js";
import { ResumeDocument } from "../ResumeDocument.js";
import type { ResumeData } from "../types.js";
import { Button } from "./ui/button.js";

const TEMPLATES = TEMPLATE_CONFIGS.map((c, i) => ({
  id: c.id,
  name: PDF_DESIGN_NAMES[i] ?? c.name,
}));

export type ResumeBuilderProps = {
  initial: Record<string, unknown>;
  onDraftChange?: (draft: Record<string, unknown>) => void;
  onTemplateChange?: (templateId: string) => void;
};

export function ResumeBuilderApp({ initial, onDraftChange, onTemplateChange }: ResumeBuilderProps) {
  const [data, setData] = useState<ResumeData>(() => mergeWithSample(draftToResumeData(initial)));
  const onDraftChangeRef = useRef(onDraftChange);
  onDraftChangeRef.current = onDraftChange;

  useEffect(() => {
    onDraftChangeRef.current?.(resumeDataToDraft(data));
  }, [data]);

  const onFieldChange = useCallback((path: string, value: string) => {
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
  }, []);

  const setTemplate = useCallback(
    (templateId: string) => {
      setData((prev) => {
        const cfg = TEMPLATE_CONFIGS.find((t) => t.id === templateId);
        const showPhoto = cfg?.photoDefault ?? prev.showPhoto;
        return { ...prev, templateId, showPhoto };
      });
      onTemplateChange?.(templateId);
    },
    [onTemplateChange],
  );

  return (
    <div className="mx-auto max-w-4xl px-4 pb-16 pt-6">
      <div className="print:hidden mb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Resume builder</h1>
          <p className="mt-1 max-w-xl text-sm text-zinc-600">
            Edit your resume below, then print to PDF.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="rf-template">
            Template
          </label>
          <select
            id="rf-template"
            className="max-h-60 min-w-[min(100%,14rem)] rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900/20"
            value={data.templateId}
            onChange={(e) => setTemplate(e.target.value)}
          >
            {TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            Home
          </a>
          <Button type="button" onClick={() => window.print()}>
            Print / Save PDF
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => window.dispatchEvent(new Event("resume-reset-request"))}
          >
            Reset
          </Button>
        </div>
      </div>

      <div
        id="rf-preview-shell"
        className="overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-200/80 p-3 shadow-md sm:p-4 print:border-0 print:bg-white print:p-0 print:shadow-none"
      >
        <div id="rf-preview" className="cv-preview-scale mx-auto">
          <ResumeDocument data={data} editable onFieldChange={onFieldChange} />
        </div>
      </div>
    </div>
  );
}
