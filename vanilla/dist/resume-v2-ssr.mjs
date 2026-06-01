// src/resume/ssr-entry.tsx
import { renderToStaticMarkup } from "react-dom/server";

// src/resume/sample-resume.ts
var SAMPLE_RESUME = {
  templateId: "resume_01",
  fullName: "Elena Vasquez",
  title: "Senior Product Engineer",
  email: "elena.vasquez@email.com",
  phone: "+1 415 555 0142",
  location: "San Francisco, CA",
  summary: "Product engineer with nine years shipping B2B platforms and developer tools. Led cross-functional delivery from discovery through production, improving activation by 34% and cutting incident volume by half. Comfortable owning architecture decisions, mentoring engineers, and partnering with design on complex workflows.",
  experience: [
    {
      role: "Staff Software Engineer",
      company: "Northline Systems",
      start: "2021",
      end: "Present",
      bullets: [
        "Built observability and release automation for 40+ microservices; reduced mean time to recovery from 47 minutes to 19.",
        "Drove API versioning strategy adopted by three product lines, eliminating breaking changes for enterprise clients.",
        "Mentored a team of six; two promotions to senior level within 18 months."
      ]
    },
    {
      role: "Senior Software Engineer",
      company: "Meridian Analytics",
      start: "2017",
      end: "2021",
      bullets: [
        "Delivered customer-facing reporting module used by 12,000 accounts; improved query performance 3\xD7 via indexing and caching.",
        "Introduced contract tests between frontend and backend, cutting regression bugs in release week by 60%."
      ]
    }
  ],
  education: [
    {
      degree: "M.S. Computer Science",
      school: "State University",
      start: "2015",
      end: "2017",
      details: "Thesis: distributed tracing for event-driven systems"
    }
  ],
  skills: [
    "TypeScript",
    "React",
    "Node.js",
    "PostgreSQL",
    "System design",
    "Technical leadership"
  ],
  projects: [
    {
      name: "OpenTelemetry Workshop Kit",
      context: "Internal training platform",
      start: "2023",
      bullets: ["Self-paced labs and sandboxes for 200+ engineers; adopted as onboarding standard."]
    },
    {
      name: "Customer Health Dashboard",
      context: "Product analytics",
      start: "2020",
      bullets: ["Unified churn signals; referenced weekly by customer success leadership."]
    }
  ],
  certifications: "AWS Solutions Architect \u2013 Associate \xB7 Certified Kubernetes Administrator",
  languages: "English (native) \xB7 Spanish (professional)",
  links: [
    { label: "GitHub", url: "github.com/elena-vasquez" },
    { label: "LinkedIn", url: "linkedin.com/in/elenavasquez" }
  ],
  showPhoto: false,
  photoUrl: ""
};

// src/resume/pdf-design-map.ts
var PDF_DESIGN_NAMES = [
  "Estelle Classic",
  // 1 UX Designer
  "Eez Contact Split",
  // 2 Mechatronics — contact stack left
  "Jacqueline Sidebar",
  // 3 Marketing executive
  "Juliana Sales Split",
  // 4 Sales — about left
  "Aaron Creative",
  // 5 Graphic designer
  "Aaron Professional",
  // 6 Centered professional
  "Estelle Process",
  // 7 Process engineer classic
  "Olivia Marketing",
  // 8 Marketing manager sidebar
  "Olivia Product",
  // 9 Product designer sidebar
  "Harper Web Split",
  // 10 Web developer split
  "Lorna Web Split",
  // 11 Web developer variant
  "Samira Graphic Top",
  // 12 Graphic designer top blocks
  "Sebastian PM",
  // 13 Project manager classic
  "Sebastian Accountant",
  // 14 Hero name accountant
  "Juliana Social",
  // 15 Social coordinator
  "Harper Marketing",
  // 16 Marketing manager header
  "Estelle Content",
  // 17 Content creator vertical name
  "Rachelle Copywriter",
  // 18 Brand strategist two-col
  "Catrine IT Profile",
  // 19 IT project manager
  "Catrine IT Timeline"
  // 20 IT PM timeline accent
];
var PDF_LAYOUT_BY_TEMPLATE = {
  resume_01: "pdf-01-classic",
  resume_02: "pdf-02-contact-left",
  resume_03: "pdf-03-sidebar-contact",
  resume_04: "pdf-04-about-left",
  resume_05: "pdf-05-creative-name",
  resume_06: "pdf-06-centered-pro",
  resume_07: "pdf-07-classic-process",
  resume_08: "pdf-08-sidebar-about",
  resume_09: "pdf-09-sidebar-product",
  resume_10: "pdf-10-web-split",
  resume_11: "pdf-11-web-split-alt",
  resume_12: "pdf-12-graphic-top",
  resume_13: "pdf-13-classic-pm",
  resume_14: "pdf-14-hero-accountant",
  resume_15: "pdf-15-social-achieve",
  resume_16: "pdf-16-marketing-header",
  resume_17: "pdf-17-vertical-name",
  resume_18: "pdf-18-copywriter-cols",
  resume_19: "pdf-19-it-profile",
  resume_20: "pdf-20-it-timeline"
};

// src/resume/template-configs.ts
var STYLE = [
  { tplClass: "cv-tpl-01", formalPadding: false, photoDefault: false, photoShape: "round", photoSize: "md", sectionTitle: "minimal", skills: "plain-row" },
  { tplClass: "cv-tpl-02", formalPadding: false, photoDefault: true, photoShape: "round", photoSize: "md", sectionTitle: "ruled", skills: "pills" },
  { tplClass: "cv-tpl-03", formalPadding: false, photoDefault: false, photoShape: "round", photoSize: "md", sectionTitle: "minimal", skills: "outline" },
  { tplClass: "cv-tpl-04", formalPadding: false, photoDefault: true, photoShape: "sq", photoSize: "lg", sectionTitle: "boxed", skills: "grid-2col" },
  { tplClass: "cv-tpl-05", formalPadding: false, photoDefault: false, photoShape: "round", photoSize: "md", sectionTitle: "ruled", skills: "progress-bars" },
  { tplClass: "cv-tpl-06", formalPadding: false, photoDefault: false, photoShape: "round", photoSize: "md", sectionTitle: "band", skills: "card-tiles" },
  { tplClass: "cv-tpl-07", formalPadding: false, photoDefault: true, photoShape: "rounded-sm", photoSize: "md", sectionTitle: "double", skills: "pills-dark" },
  { tplClass: "cv-tpl-08", formalPadding: false, photoDefault: true, photoShape: "sq", photoSize: "md", sectionTitle: "band", skills: "tags-band" },
  { tplClass: "cv-tpl-09", formalPadding: false, photoDefault: false, photoShape: "round", photoSize: "md", sectionTitle: "minimal", skills: "dot-scale" },
  { tplClass: "cv-tpl-10", formalPadding: false, photoDefault: true, photoShape: "round", photoSize: "lg", sectionTitle: "ruled", skills: "sky-chips" },
  { tplClass: "cv-tpl-11", formalPadding: false, photoDefault: false, photoShape: "round", photoSize: "md", sectionTitle: "boxed", skills: "academic-list" },
  { tplClass: "cv-tpl-12", formalPadding: true, photoDefault: false, photoShape: "sq", photoSize: "md", sectionTitle: "double", skills: "serif-blocks" },
  { tplClass: "cv-tpl-13", formalPadding: false, photoDefault: false, photoShape: "round", photoSize: "md", sectionTitle: "ruled", skills: "rose-tiles" },
  { tplClass: "cv-tpl-14", formalPadding: false, photoDefault: true, photoShape: "round", photoSize: "sm", sectionTitle: "band", skills: "compact-dark" },
  { tplClass: "cv-tpl-15", formalPadding: false, photoDefault: false, photoShape: "round", photoSize: "md", sectionTitle: "minimal", skills: "cyan-stack" },
  { tplClass: "cv-tpl-16", formalPadding: false, photoDefault: false, photoShape: "round", photoSize: "md", sectionTitle: "ruled", skills: "swiss-dense" },
  { tplClass: "cv-tpl-17", formalPadding: false, photoDefault: true, photoShape: "sq", photoSize: "md", sectionTitle: "boxed", skills: "slate-list" },
  { tplClass: "cv-tpl-18", formalPadding: false, photoDefault: true, photoShape: "rounded-sm", photoSize: "md", sectionTitle: "band", skills: "mag-cols" },
  { tplClass: "cv-tpl-19", formalPadding: true, photoDefault: false, photoShape: "sq", photoSize: "md", sectionTitle: "double", skills: "underline" },
  { tplClass: "cv-tpl-20", formalPadding: false, photoDefault: true, photoShape: "sq", photoSize: "sm", sectionTitle: "minimal", skills: "grad-dark" }
];
var TEMPLATE_CONFIGS = PDF_DESIGN_NAMES.map((name, i) => {
  const n = String(i + 1).padStart(2, "0");
  const id = `resume_${n}`;
  return {
    id,
    name,
    layout: PDF_LAYOUT_BY_TEMPLATE[id],
    ...STYLE[i]
  };
});
var TEMPLATE_BY_ID = Object.fromEntries(TEMPLATE_CONFIGS.map((c) => [c.id, c]));

// src/resume/draft-mapper.ts
function parseSkills(raw) {
  if (Array.isArray(raw)) return raw.map(String).filter(Boolean);
  return String(raw ?? "").split(/\n|,/).map((s) => s.trim()).filter(Boolean);
}
function mapLegacyTemplateId(id) {
  const fluvo = /^resume_fluvo_(\d+)$/.exec(id);
  if (fluvo) return `resume_${fluvo[1].padStart(2, "0")}`;
  const legacy = {
    resume_classic: "resume_01",
    resume_sidebar: "resume_02",
    resume_minimal: "resume_03"
  };
  return legacy[id] || id;
}
function draftToResumeData(raw) {
  const templateId = mapLegacyTemplateId(String(raw.templateId || "resume_01"));
  const cfg = TEMPLATE_BY_ID[templateId];
  const exp = Array.isArray(raw.experience) ? raw.experience : SAMPLE_RESUME.experience;
  const edu = Array.isArray(raw.education) ? raw.education : SAMPLE_RESUME.education;
  const proj = Array.isArray(raw.projects) ? raw.projects : SAMPLE_RESUME.projects;
  const links = Array.isArray(raw.links) ? raw.links : SAMPLE_RESUME.links;
  const showPhoto = typeof raw.showPhoto === "boolean" ? raw.showPhoto : Boolean(cfg?.photoDefault);
  return {
    templateId,
    fullName: String(raw.fullName ?? ""),
    title: String(raw.title ?? ""),
    email: String(raw.email ?? ""),
    phone: String(raw.phone ?? ""),
    location: String(raw.location ?? ""),
    summary: String(raw.summary ?? ""),
    experience: exp.slice(0, 6).map((j) => ({
      role: String(j.role ?? ""),
      company: String(j.company ?? ""),
      location: String(j.location ?? ""),
      start: String(j.start ?? ""),
      end: String(j.end ?? ""),
      bullets: Array.isArray(j.bullets) ? j.bullets.map((b) => String(b ?? "")).filter((_, i, a) => i < a.length) : [""]
    })),
    education: edu.slice(0, 4).map((e) => ({
      degree: String(e.degree ?? ""),
      school: String(e.school ?? ""),
      start: String(e.start ?? ""),
      end: String(e.end ?? ""),
      details: String(e.details ?? "")
    })),
    skills: parseSkills(raw.skills),
    projects: proj.slice(0, 4).map((p) => ({
      name: String(p.name ?? ""),
      context: String(p.context ?? ""),
      start: String(p.start ?? ""),
      end: String(p.end ?? ""),
      bullets: Array.isArray(p.bullets) ? p.bullets.map((b) => String(b ?? "")) : [""]
    })),
    certifications: String(raw.certifications ?? ""),
    languages: String(raw.languages ?? ""),
    links: links.slice(0, 6).map((l) => ({
      label: String(l.label ?? ""),
      url: String(l.url ?? "")
    })),
    showPhoto,
    photoUrl: String(raw.photoUrl ?? "")
  };
}
function mergeWithSample(data) {
  const fill = (v, fallback) => v.trim() ? v : fallback;
  return {
    ...SAMPLE_RESUME,
    ...data,
    fullName: fill(data.fullName, SAMPLE_RESUME.fullName),
    title: fill(data.title, SAMPLE_RESUME.title),
    email: fill(data.email, SAMPLE_RESUME.email),
    phone: fill(data.phone, SAMPLE_RESUME.phone),
    location: fill(data.location, SAMPLE_RESUME.location),
    summary: fill(data.summary, SAMPLE_RESUME.summary),
    certifications: fill(data.certifications, SAMPLE_RESUME.certifications),
    languages: fill(data.languages, SAMPLE_RESUME.languages),
    skills: data.skills.length >= 4 ? data.skills : SAMPLE_RESUME.skills,
    experience: data.experience.filter((j) => j.role || j.company).length >= 2 ? data.experience : SAMPLE_RESUME.experience,
    education: data.education.filter((e) => e.degree || e.school).length >= 1 ? data.education : SAMPLE_RESUME.education,
    projects: data.projects.filter((p) => p.name).length >= 2 ? data.projects : SAMPLE_RESUME.projects
  };
}

