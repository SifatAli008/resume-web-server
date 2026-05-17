/** International CV placeholders — jobs, university, research */
export const CV_PH = {
  fullName: "Full legal name (as on passport / visa documents)",
  title: "Target role · discipline · e.g. Senior Software Engineer · PhD Candidate",
  email: "professional.email@example.com",
  phone: "+[country code] [number] · WhatsApp optional",
  location: "City, Country · Work authorization · Willing to relocate",
  photoUrl: "Image URL (HTTPS) — professional headshot, plain background",
  photoHint: "Photo optional: common in EU, Middle East, Asia; often omitted in US, UK, Canada for ATS",
  linkLabel: "Label (LinkedIn, ORCID, GitHub, Portfolio, ResearchGate…)",
  linkUrl: "https://…",
  summary:
    "Professional profile (3–5 sentences): expertise, years of experience, key achievements with metrics, research or industry focus, career goal. Note work authorization, visa status, or programme fit when relevant.",
  skills:
    "Technical: TypeScript · JavaScript · Node.js · React · PostgreSQL · Docker · AWS\nResearch: statistical methods · datasets · publication tools\nProfessional: technical writing · code review · mentoring",
  certifications:
    "Credential — Issuing body (Year)\nLicense — Region (Year)",
  languages:
    "English — Full professional (C1/C2)\n[Language] — Professional working (B2)\n[Language] — Native",
  expRole: "Job title / Research role / Teaching role",
  expCompany: "Organisation · City, Country · Full-time / Contract / Internship",
  expStart: "Mon YYYY",
  expEnd: "Mon YYYY or Present",
  bullet: "Action verb + task + scope + measurable outcome (%, time, users, citations)",
  projName: "Project, thesis, or publication title",
  projContext: "Institution, employer, grant, conference, or journal context",
  projStart: "Mon YYYY",
  projEnd: "Mon YYYY or Present",
  eduDegree: "Degree, major, honours, GPA or class (if strong)",
  eduSchool: "University · City, Country",
  eduStart: "YYYY",
  eduEnd: "YYYY or Expected",
};

export function hasText(v) {
  return String(v ?? "").trim().length > 0;
}
