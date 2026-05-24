import type { ResumeData } from "./types.js";

export const SAMPLE_RESUME: ResumeData = {
  templateId: "resume_01",
  fullName: "Elena Vasquez",
  title: "Senior Product Engineer",
  email: "elena.vasquez@email.com",
  phone: "+1 415 555 0142",
  location: "San Francisco, CA",
  summary:
    "Product engineer with nine years shipping B2B platforms and developer tools. Led cross-functional delivery from discovery through production, improving activation by 34% and cutting incident volume by half. Comfortable owning architecture decisions, mentoring engineers, and partnering with design on complex workflows.",
  experience: [
    {
      role: "Staff Software Engineer",
      company: "Northline Systems",
      start: "2021",
      end: "Present",
      bullets: [
        "Built observability and release automation for 40+ microservices; reduced mean time to recovery from 47 minutes to 19.",
        "Drove API versioning strategy adopted by three product lines, eliminating breaking changes for enterprise clients.",
        "Mentored a team of six; two promotions to senior level within 18 months.",
      ],
    },
    {
      role: "Senior Software Engineer",
      company: "Meridian Analytics",
      start: "2017",
      end: "2021",
      bullets: [
        "Delivered customer-facing reporting module used by 12,000 accounts; improved query performance 3× via indexing and caching.",
        "Introduced contract tests between frontend and backend, cutting regression bugs in release week by 60%.",
      ],
    },
  ],
  education: [
    {
      degree: "M.S. Computer Science",
      school: "State University",
      start: "2015",
      end: "2017",
      details: "Thesis: distributed tracing for event-driven systems",
    },
  ],
  skills: [
    "TypeScript",
    "React",
    "Node.js",
    "PostgreSQL",
    "System design",
    "Technical leadership",
  ],
  projects: [
    {
      name: "OpenTelemetry Workshop Kit",
      context: "Internal training platform",
      start: "2023",
      bullets: ["Self-paced labs and sandboxes for 200+ engineers; adopted as onboarding standard."],
    },
    {
      name: "Customer Health Dashboard",
      context: "Product analytics",
      start: "2020",
      bullets: ["Unified churn signals; referenced weekly by customer success leadership."],
    },
  ],
  certifications: "AWS Solutions Architect – Associate · Certified Kubernetes Administrator",
  languages: "English (native) · Spanish (professional)",
  links: [
    { label: "GitHub", url: "github.com/elena-vasquez" },
    { label: "LinkedIn", url: "linkedin.com/in/elenavasquez" },
  ],
  showPhoto: false,
  photoUrl: "",
};
