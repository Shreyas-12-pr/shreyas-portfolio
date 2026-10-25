"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import { getAdminClient, getAdminSessionClient } from "../../../lib/supabase/admin";
import { PORTFOLIO_CONTENT_TAG } from "../../../lib/portfolio/server";

function readString(value: FormDataEntryValue | null | undefined): string {
  return String(value ?? "").trim();
}

function readOptionalString(value: FormDataEntryValue | null | undefined): string {
  const str = String(value ?? "").trim();
  return str.length > 0 ? str : "";
}

function readBoolean(value: FormDataEntryValue | null | undefined): boolean {
  return value === "on";
}

function readInt(value: FormDataEntryValue | null | undefined, fallback = 0): number {
  const parsed = Number(String(value ?? ""));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function readHttpUrl(value: FormDataEntryValue | null | undefined, label: string): string | null {
  const raw = readOptionalString(value);
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol === "https:" || url.protocol === "http:") return url.toString();
  } catch {
    // Invalid URLs are reported below without exposing submitted values.
  }
  buildRedirect(`${label} must be a valid http or https URL`);
}

function readCtaHref(value: FormDataEntryValue | null | undefined, label: string): string {
  const raw = readString(value);
  if (/^#[a-zA-Z0-9_-]+$/.test(raw)) return raw;
  const url = readHttpUrl(raw, label);
  if (url) return url;
  buildRedirect(`${label} is required`);
}

function buildRedirect(errorMessage: string): never {
  redirect("/admin?error=" + encodeURIComponent(errorMessage));
}

async function finishMutation(): Promise<void> {
  updateTag(PORTFOLIO_CONTENT_TAG);
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export async function loginAction(formData: FormData) {
  const email = readString(formData.get("email"));
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    buildRedirect("Enter your email and password");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    buildRedirect("Login failed. Check your credentials");
  }

  const { data } = await supabase.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (
    !adminEmail ||
    !data.user?.email ||
    data.user.email.trim().toLowerCase() !== adminEmail
  ) {
    await supabase.auth.signOut();
    buildRedirect("This account is not authorized");
  }

  redirect("/admin?success=" + encodeURIComponent("Signed in"));
}

export async function logoutAction() {
  const supabase = await getAdminSessionClient();
  await supabase.auth.signOut();
  redirect("/admin?success=" + encodeURIComponent("Signed out"));
}

// ---------------------------------------------------------------------------
// Hero (single content entry, section_key "hero" / title "Hero")
// ---------------------------------------------------------------------------

export async function saveHeroAction(formData: FormData) {
  const supabase = await getAdminClient();

  const content = {
    name: readString(formData.get("name")),
    headline: readString(formData.get("headline")),
    introduction: readString(formData.get("introduction")),
    primaryCtaLabel: readString(formData.get("primaryCtaLabel")),
    primaryCtaHref: readCtaHref(formData.get("primaryCtaHref"), "Primary CTA destination"),
    secondaryCtaLabel: readString(formData.get("secondaryCtaLabel")),
    secondaryCtaHref: readCtaHref(formData.get("secondaryCtaHref"), "Secondary CTA destination"),
  };

  const isPublished = readBoolean(formData.get("is_published"));

  const { data: existing, error: lookupError } = await supabase
    .from("portfolio_content")
    .select("id")
    .eq("section_key", "hero")
    .eq("title", "Hero")
    .maybeSingle();
  if (lookupError) buildRedirect("Could not locate the hero content");

  const payload = {
    title: "Hero",
    content,
    is_published: isPublished,
    updated_at: new Date().toISOString(),
  };

  if (existing) {
    const { data, error } = await supabase
      .from("portfolio_content")
      .update(payload)
      .eq("id", existing.id)
      .eq("section_key", "hero")
      .select("id")
      .maybeSingle();
    if (error || !data) buildRedirect("Could not save the hero content");
  } else {
    const { error } = await supabase.from("portfolio_content").insert({
      section_key: "hero",
      title: "Hero",
      content,
      is_published: isPublished,
      sort_order: 0,
    });
    if (error) buildRedirect("Could not save the hero content");
  }

  await finishMutation();
  redirect("/admin?success=" + encodeURIComponent("Hero content saved"));
}

// ---------------------------------------------------------------------------
// About (single content entry, section_key "about" / title "About")
// ---------------------------------------------------------------------------

export async function saveAboutAction(formData: FormData) {
  const supabase = await getAdminClient();

  const content = {
    heading: readString(formData.get("heading")),
    subtitle: readString(formData.get("subtitle")),
    biography: readString(formData.get("biography")),
    shortSummary: readString(formData.get("shortSummary")),
  };

  const isPublished = readBoolean(formData.get("is_published"));

  const { data: existing, error: lookupError } = await supabase
    .from("portfolio_content")
    .select("id")
    .eq("section_key", "about")
    .eq("title", "About")
    .maybeSingle();
  if (lookupError) buildRedirect("Could not locate the about content");

  const payload = {
    title: "About",
    content,
    is_published: isPublished,
    updated_at: new Date().toISOString(),
  };

  if (existing) {
    const { data, error } = await supabase
      .from("portfolio_content")
      .update(payload)
      .eq("id", existing.id)
      .eq("section_key", "about")
      .select("id")
      .maybeSingle();
    if (error || !data) buildRedirect("Could not save the about content");
  } else {
    const { error } = await supabase.from("portfolio_content").insert({
      section_key: "about",
      title: "About",
      content,
      is_published: isPublished,
      sort_order: 0,
    });
    if (error) buildRedirect("Could not save the about content");
  }

  await finishMutation();
  redirect("/admin?success=" + encodeURIComponent("About content saved"));
}

// ---------------------------------------------------------------------------
// Contact (single content entry, section_key "contact" / title "Contact")
// ---------------------------------------------------------------------------

export async function saveContactAction(formData: FormData) {
  const supabase = await getAdminClient();

  const otherLinksRaw = readString(formData.get("otherLinks"));
  const otherLinks: { label: string; url: string }[] = [];
  for (const line of otherLinksRaw.split(/\r?\n/)) {
    const [labelText, ...urlParts] = line.split("|");
    const label = labelText.trim();
    const rawUrl = urlParts.join("|").trim();
    if (!label && !rawUrl) continue;
    if (!label || !rawUrl) {
      buildRedirect("Enter each other link as Label | https://example.com");
    }
    const url = readHttpUrl(rawUrl, "Other link");
    if (url) otherLinks.push({ label, url });
  }

  const content = {
    heading: readString(formData.get("heading")),
    description: readString(formData.get("description")),
    linkedinUrl: readHttpUrl(formData.get("linkedinUrl"), "LinkedIn URL"),
    githubUrl: readHttpUrl(formData.get("githubUrl"), "GitHub URL"),
    otherLinks,
  };

  const isPublished = readBoolean(formData.get("is_published"));

  const { data: existing, error: lookupError } = await supabase
    .from("portfolio_content")
    .select("id")
    .eq("section_key", "contact")
    .eq("title", "Contact")
    .maybeSingle();
  if (lookupError) buildRedirect("Could not locate the contact content");

  const payload = {
    title: "Contact",
    content,
    is_published: isPublished,
    updated_at: new Date().toISOString(),
  };

  if (existing) {
    const { data, error } = await supabase
      .from("portfolio_content")
      .update(payload)
      .eq("id", existing.id)
      .eq("section_key", "contact")
      .select("id")
      .maybeSingle();
    if (error || !data) buildRedirect("Could not save the contact content");
  } else {
    const { error } = await supabase.from("portfolio_content").insert({
      section_key: "contact",
      title: "Contact",
      content,
      is_published: isPublished,
      sort_order: 0,
    });
    if (error) buildRedirect("Could not save the contact content");
  }

  await finishMutation();
  redirect("/admin?success=" + encodeURIComponent("Contact content saved"));
}

const RESUME_BUCKET = "portfolio-assets";
const MAX_RESUME_BYTES = 5 * 1024 * 1024;

function resumePath(value: unknown): string | null {
  if (typeof value !== "string" || !/^resumes\/[a-f0-9-]+\.pdf$/i.test(value)) {
    return null;
  }
  return value;
}

async function getResumeEntry(supabase: Awaited<ReturnType<typeof getAdminClient>>) {
  const { data, error } = await supabase
    .from("portfolio_content")
    .select("id, content, is_published")
    .eq("section_key", "resume")
    .eq("title", "Resume")
    .maybeSingle();

  if (error) buildRedirect("Could not load the current resume metadata");
  return data;
}

export async function uploadResumeAction(formData: FormData) {
  const supabase = await getAdminClient();
  const file = formData.get("resume");

  if (!(file instanceof File) || file.size === 0) {
    buildRedirect("Choose a PDF file to upload");
  }
  if (file.size > MAX_RESUME_BYTES) {
    buildRedirect("The resume must be 5 MB or smaller");
  }
  if (
    file.type !== "application/pdf" ||
    !/\.pdf$/i.test(file.name)
  ) {
    buildRedirect("Only PDF files with a .pdf extension are accepted");
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (
    bytes.length < 5 ||
    bytes[0] !== 0x25 ||
    bytes[1] !== 0x50 ||
    bytes[2] !== 0x44 ||
    bytes[3] !== 0x46 ||
    bytes[4] !== 0x2d
  ) {
    buildRedirect("The selected file does not contain a valid PDF header");
  }

  const existing = await getResumeEntry(supabase);
  const previousContent =
    existing?.content && typeof existing.content === "object"
      ? (existing.content as Record<string, unknown>)
      : {};
  const oldPath = resumePath(previousContent.storagePath);
  const storagePath = `resumes/${crypto.randomUUID()}.pdf`;
  const filename = file.name
    .split(/[\\/]/)
    .pop()
    ?.replace(/[\u0000-\u001f\u007f]/g, "")
    .trim();

  if (!filename) buildRedirect("The selected file has an invalid filename");

  const { error: uploadError } = await supabase.storage
    .from(RESUME_BUCKET)
    .upload(storagePath, bytes, {
      contentType: "application/pdf",
      cacheControl: "60",
      upsert: false,
    });

  if (uploadError) {
    buildRedirect("Could not upload the resume. Check the private portfolio-assets bucket and storage policies.");
  }

  const nextContent = {
    storagePath,
    filename,
    publicDownload: existing?.content
      ? previousContent.publicDownload === true
      : false,
  };
  const writeResult = existing
    ? await supabase
        .from("portfolio_content")
        .update({
          content: nextContent,
          is_published: nextContent.publicDownload,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .eq("section_key", "resume")
        .select("id")
        .maybeSingle()
    : await supabase
        .from("portfolio_content")
        .insert({
          section_key: "resume",
          title: "Resume",
          content: nextContent,
          is_published: nextContent.publicDownload === true,
          sort_order: 0,
        })
        .select("id")
        .maybeSingle();

  if (writeResult.error || !writeResult.data) {
    const { error: cleanupError } = await supabase.storage
      .from(RESUME_BUCKET)
      .remove([storagePath]);
    if (cleanupError) {
      console.error("Could not clean up an unreferenced resume upload.");
    }
    buildRedirect("The resume file was uploaded, but its metadata could not be saved");
  }

  await finishMutation();

  if (oldPath && oldPath !== storagePath) {
    const { error: cleanupError } = await supabase.storage
      .from(RESUME_BUCKET)
      .remove([oldPath]);
    if (cleanupError) {
      redirect(
        "/admin?success=" +
          encodeURIComponent("Resume replaced. The previous private file could not be cleaned up.")
      );
    }
  }

  redirect("/admin?success=" + encodeURIComponent("Resume uploaded"));
}

export async function saveResumeVisibilityAction(formData: FormData) {
  const supabase = await getAdminClient();
  const id = readString(formData.get("id"));
  const publicDownload = readBoolean(formData.get("publicDownload"));
  if (!id) buildRedirect("Resume metadata was not found");

  const { data: existing, error: lookupError } = await supabase
    .from("portfolio_content")
    .select("content")
    .eq("id", id)
    .eq("section_key", "resume")
    .maybeSingle();

  if (lookupError || !existing) buildRedirect("Could not load the resume metadata");
  const content =
    existing.content && typeof existing.content === "object"
      ? (existing.content as Record<string, unknown>)
      : {};
  if (!resumePath(content.storagePath)) {
    buildRedirect("Upload a resume before enabling its public download link");
  }

  const { data, error } = await supabase
    .from("portfolio_content")
    .update({
      content: { ...content, publicDownload },
      is_published: publicDownload,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("section_key", "resume")
    .select("id")
    .maybeSingle();

  if (error || !data) buildRedirect("Could not save resume visibility");
  await finishMutation();
  redirect(
    "/admin?success=" +
      encodeURIComponent(publicDownload ? "Resume download is now public" : "Resume download is hidden")
  );
}

export async function removeResumeAction() {
  const supabase = await getAdminClient();
  const existing = await getResumeEntry(supabase);
  if (!existing) buildRedirect("No resume is currently stored");

  const content =
    existing.content && typeof existing.content === "object"
      ? (existing.content as Record<string, unknown>)
      : {};
  const oldPath = resumePath(content.storagePath);
  if (!oldPath) buildRedirect("The stored resume path is invalid; no file was deleted");

  const { data, error } = await supabase
    .from("portfolio_content")
    .update({
      content: { storagePath: null, filename: null, publicDownload: false },
      is_published: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", existing.id)
    .eq("section_key", "resume")
    .select("id")
    .maybeSingle();

  if (error || !data) buildRedirect("Could not remove the resume from the public site");
  await finishMutation();

  const { error: deleteError } = await supabase.storage
    .from(RESUME_BUCKET)
    .remove([oldPath]);
  if (deleteError) {
    redirect(
      "/admin?error=" +
        encodeURIComponent("The resume link was removed, but the private file could not be deleted from storage")
    );
  }

  redirect("/admin?success=" + encodeURIComponent("Resume removed"));
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export async function createProjectAction(formData: FormData) {
  const supabase = await getAdminClient();

  const title = readString(formData.get("title"));
  const description = readString(formData.get("description"));
  const technologies = readString(formData.get("technologies"));
  const repoUrl = readHttpUrl(formData.get("repoUrl"), "Repository URL");
  const liveUrl = readHttpUrl(formData.get("liveUrl"), "Live demo URL");
  const status = readString(formData.get("status"));
  const featured = readBoolean(formData.get("featured"));
  const sortOrder = readInt(formData.get("sort_order"));
  const isPublished = readBoolean(formData.get("is_published"));

  if (!title || !description) buildRedirect("Project title and description are required");

  const content = {
    title,
    description,
    technologies: technologies.split(",").map((item) => item.trim()).filter((item) => item.length > 0),
    imageUrl: readHttpUrl(formData.get("imageUrl"), "Image URL"),
    liveUrl,
    repoUrl,
    featured,
    status: status || "In progress",
  };

  const { error } = await supabase.from("portfolio_content").insert({
    section_key: "projects",
    title,
    content,
    sort_order: sortOrder,
    is_published: isPublished,
  });

  if (error) buildRedirect("Could not create the project");

  await finishMutation();
  redirect("/admin?success=" + encodeURIComponent("Project created"));
}

export async function updateProjectAction(formData: FormData) {
  const supabase = await getAdminClient();

  const id = readString(formData.get("id"));
  const title = readString(formData.get("title"));
  const description = readString(formData.get("description"));
  const technologies = readString(formData.get("technologies"));
  const repoUrl = readHttpUrl(formData.get("repoUrl"), "Repository URL");
  const liveUrl = readHttpUrl(formData.get("liveUrl"), "Live demo URL");
  const status = readString(formData.get("status"));
  const featured = readBoolean(formData.get("featured"));
  const sortOrder = readInt(formData.get("sort_order"));
  const isPublished = readBoolean(formData.get("is_published"));

  if (!id || !title || !description) buildRedirect("Project title and description are required");

  const content = {
    title,
    description,
    technologies: technologies.split(",").map((item) => item.trim()).filter((item) => item.length > 0),
    imageUrl: readHttpUrl(formData.get("imageUrl"), "Image URL"),
    liveUrl,
    repoUrl,
    featured,
    status: status || "In progress",
  };

  const { data, error } = await supabase
    .from("portfolio_content")
    .update({
      title,
      content,
      sort_order: sortOrder,
      is_published: isPublished,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("section_key", "projects")
    .select("id")
    .maybeSingle();

  if (error || !data) buildRedirect("Could not update the project");

  await finishMutation();
  redirect("/admin?success=" + encodeURIComponent("Project updated"));
}

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------

export async function createExperienceAction(formData: FormData) {
  const supabase = await getAdminClient();

  const role = readString(formData.get("role"));
  const organization = readString(formData.get("organization"));
  const description = readString(formData.get("description"));
  const startDate = readString(formData.get("startDate"));
  const endDate = readString(formData.get("endDate"));
  const isCurrent = readBoolean(formData.get("isCurrent"));
  const link = readHttpUrl(formData.get("link"), "Experience link");
  const sortOrder = readInt(formData.get("sort_order"));
  const isPublished = readBoolean(formData.get("is_published"));

  if (!role || !organization) buildRedirect("Experience role and organization are required");

  const content = {
    role,
    organization,
    description,
    startDate,
    endDate,
    isCurrent,
    link,
  };

  const { error } = await supabase.from("portfolio_content").insert({
    section_key: "experience",
    title: role,
    content,
    sort_order: sortOrder,
    is_published: isPublished,
  });

  if (error) buildRedirect("Could not create the experience");

  await finishMutation();
  redirect("/admin?success=" + encodeURIComponent("Experience created"));
}

export async function updateExperienceAction(formData: FormData) {
  const supabase = await getAdminClient();

  const id = readString(formData.get("id"));
  const role = readString(formData.get("role"));
  const organization = readString(formData.get("organization"));
  const description = readString(formData.get("description"));
  const startDate = readString(formData.get("startDate"));
  const endDate = readString(formData.get("endDate"));
  const isCurrent = readBoolean(formData.get("isCurrent"));
  const link = readHttpUrl(formData.get("link"), "Experience link");
  const sortOrder = readInt(formData.get("sort_order"));
  const isPublished = readBoolean(formData.get("is_published"));

  if (!id || !role || !organization) buildRedirect("Experience role and organization are required");

  const content = {
    role,
    organization,
    description,
    startDate,
    endDate,
    isCurrent,
    link,
  };

  const { data, error } = await supabase
    .from("portfolio_content")
    .update({
      title: role,
      content,
      sort_order: sortOrder,
      is_published: isPublished,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("section_key", "experience")
    .select("id")
    .maybeSingle();

  if (error || !data) buildRedirect("Could not update the experience");

  await finishMutation();
  redirect("/admin?success=" + encodeURIComponent("Experience updated"));
}

// ---------------------------------------------------------------------------
// Education
// ---------------------------------------------------------------------------

export async function createEducationAction(formData: FormData) {
  const supabase = await getAdminClient();

  const institution = readString(formData.get("institution"));
  const degree = readString(formData.get("degree"));
  const fieldOfStudy = readString(formData.get("fieldOfStudy"));
  const startDate = readString(formData.get("startDate"));
  const endDate = readString(formData.get("endDate"));
  const description = readString(formData.get("description"));
  const sortOrder = readInt(formData.get("sort_order"));
  const isPublished = readBoolean(formData.get("is_published"));

  if (!institution || !degree) buildRedirect("Education institution and degree are required");

  const content = { institution, degree, fieldOfStudy, startDate, endDate, description };

  const { error } = await supabase.from("portfolio_content").insert({
    section_key: "education",
    title: degree,
    content,
    sort_order: sortOrder,
    is_published: isPublished,
  });

  if (error) buildRedirect("Could not create the education entry");

  await finishMutation();
  redirect("/admin?success=" + encodeURIComponent("Education created"));
}

export async function updateEducationAction(formData: FormData) {
  const supabase = await getAdminClient();

  const id = readString(formData.get("id"));
  const institution = readString(formData.get("institution"));
  const degree = readString(formData.get("degree"));
  const fieldOfStudy = readString(formData.get("fieldOfStudy"));
  const startDate = readString(formData.get("startDate"));
  const endDate = readString(formData.get("endDate"));
  const description = readString(formData.get("description"));
  const sortOrder = readInt(formData.get("sort_order"));
  const isPublished = readBoolean(formData.get("is_published"));

  if (!id || !institution || !degree) buildRedirect("Education institution and degree are required");

  const content = { institution, degree, fieldOfStudy, startDate, endDate, description };

  const { data, error } = await supabase
    .from("portfolio_content")
    .update({
      title: degree,
      content,
      sort_order: sortOrder,
      is_published: isPublished,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("section_key", "education")
    .select("id")
    .maybeSingle();

  if (error || !data) buildRedirect("Could not update the education entry");

  await finishMutation();
  redirect("/admin?success=" + encodeURIComponent("Education updated"));
}

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------

export async function createSkillAction(formData: FormData) {
  const supabase = await getAdminClient();

  const name = readString(formData.get("name"));
  const category = readString(formData.get("category"));
  const sortOrder = readInt(formData.get("sort_order"));
  const isPublished = readBoolean(formData.get("is_published"));

  if (!name) buildRedirect("Skill name is required");

  const content = { name, category };

  const { error } = await supabase.from("portfolio_content").insert({
    section_key: "skills",
    title: name,
    content,
    sort_order: sortOrder,
    is_published: isPublished,
  });

  if (error) buildRedirect("Could not create the skill");

  await finishMutation();
  redirect("/admin?success=" + encodeURIComponent("Skill created"));
}

export async function updateSkillAction(formData: FormData) {
  const supabase = await getAdminClient();

  const id = readString(formData.get("id"));
  const name = readString(formData.get("name"));
  const category = readString(formData.get("category"));
  const sortOrder = readInt(formData.get("sort_order"));
  const isPublished = readBoolean(formData.get("is_published"));

  if (!id || !name) buildRedirect("Skill name is required");

  const content = { name, category };

  const { data, error } = await supabase
    .from("portfolio_content")
    .update({
      title: name,
      content,
      sort_order: sortOrder,
      is_published: isPublished,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("section_key", "skills")
    .select("id")
    .maybeSingle();

  if (error || !data) buildRedirect("Could not update the skill");

  await finishMutation();
  redirect("/admin?success=" + encodeURIComponent("Skill updated"));
}

// ---------------------------------------------------------------------------
// Certifications
// ---------------------------------------------------------------------------

export async function createCertificationAction(formData: FormData) {
  const supabase = await getAdminClient();

  const title = readString(formData.get("title"));
  const issuer = readString(formData.get("issuer"));
  const date = readString(formData.get("date"));
  const description = readString(formData.get("description"));
  const credentialUrl = readHttpUrl(formData.get("credentialUrl"), "Credential URL");
  const sortOrder = readInt(formData.get("sort_order"));
  const isPublished = readBoolean(formData.get("is_published"));

  if (!title) buildRedirect("Certification title is required");

  const content = { title, issuer, date, description, credentialUrl };

  const { error } = await supabase.from("portfolio_content").insert({
    section_key: "certifications",
    title,
    content,
    sort_order: sortOrder,
    is_published: isPublished,
  });

  if (error) buildRedirect("Could not create the certification");

  await finishMutation();
  redirect("/admin?success=" + encodeURIComponent("Certification created"));
}

export async function updateCertificationAction(formData: FormData) {
  const supabase = await getAdminClient();

  const id = readString(formData.get("id"));
  const title = readString(formData.get("title"));
  const issuer = readString(formData.get("issuer"));
  const date = readString(formData.get("date"));
  const description = readString(formData.get("description"));
  const credentialUrl = readHttpUrl(formData.get("credentialUrl"), "Credential URL");
  const sortOrder = readInt(formData.get("sort_order"));
  const isPublished = readBoolean(formData.get("is_published"));

  if (!id || !title) buildRedirect("Certification title is required");

  const content = { title, issuer, date, description, credentialUrl };

  const { data, error } = await supabase
    .from("portfolio_content")
    .update({
      title,
      content,
      sort_order: sortOrder,
      is_published: isPublished,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("section_key", "certifications")
    .select("id")
    .maybeSingle();

  if (error || !data) buildRedirect("Could not update the certification");

  await finishMutation();
  redirect("/admin?success=" + encodeURIComponent("Certification updated"));
}

// ---------------------------------------------------------------------------
// Awards
// ---------------------------------------------------------------------------

export async function createAwardAction(formData: FormData) {
  const supabase = await getAdminClient();

  const title = readString(formData.get("title"));
  const subtitle = readString(formData.get("subtitle"));
  const date = readString(formData.get("date"));
  const description = readString(formData.get("description"));
  const sortOrder = readInt(formData.get("sort_order"));
  const isPublished = readBoolean(formData.get("is_published"));

  if (!title) buildRedirect("Award title is required");

  const content = { title, subtitle, date, description };

  const { error } = await supabase.from("portfolio_content").insert({
    section_key: "awards",
    title,
    content,
    sort_order: sortOrder,
    is_published: isPublished,
  });

  if (error) buildRedirect("Could not create the award");

  await finishMutation();
  redirect("/admin?success=" + encodeURIComponent("Award created"));
}

export async function updateAwardAction(formData: FormData) {
  const supabase = await getAdminClient();

  const id = readString(formData.get("id"));
  const title = readString(formData.get("title"));
  const subtitle = readString(formData.get("subtitle"));
  const date = readString(formData.get("date"));
  const description = readString(formData.get("description"));
  const sortOrder = readInt(formData.get("sort_order"));
  const isPublished = readBoolean(formData.get("is_published"));

  if (!id || !title) buildRedirect("Award title is required");

  const content = { title, subtitle, date, description };

  const { data, error } = await supabase
    .from("portfolio_content")
    .update({
      title,
      content,
      sort_order: sortOrder,
      is_published: isPublished,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("section_key", "awards")
    .select("id")
    .maybeSingle();

  if (error || !data) buildRedirect("Could not update the award");

  await finishMutation();
  redirect("/admin?success=" + encodeURIComponent("Award updated"));
}

// ---------------------------------------------------------------------------
// Generic delete + reorder
// ---------------------------------------------------------------------------

export async function deleteEntryAction(formData: FormData) {
  const supabase = await getAdminClient();
  const id = readString(formData.get("id"));

  if (!id) buildRedirect("Missing entry id");

  const { data, error } = await supabase
    .from("portfolio_content")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error || !data) buildRedirect("Could not delete the entry");

  await finishMutation();
  redirect("/admin?success=" + encodeURIComponent("Entry deleted"));
}

export async function moveEntryAction(formData: FormData) {
  const supabase = await getAdminClient();
  const id = readString(formData.get("id"));
  const direction = readString(formData.get("direction"));

  if (!id || (direction !== "up" && direction !== "down")) {
    buildRedirect("Invalid move request");
  }

  const { data: entry, error: entryError } = await supabase
    .from("portfolio_content")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (entryError || !entry) buildRedirect("Entry not found");

  const { data: siblings, error: siblingsError } = await supabase
    .from("portfolio_content")
    .select("id, sort_order")
    .eq("section_key", entry.section_key)
    .order("sort_order", { ascending: true });
  if (siblingsError || !siblings) buildRedirect("Could not load entries to reorder");

  const sorted = siblings.slice().sort(
    (a, b) => a.sort_order - b.sort_order
  );

  const targetIndex = sorted.findIndex((item) => item.id === id);
  const swapIndex = direction === "up" ? targetIndex - 1 : targetIndex + 1;
  if (targetIndex < 0 || swapIndex < 0 || swapIndex >= sorted.length) {
    buildRedirect("Nothing to reorder");
  }

  const swapEntry = sorted[swapIndex];
  const currentOrder = entry.sort_order;
  const swapOrder = swapEntry.sort_order;

  const { error: firstError } = await supabase
    .from("portfolio_content")
    .update({ sort_order: swapOrder })
    .eq("id", id)
    .eq("section_key", entry.section_key);
  if (firstError) buildRedirect("Could not reorder the entry");

  const { error: secondError } = await supabase
    .from("portfolio_content")
    .update({ sort_order: currentOrder })
    .eq("id", swapEntry.id)
    .eq("section_key", entry.section_key);
  if (secondError) buildRedirect("The first reorder step succeeded, but the second failed. Review the sort order.");

  await finishMutation();
  redirect("/admin?success=" + encodeURIComponent("Entry reordered"));
}
