import { Fragment } from "react";
import Image from "next/image";
import { HeaderNav } from "./components/HeaderNav";
import { HeroArt } from "./components/HeroArt";
import { InteractiveTerminal } from "./components/InteractiveTerminal";
import { getPublishedEntries } from "../../lib/portfolio/server";
import {
  getAboutContent,
  getAwardsContent,
  getCertificationsContent,
  getContactContent,
  getEducationsContent,
  getExperiencesContent,
  getHeroContent,
  getProjectsContent,
  getSkillsContent,
} from "../../lib/portfolio/content";
import type {
  AwardContent,
  CertificationContent,
  ContactContent,
  EducationContent,
  ExperienceContent,
  HeroContent,
  PortfolioEntry,
  ProjectContent,
  SkillContent,
} from "../../lib/portfolio/types";

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-heading">
      <div className="eyebrow-container">
        <span className="eyebrow-mark">❖</span>
        <p className="eyebrow">{eyebrow}</p>
      </div>
      <h2>{title}</h2>
      {description && <p className="section-description">{description}</p>}
    </div>
  );
}

function TimelineCard({
  label,
  date,
  title,
  subtitle,
  description,
  link,
}: {
  label: string;
  date: string;
  title: string;
  subtitle: string;
  description: string;
  link?: { href: string; text: string };
}) {
  return (
    <article className="timeline-card">
      <div className="timeline-marker">
        <span className="timeline-marker-dot" />
        <span className="timeline-marker-line" />
      </div>
      <div className="timeline-main">
        <div className="timeline-topline">
          <span className="small-label-pill">{label}</span>
          <span className="timeline-date">{date}</span>
        </div>
        <h3>{title}</h3>
        {subtitle && <p className="timeline-subtitle">{subtitle}</p>}
        <p className="timeline-description">{description}</p>
        {link && (
          <a
            className="text-link"
            href={link.href}
            target="_blank"
            rel="noreferrer"
          >
            {link.text} <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </article>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="empty-state">
      <span className="empty-state-mark" aria-hidden="true">
        ✦
      </span>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <span className="empty-state-note">In preparation</span>
    </div>
  );
}

function ProjectCard({ project }: { project: ProjectContent }) {
  return (
    <article className="project-card">
      {project.imageUrl && (
        <div className="project-cover">
          <Image
            src={project.imageUrl}
            alt={`${project.title} preview`}
            fill
            sizes="(max-width: 650px) 100vw, (max-width: 1100px) 50vw, 420px"
            className="project-cover-img"
            priority={project.featured}
            unoptimized
          />
          <div className="project-cover-overlay" />
        </div>
      )}
      <div className="project-card-content">
        <div className="project-card-topline">
          <span className="small-label-pill">
            {project.featured ? "FEATURED WORK" : "PROJECT"}
          </span>
          <span className="project-status">
            <span className="status-dot-pulse" />
            {project.status}
          </span>
        </div>

        <h3>{project.title}</h3>

        {project.technologies.length > 0 && (
          <ul className="project-tags" aria-label="Technologies">
            {project.technologies.map((tech) => (
              <li key={tech} className="tech-badge">
                {tech}
              </li>
            ))}
          </ul>
        )}

        <p className="timeline-description">{project.description}</p>

        <div className="project-links">
          {project.liveUrl && (
            <a
              className="button button-sm button-primary"
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
            >
              Live Demo <span aria-hidden="true">↗</span>
            </a>
          )}
          {project.repoUrl && (
            <a
              className="button button-sm button-secondary"
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
            >
              Source <span aria-hidden="true">↗</span>
            </a>
          )}
          {!project.liveUrl && !project.repoUrl && (
            <span className="project-status-note">
              Research &amp; Active Development
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default async function Home() {
  const entries: PortfolioEntry[] = await getPublishedEntries();

  const hero: HeroContent = getHeroContent(entries);
  const about = getAboutContent(entries);
  const skills: SkillContent[] = getSkillsContent(entries);
  const projects: ProjectContent[] = getProjectsContent(entries);
  const experiences: ExperienceContent[] = getExperiencesContent(entries);
  const education: EducationContent[] = getEducationsContent(entries);
  const certifications: CertificationContent[] = getCertificationsContent(entries);
  const awards: AwardContent[] = getAwardsContent(entries);
  const contact: ContactContent = getContactContent(entries);

  const resumeEntry = entries.find(
    (entry) => entry.section_key === "resume" && entry.is_published
  );
  const resumeContent = resumeEntry?.content ?? {};
  const showResumeDownload =
    resumeContent.publicDownload === true &&
    typeof resumeContent.storagePath === "string" &&
    resumeContent.storagePath.length > 0;

  const heroHeadlineLines = hero.headline
    .split(/\s*\|\s*|(?<=\.)\s+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const otherContactLinks = contact.otherLinks.filter(
    (link) => link.url !== contact.linkedinUrl && link.url !== contact.githubUrl
  );

  // Group skills by category for rich categorized visual presentation
  const skillCategories = Array.from(
    new Set(skills.map((s) => s.category || "General"))
  );

  return (
    <main className="portfolio-wrapper">
      <HeaderNav />

      {/* Hero Section */}
      <section className="hero page-shell" id="home">
        <div className="hero-copy">
          <div className="availability">
            <span className="availability-dot" />
            <span className="availability-text">
              Computer Science Engineering Student · Sapthagiri NPS University
            </span>
          </div>

          <p className="hero-kicker">HELLO, I&apos;M {hero.name.toUpperCase()}</p>

          <h1 className="hero-heading">
            {heroHeadlineLines.map((line, i) => (
              <Fragment key={`${line}-${i}`}>
                {i > 0 && <br />}
                {i === 0 ? (
                  <span className="headline-main">{line}</span>
                ) : (
                  <span
                    className={
                      i % 2 === 1 ? "text-gradient" : "text-gradient-cyan"
                    }
                  >
                    {line}
                  </span>
                )}
              </Fragment>
            ))}
          </h1>

          <p className="hero-description">{hero.introduction}</p>

          <div className="hero-actions">
            <a className="button button-primary" href={hero.primaryCtaHref}>
              <span>{hero.primaryCtaLabel}</span>
              <span className="btn-arrow" aria-hidden="true">
                ↗
              </span>
            </a>
            <a className="button button-secondary" href={hero.secondaryCtaHref}>
              <span>{hero.secondaryCtaLabel}</span>
              <span className="btn-arrow" aria-hidden="true">
                ↓
              </span>
            </a>
            {showResumeDownload && (
              <a className="button button-secondary" href="/api/resume/download">
                <span>Download Resume</span>
                <span className="btn-arrow" aria-hidden="true">
                  ↓
                </span>
              </a>
            )}
          </div>

          {/* Quick Credential Badges */}
          <div className="hero-highlights">
            <div className="hero-highlight-pill">
              <span className="pill-icon">🎓</span>
              <span>B.Tech CSE (2024–2028)</span>
            </div>
            <div className="hero-highlight-pill">
              <span className="pill-icon">🌐</span>
              <span>TechNexus Community</span>
            </div>
            <div className="hero-highlight-pill">
              <span className="pill-icon">📍</span>
              <span>Bengaluru, India</span>
            </div>
          </div>
        </div>

        {/* Hero Cyber Art */}
        <HeroArt />

        <a className="scroll-cue" href="#about" aria-label="Scroll to about section">
          <span className="scroll-line" />
          <span>Scroll to explore</span>
        </a>
      </section>

      {/* Intro Band */}
      <section className="intro-band">
        <div className="page-shell intro-grid">
          <div className="intro-meta">
            <span className="intro-badge">PHILOSOPHY</span>
            <p className="eyebrow">CORE CONVICTION</p>
          </div>
          <p className="intro-statement">
            Impactful technology combines <em>great ideas</em>, disciplined
            execution, and <em>collaborative communities</em>.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="content-section page-shell" id="about">
        <SectionHeading
          eyebrow="ABOUT"
          title={about.heading}
          description="A glimpse into my background, academic direction, and community involvement."
        />

        {/* Interactive Terminal Profile Card */}
        <InteractiveTerminal
          itemsCol1={[
            { label: "Name", value: hero.name },
            {
              label: "Education",
              value: education[0]
                ? `${education[0].degree}`
                : "B.Tech Computer Science Engineering",
            },
            {
              label: "Institution",
              value: education[0]?.institution || "Sapthagiri NPS University",
            },
            {
              label: "Timeline",
              value: education[0]
                ? `${education[0].startDate}–${education[0].endDate}`
                : "2024–2028",
            },
            { label: "Location", value: "Bengaluru, Karnataka, India" },
          ]}
          itemsCol2={[
            {
              label: "Community",
              value: experiences[0]
                ? `${experiences[0].organization} (${experiences[0].role})`
                : "TechNexus Community",
            },
            {
              label: "Focus Areas",
              value: "AI · Software Systems · Community",
            },
            { label: "Languages", value: "English · Kannada" },
            {
              label: "GitHub",
              value: "github.com/Shreyas-12-pr ↗",
              isLink: true,
              href: "https://github.com/Shreyas-12-pr",
            },
            {
              label: "LinkedIn",
              value: "linkedin.com/in/shreyas-p-r ↗",
              isLink: true,
              href: "https://www.linkedin.com/in/shreyas-p-r",
            },
          ]}
        />

        {/* Narrative Biography without Redundant Sentences */}
        <div className="about-narrative-card">
          <div className="about-narrative-header">
            <h3>Hey 👋, I&apos;m {hero.name}</h3>
            <span className="about-subtitle-badge">{about.subtitle}</span>
          </div>

          <div className="about-text-content">
            {about.biography
              .split(/\n\n+/)
              .filter((p) => p.trim().length > 0)
              .map((paragraph, index) => (
                <p key={`about-paragraph-${index}`}>{paragraph.trim()}</p>
              ))}
          </div>

          <div className="about-focus-points">
            <h4 className="focus-points-title">WHAT DRIVES ME</h4>
            <div className="focus-points-grid">
              <div className="focus-point-item">
                <span className="point-icon">🚀</span>
                <div>
                  <strong>Community Building</strong>
                  <p>Organizing workshops, meetups, and student tech initiatives.</p>
                </div>
              </div>
              <div className="focus-point-item">
                <span className="point-icon">💻</span>
                <div>
                  <strong>Software &amp; AI Systems</strong>
                  <p>Experimenting with modern web technologies and emerging AI models.</p>
                </div>
              </div>
              <div className="focus-point-item">
                <span className="point-icon">🤝</span>
                <div>
                  <strong>Collaborative Learning</strong>
                  <p>Connecting passionate learners and sharing knowledge freely.</p>
                </div>
              </div>
              <div className="focus-point-item">
                <span className="point-icon">📚</span>
                <div>
                  <strong>Fundamentals First</strong>
                  <p>Deepening knowledge in data structures, algorithms, and systems.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Position / Current Focus Section */}
      <section className="content-section section-tinted" id="position">
        <div className="page-shell two-column-section">
          <SectionHeading
            eyebrow="CURRENT STATUS"
            title="Where I am today."
            description="My focus is computer science, technology, community building, and continuous learning."
          />
          <div className="position-panel">
            <div className="status-chip-row">
              <span className="status-chip">
                <span className="availability-dot" /> Currently studying
              </span>
              <span className="position-year-badge">Class of 2028</span>
            </div>
            <h3>Computer Science Engineering Student</h3>
            <p>
              Building a rigorous base in computing principles while actively
              exploring real-world projects and collaborative communities.
            </p>
            <div className="panel-rule" />
            <div className="position-meta-list">
              <div className="position-meta">
                <span>Institution</span>
                <strong>Sapthagiri NPS University</strong>
              </div>
              <div className="position-meta">
                <span>Current Focus</span>
                <strong>Algorithms, Web &amp; AI Architecture</strong>
              </div>
              <div className="position-meta">
                <span>Community</span>
                <strong>TechNexus Community (Core Member)</strong>
              </div>
              <div className="position-meta">
                <span>Next Milestone</span>
                <strong>Collaborate, contribute, and build</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="content-section page-shell" id="education">
        <SectionHeading
          eyebrow="ACADEMICS"
          title="The Foundation"
          description="My academic journey in computer science and engineering."
        />
        <div className="timeline-list">
          {education.map((item, index) => (
            <TimelineCard
              key={`education-${item.institution}-${item.startDate}-${index}`}
              label="DEGREE PROGRAM"
              date={`${item.startDate} – ${item.endDate}`}
              title={item.degree}
              subtitle={`${item.fieldOfStudy} · ${item.institution}`}
              description={item.description}
            />
          ))}
          {education.length === 0 && (
            <EmptyState
              title="Education in progress."
              description="Education entries are being prepared."
            />
          )}
        </div>
      </section>

      {/* Projects Section */}
      <section className="content-section section-tinted" id="projects">
        <div className="page-shell">
          <SectionHeading
            eyebrow="SELECTED WORK"
            title="Projects with purpose."
            description="A growing collection of ideas, system architectures, and development work."
          />
          <div className="project-grid">
            {projects.map((project, index) => (
              <ProjectCard
                key={`project-${project.title}-${index}`}
                project={project}
              />
            ))}
          </div>
          {projects.length === 0 && (
            <EmptyState
              title="Projects under development."
              description="Published projects will appear here as they are deployed."
            />
          )}
        </div>
      </section>

      {/* Skills Section */}
      <section className="content-section page-shell" id="skills">
        <SectionHeading
          eyebrow="SKILLS &amp; FOCUS"
          title="Skills are built, not claimed."
          description="Areas of interest, personal strengths, and foundational engineering tools."
        />
        <div className="skills-layout">
          <div className="skills-intro">
            <span className="skills-symbol">✳</span>
            <h3>
              Stay curious.
              <br />
              <em>Keep building.</em>
            </h3>
            <p>
              I value deep curiosity, deliberate practice, and the resilience to
              tackle unfamiliar problems.
            </p>
            <div className="skills-quote-highlight">
              <span>“The best way to learn is by building and sharing.”</span>
            </div>
          </div>

          <div className="skills-categorized">
            {skillCategories.map((category) => {
              const catSkills = skills.filter(
                (s) => (s.category || "General") === category
              );
              return (
                <div key={category} className="skill-category-block">
                  <h4 className="skill-category-title">{category}</h4>
                  <div className="skill-pills-row">
                    {catSkills.map((skill) => (
                      <div className="skill-pill-card" key={skill.name}>
                        <span className="pill-dot" />
                        <span className="skill-pill-name">{skill.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="content-section section-tinted" id="experience">
        <div className="page-shell">
          <SectionHeading
            eyebrow="EXPERIENCE"
            title="Community &amp; Collaboration"
            description="Active roles in technology communities and collaborative student initiatives."
          />
          <div className="timeline-list">
            {experiences.map((experience, index) => (
              <TimelineCard
                key={`experience-${experience.organization}-${experience.startDate}-${index}`}
                label="COMMUNITY ROLE"
                date={`${experience.startDate} · ${
                  experience.isCurrent ? "Current" : experience.endDate
                }`}
                title={experience.role}
                subtitle={experience.organization}
                description={experience.description}
                link={
                  experience.link
                    ? { href: experience.link, text: "View community" }
                    : undefined
                }
              />
            ))}
            {experiences.length === 0 && (
              <EmptyState
                title="Experience entries in progress."
                description="Community and leadership roles will appear here."
              />
            )}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="content-section page-shell" id="certifications">
        <SectionHeading
          eyebrow="CREDENTIALS"
          title="Learning with evidence."
          description="Courses and certifications verifying knowledge in critical computing topics."
        />
        <div className="timeline-list">
          {certifications.map((item, index) => (
            <TimelineCard
              key={`certification-${item.title}-${item.date}-${index}`}
              label="CERTIFICATION"
              date={item.date}
              title={item.title}
              subtitle={item.issuer}
              description={item.description}
              link={
                item.credentialUrl
                  ? { href: item.credentialUrl, text: "View credential" }
                  : undefined
              }
            />
          ))}
          {certifications.length === 0 && (
            <EmptyState
              title="Credentials in review."
              description="Certifications will appear here once verified."
            />
          )}
        </div>
      </section>

      {/* Awards Section */}
      <section className="content-section section-tinted" id="awards">
        <div className="page-shell">
          <SectionHeading
            eyebrow="RECOGNITION"
            title="Honors &amp; Hackathons"
            description="Participation in competitive challenges and student hackathons."
          />
          <div className="timeline-list">
            {awards.map((item, index) => (
              <TimelineCard
                key={`award-${item.title}-${item.date}-${index}`}
                label="HACKATHON"
                date={item.date}
                title={item.title}
                subtitle={item.subtitle}
                description={item.description}
              />
            ))}
            {awards.length === 0 && (
              <EmptyState
                title="Recognition entries in progress."
                description="Upcoming hackathon and festival entries will appear here."
              />
            )}
          </div>
        </div>
      </section>

      {/* Languages Section */}
      <section className="content-section page-shell" id="languages">
        <SectionHeading
          eyebrow="LANGUAGES"
          title="Connecting through language."
          description="Proficiency in spoken and written languages."
        />
        <div className="language-grid">
          <div className="language-card">
            <div className="lang-icon">🌐</div>
            <div className="lang-details">
              <h4>English</h4>
              <p>Professional Working Proficiency</p>
            </div>
            <span className="lang-badge">Fluent</span>
          </div>
          <div className="language-card">
            <div className="lang-icon">💬</div>
            <div className="lang-details">
              <h4>Kannada</h4>
              <p>Native / Bilingual Proficiency</p>
            </div>
            <span className="lang-badge">Native</span>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section" id="contact">
        <div className="page-shell contact-inner">
          <div className="contact-kicker">
            <span className="contact-kicker-dot" />
            <p className="eyebrow">HAVE SOMETHING IN MIND?</p>
          </div>

          <h2>{contact.heading}</h2>
          <p className="contact-description">{contact.description}</p>

          <div className="contact-details">
            <div className="contact-detail">
              <span className="contact-detail-icon" aria-hidden="true">
                ⌖
              </span>
              <div>
                <span className="contact-detail-label">LOCATION</span>
                <p>Bengaluru, Karnataka, India</p>
              </div>
            </div>

            <a
              className="contact-detail contact-detail-link"
              href={contact.linkedinUrl}
              target="_blank"
              rel="noreferrer"
            >
              <span className="contact-detail-icon" aria-hidden="true">
                in
              </span>
              <div>
                <span className="contact-detail-label">LINKEDIN</span>
                <p>linkedin.com/in/shreyas-p-r ↗</p>
              </div>
            </a>

            <a
              className="contact-detail contact-detail-link"
              href={contact.githubUrl}
              target="_blank"
              rel="noreferrer"
            >
              <span className="contact-detail-icon" aria-hidden="true">
                ⌘
              </span>
              <div>
                <span className="contact-detail-label">GITHUB</span>
                <p>github.com/Shreyas-12-pr ↗</p>
              </div>
            </a>

            {otherContactLinks.map((link) => (
              <a
                key={`${link.label}-${link.url}`}
                className="contact-detail contact-detail-link"
                href={link.url}
                target="_blank"
                rel="noreferrer"
              >
                <span className="contact-detail-icon" aria-hidden="true">
                  ↗
                </span>
                <div>
                  <span className="contact-detail-label">LINK</span>
                  <p>{link.label} ↗</p>
                </div>
              </a>
            ))}
          </div>

          <p className="contact-note">
            Feel free to reach out via LinkedIn or GitHub for collaborations,
            hackathon teams, and tech discussions.
          </p>
        </div>
      </section>

      {/* Site Footer */}
      <footer className="site-footer">
        <a className="wordmark footer-wordmark" href="#home">
          <span className="wordmark-mark">S</span>
          <span>
            Shreyas P R<span className="wordmark-period">.</span>
          </span>
        </a>
        <p className="footer-motto">
          Designed with intention. Built with passion.
        </p>
        <a className="back-top" href="#home" aria-label="Scroll back to top">
          Back to top ↑
        </a>
        <span className="footer-year">© 2026 Shreyas P R</span>
      </footer>
    </main>
  );
}
