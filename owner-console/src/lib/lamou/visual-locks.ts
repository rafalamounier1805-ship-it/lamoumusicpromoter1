import coreOwnerArchitecture from "@/assets/visual-lock/core-owner-architecture.asset.json";
import iconLibrary from "@/assets/visual-lock/icon-library.asset.json";
import mapaVivoOwner from "@/assets/visual-lock/mapa-vivo-owner.asset.json";
import ownerInstallCore from "@/assets/visual-lock/owner-install-core.asset.json";
import ownerInstallIdentity from "@/assets/visual-lock/owner-install-identity.asset.json";
import ownerInstallSettings from "@/assets/visual-lock/owner-install-settings.asset.json";

/**
 * Visual Locks conectados — arquivos de referência recebidos do proprietário e
 * anexados ao projeto como evidência visual (EXTERNAL_EVIDENCE).
 *
 * Regra: Visual Lock é REFERÊNCIA, não componente aprovado. A conformidade da
 * tela contra a referência permanece NOT_VERIFIED até revisão explícita.
 */
export interface VisualLockRef {
  id: string;
  surface: string;
  /** Chave da etapa da instalação (quando aplicável). */
  step?: string;
  caption: string;
  url: string;
  truth: string;
  conformance: string;
}

export const CONNECTED_VISUAL_LOCKS: VisualLockRef[] = [
  {
    id: "VL-OWNER-INSTALL-IDENTITY",
    surface: "Instalação do Proprietário · Identidade",
    step: "identity",
    caption:
      "Light executivo: pergunta-título, obrigatórios × opcionais, prévia do perfil e coluna lateral com o que é necessário agora.",
    url: ownerInstallIdentity.url,
    truth: "EXTERNAL_EVIDENCE",
    conformance: "NOT_VERIFIED",
  },
  {
    id: "VL-OWNER-INSTALL-SETTINGS",
    surface: "Instalação do Proprietário · Configurações",
    step: "settings",
    caption:
      "Cards de idioma, fuso, tema, modo de uso, notificações e preferências; acessibilidade e dados avançados na coluna lateral.",
    url: ownerInstallSettings.url,
    truth: "EXTERNAL_EVIDENCE",
    conformance: "NOT_VERIFIED",
  },
  {
    id: "VL-OWNER-INSTALL-CORE",
    surface: "Instalação do Proprietário · CORE e conexões",
    step: "core",
    caption:
      "Grade de módulos com checagens, resumo da instalação em donut e topologia do ambiente ao redor do CORE.",
    url: ownerInstallCore.url,
    truth: "EXTERNAL_EVIDENCE",
    conformance: "NOT_VERIFIED",
  },
  {
    id: "VL-ICON-LIBRARY",
    surface: "Biblioteca Visual · Marca e componentes",
    caption: "Marca do CORE, variações de ícone, cartões de pessoa e conectores.",
    url: iconLibrary.url,
    truth: "EXTERNAL_EVIDENCE",
    conformance: "NOT_VERIFIED",
  },
  {
    id: "VL-CORE-OWNER-ARCH",
    surface: "CORE Proprietário · Arquitetura",
    caption: "Core Padrão × Core Cubo, famílias do CORE e estados de verdade da integração.",
    url: coreOwnerArchitecture.url,
    truth: "EXTERNAL_EVIDENCE",
    conformance: "NOT_VERIFIED",
  },
  {
    id: "VL-MAPA-VIVO-OWNER",
    surface: "Mapa Vivo · Owner",
    caption: "Nós por área, KPIs inferiores e painel lateral do caso ativo.",
    url: mapaVivoOwner.url,
    truth: "EXTERNAL_EVIDENCE",
    conformance: "NOT_VERIFIED",
  },
];

export function visualLocksForStep(step: string) {
  return CONNECTED_VISUAL_LOCKS.filter((v) => v.step === step);
}
