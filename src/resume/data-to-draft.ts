import type { ResumeData } from "./types.js";

/** ResumeData → vanilla localStorage draft shape */
export function resumeDataToDraft(data: ResumeData): Record<string, unknown> {
  return {
    templateId: data.templateId,
    fullName: data.fullName,
    title: data.title,
    email: data.email,
    phone: data.phone,
    location: data.location,
    summary: data.summary,
    showPhoto: data.showPhoto,
    photoUrl: data.photoUrl,
    experience: data.experience,
    education: data.education,
    projects: data.projects,
    skills: data.skills.join("\n"),
    certifications: data.certifications,
    languages: data.languages,
    links: data.links,
  };
}