// src/resume/icons.tsx
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var PATHS = {
  document: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M4 2h6l4 4v10H4V2z" }),
    /* @__PURE__ */ jsx("path", { d: "M10 2v4h4" })
  ] }),
  sparkles: /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("path", { d: "M7 1v2M7 11v2M1 7h2M11 7h2M2.8 2.8l1.4 1.4M9.8 9.8l1.4 1.4M2.8 11.2l1.4-1.4M9.8 4.2l1.4-1.4" }) }),
  cpu: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("rect", { x: "3", y: "3", width: "8", height: "8", rx: "1" }),
    /* @__PURE__ */ jsx("path", { d: "M7 1v2M7 11v2M1 7h2M11 7h2" })
  ] }),
  briefcase: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M2 5h10v7H2z" }),
    /* @__PURE__ */ jsx("path", { d: "M5 5V3h4v2" })
  ] }),
  folder: /* @__PURE__ */ jsx("path", { d: "M2 4h4l1 2h5v6H2V4z" }),
  "academic-cap": /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M1 5l6-3 6 3-6 3-6-3z" }),
    /* @__PURE__ */ jsx("path", { d: "M4 8v3c0 1 2 2 3 2s3-1 3-2V8" })
  ] }),
  certificate: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("rect", { x: "2", y: "2", width: "10", height: "8", rx: "1" }),
    /* @__PURE__ */ jsx("path", { d: "M5 6h4M5 4h4" })
  ] }),
  globe: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("circle", { cx: "7", cy: "7", r: "5" }),
    /* @__PURE__ */ jsx("path", { d: "M2 7h10M7 2a8 8 0 010 10M7 2a8 8 0 000 10" })
  ] }),
  link: /* @__PURE__ */ jsx("path", { d: "M5 7l4-4M6 4h3v3M8 9l-4 4M6 10H3V7" })
};
function SvgIcon({ name, className }) {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      className,
      width: 14,
      height: 14,
      viewBox: "0 0 14 14",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 1.25,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": true,
      children: PATHS[name]
    }
  );
}
var SECTION_ICONS = {
  "Professional Summary": "document",
  "Core Competencies": "sparkles",
  Skills: "cpu",
  "Professional Experience": "briefcase",
  Education: "academic-cap",
  "Certifications & Licenses": "certificate",
  Languages: "globe",
  Links: "link",
  Projects: "folder"
};

// src/resume/util.ts
function skillBarPct(label, min = 52, max = 94) {
  let h = 0;
  const s = String(label ?? "");
  for (let i = 0; i < s.length; i++) h = h * 31 + s.charCodeAt(i) | 0;
  const span = Math.max(1, max - min + 1);
  return Math.min(100, Math.max(0, min + Math.abs(h) % span));
}
function initials(name) {
  return String(name || "?").trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}
function dotScaleFilled(label) {
  return 1 + Math.abs(skillBarPct(label, 0, 4)) % 5;
}

