import { DEFAULT_RESUME_TEMPLATE_ID, isKnownResumeTemplateId } from "./constants.js";

const STORAGE_KEY = "resume-web-server:draft:v1";

export function defaultResumeDraft() {
  return {
    templateId: DEFAULT_RESUME_TEMPLATE_ID,
    fullName: "Alex Morgan",
    title: "Senior Software Engineer",
    email: "alex.morgan@example.com",
    phone: "+1 (555) 012-3456",
    location: "San Francisco, CA",
    links: [
      { label: "LinkedIn", url: "https://linkedin.com/in/example" },
      { label: "GitHub", url: "https://github.com/example" },
      { label: "Portfolio", url: "https://example.com" },
    ],
    summary:
      "Product-minded engineer with 8+ years building reliable web platforms and APIs. Enjoys mentoring, pragmatic architecture, and shipping features that users feel. Comfortable across TypeScript, Node, and cloud-native deployments.",
    experience: [
      {
        company: "Northwind Labs",
        role: "Staff Software Engineer",
        start: "2021",
        end: "Present",
        bullets: [
          "Led redesign of core billing pipeline; cut incident rate by 40% year over year.",
          "Introduced design system and accessibility checks in CI for customer-facing apps.",
          "Partnered with product and design on roadmap for multi-region failover.",
        ],
      },
      {
        company: "Riverstone Systems",
        role: "Senior Software Engineer",
        start: "2017",
        end: "2021",
        bullets: [
          "Owned authentication and permissions for a B2B SaaS product used by 2k+ companies.",
          "Migrated monolith services to modular Node workers; improved p95 latency by 25%.",
        ],
      },
    ],
    education: [
      {
        school: "State University",
        degree: "B.S. Computer Science",
        start: "2011",
        end: "2015",
      },
      {
        school: "Online — Cloud Architecture",
        degree: "Professional certificate",
        start: "2019",
        end: "2019",
      },
    ],
    skills:
      "TypeScript · JavaScript · Node.js · React\nPostgreSQL · Redis · Docker · AWS\nREST & GraphQL APIs · CI/CD · Observability (OpenTelemetry)\nTechnical writing · Code review · Mentoring",
  };
}

function normalizeLinks(links) {
  if (!Array.isArray(links)) return defaultResumeDraft().links;
  const out = links.map((l) => ({
    label: typeof l?.label === "string" ? l.label : "",
    url: typeof l?.url === "string" ? l.url : "",
  }));
  return out.length ? out : defaultResumeDraft().links;
}

function normalizeExperience(rows) {
  const fallback = defaultResumeDraft().experience;
  if (!Array.isArray(rows) || !rows.length) return fallback;
  return rows.map((r) => ({
    company: typeof r?.company === "string" ? r.company : "",
    role: typeof r?.role === "string" ? r.role : "",
    start: typeof r?.start === "string" ? r.start : "",
    end: typeof r?.end === "string" ? r.end : "",
    bullets: Array.isArray(r?.bullets)
      ? r.bullets.map((b) => (typeof b === "string" ? b : "")).concat(["", "", ""]).slice(0, 12)
      : ["", "", ""],
  }));
}

function normalizeEducation(rows) {
  const fallback = defaultResumeDraft().education;
  if (!Array.isArray(rows) || !rows.length) return fallback;
  return rows.map((r) => ({
    school: typeof r?.school === "string" ? r.school : "",
    degree: typeof r?.degree === "string" ? r.degree : "",
    start: typeof r?.start === "string" ? r.start : "",
    end: typeof r?.end === "string" ? r.end : "",
  }));
}

export function normalizeResumeDraft(raw) {
  const d = defaultResumeDraft();
  if (!raw || typeof raw !== "object") return d;

  const legacy = {
    resume_classic: "resume_fluvo_1",
    resume_sidebar: "resume_fluvo_2",
    resume_minimal: "resume_fluvo_3",
  };

  let templateId = typeof raw.templateId === "string" ? raw.templateId : "";
  if (legacy[templateId]) templateId = legacy[templateId];

  const tid = isKnownResumeTemplateId(templateId) ? templateId : DEFAULT_RESUME_TEMPLATE_ID;
  return {
    templateId: tid,
    fullName: typeof raw.fullName === "string" ? raw.fullName : d.fullName,
    title: typeof raw.title === "string" ? raw.title : d.title,
    email: typeof raw.email === "string" ? raw.email : d.email,
    phone: typeof raw.phone === "string" ? raw.phone : d.phone,
    location: typeof raw.location === "string" ? raw.location : d.location,
    links: normalizeLinks(raw.links),
    summary: typeof raw.summary === "string" ? raw.summary : d.summary,
    experience: normalizeExperience(raw.experience),
    education: normalizeEducation(raw.education),
    skills: typeof raw.skills === "string" ? raw.skills : d.skills,
  };
}

export function loadResumeDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultResumeDraft();
    const parsed = JSON.parse(raw);
    return normalizeResumeDraft(parsed);
  } catch {
    return defaultResumeDraft();
  }
}

export function saveResumeDraft(draft) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeResumeDraft(draft)));
  } catch {
    /* ignore quota */
  }
}
