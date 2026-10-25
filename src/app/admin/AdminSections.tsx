"use client";

import { useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  createAwardAction,
  createCertificationAction,
  createEducationAction,
  createExperienceAction,
  createProjectAction,
  createSkillAction,
  deleteEntryAction,
  moveEntryAction,
  saveAboutAction,
  saveContactAction,
  saveHeroAction,
  saveResumeVisibilityAction,
  uploadResumeAction,
  removeResumeAction,
  updateAwardAction,
  updateCertificationAction,
  updateEducationAction,
  updateExperienceAction,
  updateProjectAction,
  updateSkillAction,
} from "./actions";
import { ADMIN_SECTIONS, type AdminSectionKey } from "./adminSectionsConfig";
import { fallbackAbout, fallbackContact, fallbackHero } from "../../../lib/portfolio/content";
import type { PortfolioEntry } from "../../../lib/portfolio/types";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}

function TextInput({
  name,
  defaultValue,
  type = "text",
}: {
  name: string;
  defaultValue?: string;
  type?: string;
}) {
  return (
    <input
      name={name}
      type={type}
      defaultValue={defaultValue}
      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-700"
    />
  );
}

function TextArea({
  name,
  defaultValue,
  rows = 4,
}: {
  name: string;
  defaultValue?: string;
  rows?: number;
}) {
  return (
    <textarea
      name={name}
      defaultValue={defaultValue}
      rows={rows}
      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-700"
    />
  );
}

function Checkbox({
  name,
  defaultChecked,
  label,
}: {
  name: string;
  defaultChecked?: boolean;
  label?: string;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-700">
      <input name={name} type="checkbox" value="on" defaultChecked={defaultChecked} className="h-4 w-4" />
      {label ?? "Published"}
    </label>
  );
}

function SubmitButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white"
    >
      {children}
    </button>
  );
}

function CancelButton({ onCancel }: { onCancel: () => void }) {
  return (
    <button
      type="button"
      onClick={onCancel}
      className="rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-700"
    >
      Cancel
    </button>
  );
}

function ResumeSubmitButton({ hasResume }: { hasResume: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? "Uploading…" : hasResume ? "Replace Resume" : "Upload Resume"}
    </button>
  );
}

function ResumeEditor({
  entry,
  onCancel,
}: {
  entry?: PortfolioEntry;
  onCancel: () => void;
}) {
  const content = (entry?.content ?? {}) as Record<string, unknown>;
  const filename =
    typeof content.filename === "string" ? content.filename : "";
  const storagePath =
    typeof content.storagePath === "string" ? content.storagePath : "";
  const hasResume = Boolean(filename && storagePath);
  const isPublic = Boolean(entry?.is_published && content.publicDownload === true);

  return (
    <div className="mt-4 space-y-5">
      {hasResume ? (
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-sm font-medium text-slate-800">{filename}</p>
          <p className="mt-1 text-xs text-slate-500">
            Current resume · PDF · {isPublic ? "Public download enabled" : "Private"}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href="/api/admin/resume-preview"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700"
            >
              Preview / open
            </a>
            <form
              action={removeResumeAction}
              onSubmit={(event) => {
                if (!window.confirm("Remove the current resume?")) {
                  event.preventDefault();
                }
              }}
            >
              <button
                type="submit"
                className="rounded-lg border border-red-300 px-4 py-2 text-sm text-red-700"
              >
                Remove Resume
              </button>
            </form>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-600">No resume has been uploaded.</p>
      )}

      <form action={uploadResumeAction} className="space-y-3">
        <Field label="Resume PDF (maximum 5 MB)">
          <input
            type="file"
            name="resume"
            accept=".pdf,application/pdf"
            required
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </Field>
        <ResumeSubmitButton hasResume={hasResume} />
        <p className="text-xs text-slate-500">
          Uploading replaces the current resume only after the new file is safely stored.
        </p>
      </form>

      {hasResume && (
        <form action={saveResumeVisibilityAction} className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4">
          <input type="hidden" name="id" value={entry?.id ?? ""} />
          <Checkbox
            name="publicDownload"
            label="Show the Download Resume link on the public homepage"
            defaultChecked={isPublic}
          />
          <SubmitButton>Save visibility</SubmitButton>
        </form>
      )}

      <div>
        <CancelButton onCancel={onCancel} />
      </div>
    </div>
  );
}

