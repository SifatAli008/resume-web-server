import {
  DEFAULT_RESUME_TEMPLATE_ID,
  isKnownResumeTemplateId,
  normalizeTemplateId,
} from "./constants.js";
import { CV_PH } from "./templates/cv-placeholders.js";

const STORAGE_KEY = "resume-web-server:draft:v3";

const emptyBullets = () => ["", "", ""];
const emptyJob = () => ({ company: "", role: "", start: "", end: "", bullets: emptyBullets() });
const emptyProject = () => ({ name: "", context: "", start: "", end: "", bullets: emptyBullets() });
const emptyEdu = () => ({ school: "", degree: "", start: "", end: "", notes: "", bullets: ["", ""] });
const emptyRef = () => ({ name: "", title: "", phone: "", email: "" });
const emptyLink = () => ({ label: "", url: "" });

export function defaultResumeDraft() {
  return {
    templateId: DEFAULT_RESUME_TEMPLATE_ID,
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    showPhoto: false,
    photoUrl: "",
    links: [emptyLink(), emptyLink(), emptyLink()],
    summary: "",
    experience: [emptyJob(), emptyJob(), emptyJob()],
    projects: [emptyProject(), emptyProject()],
    education: [emptyEdu(), emptyEdu()],
    skills: "",
    certifications: "",
    languages: "",
    awards: "",
    references: [emptyRef(), emptyRef()],
  };
}

export { CV_PH };

function normalizeLinks(links) {
  if (!Array.isArray(links)) return defaultResumeDraft().links;
  const out = [];
  const seen = new Set();
  for (const l of links) {
    const label = typeof l?.label === "string" ? l.label : "";
    const url = typeof l?.url === "string" ? l.url : "";
    const key = `${label}\0${url}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ label, url });
    if (out.length >= 6) break;
  }
  if (!out.length) return defaultResumeDraft().links;
  while (out.length < 3) out.push(emptyLink());
  return out.slice(0, 6);
}

function normalizeBullets(bullets) {
  return Array.isArray(bullets)
    ? bullets.map((b) => (typeof b === "string" ? b : "")).concat(["", "", ""]).slice(0, 12)
    : emptyBullets();
}

function normalizeExperience(rows) {
  if (!Array.isArray(rows) || !rows.length) return defaultResumeDraft().experience;
  return rows.map((r) => ({
    company: typeof r?.company === "string" ? r.company : "",
    role: typeof r?.role === "string" ? r.role : "",
    start: typeof r?.start === "string" ? r.start : "",
    end: typeof r?.end === "string" ? r.end : "",
    bullets: normalizeBullets(r?.bullets),
  }));
}

function normalizeProjects(rows) {
  if (!Array.isArray(rows) || !rows.length) return defaultResumeDraft().projects;
  return rows.map((r) => ({
    name: typeof r?.name === "string" ? r.name : "",
    context: typeof r?.context === "string" ? r.context : "",
    start: typeof r?.start === "string" ? r.start : "",
    end: typeof r?.end === "string" ? r.end : "",
    bullets: normalizeBullets(r?.bullets),
  }));
}

function normalizeEducation(rows) {
  if (!Array.isArray(rows) || !rows.length) return defaultResumeDraft().education;
  return rows.map((r) => ({
    school: typeof r?.school === "string" ? r.school : "",
    degree: typeof r?.degree === "string" ? r.degree : "",
    start: typeof r?.start === "string" ? r.start : "",
    end: typeof r?.end === "string" ? r.end : "",
    notes: typeof r?.notes === "string" ? r.notes : "",
    bullets: normalizeBullets(r?.bullets),
  }));
}

function normalizeReferences(rows) {
  if (!Array.isArray(rows) || !rows.length) return defaultResumeDraft().references;
  return rows.map((r) => ({
    name: typeof r?.name === "string" ? r.name : "",
    title: typeof r?.title === "string" ? r.title : "",
    phone: typeof r?.phone === "string" ? r.phone : "",
    email: typeof r?.email === "string" ? r.email : "",
  }));
}

export function normalizeResumeDraft(raw) {
  const d = defaultResumeDraft();
  if (!raw || typeof raw !== "object") return d;

  let templateId = typeof raw.templateId === "string" ? raw.templateId : "";
  templateId = normalizeTemplateId(templateId);

  const tid = isKnownResumeTemplateId(templateId)
    ? normalizeTemplateId(templateId)
    : DEFAULT_RESUME_TEMPLATE_ID;
  return {
    templateId: tid,
    fullName: typeof raw.fullName === "string" ? raw.fullName : d.fullName,
    title: typeof raw.title === "string" ? raw.title : d.title,
    email: typeof raw.email === "string" ? raw.email : d.email,
    phone: typeof raw.phone === "string" ? raw.phone : d.phone,
    location: typeof raw.location === "string" ? raw.location : d.location,
    showPhoto: Boolean(raw.showPhoto),
    photoUrl: typeof raw.photoUrl === "string" ? raw.photoUrl : d.photoUrl,
    links: normalizeLinks(raw.links),
    summary: typeof raw.summary === "string" ? raw.summary : d.summary,
    experience: normalizeExperience(raw.experience),
    projects: normalizeProjects(raw.projects),
    education: normalizeEducation(raw.education),
    skills: typeof raw.skills === "string" ? raw.skills : d.skills,
    certifications: typeof raw.certifications === "string" ? raw.certifications : d.certifications,
    languages: typeof raw.languages === "string" ? raw.languages : d.languages,
    awards: typeof raw.awards === "string" ? raw.awards : d.awards,
    references: normalizeReferences(raw.references),
  };
}

export function loadResumeDraft() {
  try {
    for (const key of ["resume-web-server:draft:v2", "resume-web-server:draft:v1"]) {
      const legacy = localStorage.getItem(key);
      if (legacy) return normalizeResumeDraft(JSON.parse(legacy));
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultResumeDraft();
    return normalizeResumeDraft(JSON.parse(raw));
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
