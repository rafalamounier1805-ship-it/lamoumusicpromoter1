-- COMPOSER OS — P0 real foundation schema
-- Canonical intent: first RUN must use real Auth/Postgres/Storage/RLS/Audit.
-- This file is source-controlled schema intent. Apply to the dedicated Composer OS Supabase project,
-- verify with readback/advisors, then capture the resulting migration history.

begin;

create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','editor','viewer')),
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create or replace function private.has_workspace_role(target_workspace uuid, allowed_roles text[] default null)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = target_workspace
      and wm.user_id = auth.uid()
      and (allowed_roles is null or wm.role = any(allowed_roles))
  );
$$;
revoke all on function private.has_workspace_role(uuid,text[]) from public, anon;
grant execute on function private.has_workspace_role(uuid,text[]) to authenticated;

create table if not exists public.releases (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  title text not null,
  release_type text,
  upc text,
  release_date date,
  external_source text,
  external_id text,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tracks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  release_id uuid references public.releases(id) on delete set null,
  title text not null,
  version_label text,
  stage text,
  isrc text,
  iswc text,
  language text,
  genre text,
  published boolean not null default false,
  objective text,
  source_kind text not null default 'DECLARED' check (source_kind in ('DECLARED','IMPORTED','EXTRACTED','VERIFIED','SYNTHETIC_DEMO')),
  source_ref text,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contributors (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  track_id uuid not null references public.tracks(id) on delete cascade,
  name text not null,
  role text not null,
  work_share numeric(7,4) check (work_share between 0 and 100),
  master_share numeric(7,4) check (master_share between 0 and 100),
  territory text,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  track_id uuid references public.tracks(id) on delete set null,
  title text not null,
  status text not null default 'pending',
  priority text,
  due_date date,
  owner_user_id uuid references auth.users(id) on delete set null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.task_dependencies (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  task_id uuid not null references public.tasks(id) on delete cascade,
  depends_on_task_id uuid not null references public.tasks(id) on delete cascade,
  primary key (task_id, depends_on_task_id),
  check (task_id <> depends_on_task_id)
);

create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  organization_name text,
  stage text not null default 'alvo',
  source_url text,
  source_verified_at timestamptz,
  next_action text,
  due_at timestamptz,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  track_id uuid references public.tracks(id) on delete set null,
  opportunity_id uuid references public.opportunities(id) on delete set null,
  doc_type text not null,
  title text not null,
  status text not null default 'active',
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.document_versions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  document_id uuid not null references public.documents(id) on delete cascade,
  version_no integer not null check (version_no > 0),
  storage_bucket text not null default 'composer-private',
  storage_path text not null,
  sha256 text not null check (sha256 ~ '^[0-9a-fA-F]{64}$'),
  mime_type text,
  size_bytes bigint check (size_bytes is null or size_bytes >= 0),
  uploaded_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  unique (document_id, version_no),
  unique (storage_bucket, storage_path)
);

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  release_id uuid references public.releases(id) on delete set null,
  name text not null,
  status text not null default 'draft',
  budget numeric(14,2),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.campaign_actions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  channel text,
  action_type text not null,
  due_at timestamptz,
  status text not null default 'pending',
  asset_document_id uuid references public.documents(id) on delete set null,
  owner_user_id uuid references auth.users(id) on delete set null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.statements (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  provider text not null,
  period_start date,
  period_end date,
  document_version_id uuid references public.document_versions(id) on delete set null,
  imported_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.revenue_entries (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  statement_id uuid references public.statements(id) on delete cascade,
  track_id uuid references public.tracks(id) on delete set null,
  amount numeric(18,6) not null,
  currency char(3) not null,
  territory text,
  dsp text,
  period_start date,
  period_end date,
  matching_status text not null default 'unmatched' check (matching_status in ('matched','unmatched','conflict','manual')),
  source_ref text,
  created_at timestamptz not null default now()
);

create table if not exists public.rights_claims (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  track_id uuid not null references public.tracks(id) on delete cascade,
  right_type text not null,
  claimant_name text not null,
  share numeric(7,4) check (share between 0 and 100),
  territory text,
  status text not null default 'declared',
  source_document_id uuid references public.documents(id) on delete set null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  track_id uuid not null references public.tracks(id) on delete cascade,
  registration_type text not null,
  authority text,
  protocol text,
  registered_at date,
  status text not null default 'pending',
  document_id uuid references public.documents(id) on delete set null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.external_connections (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  provider text not null,
  external_account_id text,
  status text not null default 'not_connected',
  last_synced_at timestamptz,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, provider, external_account_id)
);

create table if not exists public.external_imports (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  connection_id uuid references public.external_connections(id) on delete set null,
  provider text not null,
  entity_type text not null,
  external_id text not null,
  local_entity_type text,
  local_entity_id uuid,
  payload_hash text,
  source_updated_at timestamptz,
  imported_at timestamptz not null default now(),
  unique (workspace_id, provider, entity_type, external_id)
);

create table if not exists public.audit_events (
  id bigint generated always as identity primary key,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  entity_type text not null,
  entity_id text,
  action text not null check (action in ('INSERT','UPDATE','DELETE')),
  before_data jsonb,
  after_data jsonb,
  correlation_id uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now()
);

create table if not exists public.migration_receipts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id),
  source_key text not null,
  source_hash text not null,
  schema_version integer not null,
  imported_counts jsonb not null default '{}'::jsonb,
  status text not null check (status in ('started','verified','failed')),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  unique (workspace_id, source_key, source_hash)
);