function HeroEditor({
  entry,
  onCancel,
}: {
  entry?: PortfolioEntry;
  onCancel: () => void;
}) {
  const content = (entry?.content ?? {}) as Record<string, unknown>;
  const values = {
    name: String(content.name ?? fallbackHero.name),
    headline: String(content.headline ?? fallbackHero.headline),
    introduction: String(content.introduction ?? fallbackHero.introduction),
    primaryCtaLabel: String(content.primaryCtaLabel ?? fallbackHero.primaryCtaLabel),
    primaryCtaHref: String(content.primaryCtaHref ?? fallbackHero.primaryCtaHref),
    secondaryCtaLabel: String(content.secondaryCtaLabel ?? fallbackHero.secondaryCtaLabel),
    secondaryCtaHref: String(content.secondaryCtaHref ?? fallbackHero.secondaryCtaHref),
  };

  return (
    <form action={saveHeroAction} className="mt-4 grid gap-4 sm:grid-cols-2">
      <Field label="Name">
        <TextInput name="name" defaultValue={values.name} />
      </Field>
      <Field label="Headline">
        <TextInput name="headline" defaultValue={values.headline} />
      </Field>
      <Field label="Introduction">
        <TextArea name="introduction" defaultValue={values.introduction} />
      </Field>
      <Field label="Primary CTA label">
        <TextInput name="primaryCtaLabel" defaultValue={values.primaryCtaLabel} />
      </Field>
      <Field label="Primary CTA destination">
        <TextInput name="primaryCtaHref" defaultValue={values.primaryCtaHref} />
      </Field>
      <Field label="Secondary CTA label">
        <TextInput name="secondaryCtaLabel" defaultValue={values.secondaryCtaLabel} />
      </Field>
      <Field label="Secondary CTA destination">
        <TextInput name="secondaryCtaHref" defaultValue={values.secondaryCtaHref} />
      </Field>
      <Checkbox name="is_published" defaultChecked={entry?.is_published} />
      <div className="sm:col-span-2 flex flex-wrap gap-2">
        <SubmitButton>Save hero</SubmitButton>
        <CancelButton onCancel={onCancel} />
      </div>
    </form>
  );
}

function AboutEditor({
  entry,
  onCancel,
}: {
  entry?: PortfolioEntry;
  onCancel: () => void;
}) {
  const content = (entry?.content ?? {}) as Record<string, unknown>;
  const values = {
    heading: String(content.heading ?? fallbackAbout.heading),
    subtitle: String(content.subtitle ?? fallbackAbout.subtitle),
    biography: String(content.biography ?? fallbackAbout.biography),
    shortSummary: String(content.shortSummary ?? fallbackAbout.shortSummary),
  };

  return (
    <form action={saveAboutAction} className="mt-4 grid gap-4 sm:grid-cols-2">
      <Field label="Heading">
        <TextInput name="heading" defaultValue={values.heading} />
      </Field>
      <Field label="Subtitle">
        <TextInput name="subtitle" defaultValue={values.subtitle} />
      </Field>
      <Field label="Biography">
        <TextArea name="biography" defaultValue={values.biography} rows={8} />
      </Field>
      <Field label="Short summary">
        <TextInput name="shortSummary" defaultValue={values.shortSummary} />
      </Field>
      <Checkbox name="is_published" defaultChecked={entry?.is_published} />
      <div className="sm:col-span-2 flex flex-wrap gap-2">
        <SubmitButton>Save about</SubmitButton>
        <CancelButton onCancel={onCancel} />
      </div>
    </form>
  );
}

