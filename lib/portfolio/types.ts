export type PortfolioEntry = {
  id: string;
  section_key: string;
  title: string;
  content: Record<string, unknown>;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type HeroContent = {
  name: string;
  headline: string;
  introduction: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
};

export type AboutContent = {
  heading: string;
  subtitle: string;
  biography: string;
  shortSummary: string;
};

export type ProjectContent = {
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string | null;
  liveUrl: string | null;
  repoUrl: string | null;
  featured: boolean;
  status: string;
};

export type ExperienceContent = {
  role: string;
  organization: string;
  description: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  link: string | null;
};

export type EducationContent = {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type SkillContent = {
  name: string;
  category: string;
};

export type CertificationContent = {
  title: string;
  issuer: string;
  date: string;
  description: string;
  credentialUrl: string | null;
};

export type AwardContent = {
  title: string;
  subtitle: string;
  date: string;
  description: string;
};

export type ContactLink = {
  label: string;
  url: string;
};

export type ContactContent = {
  heading: string;
  description: string;
  linkedinUrl: string;
  githubUrl: string;
  otherLinks: ContactLink[];
};
