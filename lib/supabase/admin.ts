import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "./server";

export async function getAdminSessionClient() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/admin?error=Please%20sign%20in");
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const userEmail = data.user.email?.trim().toLowerCase();

  if (!adminEmail || !userEmail || userEmail !== adminEmail) {
    await supabase.auth.signOut();
    redirect("/admin?error=This%20account%20is%20not%20authorized");
  }

  return supabase;
}

export async function getAdminClient() {
  return getAdminSessionClient();
}