function ContactEditor({
  entry,
  onCancel,
}: {
  entry?: PortfolioEntry;
  onCancel: () => void;
}) {
  const content = (entry?.content ?? {}) as Record<string, unknown>;
  const otherLinks = Array.isArray(content.otherLinks)
    ? content.otherLinks
        .map((value) => {
          if (!value || typeof value !== "object") return "";
          const link = value as Record<string, unknown>;
          return `${String(link.label ?? "")} | ${String(link.url ?? "")}`;
        })
        .filter(Boolean)
        .join("\n")
    : fallbackContact.otherLinks
        .map((link) => `${link.label} | ${link.url}`)
        .join("\n");
  const values = {
    heading: String(content.heading ?? fallbackContact.heading),
    description: String(content.description ?? fallbackContact.description),
    linkedinUrl: String(content.linkedinUrl ?? fallbackContact.linkedinUrl),
    githubUrl: String(content.githubUrl ?? fallbackContact.githubUrl),
    otherLinks,
  };

  return (
    <form action={saveContactAction} className="mt-4 grid gap-4 sm:grid-cols-2">
      <Field label="Heading">
        <TextInput name="heading" defaultValue={values.heading} />
      </Field>
      <Field label="Description">
        <TextArea name="description" defaultValue={values.description} />
      </Field>
      <Field label="LinkedIn URL">
        <TextInput name="linkedinUrl" defaultValue={values.linkedinUrl} />
      </Field>
      <Field label="GitHub URL">
        <TextInput name="githubUrl" defaultValue={values.githubUrl} />
      </Field>
      <Field label="Other links (one per line: Label | https://example.com)">
        <TextArea name="otherLinks" defaultValue={values.otherLinks} rows={4} />
      </Field>
      <Checkbox name="is_published" defaultChecked={entry?.is_published} />
      <div className="sm:col-span-2 flex flex-wrap gap-2">
        <SubmitButton>Save contact</SubmitButton>
        <CancelButton onCancel={onCancel} />
      </div>
    </form>
  );
}

function ProjectEditor({ entry, onCancel }: { entry: PortfolioEntry; onCancel: () => void }) {
  const content = (entry.content ?? {}) as Record<string, unknown>;
  const technologies = Array.isArray(content.technologies)
    ? (content.technologies as string[]).join(", ")
    : "";

  return (
    <form action={updateProjectAction} className="mt-4 grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="id" value={entry.id} />
      <Field label="Title">
        <TextInput name="title" defaultValue={String(content.title ?? entry.title)} />
      </Field>
      <Field label="Description">
        <TextArea name="description" defaultValue={String(content.description ?? "")} />
      </Field>
      <Field label="Technologies (comma separated)">
        <TextInput name="technologies" defaultValue={technologies} />
      </Field>
      <Field label="Repository URL">
        <TextInput name="repoUrl" defaultValue={String(content.repoUrl ?? "")} />
      </Field>
      <Field label="Live demo URL">
        <TextInput name="liveUrl" defaultValue={String(content.liveUrl ?? "")} />
      </Field>
      <Field label="Status">
        <TextInput name="status" defaultValue={String(content.status ?? "In progress")} />
      </Field>
      <Field label="Sort order">
        <TextInput name="sort_order" type="number" defaultValue={String(entry.sort_order)} />
      </Field>
      <Checkbox name="featured" defaultChecked={Boolean(content.featured)} />
      <Checkbox name="is_published" defaultChecked={entry.is_published} />
      <div className="sm:col-span-2 flex flex-wrap gap-2">
        <SubmitButton>Save project</SubmitButton>
        <CancelButton onCancel={onCancel} />
      </div>
    </form>
  );
}