create table if not exists public.backup_runs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  initiated_by uuid not null references auth.users(id),
  backup_type text not null check (backup_type in ('export','snapshot','restore_test')),
  status text not null check (status in ('started','verified','failed')),
  storage_path text,
  checksum text,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  restore_verified_at timestamptz
);

create table if not exists public.app_versions (
  id uuid primary key default gen_random_uuid(),
  version text not null,
  branch text not null,
  commit_sha text not null,
  build_id text,
  status text not null check (status in ('CANDIDATE_NOT_RUN','ACTIVE_VERIFIED','OBSOLETE_NON_EXECUTABLE','ARCHIVED_ROLLBACK','REJECTED')),
  evidence_ref text,
  deployed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (version, commit_sha)
);
create unique index if not exists app_versions_one_active_verified
  on public.app_versions ((status)) where status = 'ACTIVE_VERIFIED';

create table if not exists public.feature_status (
  id uuid primary key default gen_random_uuid(),
  version_id uuid not null references public.app_versions(id) on delete cascade,
  feature_key text not null,
  status text not null check (status in ('IMPLEMENTED_VERIFIED','BLOCKED_NOT_IMPLEMENTED','OUT_OF_SCOPE','NOT_VERIFIED')),
  evidence_ref text,
  updated_at timestamptz not null default now(),
  unique (version_id, feature_key)
);

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
revoke all on function private.set_updated_at() from public, anon, authenticated;

create or replace function private.audit_row_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  old_row jsonb;
  new_row jsonb;
  wid uuid;
  eid text;
begin
  old_row := case when tg_op in ('UPDATE','DELETE') then to_jsonb(old) else null end;
  new_row := case when tg_op in ('INSERT','UPDATE') then to_jsonb(new) else null end;
  wid := coalesce((new_row->>'workspace_id')::uuid, (old_row->>'workspace_id')::uuid);
  eid := coalesce(new_row->>'id', old_row->>'id');
  insert into public.audit_events(workspace_id, actor_user_id, entity_type, entity_id, action, before_data, after_data)
  values (wid, auth.uid(), tg_table_name, eid, tg_op, old_row, new_row);
  return coalesce(new, old);
end;
$$;
revoke all on function private.audit_row_change() from public, anon, authenticated;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles(id) values (new.id) on conflict (id) do nothing;
  return new;
end;
$$;
revoke all on function private.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created_composer_os on auth.users;
create trigger on_auth_user_created_composer_os
after insert on auth.users
for each row execute function private.handle_new_user();

-- updated_at triggers
DO $$
declare t text;
begin
  foreach t in array array['profiles','workspaces','releases','tracks','contributors','tasks','opportunities','documents','campaigns','campaign_actions','rights_claims','registrations','external_connections']
  loop
    execute format('drop trigger if exists trg_%I_updated_at on public.%I', t, t);
    execute format('create trigger trg_%I_updated_at before update on public.%I for each row execute function private.set_updated_at()', t, t);
  end loop;
end $$;

-- audit triggers on business-critical mutable tables
DO $$
declare t text;
begin
  foreach t in array array['releases','tracks','contributors','tasks','opportunities','documents','document_versions','campaigns','campaign_actions','statements','revenue_entries','rights_claims','registrations','external_connections','external_imports','migration_receipts','backup_runs']
  loop
    execute format('drop trigger if exists trg_%I_audit on public.%I', t, t);
    execute format('create trigger trg_%I_audit after insert or update or delete on public.%I for each row execute function private.audit_row_change()', t, t);
  end loop;
end $$;

-- RLS
DO $$
declare t text;
begin
  foreach t in array array['profiles','workspaces','workspace_members','releases','tracks','contributors','tasks','task_dependencies','opportunities','documents','document_versions','campaigns','campaign_actions','statements','revenue_entries','rights_claims','registrations','external_connections','external_imports','audit_events','migration_receipts','backup_runs','app_versions','feature_status']
  loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

