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

  // Centerpiece project is the first project (Open Design AI)
  const centerpieceProject = projects[0];
  const supportingProjects = projects.slice(1);

  return (
    <main className="portfolio-wrapper">
      <HeaderNav />

      {/* ====================================================================
          HERO SECTION
          ==================================================================== */}
      <section className="hero page-shell" id="home">
        <div className="hero-copy">
          <div className="availability">
            <span className="availability-dot" />
            <span className="availability-text">
              Computer Science Engineering · Sapthagiri NPS University
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
            <a className="button button-primary" href="#projects">
              <span>View Featured Project</span>
              <span className="btn-arrow" aria-hidden="true">
                ↗
              </span>
            </a>
            <a className="button button-secondary" href="#about">
              <span>About My Journey</span>
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

        {/* Hero Cyber HUD Artwork */}
        <HeroArt />

        <a className="scroll-cue" href="#projects" aria-label="Scroll to featured project">
          <span className="scroll-line" />
          <span>Explore Work</span>
        </a>
      </section>

      {/* ====================================================================
          FEATURED WORK / PROJECTS CENTERPIECE
          ==================================================================== */}
      {projects.length > 0 && (
        <section className="content-section section-tinted" id="projects">
          <div className="page-shell">
            <SectionHeading
              eyebrow="FEATURED WORK"
              title="System Architecture &amp; Exploration"
              description="A featured study exploring design systems, modular UI component boundaries, and AI-assisted workflows."
            />

            {centerpieceProject && (
              <article className="centerpiece-card">
                <div className="centerpiece-header">
                  <div className="centerpiece-title-row">
                    <div>
                      <div className="centerpiece-badge-row">
                        <span className="small-label-pill">ARCHITECTURE CONCEPT</span>
                        <span className="project-status">
                          <span className="status-dot-pulse" />
                          {centerpieceProject.status}
                        </span>
                      </div>
                      <h3 className="centerpiece-title">{centerpieceProject.title}</h3>
                    </div>

                    <div className="centerpiece-tech-badges">
                      {centerpieceProject.technologies.map((tech) => (
                        <span key={tech} className="tech-badge">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="centerpiece-description">
                    {centerpieceProject.description}
                  </p>
                </div>

                {/* Showcase Vector Mockup */}
                {centerpieceProject.imageUrl && (
                  <div className="centerpiece-visual-container">
                    <div className="centerpiece-cover">
                      <Image
                        src={centerpieceProject.imageUrl}
                        alt={`${centerpieceProject.title} preview`}
                        fill
                        sizes="(max-width: 900px) 100vw, 1100px"
                        className="centerpiece-cover-img"
                        priority
                        unoptimized
                      />
                    </div>
                  </div>
                )}

                {/* Architectural Pillars / Features Breakdown */}
                <div className="centerpiece-pillars">
                  <div className="pillar-item">
                    <div className="pillar-num">01</div>
                    <h4>Design Token Engine</h4>
                    <p>
                      Centralized color, spatial grids, and responsive typographic tokens ensuring consistency across multiple viewports.
                    </p>
                  </div>

                  <div className="pillar-item">
                    <div className="pillar-num">02</div>
                    <h4>Composable UI Primitives</h4>
                    <p>
                      Strict component contracts for buttons, inputs, panels, and navigation, designed to avoid stylesheet fragmentation.
                    </p>
                  </div>

                  <div className="pillar-item">
                    <div className="pillar-num">03</div>
                    <h4>AI-Assisted Guardrails</h4>
                    <p>
                      Translating design prompts into structured, validated design-token parameters rather than unconstrained raw markup.
                    </p>
                  </div>
                </div>

                <div className="centerpiece-footer">
                  <div className="centerpiece-note">
                    <span className="note-indicator">✦</span>
                    <span>Exploratory design framework under active iteration.</span>
                  </div>

                  {(centerpieceProject.liveUrl || centerpieceProject.repoUrl) && (
                    <div className="centerpiece-actions">
                      {centerpieceProject.liveUrl && (
                        <a
                          className="button button-sm button-primary"
                          href={centerpieceProject.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Live Demo <span aria-hidden="true">↗</span>
                        </a>
                      )}
                      {centerpieceProject.repoUrl && (
                        <a
                          className="button button-sm button-secondary"
                          href={centerpieceProject.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Source Code <span aria-hidden="true">↗</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </article>
            )}

            {/* Supporting projects if more exist in database */}
            {supportingProjects.length > 0 && (
              <div className="project-grid" style={{ marginTop: "32px" }}>
                {supportingProjects.map((project, index) => (
                  <div className="project-card" key={`supporting-${project.title}-${index}`}>
                    <div className="project-card-content">
                      <div className="project-card-topline">
                        <span className="small-label-pill">PROJECT</span>
                        <span className="project-status">{project.status}</span>
                      </div>
                      <h3>{project.title}</h3>
                      <p className="timeline-description">{project.description}</p>
                      {project.technologies.length > 0 && (
                        <ul className="project-tags">
                          {project.technologies.map((t) => (
                            <li key={t} className="tech-badge">
                              {t}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ====================================================================
          ABOUT SECTION & VERIFIED TERMINAL PROFILE
          ==================================================================== */}
      <section className="content-section page-shell" id="about">
        <SectionHeading
          eyebrow="BACKGROUND"
          title={about.heading || "Curiosity, Engineering & Community"}
          description={about.subtitle || "A direct look at my academic grounding, community initiatives, and technical focus."}
        />

        <div className="about-split-layout">
          {/* Left Column: Focused Narrative */}
          <div className="about-narrative-panel">
            <h3 className="about-panel-heading">
              Building practical software with a collaborative spirit.
            </h3>
            
            <p className="about-panel-text">
              I am a Computer Science Engineering student at <strong>Sapthagiri NPS University</strong> in Bengaluru. My focus centers on mastering software engineering fundamentals, exploring emerging AI models, and participating in practical projects.
            </p>

            <p className="about-panel-text">
              Beyond coursework, I am deeply committed to community building. As a Core Member of the <strong>TechNexus Community</strong>, I help organize student developer initiatives, peer collaboration sessions, and technical meetups to make tech learning accessible and energizing.
            </p>

            <div className="about-core-pillars">
              <div className="core-pillar-item">
                <span className="pillar-icon">🌐</span>
                <div>
                  <strong>Community Builder</strong>
                  <p>Organizing workshops, collaborative hackathon teams, and student outreach.</p>
                </div>
              </div>

              <div className="core-pillar-item">
                <span className="pillar-icon">⚡</span>
                <div>
                  <strong>Software Systems</strong>
                  <p>Studying algorithms, data structures, and modern full-stack web architectures.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Verified Terminal Profile */}
          <div className="about-terminal-panel">
            <InteractiveTerminal
              itemsCol1={[
                { label: "Name", value: hero.name },
                {
                  label: "Degree",
                  value: education[0] ? education[0].degree : "B.Tech Computer Science",
                },
                {
                  label: "University",
                  value: education[0]?.institution || "Sapthagiri NPS University",
                },
                {
                  label: "Timeline",
                  value: education[0] ? `${education[0].startDate}–${education[0].endDate}` : "2024–2028",
                },
                { label: "Location", value: "Bengaluru, India" },
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
                  value: "AI · Systems · Software",
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
          </div>
        </div>
      </section>

      {/* ====================================================================
          SKILLS SECTION
          ==================================================================== */}
      {skills.length > 0 && (
        <section className="content-section section-tinted" id="skills">
          <div className="page-shell">
            <SectionHeading
              eyebrow="SKILLS &amp; FOCUS"
              title="Deliberate Practice &amp; Strengths"
              description="Personal strengths, core interests, and foundational disciplines."
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
                  I value a strong foundation in fundamentals, consistent practice, and the discipline to solve difficult, unfamiliar problems.
                </p>
                <div className="skills-quote-highlight">
                  <span>“Learning accelerates when you build and share openly.”</span>
                </div>
              </div>

              <div className="skills-categorized">
                {Array.from(new Set(skills.map((s) => s.category || "General"))).map((category) => {
                  const catSkills = skills.filter((s) => (s.category || "General") === category);
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
          </div>
        </section>
      )}

      {/* ====================================================================
          EDUCATION SECTION (Only rendered if education data exists)
          ==================================================================== */}
      {education.length > 0 && (
        <section className="content-section page-shell" id="education">
          <SectionHeading
            eyebrow="ACADEMICS"
            title="Educational Foundation"
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
          </div>
        </section>
      )}

      {/* ====================================================================
          EXPERIENCE SECTION (Only rendered if experience data exists)
          ==================================================================== */}
      {experiences.length > 0 && (
        <section className="content-section section-tinted" id="experience">
          <div className="page-shell">
            <SectionHeading
              eyebrow="EXPERIENCE"
              title="Community Leadership &amp; Involvement"
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
            </div>
          </div>
        </section>
      )}

      {/* ====================================================================
          CERTIFICATIONS SECTION (Only rendered when verified entries exist)
          ==================================================================== */}
      {certifications.length > 0 && (
        <section className="content-section page-shell" id="certifications">
          <div className="page-shell">
            <SectionHeading
              eyebrow="CREDENTIALS"
              title="Certifications &amp; Training"
              description="Verified courses and credentials."
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
            </div>
          </div>
        </section>
      )}

      {/* ====================================================================
          AWARDS SECTION (Only rendered when verified entries exist)
          ==================================================================== */}
      {awards.length > 0 && (
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
            </div>
          </div>
        </section>
      )}

      {/* ====================================================================
          CONTACT SECTION
          ==================================================================== */}
      <section className="contact-section" id="contact">
        <div className="page-shell contact-inner">
          <div className="contact-kicker">
            <span className="contact-kicker-dot" />
            <p className="eyebrow">GET IN TOUCH</p>
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
            hackathon teams, or discussions about technology and community building.
          </p>
        </div>
      </section>

      {/* ====================================================================
          SITE FOOTER
          ==================================================================== */}
      <footer className="site-footer">
        <a className="wordmark footer-wordmark" href="#home" aria-label="Back to home">
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