function ExperienceEditor({ entry, onCancel }: { entry: PortfolioEntry; onCancel: () => void }) {
  const content = (entry.content ?? {}) as Record<string, unknown>;

  return (
    <form action={updateExperienceAction} className="mt-4 grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="id" value={entry.id} />
      <Field label="Role">
        <TextInput name="role" defaultValue={String(content.role ?? "")} />
      </Field>
      <Field label="Organization">
        <TextInput name="organization" defaultValue={String(content.organization ?? "")} />
      </Field>
      <Field label="Description">
        <TextArea name="description" defaultValue={String(content.description ?? "")} />
      </Field>
      <Field label="Start date">
        <TextInput name="startDate" defaultValue={String(content.startDate ?? "")} />
      </Field>
      <Field label="End date">
        <TextInput name="endDate" defaultValue={String(content.endDate ?? "")} />
      </Field>
      <Field label="Relevant link">
        <TextInput name="link" defaultValue={String(content.link ?? "")} />
      </Field>
      <Field label="Sort order">
        <TextInput name="sort_order" type="number" defaultValue={String(entry.sort_order)} />
      </Field>
      <Checkbox name="isCurrent" defaultChecked={Boolean(content.isCurrent)} />
      <Checkbox name="is_published" defaultChecked={entry.is_published} />
      <div className="sm:col-span-2 flex flex-wrap gap-2">
        <SubmitButton>Save experience</SubmitButton>
        <CancelButton onCancel={onCancel} />
      </div>
    </form>
  );
}

function EducationEditor({ entry, onCancel }: { entry: PortfolioEntry; onCancel: () => void }) {
  const content = (entry.content ?? {}) as Record<string, unknown>;

  return (
    <form action={updateEducationAction} className="mt-4 grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="id" value={entry.id} />
      <Field label="Institution">
        <TextInput name="institution" defaultValue={String(content.institution ?? "")} />
      </Field>
      <Field label="Degree">
        <TextInput name="degree" defaultValue={String(content.degree ?? "")} />
      </Field>
      <Field label="Field of study">
        <TextInput name="fieldOfStudy" defaultValue={String(content.fieldOfStudy ?? "")} />
      </Field>
      <Field label="Start date">
        <TextInput name="startDate" defaultValue={String(content.startDate ?? "")} />
      </Field>
      <Field label="End date">
        <TextInput name="endDate" defaultValue={String(content.endDate ?? "")} />
      </Field>
      <Field label="Description">
        <TextArea name="description" defaultValue={String(content.description ?? "")} />
      </Field>
      <Field label="Sort order">
        <TextInput name="sort_order" type="number" defaultValue={String(entry.sort_order)} />
      </Field>
      <Checkbox name="is_published" defaultChecked={entry.is_published} />
      <div className="sm:col-span-2 flex flex-wrap gap-2">
        <SubmitButton>Save education</SubmitButton>
        <CancelButton onCancel={onCancel} />
      </div>
    </form>
  );
}

function SkillEditor({ entry, onCancel }: { entry: PortfolioEntry; onCancel: () => void }) {
  const content = (entry.content ?? {}) as Record<string, unknown>;

  return (
    <form action={updateSkillAction} className="mt-4 grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="id" value={entry.id} />
      <Field label="Skill name">
        <TextInput name="name" defaultValue={String(content.name ?? "")} />
      </Field>
      <Field label="Category">
        <TextInput name="category" defaultValue={String(content.category ?? "")} />
      </Field>
      <Field label="Sort order">
        <TextInput name="sort_order" type="number" defaultValue={String(entry.sort_order)} />
      </Field>
      <Checkbox name="is_published" defaultChecked={entry.is_published} />
      <div className="sm:col-span-2 flex flex-wrap gap-2">
        <SubmitButton>Save skill</SubmitButton>
        <CancelButton onCancel={onCancel} />
      </div>
    </form>
  );
}

