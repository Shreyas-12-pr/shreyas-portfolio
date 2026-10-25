export type AdminSectionKey =
  | "hero"
  | "about"
  | "resume"
  | "projects"
  | "experience"
  | "education"
  | "skills"
  | "certifications"
  | "awards"
  | "contact";

export type AdminSection = {
  key: AdminSectionKey;
  label: string;
  description: string;
  kind: "content" | "entries";
};

export const ADMIN_SECTIONS: AdminSection[] = [
  {
    key: "hero",
    label: "Hero / Introduction",
    description: "Headline, introduction, and call-to-action buttons shown at the top of the portfolio.",
    kind: "content",
  },
  {
    key: "about",
    label: "About",
    description: "Short heading, subtitle, biography, and optional short summary.",
    kind: "content",
  },
  {
    key: "resume",
    label: "Resume",
    description: "Upload and manage the private PDF used for the public resume download.",
    kind: "content",
  },
  {
    key: "projects",
    label: "Projects",
    description: "Project entries with description, technologies, and optional links.",
    kind: "entries",
  },
  {
    key: "experience",
    label: "Experience",
    description: "Community roles and volunteering entries.",
    kind: "entries",
  },
  {
    key: "education",
    label: "Education",
    description: "Education entries with institution, degree, and dates.",
    kind: "entries",
  },
  {
    key: "skills",
    label: "Skills",
    description: "Skills and areas of interest.",
    kind: "entries",
  },
  {
    key: "certifications",
    label: "Achievements / Certifications",
    description: "Certifications and achievement entries.",
    kind: "entries",
  },
  {
    key: "awards",
    label: "Honors & Awards",
    description: "Awards and recognitions.",
    kind: "entries",
  },
  {
    key: "contact",
    label: "Contact",
    description: "Contact heading, description, and public social links.",
    kind: "content",
  },
];
