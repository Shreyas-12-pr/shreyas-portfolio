begin;

alter table public.portfolio_content enable row level security;

-- Replace REPLACE_WITH_ADMIN_EMAIL with the exact ADMIN_EMAIL configured by
-- the application before running this migration.
do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'portfolio_content'
  loop
    execute format(
      'drop policy if exists %I on public.portfolio_content',
      existing_policy.policyname
    );
  end loop;
end
$$;

revoke insert, update, delete on public.portfolio_content from anon, authenticated;
grant select on public.portfolio_content to anon, authenticated;
grant insert, update, delete on public.portfolio_content to authenticated;

create policy portfolio_content_published_read
  on public.portfolio_content
  for select
  to anon, authenticated
  using (
    is_published is true
    or lower(coalesce(auth.jwt() ->> 'email', '')) = lower('REPLACE_WITH_ADMIN_EMAIL')
  );

create policy portfolio_content_admin_insert
  on public.portfolio_content
  for insert
  to authenticated
  with check (
    lower(coalesce(auth.jwt() ->> 'email', '')) = lower('REPLACE_WITH_ADMIN_EMAIL')
  );

create policy portfolio_content_admin_update
  on public.portfolio_content
  for update
  to authenticated
  using (
    lower(coalesce(auth.jwt() ->> 'email', '')) = lower('REPLACE_WITH_ADMIN_EMAIL')
  )
  with check (
    lower(coalesce(auth.jwt() ->> 'email', '')) = lower('REPLACE_WITH_ADMIN_EMAIL')
  );

create policy portfolio_content_admin_delete
  on public.portfolio_content
  for delete
  to authenticated
  using (
    lower(coalesce(auth.jwt() ->> 'email', '')) = lower('REPLACE_WITH_ADMIN_EMAIL')
  );

commit;
