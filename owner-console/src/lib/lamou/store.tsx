import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  ACTION_PLANS,
  APPS,
  ASSETS,
  CASES,
  CLIENTS,
  CONTRACTS,
  IMPROVEMENTS,
  MODULES,
  SCENARIOS,
  SECURITY,
  TESTS,
  VERSIONS,
} from "./demo-data";
import type {
  ActionPlan,
  AppProduct,
  AssetItem,
  CaseDestination,
  CaseNode,
  ClientAccount,
  Contract,
  Improvement,
  ImprovementRoute,
  ModuleCard,
  Project,
  Referral,
  Scenario,
  SecurityAlert,
  TestRequest,
  TestRun,
  VersionEntry,
} from "./types";

const STORAGE_KEY = "lamou-owner-core-v1";

export interface LamouState {
  criticalOnly: boolean;
  panelMode: boolean;
  modules: ModuleCard[];
  cases: CaseNode[];
  apps: AppProduct[];
  clients: ClientAccount[];
  contracts: Contract[];
  tests: TestRun[];
  plans: ActionPlan[];
  projects: Project[];
  testRequests: TestRequest[];
  referrals: Referral[];
  improvements: Improvement[];
  security: SecurityAlert[];
  versions: VersionEntry[];
  scenarios: Scenario[];
  assets: AssetItem[];
  activity: { at: string; text: string }[];
}

const initialState: LamouState = {
  criticalOnly: false,
  panelMode: false,
  modules: MODULES,
  cases: CASES,
  apps: APPS,
  clients: CLIENTS,
  contracts: CONTRACTS,
  tests: TESTS,
  plans: ACTION_PLANS,
  projects: [],
  testRequests: [],
  referrals: [],
  improvements: IMPROVEMENTS,
  security: SECURITY,
  versions: VERSIONS,
  scenarios: SCENARIOS,
  assets: ASSETS,
  activity: [
    { at: "2026-09-09", text: "Owner Core aberto nesta sessão" },
    { at: "2026-09-08", text: "Divergência de snapshot registrada (DEMO)" },
    { at: "2026-09-07", text: "Falso positivo marcado em teste de IA (DEMO)" },
  ],
};

interface LamouActions {
  setCriticalOnly: (v: boolean) => void;
  setPanelMode: (v: boolean) => void;
  resolvePending: (moduleId: string, pendingId: string) => void;
  reopenPending: (moduleId: string, pendingId: string) => void;
  routeCase: (caseId: string, destination: CaseDestination, reason?: string) => void;
  clearCaseDestination: (caseId: string) => void;
  noteCase: (caseId: string, text: string) => void;
  assignCaseOwner: (caseId: string, owner: string) => void;
  createProject: (caseId: string) => void;
  createTestRequest: (caseId: string) => void;
  createReferral: (caseId: string, app: string, note: string) => void;
  updatePlan: (planId: string, patch: Partial<ActionPlan>) => void;
  closePlan: (planId: string, closure: NonNullable<ActionPlan["closure"]>) => void;
  setImprovementRoute: (id: string, route: ImprovementRoute | null) => void;
  createImprovement: (input: { title: string; description: string; origin: string }) => void;
  setSecurityStatus: (id: string, status: SecurityAlert["status"]) => void;
  toggleGate: (versionId: string, gateLabel: string) => void;
  promoteVersion: (versionId: string) => { ok: boolean; message: string };
  markDeploymentStep: (clientId: string, step: string, done: boolean) => void;
  requestRetest: (testId: string) => void;
  resetDemo: () => void;
}

const LamouContext = createContext<(LamouState & LamouActions) | null>(null);

const today = () => new Date().toISOString().slice(0, 10);

