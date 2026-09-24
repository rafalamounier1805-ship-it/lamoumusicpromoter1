-- LAMOU CORE usage telemetry v1
-- Canonical ledger remains public.lamou_audit_events; this migration adds
-- query support and a tenant-safe daily aggregation view.

create index if not exists idx_lamou_audit_events_tenant_created_at
  on public.lamou_audit_events (tenant_id, created_at desc);

create index if not exists idx_lamou_audit_events_event_created_at
  on public.lamou_audit_events (event_type, created_at desc);

create index if not exists idx_lamou_audit_events_usage_surface
  on public.lamou_audit_events (
    (detail ->> 'schema_version'),
    (detail ->> 'surface_type'),
    (detail ->> 'surface_id'),
    created_at desc
  );

create or replace view public.lamou_usage_daily
with (security_invoker = true)
as
select
  tenant_id,
  (created_at at time zone 'UTC')::date as usage_date,
  detail ->> 'surface_type' as surface_type,
  coalesce(
    nullif(detail ->> 'surface_id', ''),
    nullif(detail ->> 'route', ''),
    'unknown'
  ) as surface_id,
  event_type,
  count(*)::bigint as event_count,
  count(distinct actor_id)::bigint as actor_count,
  max(created_at) as last_event_at
from public.lamou_audit_events
where detail ->> 'schema_version' = 'usage.v1'
group by
  tenant_id,
  (created_at at time zone 'UTC')::date,
  detail ->> 'surface_type',
  coalesce(
    nullif(detail ->> 'surface_id', ''),
    nullif(detail ->> 'route', ''),
    'unknown'
  ),
  event_type;

revoke all on public.lamou_usage_daily from anon;
grant select on public.lamou_usage_daily to authenticated;
grant select on public.lamou_usage_daily to service_role;

comment on view public.lamou_usage_daily is
  'Tenant-safe aggregation of LAMOU usage.v1 events. Underlying RLS is enforced via security_invoker.';
