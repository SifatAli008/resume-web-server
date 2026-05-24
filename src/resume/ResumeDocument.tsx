import { TEMPLATE_BY_ID } from "./template-configs.js";
import { renderLayoutBody } from "./layouts.js";
import type { ResumeData } from "./types.js";

export type ResumeDocumentProps = {
  data: ResumeData;
  editable?: boolean;
  invoiceShell?: boolean;
  onFieldChange?: (path: string, value: string) => void;
};

export function ResumeDocument({ data, editable, invoiceShell, onFieldChange }: ResumeDocumentProps) {
  const cfg = TEMPLATE_BY_ID[data.templateId] ?? TEMPLATE_BY_ID.resume_01;
  const photoOn = cfg.photoDefault ? data.showPhoto !== false : data.showPhoto === true;

  const body = renderLayoutBody({
    data: { ...data, showPhoto: photoOn },
    cfg,
    editable,
    invoiceShell,
    onFieldChange,
  });

  return (
    <article
      id="resume-print-root"
      className={`${cfg.tplClass} cv-v2${invoiceShell ? " cv-invoice-shell" : ""}${photoOn ? " cv-has-photo" : " cv-no-photo"}`}
      data-template={cfg.id}
      data-invoice-shell={invoiceShell ? "1" : undefined}
    >
      {body}
    </article>
  );
}
