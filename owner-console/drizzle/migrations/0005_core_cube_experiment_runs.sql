-- CORE Cubo experimental evidence ledger.
-- Candidate-only architecture evidence. No experimental architecture is promoted by this migration.

create table if not exists public.lamou_core_experiment_runs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  run_key text not null,
  benchmark_version text not null,
  dataset_id text not null,
  dataset_hash text not null,
  baseline text not null default 'grid',
  target text not null,
  truth_state text not null default 'SYNTHETIC_DEMO',
  execution_scope text not null default 'CANDIDATE_CI',
  build_sha text,
  ci_run_id text,
  environment text not null default 'CANDIDATE',
  metrics jsonb not null default '{}'::jsonb,
  specialist_reviews jsonb not null default '[]'::jsonb,
  evidence jsonb not null default '{}'::jsonb,
  created_by uuid,
  created_at timestamptz not null default now(),
  constraint lamou_core_experiment_runs_run_key_unique unique (tenant_id, run_key, target),
  constraint lamou_core_experiment_runs_target_check check (
    target in (
      'grid',
      'cube',
      'magic-cube',
      'multi-magic-cube',
      'prism',
      'snapshot',
      'ghost',
      'relation',
      'kaleidoscope',
      'pyramid'
    )
  ),
  constraint lamou_core_experiment_runs_truth_check check (
    truth_state in ('SYNTHETIC_DEMO', 'NOT_VERIFIED', 'EXTERNAL_EVIDENCE')
  ),
  constraint lamou_core_experiment_runs_scope_check check (
    execution_scope in ('LOCAL_RULESET_ONLY', 'CANDIDATE_CI', 'EXTERNAL_RUNNER')
  )
);

alter table public.lamou_core_experiment_runs enable row level security;

drop policy if exists core_experiment_select_member on public.lamou_core_experiment_runs;
create policy core_experiment_select_member
on public.lamou_core_experiment_runs
for select
to authenticated
using (lamou_private.is_member(tenant_id));

drop policy if exists core_experiment_insert_member on public.lamou_core_experiment_runs;
create policy core_experiment_insert_member
on public.lamou_core_experiment_runs
for insert
to authenticated
with check (
  lamou_private.is_member(tenant_id)
  and (created_by is null or created_by = auth.uid())
  and truth_state <> 'FACT'
);

create index if not exists lamou_core_experiment_runs_tenant_created_idx
  on public.lamou_core_experiment_runs (tenant_id, created_at desc);

create index if not exists lamou_core_experiment_runs_target_idx
  on public.lamou_core_experiment_runs (target, created_at desc);

comment on table public.lamou_core_experiment_runs is
  'Append-only evidence ledger for Planilhao/Cubo experimental comparisons. SYNTHETIC_DEMO is not production proof.';
