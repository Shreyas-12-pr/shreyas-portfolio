import { connection, NextResponse } from "next/server";
import { getAdminSessionClient } from "../../../../../lib/supabase/admin";

const RESUME_BUCKET = "portfolio-assets";

export async function GET() {
  await connection();
  const supabase = await getAdminSessionClient();
  const { data: entry, error } = await supabase
    .from("portfolio_content")
    .select("content")
    .eq("section_key", "resume")
    .eq("title", "Resume")
    .maybeSingle();

  if (error || !entry || !entry.content || typeof entry.content !== "object") {
    return new Response("Resume not found", { status: 404 });
  }

  const storagePath = (entry.content as Record<string, unknown>).storagePath;
  if (typeof storagePath !== "string" || !/^resumes\/[a-f0-9-]+\.pdf$/i.test(storagePath)) {
    return new Response("Resume not found", { status: 404 });
  }

  const { data, error: signError } = await supabase.storage
    .from(RESUME_BUCKET)
    .createSignedUrl(storagePath, 300);

  if (signError || !data?.signedUrl) {
    return new Response("Resume preview temporarily unavailable", { status: 503 });
  }

  return NextResponse.redirect(data.signedUrl, { status: 302 });
}
