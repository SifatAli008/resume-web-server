import type { ReactNode } from "react";

export type IconName =
  | "document"
  | "sparkles"
  | "cpu"
  | "briefcase"
  | "folder"
  | "academic-cap"
  | "certificate"
  | "globe"
  | "link";

const PATHS: Record<IconName, ReactNode> = {
  document: (
    <>
      <path d="M4 2h6l4 4v10H4V2z" />
      <path d="M10 2v4h4" />
    </>
  ),
  sparkles: (
    <>
      <path d="M7 1v2M7 11v2M1 7h2M11 7h2M2.8 2.8l1.4 1.4M9.8 9.8l1.4 1.4M2.8 11.2l1.4-1.4M9.8 4.2l1.4-1.4" />
    </>
  ),
  cpu: (
    <>
      <rect x="3" y="3" width="8" height="8" rx="1" />
      <path d="M7 1v2M7 11v2M1 7h2M11 7h2" />
    </>
  ),
  briefcase: (
    <>
      <path d="M2 5h10v7H2z" />
      <path d="M5 5V3h4v2" />
    </>
  ),
  folder: <path d="M2 4h4l1 2h5v6H2V4z" />,
  "academic-cap": (
    <>
      <path d="M1 5l6-3 6 3-6 3-6-3z" />
      <path d="M4 8v3c0 1 2 2 3 2s3-1 3-2V8" />
    </>
  ),
  certificate: (
    <>
      <rect x="2" y="2" width="10" height="8" rx="1" />
      <path d="M5 6h4M5 4h4" />
    </>
  ),
  globe: (
    <>
      <circle cx="7" cy="7" r="5" />
      <path d="M2 7h10M7 2a8 8 0 010 10M7 2a8 8 0 000 10" />
    </>
  ),
  link: <path d="M5 7l4-4M6 4h3v3M8 9l-4 4M6 10H3V7" />,
};

export function SvgIcon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      className={className}
      width={14}
      height={14}
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {PATHS[name]}
    </svg>
  );
}

export const SECTION_ICONS: Record<string, IconName> = {
  "Professional Summary": "document",
  "Core Competencies": "sparkles",
  Skills: "cpu",
  "Professional Experience": "briefcase",
  Education: "academic-cap",
  "Certifications & Licenses": "certificate",
  Languages: "globe",
  Links: "link",
  Projects: "folder",
};
