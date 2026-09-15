import {
  Activity,
  AppWindow,
  Boxes,
  Brain,
  Building2,
  ClipboardList,
  Compass,
  Cpu,
  Database,
  Eye,
  FlaskConical,
  Gauge,
  GraduationCap,
  Layers,
  LayoutDashboard,
  Lightbulb,
  Map as MapIcon,
  Package,
  Plug,
  Rocket,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  SunMoon,
  Users,
} from "lucide-react";

export type NavItem = { to: string; label: string; icon: typeof Gauge };
export type NavGroup = "owner" | "labtest" | "core" | "apps";

/** CENTRAL — somente gestão do proprietário. Detalhe técnico vive no CORE;
 *  o que ainda não foi promovido vive no LABTEST. */
export const OWNER_MENU: NavItem[] = [
  { to: "/owner", label: "Cognitive / Cockpit", icon: LayoutDashboard },
  { to: "/owner/mapa-vivo", label: "Mapa Vivo", icon: MapIcon },
  { to: "/owner/clients", label: "Clientes", icon: Users },
  { to: "/owner/products", label: "Produtos", icon: Package },
  { to: "/owner/commercial", label: "Comercial & Contratos", icon: Building2 },
  { to: "/owner/opportunities", label: "Oportunidades", icon: Lightbulb },
  { to: "/owner/settings", label: "Configurações", icon: Cpu },
];

/** LABTEST — superfície única de criação, desenvolvimento, teste, homologação
 *  e pré-promoção. Substitui o antigo "LAB". */
export const LABTEST_MENU: NavItem[] = [
  { to: "/labtest", label: "Visão Geral & Ambientes de Teste", icon: FlaskConical },
  { to: "/labtest/next", label: "Próxima Versão / Fila de Promoção", icon: Rocket },
];

/** CORE — operação técnica corrente. MENU CANÔNICO: exatamente 9 itens.
 *  Segurança, Dados & Fontes, CALLs, IA/Prompts, Treinamentos e SOL/LUA NÃO são
 *  itens raiz: vivem dentro de Arquitetura Técnica, Configurações, Bindings e LABTEST. */
export const CORE_MENU: NavItem[] = [
  { to: "/core", label: "Visão Geral", icon: Cpu },
  { to: "/core/health", label: "Indicadores de Saúde", icon: Gauge },
  { to: "/core/architecture", label: "Arquitetura Técnica", icon: Layers },
  { to: "/core/apps", label: "Aplicativos, Plugins & Bindings", icon: AppWindow },
  { to: "/core/problems", label: "Planos de Ação & Melhorias", icon: Activity },
  { to: "/core/tests", label: "Testes & Qualidade", icon: ClipboardList },
  { to: "/core/versions", label: "Versões & Atualizações", icon: Boxes },
  { to: "/core/observability", label: "Observabilidade", icon: Eye },
  { to: "/core/settings", label: "Configurações", icon: SlidersHorizontal },
];

/** Superfícies técnicas de detalhe: acessíveis por dentro das áreas canônicas,
 *  preservadas por compatibilidade e nunca como item raiz do CORE. */
export const CORE_DETAIL_SURFACES: {
  to: string;
  label: string;
  icon: typeof Gauge;
  parent: string;
}[] = [
  { to: "/core/architecture", label: "Arquitetura Técnica", icon: Layers, parent: "" },
  { to: "/core/calls", label: "CALLs & Contratos", icon: Plug, parent: "Arquitetura Técnica" },
  { to: "/core/data", label: "Dados & Fontes", icon: Database, parent: "Arquitetura Técnica" },
  {
    to: "/core/security",
    label: "Segurança & Tenants",
    icon: ShieldCheck,
    parent: "Arquitetura Técnica",
  },
  { to: "/core/ai", label: "IA, Prompts & Agentes", icon: Brain, parent: "Arquitetura Técnica" },
  {
    to: "/core/trainings",
    label: "Treinamentos & Capacitação",
    icon: GraduationCap,
    parent: "Aplicativos, Plugins & Bindings",
  },
  { to: "/core/sol-lua", label: "SOL / LUA (estados)", icon: SunMoon, parent: "LABTEST" },
];

export const APPS_MENU: NavItem[] = [
  { to: "/apps/research-scout", label: "Research Scout", icon: Search },
  { to: "/apps/benchmarker", label: "Benchmarker", icon: Gauge },
  { to: "/apps/opportunity-intelligence", label: "Opportunity Intelligence", icon: Lightbulb },
  { to: "/apps/showroom", label: "Showroom", icon: Rocket },
  { to: "/apps/diagnostico-360", label: "Diagnóstico 360", icon: Compass },
  { to: "/apps/digital-improvement", label: "Digital Improvement", icon: Activity },
  { to: "/apps/meeting-architect", label: "Meeting Architect", icon: ClipboardList },
  { to: "/apps/teste3", label: "Teste³ IA", icon: ClipboardList },
  { to: "/apps/validation-gate", label: "Validation Gate", icon: ShieldCheck },
  { to: "/apps/orbit", label: "Orbit / Agenda / LifeOS", icon: Compass },
  { to: "/apps/version", label: "LAMOU Version", icon: Boxes },
];

/** Três superfícies raiz — CENTRAL | LABTEST | CORE.
 *  Aplicativos não são superfície raiz: aparecem como produto na Central,
 *  como candidato no LABTEST e como binding no CORE. */
export const NAV_GROUPS: {
  group: "owner" | "labtest" | "core";
  short: string;
  label: string;
  sub: string;
  items: NavItem[];
}[] = [
  {
    group: "owner",
    short: "Central",
    label: "LAMOU IA Central",
    sub: "Proprietário — camada gerencial",
    items: OWNER_MENU,
  },
  {
    group: "labtest",
    short: "LABTEST",
    label: "LAMOU LABTEST",
    sub: "Criação, teste, homologação e pré-promoção",
    items: LABTEST_MENU,
  },
  {
    group: "core",
    short: "CORE",
    label: "LAMOU CORE",
    sub: "Proprietário — camada técnica",
    items: CORE_MENU,
  },
];

/** Catalogação de roadmap (Wave 1) — não é superfície de navegação. */
export const APP_ROUTES = {
  "research-scout": "/apps/research-scout",
  benchmarker: "/apps/benchmarker",
  "opportunity-intelligence": "/apps/opportunity-intelligence",
  showroom: "/apps/showroom",
  "diagnostico-360": "/apps/diagnostico-360",
  "digital-improvement": "/apps/digital-improvement",
  "meeting-architect": "/apps/meeting-architect",
  teste3: "/apps/teste3",
  "validation-gate": "/apps/validation-gate",
  orbit: "/apps/orbit",
  version: "/apps/version",
} as const;

export type AppSlug = keyof typeof APP_ROUTES;

export function appRoute(slug: string): (typeof APP_ROUTES)[AppSlug] {
  return APP_ROUTES[slug as AppSlug] ?? "/apps/research-scout";
}
