import type { CaseExtra, CaseNode } from "./types";

export interface CoreCaseFacts {
  case_id: string;
  timestamp: string;
  metrics: { label: string; value: string; demo: boolean }[];
  severity: CaseNode["severity"];
  origin: string;
  responsible: string | null;
  affected_entity: string;
  source_id: string;
  source_system: string;
  truth_state: string;
}

/**
 * Contrato Mapa Vivo → CORE.
 * Só fatos observados/proveniência atravessam a fronteira. Hipótese, análise de IA,
 * decisão técnica e plano não são carregados pelo Mapa.
 */
export function mapCaseToCoreFacts(item: CaseNode, extra: CaseExtra): CoreCaseFacts {
  return {
    case_id: item.id,
    timestamp: extra.source.collectedAt,
    metrics: item.metrics.map((metric) => ({ ...metric })),
    severity: item.severity,
    origin: item.origin,
    responsible: item.owner ?? extra.problem.owner ?? null,
    affected_entity: extra.problem.entity,
    source_id: extra.source.sourceId,
    source_system: extra.source.sourceSystem,
    truth_state: extra.source.truthState,
  };
}
