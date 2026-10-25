begin;

-- Replace REPLACE_WITH_ADMIN_EMAIL with the exact ADMIN_EMAIL configured by
-- the application before running this migration.
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'portfolio-assets',
  'portfolio-assets',
  false,
  5242880,
  array['application/pdf']
)
on conflict (id) do update
set
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = array['application/pdf'];

drop policy if exists portfolio_assets_admin_select on storage.objects;
drop policy if exists portfolio_assets_public_resume_select on storage.objects;
drop policy if exists portfolio_assets_admin_insert on storage.objects;
drop policy if exists portfolio_assets_admin_update on storage.objects;
drop policy if exists portfolio_assets_admin_delete on storage.objects;

create policy portfolio_assets_admin_select
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'portfolio-assets'
    and lower(coalesce(auth.jwt() ->> 'email', '')) = lower('REPLACE_WITH_ADMIN_EMAIL')
  );

create policy portfolio_assets_public_resume_select
  on storage.objects
  for select
  to anon
  using (
    bucket_id = 'portfolio-assets'
    and exists (
      select 1
      from public.portfolio_content
      where section_key = 'resume'
        and title = 'Resume'
        and is_published is true
        and content ->> 'publicDownload' = 'true'
        and content ->> 'storagePath' = storage.objects.name
    )
  );

create policy portfolio_assets_admin_insert
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'portfolio-assets'
    and lower(coalesce(auth.jwt() ->> 'email', '')) = lower('REPLACE_WITH_ADMIN_EMAIL')
  );

create policy portfolio_assets_admin_update
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'portfolio-assets'
    and lower(coalesce(auth.jwt() ->> 'email', '')) = lower('REPLACE_WITH_ADMIN_EMAIL')
  )
  with check (
    bucket_id = 'portfolio-assets'
    and lower(coalesce(auth.jwt() ->> 'email', '')) = lower('REPLACE_WITH_ADMIN_EMAIL')
  );

create policy portfolio_assets_admin_delete
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'portfolio-assets'
    and lower(coalesce(auth.jwt() ->> 'email', '')) = lower('REPLACE_WITH_ADMIN_EMAIL')
  );

commit;
