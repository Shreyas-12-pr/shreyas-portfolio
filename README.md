# Shreyas P R — Portfolio

The personal portfolio of **Shreyas P R**, a student, community builder, and technology enthusiast. It presents profile information, projects, skills, experience, education, achievements, and contact links in a responsive, hacker/cyberpunk-inspired interface with dark backgrounds, neon-green accents, and terminal-inspired visual details.

## Features

- Responsive homepage with About, projects, skills, experience, education, certifications, awards, and contact sections.
- Dark visual theme with responsive layouts, animation, keyboard focus styles, and reduced-motion support.
- Supabase-backed portfolio content loaded from published records.
- Section-based admin dashboard for editing single-section content and managing repeatable entries, including publication status and ordering.
- Supabase Auth sign-in; admin access is restricted to the configured administrator email. Server mutations also verify authorization.
- Optional resume management: PDF upload, replacement, removal, preview, and a control for showing or hiding the public download link. The application code supports a private Storage bucket and signed downloads; these workflows require Supabase setup and have not been verified against a production account.
- Search metadata, Open Graph metadata, a generated Open Graph image, `robots.txt`, and a sitemap.

## Technology stack

- Next.js 16.4.3 with the App Router and Cache Components
- React 19.3.0
- TypeScript 5
- Tailwind CSS 4
- Supabase JavaScript client 2.118+ and `@supabase/ssr` 0.12+
- ESLint 9

## Screenshots

Screenshots are not currently included in the repository. To add them, save genuine screenshots under `docs/screenshots/` and link to the files here.

## Project structure

```text
src/
  app/
    admin/
      AdminSections.tsx       # Section editors and repeatable-entry controls
      actions.ts              # Authenticated content and resume server actions
      adminSectionsConfig.ts  # Admin section definitions
      page.tsx                # Admin sign-in and dashboard
    api/
      admin/resume-preview/   # Authenticated resume preview route
      resume/download/        # Published resume download route
    globals.css               # Global styles and responsive visual theme
    layout.tsx                # Root layout and SEO metadata
    page.tsx                  # Public portfolio homepage
    opengraph-image.tsx       # Generated Open Graph image
    robots.ts                 # Generated robots.txt
    sitemap.ts                # Generated sitemap
lib/
  portfolio/
    content.ts                # Published content parsing and fallback content
    server.ts                 # Cached published content retrieval
    types.ts                  # Portfolio content types
  supabase/
    admin.ts                  # Server-side admin authorization
    client.ts                 # Browser Supabase client
    server.ts                 # Server-side Supabase clients
supabase/
  migrations/
    202610250001_portfolio_content_rls.sql
    202610260001_portfolio_resume_storage.sql
public/                        # Static assets
next.config.ts                 # Next.js and Server Actions configuration
package.json                   # Dependencies and scripts
```

## Getting started

### Prerequisites

- Node.js compatible with Next.js 16
- npm
- A Supabase project with the required table and Auth configuration (see [Supabase setup](#supabase-setup))

### Install and run on Windows

```powershell
git clone <repository-url>
cd shreyas-portfolio
npm install
Copy-Item .env.example .env.local
```

Edit `.env.local` with the values for your Supabase project and site. Start the development server:

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The admin dashboard is at [http://localhost:3000/admin](http://localhost:3000/admin).

## Environment variables

Set these variables in `.env.local` for local development and in your hosting provider for deployment:

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes | Supabase publishable key; safe for browser use when RLS is correctly configured. |
| `ADMIN_EMAIL` | Yes for admin access | Email address authorized to use the admin dashboard and perform administrator actions. |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical public site URL used for metadata, robots, and sitemap generation. |

Use placeholder values only in `.env.example`. Do not commit `.env.local`, credentials, or secret keys. This project does not require a service-role key for its documented flows.

## Supabase setup

The application expects an existing `public.portfolio_content` table with the fields used by the CMS: `id`, `section_key`, `title`, JSONB `content`, `is_published`, `sort_order`, `created_at`, and `updated_at`. The included migrations configure access to this existing table; they do not create it.

1. Configure Supabase Auth for email/password sign-in and create the administrator account. Its email must match `ADMIN_EMAIL`.
2. In both migration files, replace every `REPLACE_WITH_ADMIN_EMAIL` with that exact administrator email.
3. Run `supabase/migrations/202610250001_portfolio_content_rls.sql` in the Supabase SQL Editor. It enables RLS and defines published-content reads and administrator-only mutations.
4. Run `supabase/migrations/202610260001_portfolio_resume_storage.sql` to configure the private `portfolio-assets` bucket, PDF upload limits, and storage policies. The public read policy is restricted to the currently published resume when its public-download setting is enabled.
5. Configure the Supabase Auth site URL and allowed redirect URLs for local development and the production domain.

The migrations must be reviewed and applied in the target Supabase project. This repository does not establish whether they have already been run in that project.

## Admin usage

Visit `/admin` and sign in with the authorized Supabase Auth account. Use the section cards to edit Hero, About, Contact, or manage repeatable entries such as projects, skills, experience, education, certifications, and awards. Entries support publication controls and ordering.

The Resume editor accepts PDF files up to 5 MB and provides upload, replace, preview, remove, and public-download visibility controls. Resume actions require administrator authorization. Resume file operations and public download availability depend on the Storage bucket and policies described above.

## Scripts and testing

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server. |
| `npm run lint` | Run ESLint. |
| `npx tsc --noEmit` | Run the TypeScript compiler without emitting files. |
| `npm run build` | Create a production build. |
| `npm run start` | Start the production server after building. |

There is no test script defined in `package.json`.

## Deployment

The project can be deployed to a Next.js-compatible host such as Vercel. No production URL or deployment configuration is included in this repository. Configure the environment variables above in the hosting dashboard, then deploy the repository.

Before enabling admin or resume functionality in production, apply and verify the Supabase migrations, set the Supabase Auth site URL and redirect allowlist to the actual production domain, and keep all credentials out of Git. Do not publish a production URL until a deployment has been completed and checked.

## Security

- Keep `.env.local` and all credentials out of version control.
- Never expose a Supabase service-role key in client-side code.
- Keep Supabase Row Level Security enabled and apply the administrator and published-content policies.
- Admin server actions enforce the configured administrator identity; do not weaken authorization or RLS to bypass setup errors.
- Keep the resume bucket private. Public downloads are mediated by the application and should only be available for the published resume when explicitly enabled.

## Author and links

**Shreyas P R**

Bengaluru, Karnataka, India

- [LinkedIn](https://www.linkedin.com/in/shreyas-p-r)
- [GitHub](https://github.com/Shreyas-12-pr)
