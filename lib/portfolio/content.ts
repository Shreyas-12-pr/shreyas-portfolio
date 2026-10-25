import type {
  AboutContent,
  AwardContent,
  CertificationContent,
  ContactContent,
  EducationContent,
  ExperienceContent,
  HeroContent,
  PortfolioEntry,
  ProjectContent,
  SkillContent,
} from "./types";

function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : fallback;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return fallback;
}

function asOptionalString(value: unknown): string | null {
  const str = asString(value);
  return str.length > 0 ? str : null;
}

function asBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return fallback;
}

function asStringArray(value: unknown, fallback: string[] = []): string[] {
  if (!Array.isArray(value)) return fallback;
  const items = value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter((item) => item.length > 0);
  return items.length > 0 ? items : fallback;
}

function asUrl(value: unknown): string | null {
  const str = asOptionalString(value);
  if (!str) return null;
  try {
    const parsed = new URL(str);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

function asLinkList(value: unknown): { label: string; url: string }[] {
  if (!Array.isArray(value)) return [];
  const links = value
    .map((item) => {
      if (typeof item === "string") {
        const url = asUrl(item);
        return url ? { label: url.replace(/^https?:\/\//, "").split("/")[0], url } : null;
      }
      if (item && typeof item === "object") {
        const record = item as Record<string, unknown>;
        const label = asString(record.label);
        const url = asUrl(record.url);
        return url ? { label: label || url.replace(/^https?:\/\//, "").split("/")[0], url } : null;
      }
      return null;
    })
    .filter((item): item is { label: string; url: string } => item !== null);
  return links;
}

function publishedEntries(
  entries: PortfolioEntry[] | undefined,
  sectionKey: string
): PortfolioEntry[] {
  if (!entries) return [];
  return entries
    .filter((entry) => entry.section_key === sectionKey && entry.is_published)
    .sort(
      (a, b) =>
        a.sort_order - b.sort_order || a.created_at.localeCompare(b.created_at)
    );
}

function firstPublishedEntry(
  entries: PortfolioEntry[] | undefined,
  sectionKey: string
): PortfolioEntry | undefined {
  const list = publishedEntries(entries, sectionKey);
  return list[0];
}

function entryContent(entry: PortfolioEntry | undefined): Record<string, unknown> {
  if (!entry) return {};
  return entry?.content && typeof entry.content === "object"
    ? (entry.content as Record<string, unknown>)
    : {};
}

// ---------------------------------------------------------------------------
// Fallbacks: verified approved content, used only while no published entry
// exists in the database. Nothing here is invented.
// ---------------------------------------------------------------------------

export const fallbackHero: HeroContent = {
  name: "Shreyas P R",
  headline: "Student | Community Builder | Tech Enthusiast",
  introduction:
    "I'm passionate about building communities, exploring technology, and creating opportunities for people to learn, connect, and grow together.",
  primaryCtaLabel: "View Projects",
  primaryCtaHref: "#projects",
  secondaryCtaLabel: "A little about me",
  secondaryCtaHref: "#about",
};

export const fallbackAbout: AboutContent = {
  heading: "About Me",
  subtitle: "Student | Community Builder | Tech Enthusiast",
  biography:
    "Hey 👋, I'm Shreyas P R.\n\nI'm passionate about building communities, exploring technology, and creating opportunities for people to learn, connect, and grow together.\n\nI believe that impactful technology comes from a combination of great ideas, strong execution, and collaborative communities.\n\nAlways open to collaborations, interesting projects, and meaningful conversations.",
  shortSummary:
    "Student | Community Builder | Tech Enthusiast building communities, exploring technology, and creating opportunities for people to learn, connect, and grow together.",
};

export const fallbackSkills: SkillContent[] = [
  { name: "Artificial intelligence — area of interest", category: "Interest" },
  { name: "Problem solving", category: "Strength" },
  { name: "Communication", category: "Strength" },
  { name: "Teamwork", category: "Strength" },
];

export const fallbackProjects: ProjectContent[] = [
  {
    title: "Open Design AI",
    description:
      "Exploring a design-system concept for an AI-assisted design workspace, with an interest in reusable UI components, consistent visual styling, and coherent design patterns. Implementation and personal deliverables are not yet confirmed.",
    technologies: ["AI-assisted design"],
    imageUrl: null,
    liveUrl: null,
    repoUrl: null,
    featured: true,
    status: "Idea stage",
  },
];

export const fallbackExperience: ExperienceContent = {
  role: "Core Member",
  organization: "TechNexus Community",
  description:
    "Participate in a range of community activities, collaboration, and technology-focused initiatives. Specific responsibilities and outcomes can be added when confirmed.",
  startDate: "June 2025",
  endDate: "End date not confirmed",
  isCurrent: true,
  link: null,
};

export const fallbackEducation: EducationContent = {
  institution: "Sapthagiri NPS University",
  degree: "Bachelor of Technology (B.Tech)",
  fieldOfStudy: "Computer Science Engineering",
  startDate: "2024",
  endDate: "2028",
  description: "Developing a foundation in computer science, engineering, and technology.",
};

export const fallbackCertification: CertificationContent = {
  title: "AI Security Fundamentals",
  issuer: "Microsoft Learning",
  date: "May 2026",
  description: "Listed in the public profile. Credential link and certificate details should be verified before launch.",
  credentialUrl: null,
};

export const fallbackAward: AwardContent = {
  title: "RIFT '26 — Unstop Freedom Festival",
  subtitle: "RIFT",
  date: "February 2026",
  description: "Certificate of participation. This is listed as participation, not as a competition win or award.",
};

export const fallbackContact: ContactContent = {
  heading: "Let’s make something meaningful.",
  description:
    "I’m open to collaborations, interesting projects, learning opportunities, and meaningful conversations.",
  linkedinUrl: "https://www.linkedin.com/in/shreyas-p-r",
  githubUrl: "https://github.com/Shreyas-12-pr",
  otherLinks: [],
};

// ---------------------------------------------------------------------------
// Typed content getters (published entries win, fallbacks keep the approved
// public copy visible while no CMS content has been saved yet).
// ---------------------------------------------------------------------------

export function getHeroContent(
  entries: PortfolioEntry[] | undefined
): HeroContent {
  const entry = firstPublishedEntry(entries, "hero");
  const content = entryContent(entry);

  const primaryCtaLabel = asString(content.primaryCtaLabel, fallbackHero.primaryCtaLabel);
  const primaryCtaHref = asString(content.primaryCtaHref, fallbackHero.primaryCtaHref);
  const secondaryCtaLabel = asString(content.secondaryCtaLabel, fallbackHero.secondaryCtaLabel);
  const secondaryCtaHref = asString(content.secondaryCtaHref, fallbackHero.secondaryCtaHref);

  const primaryHref =
    primaryCtaHref.startsWith("#") || primaryCtaHref.startsWith("http")
      ? primaryCtaHref
      : fallbackHero.primaryCtaHref;

  const secondaryHref =
    secondaryCtaHref.startsWith("#") || secondaryCtaHref.startsWith("http")
      ? secondaryCtaHref
      : fallbackHero.secondaryCtaHref;

  return {
    name: asString(content.name, fallbackHero.name) || fallbackHero.name,
    headline: asString(content.headline, fallbackHero.headline) || fallbackHero.headline,
    introduction: asString(content.introduction, fallbackHero.introduction),
    primaryCtaLabel: primaryCtaLabel || fallbackHero.primaryCtaLabel,
    primaryCtaHref: primaryHref,
    secondaryCtaLabel: secondaryCtaLabel || fallbackHero.secondaryCtaLabel,
    secondaryCtaHref: secondaryHref,
  };
}

export function getAboutContent(
  entries: PortfolioEntry[] | undefined
): AboutContent {
  const entry = firstPublishedEntry(entries, "about");
  const content = entryContent(entry);

  return {
    heading: asString(content.heading, fallbackAbout.heading) || fallbackAbout.heading,
    subtitle: asString(content.subtitle, fallbackAbout.subtitle),
    biography: asString(content.biography, fallbackAbout.biography),
    shortSummary: asString(content.shortSummary, fallbackAbout.shortSummary),
  };
}

export function getSkillsContent(
  entries: PortfolioEntry[] | undefined
): SkillContent[] {
  const sectionEntries = publishedEntries(entries, "skills");
  const skills: SkillContent[] = [];
  for (const entry of sectionEntries) {
    const content = entryContent(entry);
    const name = asString(content.name);
    if (name) {
      skills.push({ name, category: asString(content.category) });
    }
  }
  return skills;
}

export function getProjectsContent(
  entries: PortfolioEntry[] | undefined
): ProjectContent[] {
  const sectionEntries = publishedEntries(entries, "projects");
  const projects: ProjectContent[] = [];
  for (const entry of sectionEntries) {
    const content = entryContent(entry);
    const title = asString(content.title);
    if (!title) continue;
    projects.push({
      title,
      description: asString(content.description, fallbackProjects[0].description),
      technologies: asStringArray(content.technologies, fallbackProjects[0].technologies),
      imageUrl: asUrl(content.imageUrl),
      liveUrl: asUrl(content.liveUrl),
      repoUrl: asUrl(content.repoUrl),
      featured: asBoolean(content.featured, false),
      status: asString(content.status, fallbackProjects[0].status),
    });
  }
  return projects;
}

export function getExperiencesContent(
  entries: PortfolioEntry[] | undefined
): ExperienceContent[] {
  const sectionEntries = publishedEntries(entries, "experience");
  const experiences: ExperienceContent[] = [];
  for (const entry of sectionEntries) {
    const content = entryContent(entry);
    experiences.push({
      role: asString(content.role, fallbackExperience.role) || fallbackExperience.role,
      organization: asString(content.organization, fallbackExperience.organization),
      description: asString(content.description, fallbackExperience.description),
      startDate: asString(content.startDate, fallbackExperience.startDate),
      endDate: asString(content.endDate, fallbackExperience.endDate),
      isCurrent: asBoolean(content.isCurrent, true),
      link: asUrl(content.link),
    });
  }
  return experiences;
}

export function getEducationsContent(
  entries: PortfolioEntry[] | undefined
): EducationContent[] {
  const sectionEntries = publishedEntries(entries, "education");
  const education: EducationContent[] = [];
  for (const entry of sectionEntries) {
    const content = entryContent(entry);
    education.push({
      institution: asString(content.institution, fallbackEducation.institution),
      degree: asString(content.degree, fallbackEducation.degree),
      fieldOfStudy: asString(content.fieldOfStudy, fallbackEducation.fieldOfStudy),
      startDate: asString(content.startDate, fallbackEducation.startDate),
      endDate: asString(content.endDate, fallbackEducation.endDate),
      description: asString(content.description, fallbackEducation.description),
    });
  }
  return education;
}

export function getCertificationsContent(
  entries: PortfolioEntry[] | undefined
): CertificationContent[] {
  const sectionEntries = publishedEntries(entries, "certifications");
  const certifications: CertificationContent[] = [];
  for (const entry of sectionEntries) {
    const content = entryContent(entry);
    certifications.push({
      title: asString(content.title, fallbackCertification.title),
      issuer: asString(content.issuer, fallbackCertification.issuer),
      date: asString(content.date, fallbackCertification.date),
      description: asString(content.description, fallbackCertification.description),
      credentialUrl: asUrl(content.credentialUrl),
    });
  }
  return certifications;
}

export function getAwardsContent(
  entries: PortfolioEntry[] | undefined
): AwardContent[] {
  const sectionEntries = publishedEntries(entries, "awards");
  const awards: AwardContent[] = [];
  for (const entry of sectionEntries) {
    const content = entryContent(entry);
    awards.push({
      title: asString(content.title, fallbackAward.title),
      subtitle: asString(content.subtitle, fallbackAward.subtitle),
      date: asString(content.date, fallbackAward.date),
      description: asString(content.description, fallbackAward.description),
    });
  }
  return awards;
}

export function getContactContent(
  entries: PortfolioEntry[] | undefined
): ContactContent {
  const entry = firstPublishedEntry(entries, "contact");
  const content = entryContent(entry);

  return {
    heading: asString(content.heading, fallbackContact.heading) || fallbackContact.heading,
    description: asString(content.description, fallbackContact.description),
    linkedinUrl: asUrl(content.linkedinUrl) ?? fallbackContact.linkedinUrl,
    githubUrl: asUrl(content.githubUrl) ?? fallbackContact.githubUrl,
    otherLinks: asLinkList(content.otherLinks),
  };
}
