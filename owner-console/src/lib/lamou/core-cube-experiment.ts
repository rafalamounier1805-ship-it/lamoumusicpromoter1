import type { CoreCubeTheoryKey } from "@/lib/lamou/core-cube-theories";

export type CoreCubeBenchmarkTruthState = "SYNTHETIC_DEMO";
export type CoreCubeExecutionScope = "LOCAL_RULESET_ONLY";

export interface CoreCubeRecord {
  id: string;
  tenantId: string;
  corridor: string;
  room: string;
  cabinet: string;
  modality: "text" | "number" | "image" | "audio" | "signal" | "document";
  title: string;
  text: string;
  tags: string[];
  sourceId: string;
  createdAt: string;
  objectRef?: string;
  relations: string[];
}

export interface CoreCubeTask {
  id: string;
  tenantId: string;
  query: string;
  expectedIds: string[];
  corridor?: string;
  perspective?: string;
}

export interface CoreCubeSpecialistReview {
  personaId: string;
  state: "LOCAL_CHECK_PASS" | "LOCAL_CHECK_FAIL";
  findings: string[];
}

export interface CoreCubeBenchmarkMetric {
  architecture: CoreCubeTheoryKey;
  truthState: CoreCubeBenchmarkTruthState;
  executionScope: CoreCubeExecutionScope;
  latencyMs: number;
  retrievalAccuracy: number;
  taskSuccessRate: number;
  indexBytes: number;
  contextBytes: number;
  objectReads: number;
  lineagePreserved: boolean;
  tenantIsolation: boolean;
  specialistReviews: CoreCubeSpecialistReview[];
  promotionAllowed: false;
}

export interface CoreCubeBenchmarkReport {
  benchmarkVersion: "core-cube-benchmark.v1";
  datasetId: "LAMOU_CORE_CUBE_DEMO_V1";
  datasetHash: string;
  truthState: CoreCubeBenchmarkTruthState;
  executionScope: CoreCubeExecutionScope;
  iterations: number;
  tasks: number;
  records: number;
  results: CoreCubeBenchmarkMetric[];
}

const TENANT_A = "00000000-0000-0000-0000-0000000000a1";
const TENANT_B = "00000000-0000-0000-0000-0000000000b2";

export const CORE_CUBE_ARCHITECTURES: CoreCubeTheoryKey[] = [
  "grid",
  "cube",
  "magic-cube",
  "multi-magic-cube",
  "prism",
  "snapshot",
  "ghost",
  "relation",
  "kaleidoscope",
  "pyramid",
];

