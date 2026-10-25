import { connection, NextResponse } from "next/server";
import { createPublicClient } from "../../../../../lib/supabase/server";

const RESUME_BUCKET = "portfolio-assets";

export async function GET() {
  await connection();

  const supabase = createPublicClient();
  const { data: entry, error } = await supabase
    .from("portfolio_content")
    .select("content")
    .eq("section_key", "resume")
    .eq("title", "Resume")
    .eq("is_published", true)
    .maybeSingle();

  if (error || !entry || !entry.content || typeof entry.content !== "object") {
    return new Response("Resume not found", { status: 404 });
  }

  const content = entry.content as Record<string, unknown>;
  const storagePath = content.storagePath;
  const filename = content.filename;
  if (
    content.publicDownload !== true ||
    typeof storagePath !== "string" ||
    !/^resumes\/[a-f0-9-]+\.pdf$/i.test(storagePath) ||
    typeof filename !== "string" ||
    !filename.toLowerCase().endsWith(".pdf")
  ) {
    return new Response("Resume not found", { status: 404 });
  }

  const { data, error: signError } = await supabase.storage
    .from(RESUME_BUCKET)
    .createSignedUrl(storagePath, 60, { download: filename });

  if (signError || !data?.signedUrl) {
    return new Response("Resume temporarily unavailable", { status: 503 });
  }

  return NextResponse.redirect(data.signedUrl, { status: 302 });
}
