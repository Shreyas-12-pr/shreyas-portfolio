import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/server";
import { AdminSections } from "./AdminSections";
import { loginAction, logoutAction } from "./actions";

type SearchParams = Promise<{
  error?: string;
  success?: string;
}>;

export default function AdminPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense
      fallback={
        <main className="admin-theme min-h-screen bg-[#f5f4f0] px-5 py-16 text-slate-900">
          <p className="mx-auto max-w-md text-sm text-slate-600">
            Loading admin…
          </p>
        </main>
      }
    >
      <AdminContent searchParams={searchParams} />
    </Suspense>
  );
}

async function AdminContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await connection();
  const params = await searchParams;
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const userEmail = user?.email?.trim().toLowerCase();

  if (!user) {
    return (
      <main className="admin-theme min-h-screen bg-[#f5f4f0] px-5 py-16 text-slate-900">
        <section className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Shreyas P R · Portfolio
          </p>
          <h1 className="mt-4 text-3xl font-semibold">Admin sign in</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Sign in with your authorized administrator account to manage
            portfolio entries.
          </p>

          {params.error && (
            <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {params.error}
            </p>
          )}

          <form action={loginAction} className="mt-6 space-y-4">
            <label className="block text-sm font-medium">
              Email
              <input
                name="email"
                type="email"
                autoComplete="username"
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-slate-700"
              />
            </label>

            <label className="block text-sm font-medium">
              Password
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-slate-700"
              />
            </label>

            <button
              type="submit"
              className="w-full rounded-lg bg-slate-900 px-4 py-3 font-medium text-white hover:bg-slate-700"
            >
              Sign in
            </button>
          </form>

          <Link href="/" className="mt-6 inline-block text-sm text-slate-600 underline">
            Return to portfolio
          </Link>
        </section>
      </main>
    );
  }

  if (!adminEmail || userEmail !== adminEmail) {
    await supabase.auth.signOut();
    redirect("/admin?error=" + encodeURIComponent("This account is not authorized"));
  }

  const { data: entries, error } = await supabase
    .from("portfolio_content")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  return (
    <main className="admin-theme min-h-screen bg-[#f5f4f0] px-4 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Portfolio management
            </p>
            <h1 className="mt-2 text-3xl font-semibold">Admin dashboard</h1>
            <p className="mt-2 text-sm text-slate-600">{user.email}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/" className="rounded-lg border border-slate-300 px-4 py-2 text-sm">
              View site
            </Link>
            <form action={logoutAction}>
              <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white">
                Log out
              </button>
            </form>
          </div>
        </header>

        {params.error && (
          <p role="alert" className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {params.error}
          </p>
        )}
        {params.success && (
          <p role="status" className="mt-6 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
            {params.success}
          </p>
        )}
        {error && (
          <p role="alert" className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            Could not load entries. Check your Supabase table and row-level security policies.
          </p>
        )}

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
          <h2 className="text-xl font-semibold">Content sections</h2>
          <p className="mt-1 text-sm text-slate-600">
            Select a section to edit its content. Entries can be added, edited,
            reordered, published, or deleted per item.
          </p>

          <div className="mt-5">
            <AdminSections entries={(entries ?? []).map((entry) => ({
              ...entry,
              content: (entry.content ?? {}) as Record<string, unknown>,
            }))} />
          </div>
        </section>
      </div>
    </main>
  );
}