function CertificationEditor({ entry, onCancel }: { entry: PortfolioEntry; onCancel: () => void }) {
  const content = (entry.content ?? {}) as Record<string, unknown>;

  return (
    <form action={updateCertificationAction} className="mt-4 grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="id" value={entry.id} />
      <Field label="Title">
        <TextInput name="title" defaultValue={String(content.title ?? entry.title)} />
      </Field>
      <Field label="Issuer">
        <TextInput name="issuer" defaultValue={String(content.issuer ?? "")} />
      </Field>
      <Field label="Date">
        <TextInput name="date" defaultValue={String(content.date ?? "")} />
      </Field>
      <Field label="Credential URL">
        <TextInput name="credentialUrl" defaultValue={String(content.credentialUrl ?? "")} />
      </Field>
      <Field label="Description">
        <TextArea name="description" defaultValue={String(content.description ?? "")} />
      </Field>
      <Field label="Sort order">
        <TextInput name="sort_order" type="number" defaultValue={String(entry.sort_order)} />
      </Field>
      <Checkbox name="is_published" defaultChecked={entry.is_published} />
      <div className="sm:col-span-2 flex flex-wrap gap-2">
        <SubmitButton>Save certification</SubmitButton>
        <CancelButton onCancel={onCancel} />
      </div>
    </form>
  );
}

function AwardEditor({ entry, onCancel }: { entry: PortfolioEntry; onCancel: () => void }) {
  const content = (entry.content ?? {}) as Record<string, unknown>;

  return (
    <form action={updateAwardAction} className="mt-4 grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="id" value={entry.id} />
      <Field label="Title">
        <TextInput name="title" defaultValue={String(content.title ?? entry.title)} />
      </Field>
      <Field label="Subtitle">
        <TextInput name="subtitle" defaultValue={String(content.subtitle ?? "")} />
      </Field>
      <Field label="Date">
        <TextInput name="date" defaultValue={String(content.date ?? "")} />
      </Field>
      <Field label="Description">
        <TextArea name="description" defaultValue={String(content.description ?? "")} />
      </Field>
      <Field label="Sort order">
        <TextInput name="sort_order" type="number" defaultValue={String(entry.sort_order)} />
      </Field>
      <Checkbox name="is_published" defaultChecked={entry.is_published} />
      <div className="sm:col-span-2 flex flex-wrap gap-2">
        <SubmitButton>Save award</SubmitButton>
        <CancelButton onCancel={onCancel} />
      </div>
    </form>
  );
}

function EntryActions({
  entry,
  onEdit,
}: {
  entry: PortfolioEntry;
  onEdit: (id: string) => void;
}) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => onEdit(entry.id)}
        className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
      >
        Edit
      </button>
      <form action={moveEntryAction}>
        <input type="hidden" name="id" value={entry.id} />
        <button type="submit" name="direction" value="up" className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs">
          ↑ Move
        </button>
        <button type="submit" name="direction" value="down" className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs">
          ↓ Move
        </button>
      </form>
      {confirmingDelete ? (
        <form action={deleteEntryAction}>
          <input type="hidden" name="id" value={entry.id} />
          <button type="submit" className="rounded-lg bg-red-600 px-3 py-1.5 text-xs text-white">
            Confirm delete
          </button>
          <button
            type="button"
            onClick={() => setConfirmingDelete(false)}
            className="ml-2 rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
          >
            Cancel
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setConfirmingDelete(true)}
          className="rounded-lg border border-red-300 px-3 py-1.5 text-xs text-red-700"
        >
          Delete
        </button>
      )}
    </div>
  );
}

