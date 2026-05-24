export type ResumeLink = { label: string; url: string };

export type ResumeJob = {
  company: string;
  role: string;
  location?: string;
  start: string;
  end: string;
  bullets: string[];
};

export type ResumeProject = {
  name: string;
  context: string;
  start?: string;
  end?: string;
  bullets: string[];
};

export type ResumeEducation = {
  degree: string;
  school: string;
  start: string;
  end: string;
  details?: string;
};

export type ResumeData = {
  templateId: string;
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experience: ResumeJob[];
  education: ResumeEducation[];
  skills: string[];
  projects: ResumeProject[];
  certifications: string;
  languages: string;
  links: ResumeLink[];
  showPhoto: boolean;
  photoUrl?: string;
};

export type SectionTitleVariant = "ruled" | "minimal" | "boxed" | "band" | "double";

export type SkillsVariant =
  | "plain-row"
  | "pills"
  | "pills-dark"
  | "outline"
  | "grid-2col"
  | "card-tiles"
  | "progress-bars"
  | "tags-band"
  | "dot-scale"
  | "sky-chips"
  | "academic-list"
  | "serif-blocks"
  | "rose-tiles"
  | "compact-dark"
  | "cyan-stack"
  | "swiss-dense"
  | "slate-list"
  | "mag-cols"
  | "underline"
  | "grad-dark";

export type PhotoShape = "round" | "sq" | "rounded-sm";
export type PhotoSize = "sm" | "md" | "lg";

export type TemplateConfig = {
  id: string;
  name: string;
  tplClass: string;
  formalPadding: boolean;
  photoDefault: boolean;
  photoShape: PhotoShape;
  photoSize: PhotoSize;
  sectionTitle: SectionTitleVariant;
  skills: SkillsVariant;
  layout: string;
  sidebarPct?: number;
  sidebarSide?: "left" | "right";
};

export type LayoutRenderProps = {
  data: ResumeData;
  cfg: TemplateConfig;
  editable?: boolean;
  invoiceShell?: boolean;
  onFieldChange?: (path: string, value: string) => void;
};