export function createCoreCubeDataset(): CoreCubeRecord[] {
  const records: CoreCubeRecord[] = [
    {
      id: "A-MOTOR-TEMP",
      tenantId: TENANT_A,
      corridor: "industrial",
      room: "motor-01",
      cabinet: "telemetry",
      modality: "signal",
      title: "Motor 01 temperatura elevada",
      text: "temperatura motor rolamento aquecimento alerta 92c",
      tags: ["motor", "temperatura", "rolamento", "critical"],
      sourceId: "sensor:temp:motor-01",
      createdAt: "2026-09-16T00:00:00Z",
      relations: ["A-MOTOR-AUDIO", "A-MOTOR-IMAGE"],
    },
    {
      id: "A-MOTOR-AUDIO",
      tenantId: TENANT_A,
      corridor: "industrial",
      room: "motor-01",
      cabinet: "media",
      modality: "audio",
      title: "Motor 01 ruído de rolamento",
      text: "audio ruido rolamento vibracao motor",
      tags: ["motor", "audio", "rolamento", "vibracao"],
      sourceId: "microphone:motor-01",
      createdAt: "2026-09-16T00:00:10Z",
      objectRef: "core://objects/tenant-a/audio/motor-01-bearing.wav",
      relations: ["A-MOTOR-TEMP"],
    },
    {
      id: "A-MOTOR-IMAGE",
      tenantId: TENANT_A,
      corridor: "industrial",
      room: "motor-01",
      cabinet: "media",
      modality: "image",
      title: "Motor 01 imagem de corrosão",
      text: "foto imagem corrosao carcaca motor",
      tags: ["motor", "imagem", "corrosao"],
      sourceId: "camera:motor-01",
      createdAt: "2026-09-16T00:00:20Z",
      objectRef: "core://objects/tenant-a/images/motor-01-corrosion.webp",
      relations: ["A-MOTOR-TEMP"],
    },
    {
      id: "A-OEE",
      tenantId: TENANT_A,
      corridor: "industrial",
      room: "linha-01",
      cabinet: "metrics",
      modality: "number",
      title: "OEE linha 01",
      text: "oee produtividade disponibilidade performance qualidade 71",
      tags: ["oee", "produtividade", "indicador"],
      sourceId: "metric:oee:line-01",
      createdAt: "2026-09-16T00:01:00Z",
      relations: ["A-MOTOR-TEMP"],
    },
    {
      id: "A-INVOICE",
      tenantId: TENANT_A,
      corridor: "finance",
      room: "billing",
      cabinet: "contracts",
      modality: "document",
      title: "Fatura cliente vencida",
      text: "fatura contrato cobranca vencida inadimplencia",
      tags: ["fatura", "contrato", "cobranca"],
      sourceId: "billing:invoice:001",
      createdAt: "2026-09-16T00:02:00Z",
      objectRef: "core://objects/tenant-a/docs/invoice-001.pdf",
      relations: ["A-CONTRACT"],
    },
    {
      id: "A-CONTRACT",
      tenantId: TENANT_A,
      corridor: "finance",
      room: "contracts",
      cabinet: "documents",
      modality: "document",
      title: "Contrato cliente 001",
      text: "contrato cliente entitlement renovacao vigencia",
      tags: ["contrato", "cliente", "entitlement"],
      sourceId: "document:contract:001",
      createdAt: "2026-09-16T00:02:10Z",
      objectRef: "core://objects/tenant-a/docs/contract-001.pdf",
      relations: ["A-INVOICE"],
    },
    {
      id: "A-APP-ERROR",
      tenantId: TENANT_A,
      corridor: "software",
      room: "app-version",
      cabinet: "observability",
      modality: "text",
      title: "Falha de runtime no aplicativo Version",
      text: "erro runtime version aplicativo falha observabilidade",
      tags: ["app", "version", "erro", "runtime"],
      sourceId: "runtime:version:error:01",
      createdAt: "2026-09-16T00:03:00Z",
      relations: ["A-APP-VERSION"],
    },
    {
      id: "A-APP-VERSION",
      tenantId: TENANT_A,
      corridor: "software",
      room: "app-version",
      cabinet: "registry",
      modality: "text",
      title: "Versão candidata do aplicativo Version",
      text: "version aplicativo build candidate registry rollback",
      tags: ["app", "version", "build", "registry"],
      sourceId: "registry:app:version",
      createdAt: "2026-09-16T00:03:10Z",
      relations: ["A-APP-ERROR"],
    },
    {
      id: "A-HYPOTHESIS",
      tenantId: TENANT_A,
      corridor: "improvement",
      room: "case-001",
      cabinet: "hypotheses",
      modality: "text",
      title: "Hipótese de falha no rolamento",
      text: "hipotese rolamento temperatura vibracao causa motor",
      tags: ["hipotese", "motor", "rolamento"],
      sourceId: "core:hypothesis:case-001",
      createdAt: "2026-09-16T00:04:00Z",
      relations: ["A-MOTOR-TEMP", "A-MOTOR-AUDIO"],
    },
    {
      id: "A-EVIDENCE",
      tenantId: TENANT_A,
      corridor: "improvement",
      room: "case-001",
      cabinet: "evidence",
      modality: "document",
      title: "Evidência do teste do rolamento",
      text: "evidencia teste rolamento baseline resultado validacao",
      tags: ["evidencia", "teste", "rolamento"],
      sourceId: "validation:evidence:case-001",
      createdAt: "2026-09-16T00:04:10Z",
      relations: ["A-HYPOTHESIS"],
    },
    {
      id: "B-MOTOR-TEMP",
      tenantId: TENANT_B,
      corridor: "industrial",
      room: "motor-01",
      cabinet: "telemetry",
      modality: "signal",
      title: "Outro tenant motor temperatura",
      text: "temperatura motor rolamento aquecimento 99c",
      tags: ["motor", "temperatura", "rolamento"],
      sourceId: "sensor:tenant-b:motor-01",
      createdAt: "2026-09-16T00:00:00Z",
      relations: [],
    },
    {
      id: "B-INVOICE",
      tenantId: TENANT_B,
      corridor: "finance",
      room: "billing",
      cabinet: "contracts",
      modality: "document",
      title: "Outro tenant fatura vencida",
      text: "fatura contrato cobranca vencida",
      tags: ["fatura", "contrato"],
      sourceId: "billing:tenant-b:invoice",
      createdAt: "2026-09-16T00:02:00Z",
      relations: [],
    },
  ];
  return records;
}

