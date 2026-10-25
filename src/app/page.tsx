import { Fragment } from "react";
import Image from "next/image";
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
      <p className="eyebrow">{eyebrow}</p>
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
      <div className="timeline-marker"><span /></div>
      <div className="timeline-main">
        <div className="timeline-topline">
          <span className="small-label">{label}</span>
          <span className="timeline-date">{date}</span>
        </div>
        <h3>{title}</h3>
        {subtitle && <p className="muted">{subtitle}</p>}
        <p className="timeline-description">{description}</p>
        {link && (
          <a className="text-link" href={link.href} target="_blank" rel="noreferrer">
            {link.text} ↗
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
      <span className="empty-state-mark" aria-hidden="true">+</span>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <span className="empty-state-note">Not published</span>
    </div>
  );
}

function ProjectCard({
  project,
}: {
  project: ProjectContent;
}) {
  return (
    <article className="project-card">
      {project.imageUrl && (
        <div className="project-cover">
          <Image
            src={project.imageUrl}
            alt={`${project.title} project preview`}
            fill
            sizes="(max-width: 650px) 100vw, (max-width: 1100px) 50vw, 380px"
            unoptimized
          />
        </div>
      )}
      <div className="project-card-content">
        <div className="project-card-topline">
          <span className="small-label">{project.featured ? "SELECTED WORK" : "PROJECT"}</span>
          <span className="project-status">{project.status}</span>
        </div>
        <h3>{project.title}</h3>
        {project.technologies.length > 0 && (
          <ul className="project-tags" aria-label="Technologies">
            {project.technologies.map((technology) => (
              <li key={technology}>{technology}</li>
            ))}
          </ul>
        )}
        <p className="timeline-description">{project.description}</p>
        <div className="project-links">
          {project.liveUrl && (
            <a className="text-link" href={project.liveUrl} target="_blank" rel="noreferrer">
              Live demo <span aria-hidden="true">↗</span>
            </a>
          )}
          {project.repoUrl && (
            <a className="text-link" href={project.repoUrl} target="_blank" rel="noreferrer">
              Source <span aria-hidden="true">↗</span>
            </a>
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

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="Shreyas P R home">
          <span className="wordmark-mark">S</span>
          <span>Shreyas P R<span className="wordmark-period">.</span></span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#education">Education</a>
          <a href="#projects">Projects</a>
          <a href="#experience">Experience</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="header-cta" href="#contact">
          Let&apos;s connect <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section className="hero page-shell" id="home">
        <div className="hero-copy">
          <div className="availability">
            <span className="availability-dot" />
            <span>Computer Science Engineering student</span>
          </div>
          <p className="hero-kicker">HELLO, I&apos;M {hero.name.toUpperCase()}</p>
          <h1>
            {heroHeadlineLines.map((line, i) => (
              <Fragment key={`${line}-${i}`}>
                {i > 0 && <br />}
                {i === 0 ? line : <span>{line}</span>}
              </Fragment>
            ))}
          </h1>
          <p className="hero-description">{hero.introduction}</p>
          <div className="hero-actions">
            <a className="button button-primary" href={hero.primaryCtaHref}>
              {hero.primaryCtaLabel} <span aria-hidden="true">↗</span>
            </a>
            <a className="button button-secondary" href={hero.secondaryCtaHref}>
              {hero.secondaryCtaLabel} <span aria-hidden="true">↓</span>
            </a>
            {showResumeDownload && (
              <a className="button button-secondary" href="/api/resume/download">
                Download Resume <span aria-hidden="true">↓</span>
              </a>
            )}
          </div>
          <div className="hero-social-proof">
            <span className="mini-avatar">S</span>
            <p>
              <strong>Learning and building.</strong>
              <br />
              Connecting people through technology and community.
            </p>
          </div>
        </div>

        <div className="hero-art" aria-label="Abstract geometric artwork">
          <div className="art-topline">
            <span>SHREYAS P R</span><span>STUDENT / COMMUNITY BUILDER</span>
          </div>
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="art-orbit orbit-three" />
          <div className="art-core">
            <span className="art-core-letter">S</span>
            <span className="art-core-caption">CURIOUS<br />BY DESIGN</span>
          </div>
          <span className="art-label art-label-top">Ideas</span>
          <span className="art-label art-label-right">Build</span>
          <span className="art-label art-label-bottom">Learn</span>
          <span className="art-label art-label-left">Repeat</span>
          <div className="art-bottomline">
            <span>LEARNING · BUILDING · SHARING</span><span className="art-cross">✳</span>
          </div>
        </div>
        <a className="scroll-cue" href="#about">
          <span className="scroll-line" /> Scroll to explore
        </a>
      </section>

      <section className="intro-band">
        <div className="page-shell intro-grid">
          <p className="eyebrow">A LITTLE CONTEXT</p>
          <p className="intro-statement">
            Impactful technology combines <em>great ideas</em>, strong
            execution, and collaborative communities.
          </p>
        </div>
      </section>

      <section className="content-section page-shell" id="about">
        <SectionHeading
          eyebrow="ABOUT"
          title={about.heading}
          description={about.subtitle}
        />
        <div className="terminal-profile">
          <div className="terminal-profile-grid">
            <div className="terminal-column">
              <p><span>Name</span><b>Shreyas P R</b></p>
              <p><span>Role</span><b>Computer Science Engineering Student</b></p>
              {education[0] && (
                <p><span>Education</span><b>{education[0].degree} · {education[0].fieldOfStudy}</b></p>
              )}
              <p><span>Focus</span><b>Building · Learning · Community</b></p>
              <p><span>Interests</span><b>AI · Software · Technology</b></p>
              <p><span>Languages</span><b>English · Kannada</b></p>
            </div>
            <div className="terminal-column">
              {experiences[0] && (
                <p><span>Community</span><b>{experiences[0].organization} · {experiences[0].role}</b></p>
              )}
              <p><span>GitHub</span><a href="https://github.com/Shreyas-12-pr" target="_blank" rel="noreferrer">Shreyas-12-pr ↗</a></p>
              <p><span>LinkedIn</span><a href="https://www.linkedin.com/in/shreyas-p-r" target="_blank" rel="noreferrer">shreyas-p-r ↗</a></p>
              <p><span>Location</span><b>Bengaluru, Karnataka, India</b></p>
              <p><span>Status</span><b>Learning · Building · Collaborating</b></p>
              <p><span>Approach</span><b>Curiosity · Consistency · Teamwork</b></p>
            </div>
          </div>
          <div className="profile-card-footer">
            <span className="profile-card-prompt" aria-hidden="true">&gt;</span>
            <span>STUDENT · COMMUNITY BUILDER · TECH ENTHUSIAST</span>
          </div>
        </div>

        <div className="about-narrative">
          <h3>Hey 👋, I&apos;m {hero.name}</h3>
          <p className="about-subtitle">{about.subtitle}</p>
          {about.biography.split(/\n+/).map((paragraph, index) => (
            <p key={`about-paragraph-${index}`}>{paragraph.trim()}</p>
          ))}
          <ul>
            <li>🚀 Organizing and volunteering at tech events</li>
            <li>💻 Building projects and experimenting with new ideas</li>
            <li>🤝 Connecting people, communities, and opportunities</li>
            <li>📚 Continuously learning and sharing knowledge</li>
          </ul>
          <p>
            I believe that impactful technology comes from a combination of
            great ideas, strong execution, and collaborative communities.
          </p>
          <p>
            Always open to collaborations, interesting projects, and meaningful conversations.
          </p>
        </div>
      </section>

      <section className="content-section section-tinted" id="position">
        <div className="page-shell two-column-section">
          <SectionHeading eyebrow="POSITION" title="Where I am today." description="My current focus is computer science, technology, community building, and continuous learning." />
          <div className="position-panel">
            <span className="status-chip"><span className="availability-dot" /> Currently studying</span>
            <h3>Computer Science Engineering Student</h3>
            <p>Exploring technology, developing skills, and learning through projects and community activities.</p>
            <div className="panel-rule" />
            <div className="position-meta"><span>Current focus</span><strong>Learning &amp; personal projects</strong></div>
            <div className="position-meta"><span>Next step</span><strong>Build, contribute, grow</strong></div>
          </div>
        </div>
      </section>

      <section className="content-section page-shell" id="education">
        <SectionHeading eyebrow="EDUCATION" title="The foundation." description="My academic journey in computer science and engineering." />
        {education.map((item, index) => (
          <TimelineCard
            key={`education-${item.institution}-${item.startDate}-${index}`}
            label="DEGREE"
            date={`${item.startDate}–${item.endDate}`}
            title={item.degree}
            subtitle={`${item.fieldOfStudy} · ${item.institution}`}
            description={item.description}
          />
        ))}
        {education.length === 0 && (
          <EmptyState title="Education not published yet." description="Published education entries will appear here." />
        )}
      </section>

      <section className="content-section section-tinted" id="projects">
        <div className="page-shell">
          <SectionHeading eyebrow="SELECTED WORK" title="Projects with a purpose." description="A growing collection of ideas and projects. Work in progress is clearly labelled." />
          <div className="project-grid">
            {projects.map((project, index) => (
              <ProjectCard key={`project-${project.title}-${index}`} project={project} />
            ))}
          </div>
          {projects.length === 0 && (
            <EmptyState title="Projects not published yet." description="Published projects will appear here." />
          )}
        </div>
      </section>

      <section className="content-section page-shell" id="skills">
        <SectionHeading eyebrow="SKILLS" title="Skills are built, not claimed." description="Areas of interest and personal strengths. This list does not imply expert-level proficiency." />
        <div className="skills-layout">
          <div className="skills-intro">
            <span className="skills-symbol">✳</span>
            <h3>Keep learning.<br /><em>Keep improving.</em></h3>
            <p>I value a strong foundation, deliberate practice, and the ability to learn unfamiliar things.</p>
          </div>
          <div className="skill-list">
            {skills.map((skill) => (
              <div className="skill-row" key={skill.name}>
                <span>{skill.name}</span><span className="skill-arrow" aria-hidden="true">↗</span>
              </div>
            ))}
            {skills.length > 0 ? (
              <p className="skill-footnote">Technical tools and proficiency levels can be added once confirmed.</p>
            ) : (
              <EmptyState title="Skills not published yet." description="Published skills will appear here." />
            )}
          </div>
        </div>
      </section>

      <section className="content-section page-shell" id="experience">
        <SectionHeading eyebrow="EXPERIENCE" title="Experience, as it grows." description="Community roles and volunteering are distinct from formal employment." />
        {experiences.map((experience, index) => (
          <TimelineCard
            key={`experience-${experience.organization}-${experience.startDate}-${index}`}
            label="COMMUNITY ROLE"
            date={`${experience.startDate} · ${experience.isCurrent ? "Current" : experience.endDate}`}
            title={experience.role}
            subtitle={experience.organization}
            description={experience.description}
            link={
              experience.link
                ? { href: experience.link, text: "View link ↗" }
                : undefined
            }
          />
        ))}
        {experiences.length === 0 && (
          <EmptyState title="Experience not published yet." description="Published roles and community experience will appear here." />
        )}
      </section>

      <section className="content-section section-tinted" id="certifications">
        <div className="page-shell">
          <SectionHeading eyebrow="CREDENTIALS" title="Learning with evidence." description="Credentials should identify the issuer and reflect the original certificate details." />
          {certifications.map((item, index) => (
            <TimelineCard
              key={`certification-${item.title}-${item.date}-${index}`}
              label="CERTIFICATION"
              date={`${item.date} · Verify certificate`}
              title={item.title}
              subtitle={item.issuer}
              description={item.description}
              link={
                item.credentialUrl
                  ? { href: item.credentialUrl, text: "View credential ↗" }
                  : undefined
              }
            />
          ))}
          {certifications.length === 0 && (
            <EmptyState title="Credentials not published yet." description="Published certifications will appear here." />
          )}
        </div>
      </section>

      <section className="content-section page-shell" id="awards">
        <div className="page-shell">
          <SectionHeading eyebrow="RECOGNITION" title="Honors & awards." description="Participation and achievements are described accurately, without implying a win where none is confirmed." />
          {awards.map((item, index) => (
            <TimelineCard
              key={`award-${item.title}-${item.date}-${index}`}
              label="HACKATHON PARTICIPATION"
              date={`${item.date} · Verify certificate`}
              title={item.title}
              subtitle={item.subtitle}
              description={item.description}
            />
          ))}
          {awards.length === 0 && (
            <EmptyState title="Recognition not published yet." description="Published achievements and participation will appear here." />
          )}
        </div>
      </section>

      <section className="content-section section-tinted" id="career-break">
        <div className="page-shell">
          <SectionHeading eyebrow="CAREER TIMELINE" title="Every journey has its own pace." description="Career-break information is optional and will only appear if you choose to add and publish it." />
          <EmptyState title="Optional section." description="No career-break information has been provided, so no entry is published." />
        </div>
      </section>

      <section className="content-section page-shell" id="languages">
        <div className="page-shell">
          <SectionHeading eyebrow="LANGUAGES" title="Connecting through language." description="Language proficiency as confirmed by you." />
          <div className="language-list">
            <div className="language-item"><span>English</span><strong>Professional working proficiency</strong></div>
            <div className="language-item"><span>Kannada</span><strong>Fluent</strong></div>
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="page-shell contact-inner">
          <p className="eyebrow">HAVE SOMETHING IN MIND?</p>
          <h2>{contact.heading}</h2>
          <p className="contact-description">
            {contact.description}
          </p>

          <div className="contact-details">
            <div className="contact-detail">
              <span className="contact-detail-icon" aria-hidden="true">⌖</span>
              <div>
                <span className="contact-detail-label">LOCATION</span>
                <p>Bengaluru, Karnataka, India</p>
              </div>
            </div>

            <a className="contact-detail contact-detail-link" href={contact.linkedinUrl} target="_blank" rel="noreferrer">
              <span className="contact-detail-icon" aria-hidden="true">in</span>
              <div>
                <span className="contact-detail-label">LINKEDIN</span>
                <p>linkedin.com/in/shreyas-p-r ↗</p>
              </div>
            </a>

            <a className="contact-detail contact-detail-link" href={contact.githubUrl} target="_blank" rel="noreferrer">
              <span className="contact-detail-icon" aria-hidden="true">⌘</span>
              <div>
                <span className="contact-detail-label">GITHUB</span>
                <p>github.com/Shreyas-12-pr ↗</p>
              </div>
            </a>

            {otherContactLinks.map((link) => (
              <a key={`${link.label}-${link.url}`} className="contact-detail contact-detail-link" href={link.url} target="_blank" rel="noreferrer">
                <span className="contact-detail-icon" aria-hidden="true">↗</span>
                <div>
                  <span className="contact-detail-label">OTHER</span>
                  <p>{link.label} ↗</p>
                </div>
              </a>
            ))}
          </div>

          <p className="contact-note">
            Your email address is not displayed publicly. A secure contact form can be connected when its backend is configured.
          </p>
        </div>
      </section>

      <footer className="site-footer">
        <a className="wordmark footer-wordmark" href="#home">
          <span className="wordmark-mark">S</span>
          <span>Shreyas P R<span className="wordmark-period">.</span></span>
        </a>
        <p>Designed with intention. Built one step at a time.</p>
        <a className="back-top" href="#home">Back to top ↑</a>
        <span className="footer-year">© 2026 Shreyas P R</span>
      </footer>
    </main>
  );
}
