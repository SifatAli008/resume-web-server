import type { ResumeData } from "./types.js";
import { SAMPLE_RESUME } from "./sample-resume.js";
import { TEMPLATE_BY_ID } from "./template-configs.js";

function parseSkills(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map(String).filter(Boolean);
  return String(raw ?? "")
    .split(/\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function mapLegacyTemplateId(id: string): string {
  const fluvo = /^resume_fluvo_(\d+)$/.exec(id);
  if (fluvo) return `resume_${fluvo[1].padStart(2, "0")}`;
  const legacy: Record<string, string> = {
    resume_classic: "resume_01",
    resume_sidebar: "resume_02",
    resume_minimal: "resume_03",
  };
  return legacy[id] || id;
}

/** Map vanilla draft JSON → ResumeData for V2 renderers. */
export function draftToResumeData(raw: Record<string, unknown>): ResumeData {
  const templateId = mapLegacyTemplateId(String(raw.templateId || "resume_01"));
  const cfg = TEMPLATE_BY_ID[templateId];
  const exp = Array.isArray(raw.experience) ? raw.experience : SAMPLE_RESUME.experience;
  const edu = Array.isArray(raw.education) ? raw.education : SAMPLE_RESUME.education;
  const proj = Array.isArray(raw.projects) ? raw.projects : SAMPLE_RESUME.projects;
  const links = Array.isArray(raw.links) ? raw.links : SAMPLE_RESUME.links;

  const showPhoto =
    typeof raw.showPhoto === "boolean" ? raw.showPhoto : Boolean(cfg?.photoDefault);

  return {
    templateId,
    fullName: String(raw.fullName ?? ""),
    title: String(raw.title ?? ""),
    email: String(raw.email ?? ""),
    phone: String(raw.phone ?? ""),
    location: String(raw.location ?? ""),
    summary: String(raw.summary ?? ""),
    experience: exp.slice(0, 6).map((j: Record<string, unknown>) => ({
      role: String(j.role ?? ""),
      company: String(j.company ?? ""),
      location: String(j.location ?? ""),
      start: String(j.start ?? ""),
      end: String(j.end ?? ""),
      bullets: Array.isArray(j.bullets)
        ? j.bullets.map((b) => String(b ?? "")).filter((_, i, a) => i < a.length)
        : [""],
    })),
    education: edu.slice(0, 4).map((e: Record<string, unknown>) => ({
      degree: String(e.degree ?? ""),
      school: String(e.school ?? ""),
      start: String(e.start ?? ""),
      end: String(e.end ?? ""),
      details: String(e.details ?? ""),
    })),
    skills: parseSkills(raw.skills),
    projects: proj.slice(0, 4).map((p: Record<string, unknown>) => ({
      name: String(p.name ?? ""),
      context: String(p.context ?? ""),
      start: String(p.start ?? ""),
      end: String(p.end ?? ""),
      bullets: Array.isArray(p.bullets) ? p.bullets.map((b) => String(b ?? "")) : [""],
    })),
    certifications: String(raw.certifications ?? ""),
    languages: String(raw.languages ?? ""),
    links: links.slice(0, 6).map((l: Record<string, unknown>) => ({
      label: String(l.label ?? ""),
      url: String(l.url ?? ""),
    })),
    showPhoto,
    photoUrl: String(raw.photoUrl ?? ""),
  };
}

export function mergeWithSample(data: ResumeData): ResumeData {
  const fill = (v: string, fallback: string) => (v.trim() ? v : fallback);
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
    experience:
      data.experience.filter((j) => j.role || j.company).length >= 2
        ? data.experience
        : SAMPLE_RESUME.experience,
    education:
      data.education.filter((e) => e.degree || e.school).length >= 1
        ? data.education
        : SAMPLE_RESUME.education,
    projects:
      data.projects.filter((p) => p.name).length >= 2 ? data.projects : SAMPLE_RESUME.projects,
  };
}