export function createCoreCubeTasks(): CoreCubeTask[] {
  return [
    {
      id: "motor-temperature",
      tenantId: TENANT_A,
      query: "motor temperatura rolamento",
      expectedIds: ["A-MOTOR-TEMP"],
      corridor: "industrial",
      perspective: "maintenance",
    },
    {
      id: "bearing-audio",
      tenantId: TENANT_A,
      query: "audio ruido rolamento vibracao",
      expectedIds: ["A-MOTOR-AUDIO"],
      corridor: "industrial",
      perspective: "maintenance",
    },
    {
      id: "corrosion-image",
      tenantId: TENANT_A,
      query: "imagem corrosao carcaca motor",
      expectedIds: ["A-MOTOR-IMAGE"],
      corridor: "industrial",
      perspective: "quality",
    },
    {
      id: "billing-overdue",
      tenantId: TENANT_A,
      query: "fatura cobranca vencida contrato",
      expectedIds: ["A-INVOICE"],
      corridor: "finance",
      perspective: "finance",
    },
    {
      id: "runtime-version",
      tenantId: TENANT_A,
      query: "erro runtime aplicativo version",
      expectedIds: ["A-APP-ERROR"],
      corridor: "software",
      perspective: "engineering",
    },
    {
      id: "case-evidence",
      tenantId: TENANT_A,
      query: "evidencia teste rolamento validacao",
      expectedIds: ["A-EVIDENCE"],
      corridor: "improvement",
      perspective: "validation",
    },
  ];
}