export function AdminSections({ entries }: { entries: PortfolioEntry[] }) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [addingSection, setAddingSection] = useState<string | null>(null);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const entriesBySection = useMemo(() => {
    const map: Record<string, PortfolioEntry[]> = {};
    for (const section of ADMIN_SECTIONS) {
      map[section.key] = entries
        .filter((entry) => entry.section_key === section.key)
        .sort((a, b) => a.sort_order - b.sort_order || a.created_at.localeCompare(b.created_at));
    }
    return map;
  }, [entries]);

  const renderEntriesEditor = (key: AdminSectionKey) => {
    const sectionEntries = entriesBySection[key] ?? [];

    if (key === "projects") {
      return (
        <div className="mt-4">
          {sectionEntries.map((entry) => (
            <div key={entry.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-slate-800">
                  {String((entry.content as Record<string, unknown>).title ?? entry.title)}
                </p>
                <EntryActions entry={entry} onEdit={(id) => setEditingEntryId((current) => current === id ? null : id)} />
              </div>
              {editingEntryId === entry.id && <ProjectEditor entry={entry} onCancel={() => setEditingEntryId(null)} />}
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                <span>{entry.is_published ? "Published" : "Draft"}</span>
                <span>Sort order: {entry.sort_order}</span>
              </div>
            </div>
          ))}
          {addingSection === "projects" && (
            <form action={createProjectAction} className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="Title">
                <TextInput name="title" />
              </Field>
              <Field label="Description">
                <TextArea name="description" />
              </Field>
              <Field label="Technologies (comma separated)">
                <TextInput name="technologies" />
              </Field>
              <Field label="Repository URL">
                <TextInput name="repoUrl" />
              </Field>
              <Field label="Live demo URL">
                <TextInput name="liveUrl" />
              </Field>
              <Field label="Status">
                <TextInput name="status" />
              </Field>
              <Field label="Sort order">
                <TextInput name="sort_order" type="number" />
              </Field>
              <Checkbox name="is_published" />
              <div className="sm:col-span-2">
                <SubmitButton>Add project</SubmitButton>
              </div>
            </form>
          )}
          <button
            type="button"
            onClick={() => setAddingSection(addingSection === "projects" ? null : "projects")}
            className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm"
          >
            {addingSection === "projects" ? "Close add form" : "Add entry"}
          </button>
        </div>
      );
    }

    if (key === "experience") {
      return (
        <div className="mt-4">
          {sectionEntries.map((entry) => (
            <div key={entry.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-slate-800">
                  {String((entry.content as Record<string, unknown>).role ?? entry.title)}
                </p>
                <EntryActions entry={entry} onEdit={(id) => setEditingEntryId((current) => current === id ? null : id)} />
              </div>
              {editingEntryId === entry.id && <ExperienceEditor entry={entry} onCancel={() => setEditingEntryId(null)} />}
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                <span>{entry.is_published ? "Published" : "Draft"}</span>
                <span>Sort order: {entry.sort_order}</span>
              </div>
            </div>
          ))}
          {addingSection === "experience" && (
            <form action={createExperienceAction} className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="Role">
                <TextInput name="role" />
              </Field>
              <Field label="Organization">
                <TextInput name="organization" />
              </Field>
              <Field label="Description">
                <TextArea name="description" />
              </Field>
              <Field label="Start date">
                <TextInput name="startDate" />
              </Field>
              <Field label="End date">
                <TextInput name="endDate" />
              </Field>
              <Field label="Relevant link">
                <TextInput name="link" />
              </Field>
              <Field label="Sort order">
                <TextInput name="sort_order" type="number" />
              </Field>
              <Checkbox name="isCurrent" label="Current role" />
              <Checkbox name="is_published" />
              <div className="sm:col-span-2">
                <SubmitButton>Add experience</SubmitButton>
              </div>
            </form>
          )}
          <button
            type="button"
            onClick={() => setAddingSection(addingSection === "experience" ? null : "experience")}
            className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm"
          >
            {addingSection === "experience" ? "Close add form" : "Add entry"}
          </button>
        </div>
      );
    }

    if (key === "education") {
      return (
        <div className="mt-4">
          {sectionEntries.map((entry) => (
            <div key={entry.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-slate-800">
                  {String((entry.content as Record<string, unknown>).degree ?? entry.title)}
                </p>
                <EntryActions entry={entry} onEdit={(id) => setEditingEntryId((current) => current === id ? null : id)} />
              </div>
              {editingEntryId === entry.id && <EducationEditor entry={entry} onCancel={() => setEditingEntryId(null)} />}
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                <span>{entry.is_published ? "Published" : "Draft"}</span>
                <span>Sort order: {entry.sort_order}</span>
              </div>
            </div>
          ))}
          {addingSection === "education" && (
            <form action={createEducationAction} className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="Institution">
                <TextInput name="institution" />
              </Field>
              <Field label="Degree">
                <TextInput name="degree" />
              </Field>
              <Field label="Field of study">
                <TextInput name="fieldOfStudy" />
              </Field>
              <Field label="Start date">
                <TextInput name="startDate" />
              </Field>
              <Field label="End date">
                <TextInput name="endDate" />
              </Field>
              <Field label="Description">
                <TextArea name="description" />
              </Field>
              <Field label="Sort order">
                <TextInput name="sort_order" type="number" />
              </Field>
              <Checkbox name="is_published" />
              <div className="sm:col-span-2">
                <SubmitButton>Add education</SubmitButton>
              </div>
            </form>
          )}
          <button
            type="button"
            onClick={() => setAddingSection(addingSection === "education" ? null : "education")}
            className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm"
          >
            {addingSection === "education" ? "Close add form" : "Add entry"}
          </button>
        </div>
      );
    }

    if (key === "skills") {
      return (
        <div className="mt-4">
          {sectionEntries.map((entry) => (
            <div key={entry.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-slate-800">
                  {String((entry.content as Record<string, unknown>).name ?? entry.title)}
                </p>
                <EntryActions entry={entry} onEdit={(id) => setEditingEntryId((current) => current === id ? null : id)} />
              </div>
              {editingEntryId === entry.id && <SkillEditor entry={entry} onCancel={() => setEditingEntryId(null)} />}
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                <span>{entry.is_published ? "Published" : "Draft"}</span>
                <span>Sort order: {entry.sort_order}</span>
              </div>
            </div>
          ))}
          {addingSection === "skills" && (
            <form action={createSkillAction} className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="Skill name">
                <TextInput name="name" />
              </Field>
              <Field label="Category">
                <TextInput name="category" />
              </Field>
              <Field label="Sort order">
                <TextInput name="sort_order" type="number" />
              </Field>
              <Checkbox name="is_published" />
              <div className="sm:col-span-2">
                <SubmitButton>Add skill</SubmitButton>
              </div>
            </form>
          )}
          <button
            type="button"
            onClick={() => setAddingSection(addingSection === "skills" ? null : "skills")}
            className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm"
          >
            {addingSection === "skills" ? "Close add form" : "Add entry"}
          </button>
        </div>
      );
    }

    if (key === "certifications") {
      return (
        <div className="mt-4">
          {sectionEntries.map((entry) => (
            <div key={entry.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-slate-800">
                  {String((entry.content as Record<string, unknown>).title ?? entry.title)}
                </p>
                <EntryActions entry={entry} onEdit={(id) => setEditingEntryId((current) => current === id ? null : id)} />
              </div>
              {editingEntryId === entry.id && <CertificationEditor entry={entry} onCancel={() => setEditingEntryId(null)} />}
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                <span>{entry.is_published ? "Published" : "Draft"}</span>
                <span>Sort order: {entry.sort_order}</span>
              </div>
            </div>
          ))}
          {addingSection === "certifications" && (
            <form action={createCertificationAction} className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="Title">
                <TextInput name="title" />
              </Field>
              <Field label="Issuer">
                <TextInput name="issuer" />
              </Field>
              <Field label="Date">
                <TextInput name="date" />
              </Field>
              <Field label="Credential URL">
                <TextInput name="credentialUrl" />
              </Field>
              <Field label="Description">
                <TextArea name="description" />
              </Field>
              <Field label="Sort order">
                <TextInput name="sort_order" type="number" />
              </Field>
              <Checkbox name="is_published" />
              <div className="sm:col-span-2">
                <SubmitButton>Add certification</SubmitButton>
              </div>
            </form>
          )}
          <button
            type="button"
            onClick={() => setAddingSection(addingSection === "certifications" ? null : "certifications")}
            className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm"
          >
            {addingSection === "certifications" ? "Close add form" : "Add entry"}
          </button>
        </div>
      );
    }

    if (key === "awards") {
      return (
        <div className="mt-4">
          {sectionEntries.map((entry) => (
            <div key={entry.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-slate-800">
                  {String((entry.content as Record<string, unknown>).title ?? entry.title)}
                </p>
                <EntryActions entry={entry} onEdit={(id) => setEditingEntryId((current) => current === id ? null : id)} />
              </div>
              {editingEntryId === entry.id && <AwardEditor entry={entry} onCancel={() => setEditingEntryId(null)} />}
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                <span>{entry.is_published ? "Published" : "Draft"}</span>
                <span>Sort order: {entry.sort_order}</span>
              </div>
            </div>
          ))}
          {addingSection === "awards" && (
            <form action={createAwardAction} className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="Title">
                <TextInput name="title" />
              </Field>
              <Field label="Subtitle">
                <TextInput name="subtitle" />
              </Field>
              <Field label="Date">
                <TextInput name="date" />
              </Field>
              <Field label="Description">
                <TextArea name="description" />
              </Field>
              <Field label="Sort order">
                <TextInput name="sort_order" type="number" />
              </Field>
              <Checkbox name="is_published" />
              <div className="sm:col-span-2">
                <SubmitButton>Add award</SubmitButton>
              </div>
            </form>
          )}
          <button
            type="button"
            onClick={() => setAddingSection(addingSection === "awards" ? null : "awards")}
            className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm"
          >
            {addingSection === "awards" ? "Close add form" : "Add entry"}
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-5">
      {ADMIN_SECTIONS.map((section) => {
        const isOpen = Boolean(openSections[section.key]);
        const sectionEntries = entriesBySection[section.key] ?? [];

        return (
          <section
            key={section.key}
            className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {section.label}
                </p>
                <p className="mt-2 text-sm text-slate-600">{section.description}</p>
                <p className="mt-2 text-xs text-slate-500">
                  {section.kind === "entries"
                    ? `${sectionEntries.length} ${sectionEntries.length === 1 ? "entry" : "entries"}`
                    : sectionEntries.length > 0
                      ? "Single content entry"
                      : "No content entry yet"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600">
                  {sectionEntries.some((entry) => entry.is_published)
                    ? "Published content present"
                    : "No published content"}
                </span>
                <button
                  type="button"
                  onClick={() => toggleSection(section.key)}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white"
                >
                  {isOpen ? "Close editor" : "Edit"}
                </button>
              </div>
            </div>

            {isOpen && section.kind === "content" && (
              <div className="mt-4">
                {section.key === "hero" && (
                  <HeroEditor
                    entry={sectionEntries[0]}
                    onCancel={() => toggleSection(section.key)}
                  />
                )}
                {section.key === "about" && (
                  <AboutEditor
                    entry={sectionEntries[0]}
                    onCancel={() => toggleSection(section.key)}
                  />
                )}
                {section.key === "resume" && (
                  <ResumeEditor
                    entry={sectionEntries[0]}
                    onCancel={() => toggleSection(section.key)}
                  />
                )}
                {section.key === "contact" && (
                  <ContactEditor
                    entry={sectionEntries[0]}
                    onCancel={() => toggleSection(section.key)}
                  />
                )}
              </div>
            )}
            {isOpen && section.kind === "entries" && (
              <div className="mt-4">{renderEntriesEditor(section.key)}</div>
            )}
          </section>
        );
      })}
    </div>
  );
}
