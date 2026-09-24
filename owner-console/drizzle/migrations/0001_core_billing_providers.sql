CREATE TABLE public.billing_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL DEFAULT auth.uid(),
  code text NOT NULL,
  name text NOT NULL,
  price_cents integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'BRL',
  cycle text NOT NULL DEFAULT 'mensal',
  entitlements text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.billing_plans TO authenticated;
GRANT ALL ON public.billing_plans TO service_role;
ALTER TABLE public.billing_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner manages own plans" ON public.billing_plans FOR ALL TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

CREATE TABLE public.billing_charges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL DEFAULT auth.uid(),
  plan_id uuid REFERENCES public.billing_plans(id) ON DELETE SET NULL,
  client_name text NOT NULL,
  amount_cents integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'BRL',
  status text NOT NULL DEFAULT 'pendente',
  due_date date,
  paid_at timestamptz,
  gateway text,
  gateway_reference text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.billing_charges TO authenticated;
GRANT ALL ON public.billing_charges TO service_role;
ALTER TABLE public.billing_charges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner manages own charges" ON public.billing_charges FOR ALL TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

CREATE TABLE public.core_provider_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL DEFAULT auth.uid(),
  slot text NOT NULL,
  provider text NOT NULL,
  model text NOT NULL,
  role text NOT NULL DEFAULT 'SOL',
  state text NOT NULL DEFAULT 'NOT_VERIFIED',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.core_provider_slots TO authenticated;
GRANT ALL ON public.core_provider_slots TO service_role;
ALTER TABLE public.core_provider_slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner manages own provider slots" ON public.core_provider_slots FOR ALL TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

CREATE TABLE public.core_provider_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL DEFAULT auth.uid(),
  slot text NOT NULL DEFAULT 'SLOT-AI-MODEL',
  provider text NOT NULL,
  model text NOT NULL,
  ok boolean NOT NULL DEFAULT false,
  latency_ms integer,
  output_chars integer,
  error text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.core_provider_checks TO authenticated;
GRANT ALL ON public.core_provider_checks TO service_role;
ALTER TABLE public.core_provider_checks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner reads own provider checks" ON public.core_provider_checks FOR SELECT TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Owner inserts own provider checks" ON public.core_provider_checks FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER billing_plans_touch BEFORE UPDATE ON public.billing_plans FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER billing_charges_touch BEFORE UPDATE ON public.billing_charges FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER core_provider_slots_touch BEFORE UPDATE ON public.core_provider_slots FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();