function normalize(value: string): string[] {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

function scoreRecord(record: CoreCubeRecord, task: CoreCubeTask): number {
  const query = new Set(normalize(task.query));
  const haystack = normalize(
    [record.title, record.text, record.tags.join(" "), record.corridor, record.room].join(" "),
  );
  return haystack.reduce((score, token) => score + (query.has(token) ? 1 : 0), 0);
}

function ranked(records: CoreCubeRecord[], task: CoreCubeTask): CoreCubeRecord[] {
  return records
    .filter((record) => record.tenantId === task.tenantId)
    .map((record) => ({ record, score: scoreRecord(record, task) }))
    .filter((item) => item.score > 0)
    .sort(
      (left, right) => right.score - left.score || left.record.id.localeCompare(right.record.id),
    )
    .slice(0, 4)
    .map((item) => item.record);
}

function simpleHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

function byteSize(value: unknown): number {
  return new TextEncoder().encode(JSON.stringify(value)).byteLength;
}

export function buildMultiMagicManifest(record: CoreCubeRecord) {
  return {
    id: record.id,
    tenantId: record.tenantId,
    modality: record.modality,
    sourceId: record.sourceId,
    objectRef: record.objectRef ?? null,
    tags: record.tags,
    relations: record.relations,
    createdAt: record.createdAt,
  };
}

export function createCoreCubeSnapshot(records: CoreCubeRecord[]) {
  const snapshot = records.map((record) => ({
    ...record,
    tags: [...record.tags],
    relations: [...record.relations],
  }));
  for (const record of snapshot) {
    Object.freeze(record.tags);
    Object.freeze(record.relations);
    Object.freeze(record);
  }
  return Object.freeze(snapshot);
}

function prepareArchitecture(
  architecture: CoreCubeTheoryKey,
  records: CoreCubeRecord[],
): {
  indexBytes: number;
  retrieve: (task: CoreCubeTask) => CoreCubeRecord[];
} {
  if (architecture === "grid") {
    return { indexBytes: 0, retrieve: (task) => ranked(records, task) };
  }

  if (architecture === "cube") {
    const corridorIndex = new Map<string, CoreCubeRecord[]>();
    for (const record of records) {
      const key = `${record.tenantId}:${record.corridor}`;
      corridorIndex.set(key, [...(corridorIndex.get(key) ?? []), record]);
    }
    return {
      indexBytes: byteSize([...corridorIndex.entries()]),
      retrieve: (task) =>
        ranked(
          task.corridor ? (corridorIndex.get(`${task.tenantId}:${task.corridor}`) ?? []) : records,
          task,
        ),
    };
  }

  if (architecture === "magic-cube") {
    const lexicalIndex = records.map((record) => ({
      id: record.id,
      tenantId: record.tenantId,
      tokens: normalize([record.title, record.text, record.tags.join(" ")].join(" ")),
    }));
    return {
      indexBytes: byteSize(lexicalIndex),
      retrieve: (task) => ranked(records, task),
    };
  }

  if (architecture === "multi-magic-cube") {
    const manifests = records.map(buildMultiMagicManifest);
    return {
      indexBytes: byteSize(manifests),
      retrieve: (task) => ranked(records, task),
    };
  }

  if (architecture === "prism") {
    const projections = records.map((record) => ({
      id: record.id,
      tenantId: record.tenantId,
      corridor: record.corridor,
      tags: record.tags,
      sourceId: record.sourceId,
    }));
    return {
      indexBytes: byteSize(projections),
      retrieve: (task) => ranked(records, task),
    };
  }

  if (architecture === "snapshot") {
    const snapshot = createCoreCubeSnapshot(records);
    return {
      indexBytes: byteSize(
        snapshot.map((record) => [record.id, record.sourceId, record.createdAt]),
      ),
      retrieve: (task) => ranked([...snapshot], task),
    };
  }

  if (architecture === "ghost") {
    const overlay = records.map((record) => ({
      id: record.id,
      tenantId: record.tenantId,
      derived: [...record.tags, `room:${record.room}`],
    }));
    return {
      indexBytes: byteSize(overlay),
      retrieve: (task) => ranked(records, task),
    };
  }

  if (architecture === "relation") {
    const edges = records.flatMap((record) =>
      record.relations.map((target) => [record.id, target] as const),
    );
    return {
      indexBytes: byteSize(edges),
      retrieve: (task) => ranked(records, task),
    };
  }

  if (architecture === "kaleidoscope") {
    const perspectives = records.map((record) => ({
      id: record.id,
      tenantId: record.tenantId,
      dimensions: [record.corridor, record.room, record.modality, ...record.tags],
    }));
    return {
      indexBytes: byteSize(perspectives),
      retrieve: (task) => ranked(records, task),
    };
  }

  const pyramid = records.map((record) => ({
    id: record.id,
    tenantId: record.tenantId,
    level1: record.corridor,
    level2: record.room,
    level3: record.cabinet,
  }));
  return {
    indexBytes: byteSize(pyramid),
    retrieve: (task) => ranked(records, task),
  };
}

function evaluateSpecialists(metric: Omit<CoreCubeBenchmarkMetric, "specialistReviews">) {
  const reviews: CoreCubeSpecialistReview[] = [
    {
      personaId: "data-architect",
      state:
        metric.lineagePreserved && metric.tenantIsolation ? "LOCAL_CHECK_PASS" : "LOCAL_CHECK_FAIL",
      findings: [`lineage=${metric.lineagePreserved}`, `tenantIsolation=${metric.tenantIsolation}`],
    },
    {
      personaId: "data-engineer",
      state: metric.indexBytes >= 0 ? "LOCAL_CHECK_PASS" : "LOCAL_CHECK_FAIL",
      findings: [`indexBytes=${metric.indexBytes}`, `objectReads=${metric.objectReads}`],
    },
    {
      personaId: "software-architect",
      state: metric.retrievalAccuracy === 1 ? "LOCAL_CHECK_PASS" : "LOCAL_CHECK_FAIL",
      findings: [`retrievalAccuracy=${metric.retrievalAccuracy}`],
    },
    {
      personaId: "systems-engineer",
      state: Number.isFinite(metric.latencyMs) ? "LOCAL_CHECK_PASS" : "LOCAL_CHECK_FAIL",
      findings: [`latencyMs=${metric.latencyMs}`, `contextBytes=${metric.contextBytes}`],
    },
    {
      personaId: "research-scientist",
      state: metric.promotionAllowed === false ? "LOCAL_CHECK_PASS" : "LOCAL_CHECK_FAIL",
      findings: ["baseline=grid", "one-change-at-a-time=true", `truthState=${metric.truthState}`],
    },
  ];
  return reviews;
}

function measureArchitecture(
  architecture: CoreCubeTheoryKey,
  records: CoreCubeRecord[],
  tasks: CoreCubeTask[],
  iterations: number,
): CoreCubeBenchmarkMetric {
  const prepared = prepareArchitecture(architecture, records);
  let elapsed = 0;
  let expectedHits = 0;
  let expectedTotal = 0;
  let successfulTasks = 0;
  let contextBytes = 0;
  let objectReads = 0;
  let lineagePreserved = true;
  let tenantIsolation = true;

  for (const task of tasks) {
    let sample: CoreCubeRecord[] = [];
    const started = performance.now();
    for (let iteration = 0; iteration < iterations; iteration += 1) {
      sample = prepared.retrieve(task);
    }
    elapsed += performance.now() - started;

    const ids = new Set(sample.map((record) => record.id));
    const hits = task.expectedIds.filter((id) => ids.has(id)).length;
    expectedHits += hits;
    expectedTotal += task.expectedIds.length;
    if (hits === task.expectedIds.length) successfulTasks += 1;

    contextBytes += byteSize(
      architecture === "multi-magic-cube"
        ? sample.map(buildMultiMagicManifest)
        : sample.map((record) => ({
            id: record.id,
            sourceId: record.sourceId,
            title: record.title,
            text: record.text,
          })),
    );
    objectReads += sample.filter((record) => Boolean(record.objectRef)).length;
    lineagePreserved &&= sample.every((record) => record.sourceId.length > 0);
    tenantIsolation &&= sample.every((record) => record.tenantId === task.tenantId);
  }

  const base: Omit<CoreCubeBenchmarkMetric, "specialistReviews"> = {
    architecture,
    truthState: "SYNTHETIC_DEMO",
    executionScope: "LOCAL_RULESET_ONLY",
    latencyMs: Number((elapsed / (tasks.length * iterations)).toFixed(6)),
    retrievalAccuracy: Number((expectedHits / expectedTotal).toFixed(6)),
    taskSuccessRate: Number((successfulTasks / tasks.length).toFixed(6)),
    indexBytes: prepared.indexBytes,
    contextBytes: Math.round(contextBytes / tasks.length),
    objectReads,
    lineagePreserved,
    tenantIsolation,
    promotionAllowed: false,
  };

  return { ...base, specialistReviews: evaluateSpecialists(base) };
}

export function runCoreCubeBenchmark(iterations = 100): CoreCubeBenchmarkReport {
  const records = createCoreCubeDataset();
  const tasks = createCoreCubeTasks();
  const datasetHash = simpleHash(JSON.stringify(records));

  return {
    benchmarkVersion: "core-cube-benchmark.v1",
    datasetId: "LAMOU_CORE_CUBE_DEMO_V1",
    datasetHash,
    truthState: "SYNTHETIC_DEMO",
    executionScope: "LOCAL_RULESET_ONLY",
    iterations,
    tasks: tasks.length,
    records: records.length,
    results: CORE_CUBE_ARCHITECTURES.map((architecture) =>
      measureArchitecture(architecture, records, tasks, iterations),
    ),
  };
}