// src/resume/blocks.tsx
import { Fragment as Fragment2, jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var FIELD_PLACEHOLDERS = {
  fullName: "Your full name",
  title: "Job title",
  email: "email@example.com",
  phone: "+1 555 000 0000",
  location: "City, Country",
  summary: "Professional summary\u2026",
  certifications: "Certifications",
  languages: "Languages"
};
function F({
  value,
  path,
  editable,
  onFieldChange,
  className = "",
  multiline
}) {
  if (!editable) return /* @__PURE__ */ jsx2("span", { className, children: value });
  const leaf = path.split(".").pop() ?? path;
  const placeholder = FIELD_PLACEHOLDERS[leaf] ?? FIELD_PLACEHOLDERS[path] ?? "Edit\u2026";
  if (multiline) {
    return /* @__PURE__ */ jsx2(
      "textarea",
      {
        "data-f": path,
        className,
        value,
        placeholder,
        onChange: (e) => onFieldChange?.(path, e.target.value)
      }
    );
  }
  return /* @__PURE__ */ jsx2(
    "input",
    {
      "data-f": path,
      type: "text",
      className,
      value,
      placeholder,
      onChange: (e) => onFieldChange?.(path, e.target.value)
    }
  );
}
function SecTitle({ title, variant }) {
  const icon = SECTION_ICONS[title] || "document";
  const showIcon = variant !== "minimal";
  return /* @__PURE__ */ jsxs2("h2", { className: `cv-sec-title cv-sec-${variant}`, children: [
    showIcon && /* @__PURE__ */ jsx2(SvgIcon, { name: icon, className: "cv-sec-icon" }),
    /* @__PURE__ */ jsx2("span", { children: title }),
    variant === "ruled" && /* @__PURE__ */ jsx2("span", { className: "cv-sec-rule" })
  ] });
}
function MetaRow({ data, editable, onFieldChange }) {
  const parts = [
    ["email", data.email],
    ["phone", data.phone],
    ["location", data.location],
    ["title", data.title]
  ];
  return /* @__PURE__ */ jsx2("div", { className: "cv-meta-row", children: parts.map(([key, val], i) => /* @__PURE__ */ jsxs2("span", { children: [
    i > 0 && /* @__PURE__ */ jsx2("span", { className: "cv-meta-dot", children: " \xB7 " }),
    /* @__PURE__ */ jsx2(
      F,
      {
        value: val,
        path: key,
        editable,
        onFieldChange,
        className: "cv-meta-value"
      }
    )
  ] }, key)) });
}
function Masthead({
  data,
  editable,
  onFieldChange,
  centered
}) {
  return /* @__PURE__ */ jsxs2("div", { className: `cv-masthead${centered ? " cv-masthead-center" : ""}`, children: [
    /* @__PURE__ */ jsx2("p", { className: "cv-doc-label", children: "Curriculum Vitae" }),
    /* @__PURE__ */ jsx2(
      F,
      {
        value: data.fullName,
        path: "fullName",
        editable,
        onFieldChange,
        className: "cv-name"
      }
    )
  ] });
}
function Profile({ data, editable, onFieldChange, cfg }) {
  return /* @__PURE__ */ jsxs2("section", { className: "cv-profile cv-sec", children: [
    /* @__PURE__ */ jsx2(SecTitle, { title: "Professional Summary", variant: cfg.sectionTitle }),
    /* @__PURE__ */ jsx2(
      F,
      {
        value: data.summary,
        path: "summary",
        editable,
        onFieldChange,
        className: "cv-body",
        multiline: true
      }
    )
  ] });
}
function PhotoSlot({
  data,
  shape,
  size,
  visible
}) {
  const show = visible && data.showPhoto;
  return /* @__PURE__ */ jsx2(
    "div",
    {
      className: `cv-photo-slot cv-photo-${shape} cv-photo-${size}${show ? "" : " cv-photo-hidden"}`,
      "aria-hidden": !show,
      children: show && data.photoUrl ? /* @__PURE__ */ jsx2("img", { src: data.photoUrl, alt: "", className: "cv-photo-img" }) : /* @__PURE__ */ jsx2("span", { className: "cv-photo-initials", children: initials(data.fullName) })
    }
  );
}
function SkillsBlock({ data, variant, dark }) {
  const skills = data.skills.length ? data.skills : ["\u2014"];
  if (variant === "plain-row") {
    return /* @__PURE__ */ jsx2("p", { className: "cv-skills-plain-row", children: skills.join("  \xB7  ") });
  }
  if (variant === "pills" || variant === "pills-dark" || variant === "sky-chips" || variant === "grad-dark") {
    const cls = variant === "pills-dark" || variant === "grad-dark" ? "cv-skills-pills cv-skills-on-dark" : variant === "sky-chips" ? "cv-skills-chips" : "cv-skills-pills";
    return /* @__PURE__ */ jsx2("div", { className: cls, children: skills.map((s) => /* @__PURE__ */ jsx2("span", { className: "cv-skill-pill", children: s }, s)) });
  }
  if (variant === "outline") {
    return /* @__PURE__ */ jsx2("div", { className: "cv-skills-outline", children: skills.map((s) => /* @__PURE__ */ jsx2("span", { className: "cv-skill-outline", children: s }, s)) });
  }
  if (variant === "grid-2col") {
    return /* @__PURE__ */ jsx2("div", { className: "cv-skills-grid-2", children: skills.map((s) => /* @__PURE__ */ jsx2("span", { className: "cv-skill-cell", children: s }, s)) });
  }
  if (variant === "card-tiles") {
    return /* @__PURE__ */ jsx2("div", { className: "cv-skills-cards", children: skills.map((s) => /* @__PURE__ */ jsx2("div", { className: "cv-skill-card", children: s }, s)) });
  }
  if (variant === "progress-bars") {
    return /* @__PURE__ */ jsx2("div", { className: "cv-skills-bars", children: skills.map((s) => /* @__PURE__ */ jsxs2("div", { className: "cv-skill-bar-row", children: [
      /* @__PURE__ */ jsx2("span", { className: "cv-skill-bar-label", children: s }),
      /* @__PURE__ */ jsx2("span", { className: "cv-skill-bar-track", children: /* @__PURE__ */ jsx2("span", { className: "cv-skill-bar-fill", style: { width: `${skillBarPct(s)}%` } }) })
    ] }, s)) });
  }
  if (variant === "tags-band") {
    return /* @__PURE__ */ jsx2("div", { className: "cv-skills-tags-band", children: skills.map((s) => /* @__PURE__ */ jsx2("span", { children: s }, s)) });
  }
  if (variant === "dot-scale") {
    return /* @__PURE__ */ jsx2("ul", { className: "cv-skills-dots", children: skills.map((s) => {
      const n = dotScaleFilled(s);
      return /* @__PURE__ */ jsxs2("li", { children: [
        /* @__PURE__ */ jsx2("span", { children: s }),
        /* @__PURE__ */ jsx2("span", { className: "cv-dot-scale", "aria-label": `${n} of 5`, children: Array.from({ length: 5 }, (_, i) => /* @__PURE__ */ jsx2("span", { className: i < n ? "on" : "" }, i)) })
      ] }, s);
    }) });
  }
  if (variant === "academic-list") {
    return /* @__PURE__ */ jsx2("ol", { className: "cv-skills-academic", children: skills.map((s) => /* @__PURE__ */ jsx2("li", { children: s }, s)) });
  }
  if (variant === "serif-blocks") {
    return /* @__PURE__ */ jsx2("div", { className: "cv-skills-serif-blocks", children: skills.map((s) => /* @__PURE__ */ jsx2("span", { children: s }, s)) });
  }
  if (variant === "rose-tiles") {
    return /* @__PURE__ */ jsx2("div", { className: "cv-skills-rose-tiles", children: skills.map((s) => /* @__PURE__ */ jsx2("span", { children: s }, s)) });
  }
  if (variant === "compact-dark") {
    return /* @__PURE__ */ jsx2("div", { className: `cv-skills-compact-dark${dark ? "" : ""}`, children: skills.map((s) => /* @__PURE__ */ jsx2("span", { children: s }, s)) });
  }
  if (variant === "cyan-stack") {
    return /* @__PURE__ */ jsx2("div", { className: "cv-skills-cyan-stack", children: skills.map((s) => /* @__PURE__ */ jsx2("div", { className: "cv-cyan-row", children: s }, s)) });
  }
  if (variant === "swiss-dense") {
    return /* @__PURE__ */ jsx2("div", { className: "cv-skills-swiss-dense", children: skills.map((s) => /* @__PURE__ */ jsx2("span", { children: s }, s)) });
  }
  if (variant === "slate-list") {
    return /* @__PURE__ */ jsx2("ul", { className: "cv-skills-slate-list", children: skills.map((s) => /* @__PURE__ */ jsxs2("li", { children: [
      /* @__PURE__ */ jsx2("strong", { children: s }),
      /* @__PURE__ */ jsx2("span", { children: " \u2014 core competency" })
    ] }, s)) });
  }
  if (variant === "mag-cols") {
    return /* @__PURE__ */ jsx2("div", { className: "cv-skills-mag-cols", children: skills.map((s) => /* @__PURE__ */ jsx2("div", { children: /* @__PURE__ */ jsx2("span", { className: "cv-mag-lead", children: s }) }, s)) });
  }
  if (variant === "underline") {
    return /* @__PURE__ */ jsx2("p", { className: "cv-skills-underline", children: skills.map((s) => /* @__PURE__ */ jsx2("span", { children: s }, s)) });
  }
  return /* @__PURE__ */ jsx2("p", { className: "cv-skills-plain-row", children: skills.join("  \xB7  ") });
}
function ExpDateGrid({
  jobs,
  editable,
  onFieldChange,
  prefix = "experience"
}) {
  return /* @__PURE__ */ jsx2("div", { className: "cv-exp-table", children: jobs.map((job, i) => /* @__PURE__ */ jsxs2("article", { className: "cv-row cv-exp-row", children: [
    /* @__PURE__ */ jsxs2("div", { className: "cv-date-col", children: [
      /* @__PURE__ */ jsx2(
        F,
        {
          value: job.start,
          path: `${prefix}.${i}.start`,
          editable,
          onFieldChange,
          className: "cv-date"
        }
      ),
      /* @__PURE__ */ jsx2("span", { className: "cv-date-sep", children: " \u2013 " }),
      /* @__PURE__ */ jsx2(
        F,
        {
          value: job.end,
          path: `${prefix}.${i}.end`,
          editable,
          onFieldChange,
          className: "cv-date"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs2("div", { className: "cv-exp-body", children: [
      /* @__PURE__ */ jsxs2("p", { className: "cv-exp-head", children: [
        /* @__PURE__ */ jsx2(
          F,
          {
            value: job.role,
            path: `${prefix}.${i}.role`,
            editable,
            onFieldChange,
            className: "cv-exp-role"
          }
        ),
        /* @__PURE__ */ jsx2("span", { className: "cv-exp-at", children: " \xB7 " }),
        /* @__PURE__ */ jsx2(
          F,
          {
            value: job.company,
            path: `${prefix}.${i}.company`,
            editable,
            onFieldChange,
            className: "cv-exp-co"
          }
        )
      ] }),
      /* @__PURE__ */ jsx2("ul", { className: "cv-bullets", children: job.bullets.map((b, bi) => /* @__PURE__ */ jsx2("li", { children: /* @__PURE__ */ jsx2(
        F,
        {
          value: b,
          path: `${prefix}.${i}.bullets.${bi}`,
          editable,
          onFieldChange,
          className: "cv-body"
        }
      ) }, bi)) })
    ] })
  ] }, i)) });
}
function ExpTableHtml({ jobs, editable, onFieldChange }) {
  const rows = jobs ?? [];
  return /* @__PURE__ */ jsxs2("table", { className: "cv-exp-table cv-exp-table-html", children: [
    /* @__PURE__ */ jsx2("thead", { children: /* @__PURE__ */ jsxs2("tr", { children: [
      /* @__PURE__ */ jsx2("th", { children: "Period" }),
      /* @__PURE__ */ jsx2("th", { children: "Role" }),
      /* @__PURE__ */ jsx2("th", { children: "Highlights" })
    ] }) }),
    /* @__PURE__ */ jsx2("tbody", { children: rows.map((job, i) => /* @__PURE__ */ jsxs2("tr", { className: "cv-row", children: [
      /* @__PURE__ */ jsxs2("td", { className: "cv-date-col", children: [
        /* @__PURE__ */ jsx2(F, { value: job.start, path: `experience.${i}.start`, editable, onFieldChange }),
        /* @__PURE__ */ jsx2("span", { children: " \u2013 " }),
        /* @__PURE__ */ jsx2(F, { value: job.end, path: `experience.${i}.end`, editable, onFieldChange })
      ] }),
      /* @__PURE__ */ jsxs2("td", { children: [
        /* @__PURE__ */ jsx2(F, { value: job.role, path: `experience.${i}.role`, editable, onFieldChange }),
        /* @__PURE__ */ jsx2("br", {}),
        /* @__PURE__ */ jsx2(F, { value: job.company, path: `experience.${i}.company`, editable, onFieldChange })
      ] }),
      /* @__PURE__ */ jsx2("td", { children: /* @__PURE__ */ jsx2("ul", { className: "cv-bullets", children: job.bullets.map((b, bi) => /* @__PURE__ */ jsx2("li", { children: /* @__PURE__ */ jsx2(F, { value: b, path: `experience.${i}.bullets.${bi}`, editable, onFieldChange }) }, bi)) }) })
    ] }, i)) })
  ] });
}
function ProjectsBlock(props) {
  const { data, editable, onFieldChange } = props;
  return /* @__PURE__ */ jsxs2("section", { className: "cv-sec", children: [
    /* @__PURE__ */ jsx2(SecTitle, { title: "Projects", variant: props.cfg.sectionTitle }),
    data.projects.map((p, i) => /* @__PURE__ */ jsxs2("article", { className: "cv-row cv-proj-row", children: [
      /* @__PURE__ */ jsxs2("p", { className: "cv-proj-head", children: [
        /* @__PURE__ */ jsx2(F, { value: p.name, path: `projects.${i}.name`, editable, onFieldChange, className: "cv-exp-role" }),
        /* @__PURE__ */ jsx2("span", { children: " \u2014 " }),
        /* @__PURE__ */ jsx2(F, { value: p.context, path: `projects.${i}.context`, editable, onFieldChange, className: "cv-exp-co" })
      ] }),
      /* @__PURE__ */ jsx2("ul", { className: "cv-bullets", children: p.bullets.map((b, bi) => /* @__PURE__ */ jsx2("li", { children: /* @__PURE__ */ jsx2(F, { value: b, path: `projects.${i}.bullets.${bi}`, editable, onFieldChange, className: "cv-body" }) }, bi)) })
    ] }, i))
  ] });
}
function TotalsFooter(props) {
  const { data, editable, onFieldChange, cfg } = props;
  return /* @__PURE__ */ jsx2("footer", { className: "cv-totals-footer cv-sec", children: /* @__PURE__ */ jsxs2("div", { className: "cv-footer-grid", children: [
    /* @__PURE__ */ jsxs2("div", { children: [
      /* @__PURE__ */ jsx2(SecTitle, { title: "Education", variant: cfg.sectionTitle }),
      data.education.map((e, i) => /* @__PURE__ */ jsxs2("p", { className: "cv-body cv-row", children: [
        /* @__PURE__ */ jsx2(F, { value: e.degree, path: `education.${i}.degree`, editable, onFieldChange }),
        " \u2014",
        " ",
        /* @__PURE__ */ jsx2(F, { value: e.school, path: `education.${i}.school`, editable, onFieldChange }),
        " (",
        /* @__PURE__ */ jsx2(F, { value: e.start, path: `education.${i}.start`, editable, onFieldChange }),
        "\u2013",
        /* @__PURE__ */ jsx2(F, { value: e.end, path: `education.${i}.end`, editable, onFieldChange }),
        ")"
      ] }, i))
    ] }),
    /* @__PURE__ */ jsxs2("div", { children: [
      /* @__PURE__ */ jsx2(SecTitle, { title: "Certifications & Licenses", variant: cfg.sectionTitle }),
      /* @__PURE__ */ jsx2(F, { value: data.certifications, path: "certifications", editable, onFieldChange, className: "cv-body", multiline: true })
    ] }),
    /* @__PURE__ */ jsxs2("div", { children: [
      /* @__PURE__ */ jsx2(SecTitle, { title: "Languages", variant: cfg.sectionTitle }),
      /* @__PURE__ */ jsx2(F, { value: data.languages, path: "languages", editable, onFieldChange, className: "cv-body", multiline: true })
    ] })
  ] }) });
}
function SkillsSection(props) {
  const title = props.cfg.layout.startsWith("pdf-") ? "Area of Expertise" : "Skills";
  return /* @__PURE__ */ jsxs2("section", { className: "cv-sec cv-skills-sec", children: [
    /* @__PURE__ */ jsx2(SecTitle, { title, variant: props.cfg.sectionTitle }),
    /* @__PURE__ */ jsx2(SkillsBlock, { data: props.data, variant: props.cfg.skills, dark: props.cfg.layout.includes("dark") })
  ] });
}
function CanvaClassicHeader({ data, editable, onFieldChange }) {
  return /* @__PURE__ */ jsxs2("header", { className: "cv-canva-header-classic cv-masthead", children: [
    /* @__PURE__ */ jsx2(F, { value: data.fullName, path: "fullName", editable, onFieldChange, className: "cv-name" }),
    /* @__PURE__ */ jsx2("p", { className: "cv-canva-title-role", children: data.title }),
    /* @__PURE__ */ jsxs2("div", { className: "cv-meta-row", children: [
      /* @__PURE__ */ jsx2(F, { value: data.email, path: "email", editable, onFieldChange }),
      /* @__PURE__ */ jsx2("span", { className: "cv-meta-dot", children: " | " }),
      /* @__PURE__ */ jsx2(F, { value: data.phone, path: "phone", editable, onFieldChange }),
      /* @__PURE__ */ jsx2("span", { className: "cv-meta-dot", children: " | " }),
      /* @__PURE__ */ jsx2(F, { value: data.location, path: "location", editable, onFieldChange })
    ] })
  ] });
}
function ContactStackLeft({ data, editable, onFieldChange }) {
  return /* @__PURE__ */ jsxs2("div", { className: "cv-canva-contact-stack", children: [
    /* @__PURE__ */ jsxs2("p", { children: [
      /* @__PURE__ */ jsx2("strong", { children: "Address" }),
      /* @__PURE__ */ jsx2(F, { value: data.location, path: "location", editable, onFieldChange })
    ] }),
    /* @__PURE__ */ jsxs2("p", { children: [
      /* @__PURE__ */ jsx2("strong", { children: "Phone" }),
      /* @__PURE__ */ jsx2(F, { value: data.phone, path: "phone", editable, onFieldChange })
    ] }),
    /* @__PURE__ */ jsxs2("p", { children: [
      /* @__PURE__ */ jsx2("strong", { children: "Email" }),
      /* @__PURE__ */ jsx2(F, { value: data.email, path: "email", editable, onFieldChange })
    ] }),
    data.links[0]?.url && /* @__PURE__ */ jsxs2("p", { children: [
      /* @__PURE__ */ jsx2("strong", { children: "Website" }),
      /* @__PURE__ */ jsx2(F, { value: data.links[0].url, path: "links.0.url", editable, onFieldChange })
    ] })
  ] });
}
function KeyAchievements({ data, editable, onFieldChange, cfg }) {
  return /* @__PURE__ */ jsxs2("section", { className: "cv-sec", children: [
    /* @__PURE__ */ jsx2(SecTitle, { title: "Key Achievements", variant: cfg.sectionTitle }),
    data.projects.map((p, i) => /* @__PURE__ */ jsxs2("div", { className: "cv-canva-achievement-item cv-row", children: [
      /* @__PURE__ */ jsxs2("strong", { children: [
        /* @__PURE__ */ jsx2(F, { value: p.name, path: `projects.${i}.name`, editable, onFieldChange }),
        "."
      ] }),
      /* @__PURE__ */ jsx2("p", { className: "cv-body", children: p.bullets[0] && /* @__PURE__ */ jsx2(F, { value: p.bullets[0], path: `projects.${i}.bullets.0`, editable, onFieldChange }) })
    ] }, i))
  ] });
}
function AdditionalInfo({ data, editable, onFieldChange, cfg }) {
  return /* @__PURE__ */ jsxs2("section", { className: "cv-sec", children: [
    /* @__PURE__ */ jsx2(SecTitle, { title: "Additional Information", variant: cfg.sectionTitle }),
    /* @__PURE__ */ jsxs2("p", { className: "cv-body", children: [
      /* @__PURE__ */ jsx2("strong", { children: "Certifications: " }),
      /* @__PURE__ */ jsx2(F, { value: data.certifications, path: "certifications", editable, onFieldChange })
    ] }),
    /* @__PURE__ */ jsxs2("p", { className: "cv-body", children: [
      /* @__PURE__ */ jsx2("strong", { children: "Languages: " }),
      /* @__PURE__ */ jsx2(F, { value: data.languages, path: "languages", editable, onFieldChange })
    ] })
  ] });
}
function EducationBlock(props) {
  const { data, editable, onFieldChange, cfg } = props;
  return /* @__PURE__ */ jsxs2("section", { className: "cv-sec", children: [
    /* @__PURE__ */ jsx2(SecTitle, { title: "Education", variant: cfg.sectionTitle }),
    data.education.map((e, i) => /* @__PURE__ */ jsxs2("div", { className: "cv-canva-edu-row cv-row", children: [
      /* @__PURE__ */ jsxs2("div", { className: "cv-date-col", children: [
        /* @__PURE__ */ jsx2(F, { value: e.start, path: `education.${i}.start`, editable, onFieldChange }),
        /* @__PURE__ */ jsx2("span", { children: " \u2013 " }),
        /* @__PURE__ */ jsx2(F, { value: e.end, path: `education.${i}.end`, editable, onFieldChange })
      ] }),
      /* @__PURE__ */ jsxs2("div", { children: [
        /* @__PURE__ */ jsx2("p", { className: "cv-exp-role", children: /* @__PURE__ */ jsx2(F, { value: e.degree, path: `education.${i}.degree`, editable, onFieldChange }) }),
        /* @__PURE__ */ jsx2("p", { className: "cv-exp-co", children: /* @__PURE__ */ jsx2(F, { value: e.school, path: `education.${i}.school`, editable, onFieldChange }) }),
        e.details && /* @__PURE__ */ jsx2("p", { className: "cv-body", children: e.details })
      ] })
    ] }, i))
  ] });
}
function ExperienceBlock(props) {
  const { data, editable, onFieldChange, cfg } = props;
  return /* @__PURE__ */ jsxs2("section", { className: "cv-sec", children: [
    /* @__PURE__ */ jsx2(SecTitle, { title: "Professional Experience", variant: cfg.sectionTitle }),
    /* @__PURE__ */ jsx2(ExpDateGrid, { jobs: data.experience, editable, onFieldChange })
  ] });
}
function ProfileBlock(props) {
  const { data, editable, onFieldChange, cfg } = props;
  return /* @__PURE__ */ jsxs2("section", { className: "cv-sec cv-profile", children: [
    /* @__PURE__ */ jsx2(SecTitle, { title: "Professional Summary", variant: cfg.sectionTitle }),
    /* @__PURE__ */ jsx2(F, { value: data.summary, path: "summary", editable, onFieldChange, className: "cv-body", multiline: true })
  ] });
}
function ReferencesBlock({ data }) {
  const refs = [
    { name: "Bailey Dupont", role: "Wardiere Inc. / CEO", phone: "123-456-7890", email: "hello@reallygreatsite.com" },
    { name: "Harumi Kobayashi", role: "Wardiere Inc. / CEO", phone: "123-456-7890", email: "hello@reallygreatsite.com" }
  ];
  return /* @__PURE__ */ jsxs2("section", { className: "cv-sec", children: [
    /* @__PURE__ */ jsx2("p", { className: "cv-canva-label", children: "References" }),
    refs.map((r) => /* @__PURE__ */ jsxs2("div", { className: "cv-canva-ref-block", children: [
      /* @__PURE__ */ jsx2("strong", { children: r.name }),
      /* @__PURE__ */ jsxs2("span", { children: [
        r.role,
        /* @__PURE__ */ jsx2("br", {}),
        "Phone: ",
        r.phone,
        /* @__PURE__ */ jsx2("br", {}),
        "Email: ",
        r.email
      ] })
    ] }, r.name))
  ] });
}
function LinksRail({ data }) {
  const links = data.links.filter((l) => l.label || l.url);
  if (!links.length) return null;
  return /* @__PURE__ */ jsxs2("div", { className: "cv-links-rail", children: [
    /* @__PURE__ */ jsx2(SecTitle, { title: "Links", variant: "minimal" }),
    /* @__PURE__ */ jsx2("ul", { children: links.map((l, i) => /* @__PURE__ */ jsx2("li", { children: l.url ? /* @__PURE__ */ jsx2("a", { href: l.url.startsWith("http") ? l.url : `https://${l.url}`, children: l.label || l.url }) : l.label }, i)) })
  ] });
}
function Page({ children, formal }) {
  return /* @__PURE__ */ jsx2("div", { className: `cv-page${formal ? " cv-page-formal" : ""}`, children });
}
function Pages3({
  formal,
  a,
  b,
  c
}) {
  return /* @__PURE__ */ jsxs2(Fragment2, { children: [
    /* @__PURE__ */ jsx2(Page, { formal, children: a }),
    /* @__PURE__ */ jsx2(Page, { formal, children: b }),
    /* @__PURE__ */ jsx2(Page, { formal, children: c })
  ] });
}

// src/resume/pdf-layouts.tsx
import { Fragment as Fragment3, jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
function paginate(props, p1, p2) {
  return /* @__PURE__ */ jsx3(
    Pages3,
    {
      formal: props.cfg.formalPadding,
      a: p1,
      b: p2 ?? /* @__PURE__ */ jsxs3(Fragment3, { children: [
        /* @__PURE__ */ jsx3(ProjectsBlock, { ...props }),
        /* @__PURE__ */ jsx3(SkillsSection, { ...props })
      ] }),
      c: /* @__PURE__ */ jsx3(TotalsFooter, { ...props })
    }
  );
}
function classicPage1(props) {
  return /* @__PURE__ */ jsxs3(Fragment3, { children: [
    /* @__PURE__ */ jsx3(CanvaClassicHeader, { ...props }),
    /* @__PURE__ */ jsx3(ProfileBlock, { ...props }),
    /* @__PURE__ */ jsx3(SkillsSection, { ...props }),
    /* @__PURE__ */ jsx3(ExperienceBlock, { ...props })
  ] });
}
function classicPage2(props) {
  return /* @__PURE__ */ jsxs3(Fragment3, { children: [
    /* @__PURE__ */ jsx3(EducationBlock, { ...props }),
    /* @__PURE__ */ jsx3(KeyAchievements, { ...props }),
    /* @__PURE__ */ jsx3(AdditionalInfo, { ...props })
  ] });
}
function layout01(props) {
  return paginate(props, classicPage1(props), classicPage2(props));
}
function layout02(props) {
  const { data } = props;
  return paginate(
    props,
    /* @__PURE__ */ jsxs3("div", { className: "cv-canva-split-32-68", children: [
      /* @__PURE__ */ jsx3(ContactStackLeft, { ...props }),
      /* @__PURE__ */ jsxs3("div", { children: [
        /* @__PURE__ */ jsx3("header", { className: "cv-masthead", children: /* @__PURE__ */ jsx3(F, { value: data.fullName, path: "fullName", editable: props.editable, onFieldChange: props.onFieldChange, className: "cv-name" }) }),
        /* @__PURE__ */ jsx3(ProfileBlock, { ...props }),
        /* @__PURE__ */ jsx3(ExperienceBlock, { ...props })
      ] })
    ] })
  );
}
function layout03(props) {
  const { data } = props;
  return paginate(
    props,
    /* @__PURE__ */ jsxs3("div", { className: "cv-canva-split-28-72", children: [
      /* @__PURE__ */ jsxs3("aside", { className: "cv-canva-sidebar-dark-panel", children: [
        /* @__PURE__ */ jsx3("p", { className: "cv-canva-label", children: "Contact" }),
        /* @__PURE__ */ jsx3(ContactStackLeft, { ...props }),
        /* @__PURE__ */ jsx3(SkillsSection, { ...props })
      ] }),
      /* @__PURE__ */ jsxs3("div", { children: [
        /* @__PURE__ */ jsxs3("header", { className: "cv-masthead", children: [
          /* @__PURE__ */ jsx3(F, { value: data.fullName, path: "fullName", editable: props.editable, onFieldChange: props.onFieldChange, className: "cv-name" }),
          /* @__PURE__ */ jsx3("p", { className: "cv-canva-title-role", children: data.title })
        ] }),
        /* @__PURE__ */ jsx3(ProfileBlock, { ...props }),
        /* @__PURE__ */ jsx3(ExperienceBlock, { ...props })
      ] })
    ] })
  );
}
function layout04(props) {
  const { data, cfg } = props;
  return paginate(
    props,
    /* @__PURE__ */ jsxs3("div", { className: "cv-canva-split-35-65", children: [
      /* @__PURE__ */ jsxs3("aside", { className: "cv-canva-sidebar-panel", children: [
        /* @__PURE__ */ jsx3(ProfileBlock, { ...props }),
        /* @__PURE__ */ jsx3(EducationBlock, { ...props }),
        /* @__PURE__ */ jsxs3("section", { className: "cv-sec", children: [
          /* @__PURE__ */ jsx3(SecTitle, { title: "Language", variant: cfg.sectionTitle }),
          /* @__PURE__ */ jsx3("p", { className: "cv-body", children: data.languages })
        ] }),
        /* @__PURE__ */ jsx3(SkillsSection, { ...props }),
        /* @__PURE__ */ jsx3(ReferencesBlock, { data })
      ] }),
      /* @__PURE__ */ jsxs3("div", { children: [
        /* @__PURE__ */ jsxs3("header", { className: "cv-masthead", children: [
          /* @__PURE__ */ jsx3(F, { value: data.fullName, path: "fullName", editable: props.editable, onFieldChange: props.onFieldChange, className: "cv-name" }),
          /* @__PURE__ */ jsx3("p", { className: "cv-canva-title-role", style: { letterSpacing: "0.2em" }, children: data.title.split("").join(" ") })
        ] }),
        /* @__PURE__ */ jsx3(ExperienceBlock, { ...props })
      ] })
    ] })
  );
}
function layout05(props) {
  const { data } = props;
  return paginate(
    props,
    /* @__PURE__ */ jsxs3(Fragment3, { children: [
      /* @__PURE__ */ jsxs3("div", { className: "cv-canva-creative-banner", children: [
        /* @__PURE__ */ jsx3("h1", { className: "cv-canva-hero-name", children: /* @__PURE__ */ jsx3(F, { value: data.fullName, path: "fullName", editable: props.editable, onFieldChange: props.onFieldChange }) }),
        /* @__PURE__ */ jsx3("p", { className: "cv-canva-hero-sub", children: data.title })
      ] }),
      /* @__PURE__ */ jsxs3("div", { className: "cv-canva-split-35-65", children: [
        /* @__PURE__ */ jsx3(EducationBlock, { ...props }),
        /* @__PURE__ */ jsx3(SkillsSection, { ...props })
      ] }),
      /* @__PURE__ */ jsx3(ExperienceBlock, { ...props })
    ] })
  );
}
function layout06(props) {
  const { data } = props;
  return paginate(
    props,
    /* @__PURE__ */ jsxs3(Fragment3, { children: [
      /* @__PURE__ */ jsxs3("header", { className: "cv-canva-centered-head", children: [
        /* @__PURE__ */ jsx3("p", { className: "cv-canva-hero-name", style: { fontSize: "1.75rem" }, children: /* @__PURE__ */ jsx3(F, { value: data.fullName, path: "fullName", editable: props.editable, onFieldChange: props.onFieldChange }) }),
        /* @__PURE__ */ jsx3("p", { className: "cv-canva-title-role", children: data.title }),
        /* @__PURE__ */ jsxs3("div", { className: "cv-canva-contact-row", children: [
          /* @__PURE__ */ jsx3("span", { children: data.phone }),
          /* @__PURE__ */ jsx3("span", { children: data.email }),
          /* @__PURE__ */ jsx3("span", { children: data.location })
        ] })
      ] }),
      /* @__PURE__ */ jsx3(ProfileBlock, { ...props }),
      /* @__PURE__ */ jsx3(ExperienceBlock, { ...props })
    ] }),
    /* @__PURE__ */ jsxs3(Fragment3, { children: [
      /* @__PURE__ */ jsx3(EducationBlock, { ...props }),
      /* @__PURE__ */ jsx3(SkillsSection, { ...props }),
      /* @__PURE__ */ jsx3(AdditionalInfo, { ...props })
    ] })
  );
}
function layout07(props) {
  return paginate(
    props,
    /* @__PURE__ */ jsxs3(Fragment3, { children: [
      /* @__PURE__ */ jsx3(CanvaClassicHeader, { ...props }),
      /* @__PURE__ */ jsx3(ProfileBlock, { ...props }),
      /* @__PURE__ */ jsx3(SkillsSection, { ...props }),
      /* @__PURE__ */ jsx3(ExperienceBlock, { ...props }),
      /* @__PURE__ */ jsx3(ProjectsBlock, { ...props })
    ] }),
    classicPage2(props)
  );
}
function layout08(props) {
  const { data, cfg } = props;
  return paginate(
    props,
    /* @__PURE__ */ jsxs3("div", { className: "cv-canva-split-32-68", children: [
      /* @__PURE__ */ jsxs3("aside", { className: "cv-canva-sidebar-panel", children: [
        /* @__PURE__ */ jsx3(PhotoSlot, { data, shape: cfg.photoShape, size: cfg.photoSize, visible: cfg.photoDefault }),
        /* @__PURE__ */ jsx3(ProfileBlock, { ...props }),
        /* @__PURE__ */ jsx3(EducationBlock, { ...props }),
        /* @__PURE__ */ jsx3(SkillsSection, { ...props }),
        /* @__PURE__ */ jsxs3("section", { className: "cv-sec", children: [
          /* @__PURE__ */ jsx3(SecTitle, { title: "Language", variant: cfg.sectionTitle }),
          /* @__PURE__ */ jsx3("p", { className: "cv-body", children: data.languages })
        ] })
      ] }),
      /* @__PURE__ */ jsxs3("div", { children: [
        /* @__PURE__ */ jsxs3("header", { className: "cv-masthead", children: [
          /* @__PURE__ */ jsx3(F, { value: data.fullName, path: "fullName", editable: props.editable, onFieldChange: props.onFieldChange, className: "cv-name" }),
          /* @__PURE__ */ jsx3("p", { className: "cv-canva-title-role", children: data.title })
        ] }),
        /* @__PURE__ */ jsx3(ExperienceBlock, { ...props }),
        /* @__PURE__ */ jsx3(ReferencesBlock, { data })
      ] })
    ] })
  );
}
function layout09(props) {
  const { data, cfg } = props;
  return paginate(
    props,
    /* @__PURE__ */ jsxs3("div", { className: "cv-canva-split-32-68", children: [
      /* @__PURE__ */ jsxs3("aside", { className: "cv-canva-sidebar-panel", children: [
        /* @__PURE__ */ jsx3("p", { className: "cv-canva-label", children: "About Me" }),
        /* @__PURE__ */ jsx3(F, { value: data.summary, path: "summary", editable: props.editable, onFieldChange: props.onFieldChange, className: "cv-body", multiline: true }),
        /* @__PURE__ */ jsx3(EducationBlock, { ...props }),
        /* @__PURE__ */ jsx3(SkillsSection, { ...props }),
        /* @__PURE__ */ jsxs3("section", { className: "cv-sec", children: [
          /* @__PURE__ */ jsx3(SecTitle, { title: "Language", variant: cfg.sectionTitle }),
          /* @__PURE__ */ jsx3("p", { className: "cv-body", children: data.languages })
        ] }),
        /* @__PURE__ */ jsx3(ReferencesBlock, { data })
      ] }),
      /* @__PURE__ */ jsxs3("div", { children: [
        /* @__PURE__ */ jsxs3("header", { className: "cv-masthead", children: [
          /* @__PURE__ */ jsx3(F, { value: data.fullName, path: "fullName", editable: props.editable, onFieldChange: props.onFieldChange, className: "cv-name" }),
          /* @__PURE__ */ jsx3("p", { className: "cv-canva-title-role", style: { letterSpacing: "0.15em" }, children: data.title.toUpperCase() })
        ] }),
        /* @__PURE__ */ jsx3(ExperienceBlock, { ...props })
      ] })
    ] })
  );
}
function layoutWebSplit(props, alt) {
  const { data, cfg } = props;
  return paginate(
    props,
    /* @__PURE__ */ jsxs3("div", { className: `cv-canva-web-split${alt ? " cv-canva-web-split-alt" : ""}`, children: [
      /* @__PURE__ */ jsxs3("div", { children: [
        /* @__PURE__ */ jsx3("p", { className: "cv-canva-label", children: "Contact" }),
        /* @__PURE__ */ jsx3(ContactStackLeft, { ...props }),
        /* @__PURE__ */ jsx3(ExperienceBlock, { ...props }),
        /* @__PURE__ */ jsx3(ProfileBlock, { ...props })
      ] }),
      /* @__PURE__ */ jsxs3("aside", { className: "cv-canva-rail", children: [
        /* @__PURE__ */ jsxs3("header", { className: "cv-masthead cv-masthead-center", children: [
          /* @__PURE__ */ jsx3(F, { value: data.fullName, path: "fullName", editable: props.editable, onFieldChange: props.onFieldChange, className: "cv-name" }),
          /* @__PURE__ */ jsx3("p", { className: "cv-canva-title-role", children: data.title })
        ] }),
        /* @__PURE__ */ jsx3(EducationBlock, { ...props }),
        /* @__PURE__ */ jsx3(SkillsSection, { ...props }),
        /* @__PURE__ */ jsxs3("section", { className: "cv-sec", children: [
          /* @__PURE__ */ jsx3(SecTitle, { title: "Language", variant: cfg.sectionTitle }),
          /* @__PURE__ */ jsx3("p", { className: "cv-body", children: data.languages })
        ] }),
        /* @__PURE__ */ jsx3(ReferencesBlock, { data })
      ] })
    ] })
  );
}
function layout12(props) {
  const { data } = props;
  return paginate(
    props,
    /* @__PURE__ */ jsxs3(Fragment3, { children: [
      /* @__PURE__ */ jsxs3("div", { className: "cv-canva-split-35-65", children: [
        /* @__PURE__ */ jsxs3("div", { children: [
          /* @__PURE__ */ jsx3("p", { className: "cv-canva-label", children: "Contact" }),
          /* @__PURE__ */ jsx3(ContactStackLeft, { ...props }),
          /* @__PURE__ */ jsx3(EducationBlock, { ...props })
        ] }),
        /* @__PURE__ */ jsx3(SkillsSection, { ...props })
      ] }),
      /* @__PURE__ */ jsxs3("header", { className: "cv-masthead", children: [
        /* @__PURE__ */ jsx3(F, { value: data.fullName, path: "fullName", editable: props.editable, onFieldChange: props.onFieldChange, className: "cv-name" }),
        /* @__PURE__ */ jsx3("p", { className: "cv-canva-title-role", children: data.title })
      ] }),
      /* @__PURE__ */ jsx3(ProfileBlock, { ...props }),
      /* @__PURE__ */ jsx3(ExperienceBlock, { ...props })
    ] })
  );
}
function layout14(props) {
  const { data } = props;
  return paginate(
    props,
    /* @__PURE__ */ jsxs3(Fragment3, { children: [
      /* @__PURE__ */ jsxs3("header", { style: { marginBottom: "1rem" }, children: [
        /* @__PURE__ */ jsx3("p", { className: "cv-canva-hero-name", style: { fontSize: "2.25rem", textTransform: "none" }, children: /* @__PURE__ */ jsx3(F, { value: data.fullName, path: "fullName", editable: props.editable, onFieldChange: props.onFieldChange }) }),
        /* @__PURE__ */ jsx3("p", { className: "cv-canva-title-role", children: data.title }),
        /* @__PURE__ */ jsxs3("div", { className: "cv-meta-row", children: [
          /* @__PURE__ */ jsx3(F, { value: data.phone, path: "phone", editable: props.editable, onFieldChange: props.onFieldChange }),
          /* @__PURE__ */ jsx3("span", { className: "cv-meta-dot", children: " \xB7 " }),
          /* @__PURE__ */ jsx3(F, { value: data.email, path: "email", editable: props.editable, onFieldChange: props.onFieldChange }),
          /* @__PURE__ */ jsx3("span", { className: "cv-meta-dot", children: " \xB7 " }),
          /* @__PURE__ */ jsx3(F, { value: data.location, path: "location", editable: props.editable, onFieldChange: props.onFieldChange })
        ] })
      ] }),
      /* @__PURE__ */ jsx3(ProfileBlock, { ...props }),
      /* @__PURE__ */ jsx3(ExperienceBlock, { ...props })
    ] }),
    /* @__PURE__ */ jsxs3(Fragment3, { children: [
      /* @__PURE__ */ jsx3(EducationBlock, { ...props }),
      /* @__PURE__ */ jsx3(SkillsSection, { ...props })
    ] })
  );
}
function layout15(props) {
  const { data } = props;
  return paginate(
    props,
    /* @__PURE__ */ jsxs3(Fragment3, { children: [
      /* @__PURE__ */ jsxs3("header", { className: "cv-masthead", children: [
        /* @__PURE__ */ jsx3(F, { value: data.fullName, path: "fullName", editable: props.editable, onFieldChange: props.onFieldChange, className: "cv-name" }),
        /* @__PURE__ */ jsx3("p", { className: "cv-canva-title-role", children: data.title })
      ] }),
      /* @__PURE__ */ jsx3(ProfileBlock, { ...props }),
      /* @__PURE__ */ jsx3(ExperienceBlock, { ...props }),
      /* @__PURE__ */ jsx3(KeyAchievements, { ...props })
    ] }),
    /* @__PURE__ */ jsxs3(Fragment3, { children: [
      /* @__PURE__ */ jsx3(EducationBlock, { ...props }),
      /* @__PURE__ */ jsx3(SkillsSection, { ...props })
    ] })
  );
}
function layout16(props) {
  const { data } = props;
  return paginate(
    props,
    /* @__PURE__ */ jsxs3(Fragment3, { children: [
      /* @__PURE__ */ jsxs3("header", { style: { borderBottom: "3px solid var(--cv-a600)", paddingBottom: "0.75rem", marginBottom: "1rem" }, children: [
        /* @__PURE__ */ jsx3("p", { className: "cv-canva-hero-name", style: { fontSize: "2rem" }, children: /* @__PURE__ */ jsx3(F, { value: data.fullName, path: "fullName", editable: props.editable, onFieldChange: props.onFieldChange }) }),
        /* @__PURE__ */ jsx3("p", { className: "cv-canva-title-role", children: data.title })
      ] }),
      /* @__PURE__ */ jsx3(ProfileBlock, { ...props }),
      /* @__PURE__ */ jsx3(ExperienceBlock, { ...props }),
      /* @__PURE__ */ jsx3(KeyAchievements, { ...props })
    ] }),
    /* @__PURE__ */ jsxs3(Fragment3, { children: [
      /* @__PURE__ */ jsx3(EducationBlock, { ...props }),
      /* @__PURE__ */ jsx3(SkillsSection, { ...props })
    ] })
  );
}
function layout17(props) {
  const { data, cfg } = props;
  const parts = data.fullName.trim().split(/\s+/);
  const first = parts[0] ?? "";
  const last = parts.slice(1).join(" ") || "";
  return paginate(
    props,
    /* @__PURE__ */ jsxs3("div", { className: "cv-canva-vertical-name", children: [
      /* @__PURE__ */ jsxs3("div", { className: "cv-vname-stack", "aria-hidden": true, children: [
        first,
        " ",
        last
      ] }),
      /* @__PURE__ */ jsxs3("div", { children: [
        /* @__PURE__ */ jsx3("p", { className: "cv-canva-title-role", style: { fontSize: "1rem", marginBottom: "1rem" }, children: data.title }),
        /* @__PURE__ */ jsx3(ProfileBlock, { ...props }),
        /* @__PURE__ */ jsx3(ExperienceBlock, { ...props }),
        /* @__PURE__ */ jsx3(PhotoSlot, { data, shape: cfg.photoShape, size: cfg.photoSize, visible: cfg.photoDefault })
      ] })
    ] })
  );
}
function layout18(props) {
  const { data, cfg } = props;
  return paginate(
    props,
    /* @__PURE__ */ jsxs3("div", { className: "cv-canva-split-35-65", children: [
      /* @__PURE__ */ jsxs3("aside", { className: "cv-canva-sidebar-panel", children: [
        /* @__PURE__ */ jsx3("p", { className: "cv-canva-label", children: "Contact" }),
        /* @__PURE__ */ jsx3(ContactStackLeft, { ...props }),
        /* @__PURE__ */ jsxs3("section", { className: "cv-sec", children: [
          /* @__PURE__ */ jsx3(SecTitle, { title: "Expertise", variant: cfg.sectionTitle }),
          /* @__PURE__ */ jsx3(SkillsBlock, { data, variant: cfg.skills })
        ] }),
        /* @__PURE__ */ jsx3(ReferencesBlock, { data })
      ] }),
      /* @__PURE__ */ jsxs3("div", { children: [
        /* @__PURE__ */ jsxs3("header", { className: "cv-masthead", children: [
          /* @__PURE__ */ jsx3(F, { value: data.fullName, path: "fullName", editable: props.editable, onFieldChange: props.onFieldChange, className: "cv-name" }),
          /* @__PURE__ */ jsx3("p", { className: "cv-canva-title-role", children: data.title })
        ] }),
        /* @__PURE__ */ jsx3(ProfileBlock, { ...props }),
        /* @__PURE__ */ jsx3(ExperienceBlock, { ...props }),
        /* @__PURE__ */ jsx3(EducationBlock, { ...props })
      ] })
    ] })
  );
}
function layout19(props) {
  const { data, cfg } = props;
  return paginate(
    props,
    /* @__PURE__ */ jsxs3("div", { className: "cv-canva-split-32-68", children: [
      /* @__PURE__ */ jsxs3("aside", { className: "cv-canva-sidebar-panel", children: [
        /* @__PURE__ */ jsx3("p", { className: "cv-canva-label", children: "Profile" }),
        /* @__PURE__ */ jsx3(F, { value: data.summary, path: "summary", editable: props.editable, onFieldChange: props.onFieldChange, className: "cv-body", multiline: true }),
        /* @__PURE__ */ jsx3(SkillsSection, { ...props }),
        /* @__PURE__ */ jsxs3("section", { className: "cv-sec", children: [
          /* @__PURE__ */ jsx3(SecTitle, { title: "Awards", variant: cfg.sectionTitle }),
          /* @__PURE__ */ jsx3(KeyAchievements, { ...props })
        ] }),
        /* @__PURE__ */ jsx3(EducationBlock, { ...props })
      ] }),
      /* @__PURE__ */ jsxs3("div", { children: [
        /* @__PURE__ */ jsxs3("header", { className: "cv-masthead", children: [
          /* @__PURE__ */ jsx3(F, { value: data.fullName, path: "fullName", editable: props.editable, onFieldChange: props.onFieldChange, className: "cv-name" }),
          /* @__PURE__ */ jsx3("p", { className: "cv-canva-title-role", children: data.title })
        ] }),
        /* @__PURE__ */ jsx3(ExperienceBlock, { ...props })
      ] })
    ] })
  );
}
function layout20(props) {
  return paginate(
    props,
    /* @__PURE__ */ jsxs3(Fragment3, { children: [
      /* @__PURE__ */ jsx3(CanvaClassicHeader, { ...props }),
      /* @__PURE__ */ jsx3(ProfileBlock, { ...props }),
      /* @__PURE__ */ jsx3("section", { className: "cv-sec cv-timeline-wrap", children: /* @__PURE__ */ jsx3("div", { className: "cv-timeline", children: /* @__PURE__ */ jsx3(ExperienceBlock, { ...props }) }) }),
      /* @__PURE__ */ jsx3(SkillsSection, { ...props })
    ] }),
    /* @__PURE__ */ jsxs3(Fragment3, { children: [
      /* @__PURE__ */ jsx3(EducationBlock, { ...props }),
      /* @__PURE__ */ jsx3(KeyAchievements, { ...props }),
      /* @__PURE__ */ jsx3(AdditionalInfo, { ...props })
    ] })
  );
}
var RENDERERS = {
  "pdf-01-classic": layout01,
  "pdf-02-contact-left": layout02,
  "pdf-03-sidebar-contact": layout03,
  "pdf-04-about-left": layout04,
  "pdf-05-creative-name": layout05,
  "pdf-06-centered-pro": layout06,
  "pdf-07-classic-process": layout07,
  "pdf-08-sidebar-about": layout08,
  "pdf-09-sidebar-product": layout09,
  "pdf-10-web-split": (p) => layoutWebSplit(p, false),
  "pdf-11-web-split-alt": (p) => layoutWebSplit(p, true),
  "pdf-12-graphic-top": layout12,
  "pdf-13-classic-pm": layout01,
  "pdf-14-hero-accountant": layout14,
  "pdf-15-social-achieve": layout15,
  "pdf-16-marketing-header": layout16,
  "pdf-17-vertical-name": layout17,
  "pdf-18-copywriter-cols": layout18,
  "pdf-19-it-profile": layout19,
  "pdf-20-it-timeline": layout20
};
function renderPdfLayout(layoutId, props) {
  const fn = RENDERERS[layoutId] ?? layout01;
  return fn(props);
}

// src/resume/layouts.tsx
import { Fragment as Fragment4, jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
function standardTail(props) {
  return /* @__PURE__ */ jsxs4(Fragment4, { children: [
    /* @__PURE__ */ jsx4(ProjectsBlock, { ...props }),
    /* @__PURE__ */ jsx4(SkillsSection, { ...props })
  ] });
}
function standardThreePage(props, page1, page2) {
  const formal = props.cfg.formalPadding;
  return /* @__PURE__ */ jsx4(
    Pages3,
    {
      formal,
      a: page1,
      b: page2 ?? standardTail(props),
      c: /* @__PURE__ */ jsx4(TotalsFooter, { ...props })
    }
  );
}
function InvoiceMain(props) {
  const { cfg, data, editable, onFieldChange } = props;
  return /* @__PURE__ */ jsxs4(Fragment4, { children: [
    /* @__PURE__ */ jsx4(MetaRow, { ...props }),
    /* @__PURE__ */ jsx4(Masthead, { ...props }),
    /* @__PURE__ */ jsx4(Profile, { ...props }),
    /* @__PURE__ */ jsxs4("section", { className: "cv-sec", children: [
      /* @__PURE__ */ jsx4(SecTitle, { title: "Professional Experience", variant: cfg.sectionTitle }),
      /* @__PURE__ */ jsx4(ExpDateGrid, { jobs: data.experience, editable, onFieldChange })
    ] })
  ] });
}
function SidebarRail(props) {
  const { data, cfg, editable, onFieldChange, side, pct, dark } = props;
  const showPhoto = cfg.photoDefault;
  return /* @__PURE__ */ jsxs4(
    "aside",
    {
      className: `cv-sidebar-rail cv-sidebar-${side}${dark ? " cv-sidebar-dark" : ""}`,
      style: { flex: `0 0 ${pct}%` },
      "data-sidebar-gradient": dark ? "1" : void 0,
      children: [
        /* @__PURE__ */ jsx4(PhotoSlot, { data, shape: cfg.photoShape, size: cfg.photoSize, visible: showPhoto }),
        /* @__PURE__ */ jsx4(SkillsSection, { ...props }),
        /* @__PURE__ */ jsxs4("section", { className: "cv-sec", children: [
          /* @__PURE__ */ jsx4(SecTitle, { title: "Languages", variant: cfg.sectionTitle }),
          /* @__PURE__ */ jsx4("span", { className: "cv-body", children: data.languages })
        ] }),
        /* @__PURE__ */ jsx4(LinksRail, { data })
      ]
    }
  );
}
function renderLayoutBody(props) {
  const pdfLayout = PDF_LAYOUT_BY_TEMPLATE[props.cfg.id];
  if (pdfLayout) return renderPdfLayout(pdfLayout, props);
  const { cfg, data } = props;
  const L = cfg.layout;
  if (L === "swiss-single") {
    return standardThreePage(
      props,
      /* @__PURE__ */ jsxs4(Fragment4, { children: [
        /* @__PURE__ */ jsxs4("div", { className: "cv-swiss-head", children: [
          /* @__PURE__ */ jsx4(Masthead, { ...props }),
          /* @__PURE__ */ jsx4("p", { className: "cv-role-title", children: data.title })
        ] }),
        /* @__PURE__ */ jsx4(MetaRow, { ...props }),
        /* @__PURE__ */ jsx4(Profile, { ...props }),
        /* @__PURE__ */ jsxs4("section", { className: "cv-sec", children: [
          /* @__PURE__ */ jsx4(SecTitle, { title: "Professional Experience", variant: cfg.sectionTitle }),
          /* @__PURE__ */ jsx4(ExpDateGrid, { jobs: data.experience, editable: props.editable, onFieldChange: props.onFieldChange })
        ] })
      ] })
    );
  }
  if (L === "sidebar-left" || L === "sidebar-left-dark") {
    const dark = L === "sidebar-left-dark";
    const pct = cfg.sidebarPct ?? 27;
    return standardThreePage(
      props,
      /* @__PURE__ */ jsxs4("div", { className: "cv-split", children: [
        /* @__PURE__ */ jsx4(SidebarRail, { ...props, side: "left", pct, dark }),
        /* @__PURE__ */ jsx4("main", { className: "cv-main", style: { flex: `1 1 ${100 - pct}%` }, children: /* @__PURE__ */ jsx4(InvoiceMain, { ...props }) })
      ] }),
      /* @__PURE__ */ jsx4(ProjectsBlock, { ...props })
    );
  }
  if (L === "sidebar-right") {
    const pct = cfg.sidebarPct ?? 30;
    return standardThreePage(
      props,
      /* @__PURE__ */ jsxs4("div", { className: "cv-split", children: [
        /* @__PURE__ */ jsx4("main", { className: "cv-main cv-rail-tint", style: { flex: `1 1 ${100 - pct}%` }, children: /* @__PURE__ */ jsx4(InvoiceMain, { ...props }) }),
        /* @__PURE__ */ jsx4(SidebarRail, { ...props, side: "right", pct })
      ] })
    );
  }
  if (L === "minimal-dense") {
    return standardThreePage(
      props,
      /* @__PURE__ */ jsxs4(Fragment4, { children: [
        /* @__PURE__ */ jsx4(Masthead, { ...props }),
        /* @__PURE__ */ jsx4("div", { className: "cv-hairline" }),
        /* @__PURE__ */ jsx4(MetaRow, { ...props }),
        /* @__PURE__ */ jsx4(Profile, { ...props }),
        /* @__PURE__ */ jsxs4("section", { className: "cv-sec cv-dense", children: [
          /* @__PURE__ */ jsx4(SecTitle, { title: "Professional Experience", variant: cfg.sectionTitle }),
          /* @__PURE__ */ jsx4(ExpDateGrid, { jobs: data.experience, editable: props.editable, onFieldChange: props.onFieldChange })
        ] })
      ] })
    );
  }
  if (L === "timeline") {
    return standardThreePage(
      props,
      /* @__PURE__ */ jsxs4(Fragment4, { children: [
        /* @__PURE__ */ jsx4(MetaRow, { ...props }),
        /* @__PURE__ */ jsx4(Masthead, { ...props }),
        /* @__PURE__ */ jsx4(Profile, { ...props }),
        /* @__PURE__ */ jsxs4("section", { className: "cv-sec cv-timeline-wrap", children: [
          /* @__PURE__ */ jsx4(SecTitle, { title: "Professional Experience", variant: cfg.sectionTitle }),
          /* @__PURE__ */ jsx4("div", { className: "cv-timeline", children: /* @__PURE__ */ jsx4(ExpDateGrid, { jobs: data.experience, editable: props.editable, onFieldChange: props.onFieldChange }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs4(Fragment4, { children: [
        /* @__PURE__ */ jsx4(SkillsSection, { ...props }),
        /* @__PURE__ */ jsx4(ProjectsBlock, { ...props })
      ] })
    );
  }
  if (L === "magazine-hero") {
    return standardThreePage(
      props,
      /* @__PURE__ */ jsxs4(Fragment4, { children: [
        /* @__PURE__ */ jsx4(Masthead, { ...props }),
        /* @__PURE__ */ jsx4(MetaRow, { ...props }),
        /* @__PURE__ */ jsxs4("div", { className: "cv-mag-hero", children: [
          /* @__PURE__ */ jsx4("div", { className: "cv-mag-summary", children: /* @__PURE__ */ jsx4(Profile, { ...props }) }),
          /* @__PURE__ */ jsx4("div", { className: "cv-mag-skills", children: /* @__PURE__ */ jsx4(SkillsSection, { ...props }) })
        ] }),
        /* @__PURE__ */ jsxs4("section", { className: "cv-sec cv-banded", children: [
          /* @__PURE__ */ jsx4(SecTitle, { title: "Professional Experience", variant: cfg.sectionTitle }),
          /* @__PURE__ */ jsx4(ExpDateGrid, { jobs: data.experience, editable: props.editable, onFieldChange: props.onFieldChange })
        ] })
      ] }),
      /* @__PURE__ */ jsx4(ProjectsBlock, { ...props })
    );
  }
  if (L === "bands") {
    return standardThreePage(
      props,
      /* @__PURE__ */ jsxs4(Fragment4, { children: [
        /* @__PURE__ */ jsx4(MetaRow, { ...props }),
        /* @__PURE__ */ jsx4(Masthead, { ...props }),
        /* @__PURE__ */ jsx4("div", { className: "cv-band", children: /* @__PURE__ */ jsx4(Profile, { ...props }) }),
        /* @__PURE__ */ jsx4("div", { className: "cv-band", children: /* @__PURE__ */ jsxs4("section", { className: "cv-sec", children: [
          /* @__PURE__ */ jsx4(SecTitle, { title: "Professional Experience", variant: cfg.sectionTitle }),
          /* @__PURE__ */ jsx4(ExpDateGrid, { jobs: data.experience, editable: props.editable, onFieldChange: props.onFieldChange })
        ] }) }),
        /* @__PURE__ */ jsx4("div", { className: "cv-band", children: /* @__PURE__ */ jsx4(SkillsSection, { ...props }) })
      ] }),
      /* @__PURE__ */ jsx4(ProjectsBlock, { ...props })
    );
  }
  if (L === "banner-exec") {
    return standardThreePage(
      props,
      /* @__PURE__ */ jsxs4(Fragment4, { children: [
        /* @__PURE__ */ jsxs4("header", { className: "cv-exec-banner", children: [
          /* @__PURE__ */ jsx4(MetaRow, { ...props }),
          /* @__PURE__ */ jsx4(Masthead, { ...props })
        ] }),
        /* @__PURE__ */ jsxs4("section", { className: "cv-sec", children: [
          /* @__PURE__ */ jsx4(SecTitle, { title: "Professional Experience", variant: cfg.sectionTitle }),
          /* @__PURE__ */ jsx4(ExpDateGrid, { jobs: data.experience, editable: props.editable, onFieldChange: props.onFieldChange })
        ] })
      ] }),
      /* @__PURE__ */ jsxs4(Fragment4, { children: [
        /* @__PURE__ */ jsx4(SkillsSection, { ...props }),
        /* @__PURE__ */ jsx4(ProjectsBlock, { ...props })
      ] })
    );
  }
  if (L === "invoice-table") {
    const pct = cfg.sidebarPct ?? 24;
    return standardThreePage(
      props,
      /* @__PURE__ */ jsxs4("div", { className: "cv-split", children: [
        /* @__PURE__ */ jsxs4("main", { className: "cv-main", style: { flex: `1 1 ${100 - pct}%` }, children: [
          /* @__PURE__ */ jsx4(MetaRow, { ...props }),
          /* @__PURE__ */ jsx4(Masthead, { ...props }),
          /* @__PURE__ */ jsx4(Profile, { ...props }),
          /* @__PURE__ */ jsxs4("section", { className: "cv-sec", children: [
            /* @__PURE__ */ jsx4(SecTitle, { title: "Professional Experience", variant: cfg.sectionTitle }),
            /* @__PURE__ */ jsx4(ExpTableHtml, { ...props, jobs: data.experience })
          ] })
        ] }),
        /* @__PURE__ */ jsx4(SidebarRail, { ...props, side: "right", pct })
      ] }),
      /* @__PURE__ */ jsx4(ProjectsBlock, { ...props })
    );
  }
  if (L === "academic-boxed") {
    return standardThreePage(
      props,
      /* @__PURE__ */ jsxs4(Fragment4, { children: [
        /* @__PURE__ */ jsx4(Masthead, { ...props }),
        /* @__PURE__ */ jsx4(MetaRow, { ...props }),
        /* @__PURE__ */ jsx4("div", { className: "cv-box", children: /* @__PURE__ */ jsx4(Profile, { ...props }) }),
        /* @__PURE__ */ jsxs4("section", { className: "cv-sec", children: [
          /* @__PURE__ */ jsx4(SecTitle, { title: "Professional Experience", variant: cfg.sectionTitle }),
          /* @__PURE__ */ jsx4(ExpDateGrid, { jobs: data.experience, editable: props.editable, onFieldChange: props.onFieldChange })
        ] })
      ] })
    );
  }
  if (L === "centered-serif" || L === "centered-luxury") {
    return standardThreePage(
      props,
      /* @__PURE__ */ jsxs4("div", { className: "cv-centered-col cv-serif-doc", children: [
        /* @__PURE__ */ jsx4(Masthead, { ...props, centered: true }),
        /* @__PURE__ */ jsx4(MetaRow, { ...props }),
        /* @__PURE__ */ jsx4(Profile, { ...props }),
        /* @__PURE__ */ jsxs4("section", { className: "cv-sec", children: [
          /* @__PURE__ */ jsx4(SecTitle, { title: "Professional Experience", variant: cfg.sectionTitle }),
          /* @__PURE__ */ jsx4(ExpDateGrid, { jobs: data.experience, editable: props.editable, onFieldChange: props.onFieldChange })
        ] })
      ] }),
      /* @__PURE__ */ jsxs4(Fragment4, { children: [
        /* @__PURE__ */ jsx4(SkillsSection, { ...props }),
        /* @__PURE__ */ jsx4(ProjectsBlock, { ...props })
      ] })
    );
  }
  if (L === "asymmetric") {
    return standardThreePage(
      props,
      /* @__PURE__ */ jsxs4(Fragment4, { children: [
        /* @__PURE__ */ jsx4("div", { className: "cv-asym-head", children: /* @__PURE__ */ jsx4(Masthead, { ...props }) }),
        /* @__PURE__ */ jsx4("p", { className: "cv-asym-role", children: data.title }),
        /* @__PURE__ */ jsx4("div", { className: "cv-asym-summary", children: /* @__PURE__ */ jsx4(Profile, { ...props }) }),
        /* @__PURE__ */ jsxs4("section", { className: "cv-sec", children: [
          /* @__PURE__ */ jsx4(SecTitle, { title: "Professional Experience", variant: cfg.sectionTitle }),
          /* @__PURE__ */ jsx4(ExpDateGrid, { jobs: data.experience, editable: props.editable, onFieldChange: props.onFieldChange })
        ] })
      ] }),
      /* @__PURE__ */ jsxs4(Fragment4, { children: [
        /* @__PURE__ */ jsx4("div", { className: "cv-proj-cols", children: /* @__PURE__ */ jsx4(ProjectsBlock, { ...props }) }),
        /* @__PURE__ */ jsx4(SkillsSection, { ...props })
      ] })
    );
  }
  if (L === "card-modular") {
    return standardThreePage(
      props,
      /* @__PURE__ */ jsxs4(Fragment4, { children: [
        /* @__PURE__ */ jsxs4("div", { className: "cv-card-grid", children: [
          /* @__PURE__ */ jsx4("div", { className: "cv-card", children: /* @__PURE__ */ jsx4(Profile, { ...props }) }),
          /* @__PURE__ */ jsx4("div", { className: "cv-card cv-card-dark", children: /* @__PURE__ */ jsx4(SkillsSection, { ...props }) }),
          /* @__PURE__ */ jsxs4("div", { className: "cv-card", children: [
            /* @__PURE__ */ jsx4(PhotoSlot, { data, shape: cfg.photoShape, size: cfg.photoSize, visible: cfg.photoDefault }),
            /* @__PURE__ */ jsx4(LinksRail, { data })
          ] })
        ] }),
        /* @__PURE__ */ jsxs4("section", { className: "cv-sec", children: [
          /* @__PURE__ */ jsx4(SecTitle, { title: "Professional Experience", variant: cfg.sectionTitle }),
          data.experience.map((job, i) => /* @__PURE__ */ jsx4("div", { className: "cv-card cv-row", children: /* @__PURE__ */ jsx4(ExpDateGrid, { jobs: [job], editable: props.editable, onFieldChange: props.onFieldChange }) }, i))
        ] })
      ] }),
      /* @__PURE__ */ jsx4(ProjectsBlock, { ...props })
    );
  }
  if (L === "grid-12") {
    return standardThreePage(
      props,
      /* @__PURE__ */ jsxs4("div", { className: "cv-grid12", children: [
        /* @__PURE__ */ jsx4("div", { className: "cv-g12-name", children: /* @__PURE__ */ jsx4(Masthead, { ...props }) }),
        /* @__PURE__ */ jsx4("div", { className: "cv-g12-meta", children: /* @__PURE__ */ jsx4(MetaRow, { ...props }) }),
        /* @__PURE__ */ jsx4("div", { className: "cv-g12-sum", children: /* @__PURE__ */ jsx4(Profile, { ...props }) }),
        /* @__PURE__ */ jsx4("div", { className: "cv-g12-skills", children: /* @__PURE__ */ jsx4(SkillsSection, { ...props }) }),
        /* @__PURE__ */ jsx4("div", { className: "cv-g12-exp", children: /* @__PURE__ */ jsxs4("section", { className: "cv-sec", children: [
          /* @__PURE__ */ jsx4(SecTitle, { title: "Professional Experience", variant: cfg.sectionTitle }),
          /* @__PURE__ */ jsx4(ExpDateGrid, { jobs: data.experience, editable: props.editable, onFieldChange: props.onFieldChange })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx4(ProjectsBlock, { ...props })
    );
  }
  if (L === "newspaper") {
    return standardThreePage(
      props,
      /* @__PURE__ */ jsxs4(Fragment4, { children: [
        /* @__PURE__ */ jsx4("div", { className: "cv-news-rule" }),
        /* @__PURE__ */ jsx4(Masthead, { ...props }),
        /* @__PURE__ */ jsx4("div", { className: "cv-news-cols", children: /* @__PURE__ */ jsx4(Profile, { ...props }) }),
        /* @__PURE__ */ jsxs4("section", { className: "cv-sec", children: [
          /* @__PURE__ */ jsx4(SecTitle, { title: "Professional Experience", variant: cfg.sectionTitle }),
          /* @__PURE__ */ jsx4(ExpDateGrid, { jobs: data.experience, editable: props.editable, onFieldChange: props.onFieldChange })
        ] })
      ] }),
      /* @__PURE__ */ jsxs4(Fragment4, { children: [
        /* @__PURE__ */ jsx4("div", { className: "cv-news-cols-2", children: /* @__PURE__ */ jsx4(ProjectsBlock, { ...props }) }),
        /* @__PURE__ */ jsx4(SkillsSection, { ...props })
      ] })
    );
  }
  if (L === "brutalist") {
    return standardThreePage(
      props,
      /* @__PURE__ */ jsxs4(Fragment4, { children: [
        /* @__PURE__ */ jsx4("div", { className: "cv-brutal-top" }),
        /* @__PURE__ */ jsx4(MetaRow, { ...props }),
        /* @__PURE__ */ jsx4(Masthead, { ...props }),
        /* @__PURE__ */ jsx4(Profile, { ...props }),
        /* @__PURE__ */ jsxs4("section", { className: "cv-sec", children: [
          /* @__PURE__ */ jsx4(SecTitle, { title: "Professional Experience", variant: cfg.sectionTitle }),
          /* @__PURE__ */ jsx4(ExpDateGrid, { jobs: data.experience, editable: props.editable, onFieldChange: props.onFieldChange })
        ] })
      ] })
    );
  }
  if (L === "offset-magazine") {
    return standardThreePage(
      props,
      /* @__PURE__ */ jsxs4(Fragment4, { children: [
        /* @__PURE__ */ jsxs4("div", { className: "cv-prism-hero", children: [
          /* @__PURE__ */ jsx4(PhotoSlot, { data, shape: cfg.photoShape, size: cfg.photoSize, visible: cfg.photoDefault }),
          /* @__PURE__ */ jsx4("div", { className: "cv-prism-mast", children: /* @__PURE__ */ jsx4(Masthead, { ...props }) })
        ] }),
        /* @__PURE__ */ jsx4(MetaRow, { ...props }),
        /* @__PURE__ */ jsx4(Profile, { ...props }),
        /* @__PURE__ */ jsxs4("section", { className: "cv-sec", children: [
          /* @__PURE__ */ jsx4(SecTitle, { title: "Professional Experience", variant: cfg.sectionTitle }),
          /* @__PURE__ */ jsx4(ExpDateGrid, { jobs: data.experience, editable: props.editable, onFieldChange: props.onFieldChange })
        ] })
      ] })
    );
  }
  if (L === "sidebar-narrow") {
    const pct = cfg.sidebarPct ?? 22;
    return standardThreePage(
      props,
      /* @__PURE__ */ jsxs4("div", { className: "cv-split cv-dense", children: [
        /* @__PURE__ */ jsx4(SidebarRail, { ...props, side: "left", pct, dark: true }),
        /* @__PURE__ */ jsx4("main", { className: "cv-main", style: { flex: `1 1 ${100 - pct}%` }, children: /* @__PURE__ */ jsx4(InvoiceMain, { ...props }) })
      ] }),
      /* @__PURE__ */ jsx4(ProjectsBlock, { ...props })
    );
  }
  return standardThreePage(
    props,
    /* @__PURE__ */ jsxs4(Fragment4, { children: [
      /* @__PURE__ */ jsx4(Masthead, { ...props }),
      /* @__PURE__ */ jsx4(MetaRow, { ...props }),
      /* @__PURE__ */ jsx4(Profile, { ...props }),
      /* @__PURE__ */ jsxs4("section", { className: "cv-sec", children: [
        /* @__PURE__ */ jsx4(SecTitle, { title: "Professional Experience", variant: cfg.sectionTitle }),
        /* @__PURE__ */ jsx4(ExpDateGrid, { jobs: data.experience, editable: props.editable, onFieldChange: props.onFieldChange })
      ] })
    ] })
  );
}

// src/resume/ResumeDocument.tsx
import { jsx as jsx5 } from "react/jsx-runtime";
function ResumeDocument({ data, editable, invoiceShell, onFieldChange }) {
  const cfg = TEMPLATE_BY_ID[data.templateId] ?? TEMPLATE_BY_ID.resume_01;
  const photoOn = cfg.photoDefault ? data.showPhoto !== false : data.showPhoto === true;
  const body = renderLayoutBody({
    data: { ...data, showPhoto: photoOn },
    cfg,
    editable,
    invoiceShell,
    onFieldChange
  });
  return /* @__PURE__ */ jsx5(
    "article",
    {
      id: "resume-print-root",
      className: `${cfg.tplClass} cv-v2${invoiceShell ? " cv-invoice-shell" : ""}${photoOn ? " cv-has-photo" : " cv-no-photo"}`,
      "data-template": cfg.id,
      "data-invoice-shell": invoiceShell ? "1" : void 0,
      children: body
    }
  );
}

// src/resume/ssr-entry.tsx
import { jsx as jsx6 } from "react/jsx-runtime";
function renderResumeV2Markup(rawDraft, options = {}) {
  let data = draftToResumeData(rawDraft);
  if (options.useSampleFill !== false) {
    data = mergeWithSample(data);
  }
  return renderToStaticMarkup(
    /* @__PURE__ */ jsx6(ResumeDocument, { data, editable: options.editable, invoiceShell: options.invoiceShell })
  );
}
function renderResumeV2Pages(rawDraft, options = {}) {
  const inner = renderResumeV2Markup(rawDraft, { ...options, useSampleFill: true });
  return inner;
}
export {
  renderResumeV2Markup,
  renderResumeV2Pages
};