export function LamouProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LamouState>(initialState);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState, ...(JSON.parse(raw) as LamouState) });
    } catch {
      /* estado local indisponível: segue com dados DEMO */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignora falha de persistência local */
    }
  }, [state]);

  const log = (s: LamouState, text: string): LamouState => ({
    ...s,
    activity: [{ at: today(), text }, ...s.activity].slice(0, 30),
  });

  const actions = useMemo<LamouActions>(
    () => ({
      setCriticalOnly: (v) => setState((s) => ({ ...s, criticalOnly: v })),
      setPanelMode: (v) => setState((s) => ({ ...s, panelMode: v })),
      resolvePending: (moduleId, pendingId) =>
        setState((s) =>
          log(
            {
              ...s,
              modules: s.modules.map((m) =>
                m.id !== moduleId
                  ? m
                  : {
                      ...m,
                      pendings: m.pendings.map((p) =>
                        p.id === pendingId ? { ...p, resolved: true } : p,
                      ),
                    },
              ),
            },
            "Pendência resolvida — badge removido e tela reajustada",
          ),
        ),
      reopenPending: (moduleId, pendingId) =>
        setState((s) => ({
          ...s,
          modules: s.modules.map((m) =>
            m.id !== moduleId
              ? m
              : {
                  ...m,
                  pendings: m.pendings.map((p) =>
                    p.id === pendingId ? { ...p, resolved: false } : p,
                  ),
                },
          ),
        })),
      routeCase: (caseId, destination, reason) =>
        setState((s) => {
          const target = s.cases.find((c) => c.id === caseId);
          if (!target) return s;
          const related = [...(target.relatedIds ?? [])];
          const stamped: CaseNode = {
            ...target,
            destination,
            archivedReason:
              destination === "arquivado" || destination === "falso-positivo" ? reason : undefined,
            occurrence:
              destination === "falso-positivo" || destination === "arquivado"
                ? false
                : target.occurrence,
            history: [
              ...target.history,
              { at: today(), text: `Decisão: ${destination}${reason ? ` — ${reason}` : ""}` },
            ],
          };
          let next: LamouState = {
            ...s,
            cases: s.cases.map((c) => (c.id === caseId ? stamped : c)),
          };
          if (destination === "plano" && !s.plans.some((p) => p.originCaseId === caseId)) {
            const id = `PA-${String(s.plans.length + 1).padStart(4, "0")}`;
            related.push(id);
            next = {
              ...next,
              plans: [
                {
                  id,
                  title: target.title,
                  originCaseId: target.id,
                  origin: target.origin,
                  problem: target.description,
                  evidences: target.evidences,
                  status: "AGUARDANDO DEFINIÇÃO",
                  owner: "",
                  dueDate: "",
                  priority: "",
                  objective: "",
                  expectedEvidence: "",
                  completionCriteria: "",
                  closure: null,
                  createdAt: today(),
                },
                ...next.plans,
              ],
            };
          }
          if (
            destination === "oportunidade" &&
            !s.improvements.some((i) => i.origin === `Caso ${target.id}`)
          ) {
            const id = `OP-${String(s.improvements.length + 1).padStart(4, "0")}`;
            related.push(id);
            next = {
              ...next,
              improvements: [
                {
                  id,
                  title: target.title,
                  description: target.description,
                  route: null,
                  origin: `Caso ${target.id}`,
                  createdAt: today(),
                },
                ...next.improvements,
              ],
            };
          }
          next = {
            ...next,
            cases: next.cases.map((c) =>
              c.id === caseId ? { ...c, relatedIds: Array.from(new Set(related)) } : c,
            ),
          };
          return log(next, `${caseId} encaminhado para "${destination}"`);
        }),
      clearCaseDestination: (caseId) =>
        setState((s) => ({
          ...s,
          cases: s.cases.map((c) =>
            c.id === caseId ? { ...c, destination: null, archivedReason: undefined } : c,
          ),
        })),
      noteCase: (caseId, text) =>
        setState((s) => ({
          ...s,
          cases: s.cases.map((c) =>
            c.id === caseId ? { ...c, history: [...c.history, { at: today(), text }] } : c,
          ),
        })),
      assignCaseOwner: (caseId, owner) =>
        setState((s) =>
          log(
            {
              ...s,
              cases: s.cases.map((c) =>
                c.id === caseId
                  ? {
                      ...c,
                      owner,
                      history: [
                        ...c.history,
                        { at: today(), text: `Responsável atribuído: ${owner}` },
                      ],
                    }
                  : c,
              ),
            },
            `${caseId} agora tem responsável (registro local DEMO)`,
          ),
        ),
      createProject: (caseId) =>
        setState((s) => {
          const target = s.cases.find((c) => c.id === caseId);
          if (!target || s.projects.some((p) => p.originCaseId === caseId)) return s;
          const id = `PRJ-${String(s.projects.length + 1).padStart(4, "0")}`;
          return log(
            {
              ...s,
              projects: [
                {
                  id,
                  title: target.title,
                  originCaseId: target.id,
                  problem: target.description,
                  status: "RASCUNHO",
                  createdAt: today(),
                },
                ...s.projects,
              ],
              cases: s.cases.map((c) =>
                c.id !== caseId
                  ? c
                  : {
                      ...c,
                      destination: "projeto",
                      relatedIds: Array.from(new Set([...(c.relatedIds ?? []), id])),
                      history: [
                        ...c.history,
                        { at: today(), text: `Projeto ${id} criado (RASCUNHO)` },
                      ],
                    },
              ),
            },
            `${id} criado a partir de ${caseId}`,
          );
        }),
      createTestRequest: (caseId) =>
        setState((s) => {
          const target = s.cases.find((c) => c.id === caseId);
          if (!target || s.testRequests.some((t) => t.caseId === caseId)) return s;
          const id = `TR-${String(s.testRequests.length + 1).padStart(4, "0")}`;
          return log(
            {
              ...s,
              testRequests: [
                {
                  id,
                  caseId,
                  title: `Caso de teste para ${target.title}`,
                  target: target.district,
                  runnerStatus: "NOT_CONNECTED",
                  createdAt: today(),
                },
                ...s.testRequests,
              ],
              cases: s.cases.map((c) =>
                c.id !== caseId
                  ? c
                  : {
                      ...c,
                      destination: "teste",
                      relatedIds: Array.from(new Set([...(c.relatedIds ?? []), id])),
                      history: [
                        ...c.history,
                        {
                          at: today(),
                          text: `Solicitação de teste ${id} registrada — runner NOT_CONNECTED`,
                        },
                      ],
                    },
              ),
            },
            `${id} registrado (execução não conectada)`,
          );
        }),
      createReferral: (caseId, app, note) =>
        setState((s) => {
          const target = s.cases.find((c) => c.id === caseId);
          if (!target) return s;
          const id = `ENC-${String(s.referrals.length + 1).padStart(4, "0")}`;
          return log(
            {
              ...s,
              referrals: [
                { id, caseId, destination: app, app, note, createdAt: today() },
                ...s.referrals,
              ],
              cases: s.cases.map((c) =>
                c.id !== caseId
                  ? c
                  : {
                      ...c,
                      relatedIds: Array.from(new Set([...(c.relatedIds ?? []), id])),
                      history: [
                        ...c.history,
                        { at: today(), text: `Encaminhado para ${app} (${id})` },
                      ],
                    },
              ),
            },
            `${caseId} encaminhado para ${app}`,
          );
        }),
      updatePlan: (planId, patch) =>
        setState((s) => ({
          ...s,
          plans: s.plans.map((p) => {
            if (p.id !== planId) return p;
            const merged = { ...p, ...patch };
            const defined =
              merged.owner &&
              merged.dueDate &&
              merged.priority &&
              merged.objective &&
              merged.expectedEvidence &&
              merged.completionCriteria;
            if (merged.status === "AGUARDANDO DEFINIÇÃO" && defined) merged.status = "DEFINIDO";
            if (merged.status === "DEFINIDO" && !defined) merged.status = "AGUARDANDO DEFINIÇÃO";
            return merged;
          }),
        })),
      closePlan: (planId, closure) =>
        setState((s) =>
          log(
            {
              ...s,
              plans: s.plans.map((p) =>
                p.id === planId ? { ...p, closure, status: "CONCLUÍDO" } : p,
              ),
            },
            `${planId} concluído com registro de eficácia`,
          ),
        ),
      setImprovementRoute: (id, route) =>
        setState((s) => ({
          ...s,
          improvements: s.improvements.map((i) => (i.id === id ? { ...i, route } : i)),
        })),
      createImprovement: ({ title, description, origin }) =>
        setState((s) => {
          const id = `OP-${String(s.improvements.length + 1).padStart(4, "0")}`;
          return log(
            {
              ...s,
              improvements: [
                ...s.improvements,
                {
                  id,
                  title,
                  description,
                  route: null,
                  origin,
                  createdAt: new Date().toISOString().slice(0, 10),
                },
              ],
            },
            `${id} criada a partir de ${origin} (persistência local DEMO)`,
          );
        }),
      setSecurityStatus: (id, status) =>
        setState((s) =>
          log(
            { ...s, security: s.security.map((a) => (a.id === id ? { ...a, status } : a)) },
            `Alerta ${id} agora está "${status}"`,
          ),
        ),
      toggleGate: (versionId, gateLabel) =>
        setState((s) => ({
          ...s,
          versions: s.versions.map((v) =>
            v.id !== versionId
              ? v
              : {
                  ...v,
                  gate: v.gate.map((g) => (g.label === gateLabel ? { ...g, ok: !g.ok } : g)),
                },
          ),
        })),
      promoteVersion: (versionId) => {
        let result = { ok: false, message: "Versão não encontrada." };
        setState((s) => {
          const v = s.versions.find((x) => x.id === versionId);
          if (!v) return s;
          if (v.state === "BASELINE FROZEN") {
            result = { ok: false, message: "Baseline FROZEN não pode ser sobrescrita." };
            return s;
          }
          if (v.gate.some((g) => !g.ok)) {
            result = {
              ok: false,
              message: "Gate incompleto: promoção bloqueada. SALVAR ≠ PROMOVER.",
            };
            return s;
          }
          result = { ok: true, message: `${v.build} promovida com evidências registradas.` };
          return log(
            {
              ...s,
              versions: s.versions.map((x) =>
                x.id === versionId ? { ...x, state: "PROMOVIDA" } : x,
              ),
            },
            `${v.build} promovida`,
          );
        });
        return result;
      },
      markDeploymentStep: (clientId, step, done) =>
        setState((s) => ({
          ...s,
          clients: s.clients.map((c) =>
            c.id !== clientId
              ? c
              : {
                  ...c,
                  deployment: c.deployment.map((d) => (d.step === step ? { ...d, done } : d)),
                },
          ),
        })),
      requestRetest: (testId) =>
        setState((s) =>
          log(
            { ...s, tests: s.tests.map((t) => (t.id === testId ? { ...t, retest: true } : t)) },
            `Reteste solicitado para ${testId}`,
          ),
        ),
      resetDemo: () => setState(initialState),
    }),
    [],
  );

  const value = useMemo(() => ({ ...state, ...actions }), [state, actions]);

  return <LamouContext.Provider value={value}>{children}</LamouContext.Provider>;
}

export function useLamou() {
  const ctx = useContext(LamouContext);
  if (!ctx) throw new Error("useLamou precisa estar dentro de LamouProvider");
  return ctx;
}

export function useCriticalPendings() {
  const { modules } = useLamou();
  return useCallback(
    () =>
      modules.flatMap((m) =>
        m.pendings.filter((p) => !p.resolved).map((p) => ({ ...p, module: m })),
      ),
    [modules],
  )();
}