-- Profiles
create policy profiles_select_self on public.profiles for select to authenticated using (id = auth.uid());
create policy profiles_insert_self on public.profiles for insert to authenticated with check (id = auth.uid());
create policy profiles_update_self on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- Workspaces and membership
create policy workspaces_select_member on public.workspaces for select to authenticated
using (created_by = auth.uid() or private.has_workspace_role(id, null));
create policy workspaces_insert_creator on public.workspaces for insert to authenticated
with check (created_by = auth.uid());
create policy workspaces_update_owner on public.workspaces for update to authenticated
using (created_by = auth.uid() or private.has_workspace_role(id, array['owner']))
with check (created_by = auth.uid() or private.has_workspace_role(id, array['owner']));
create policy workspaces_delete_owner on public.workspaces for delete to authenticated
using (created_by = auth.uid() or private.has_workspace_role(id, array['owner']));

create policy workspace_members_select on public.workspace_members for select to authenticated
using (user_id = auth.uid() or private.has_workspace_role(workspace_id, null));
create policy workspace_members_insert on public.workspace_members for insert to authenticated
with check (
  private.has_workspace_role(workspace_id, array['owner'])
  or (
    user_id = auth.uid() and role = 'owner'
    and exists (select 1 from public.workspaces w where w.id = workspace_id and w.created_by = auth.uid())
  )
);
create policy workspace_members_update_owner on public.workspace_members for update to authenticated
using (private.has_workspace_role(workspace_id, array['owner']))
with check (private.has_workspace_role(workspace_id, array['owner']));
create policy workspace_members_delete_owner on public.workspace_members for delete to authenticated
using (private.has_workspace_role(workspace_id, array['owner']));

-- Generic workspace-scoped policies
DO $$
declare t text;
begin
  foreach t in array array['releases','tracks','contributors','tasks','task_dependencies','opportunities','documents','document_versions','campaigns','campaign_actions','statements','revenue_entries','rights_claims','registrations','external_connections','external_imports','migration_receipts','backup_runs']
  loop
    execute format('create policy %I_select_member on public.%I for select to authenticated using (private.has_workspace_role(workspace_id, null))', t, t);
    execute format('create policy %I_insert_editor on public.%I for insert to authenticated with check (private.has_workspace_role(workspace_id, array[''owner'',''editor'']))', t, t);
    execute format('create policy %I_update_editor on public.%I for update to authenticated using (private.has_workspace_role(workspace_id, array[''owner'',''editor''])) with check (private.has_workspace_role(workspace_id, array[''owner'',''editor'']))', t, t);
    execute format('create policy %I_delete_editor on public.%I for delete to authenticated using (private.has_workspace_role(workspace_id, array[''owner'',''editor'']))', t, t);
  end loop;
end $$;

-- Audit is append-only from trusted trigger; clients may only read their workspace events.
create policy audit_events_select_member on public.audit_events for select to authenticated
using (private.has_workspace_role(workspace_id, null));

-- Version registry is readable but not writable from browser clients.
create policy app_versions_select_authenticated on public.app_versions for select to authenticated using (true);
create policy feature_status_select_authenticated on public.feature_status for select to authenticated using (true);

-- Explicit grants for Data API + RLS enforcement.
grant select, insert, update, delete on public.profiles, public.workspaces, public.workspace_members,
  public.releases, public.tracks, public.contributors, public.tasks, public.task_dependencies,
  public.opportunities, public.documents, public.document_versions, public.campaigns, public.campaign_actions,
  public.statements, public.revenue_entries, public.rights_claims, public.registrations,
  public.external_connections, public.external_imports, public.migration_receipts, public.backup_runs
  to authenticated;
grant select on public.audit_events, public.app_versions, public.feature_status to authenticated;

-- Private storage bucket. First path segment MUST be workspace UUID text.
insert into storage.buckets(id, name, public)
values ('composer-private','composer-private',false)
on conflict (id) do update set public = false;

create policy composer_private_select on storage.objects for select to authenticated
using (
  bucket_id = 'composer-private'
  and private.has_workspace_role(((storage.foldername(name))[1])::uuid, null)
);
create policy composer_private_insert on storage.objects for insert to authenticated
with check (
  bucket_id = 'composer-private'
  and private.has_workspace_role(((storage.foldername(name))[1])::uuid, array['owner','editor'])
);
create policy composer_private_update on storage.objects for update to authenticated
using (
  bucket_id = 'composer-private'
  and private.has_workspace_role(((storage.foldername(name))[1])::uuid, array['owner','editor'])
)
with check (
  bucket_id = 'composer-private'
  and private.has_workspace_role(((storage.foldername(name))[1])::uuid, array['owner','editor'])
);
create policy composer_private_delete on storage.objects for delete to authenticated
using (
  bucket_id = 'composer-private'
  and private.has_workspace_role(((storage.foldername(name))[1])::uuid, array['owner','editor'])
);

commit;
