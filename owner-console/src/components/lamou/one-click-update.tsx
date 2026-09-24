import { Download, RefreshCw, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type UpdateState =
  | "IDLE"
  | "CHECKING"
  | "DOWNLOADING"
  | "VERIFYING"
  | "BACKUP"
  | "INSTALLING"
  | "RESTARTING"
  | "LAUNCHER_REQUIRED"
  | "DONE"
  | "ERROR";

interface NativeUpdateBridge {
  update: (request: {
    targetVersion: string;
    candidate: string;
    requireSha256: boolean;
    createRestorePoint: boolean;
    restartAfterInstall: boolean;
  }) => Promise<{ ok: boolean; message?: string }>;
}

function nativeBridge(): NativeUpdateBridge | null {
  if (typeof window === "undefined") return null;
  const candidate = (window as unknown as { lamouUpdater?: NativeUpdateBridge }).lamouUpdater;
  return candidate?.update ? candidate : null;
}

const LABEL: Record<UpdateState, string> = {
  IDLE: "Atualizar agora",
  CHECKING: "Verificando atualização…",
  DOWNLOADING: "Baixando em segundo plano…",
  VERIFYING: "Verificando integridade…",
  BACKUP: "Criando ponto de restauração…",
  INSTALLING: "Instalando…",
  RESTARTING: "Reabrindo…",
  LAUNCHER_REQUIRED: "Launcher necessário",
  DONE: "Atualizado",
  ERROR: "Tentar novamente",
};

export function OneClickUpdate({
  targetVersion,
  candidate,
}: {
  targetVersion: string;
  candidate: string;
}) {
  const [state, setState] = useState<UpdateState>("IDLE");
  const [detail, setDetail] = useState(
    "Um clique: download em segundo plano, hash, backup, instalação e reabertura.",
  );

  async function run() {
    const bridge = nativeBridge();
    if (!bridge) {
      setState("LAUNCHER_REQUIRED");
      setDetail(
        "O navegador não pode instalar software silenciosamente. Abra esta mesma candidata pelo LAMOU Launcher; ali o botão executa todo o fluxo sem ZIP ou escolha manual de arquivo.",
      );
      return;
    }

    try {
      setState("CHECKING");
      setDetail("Confirmando a candidata e o manifesto de atualização.");
      await new Promise((resolve) => setTimeout(resolve, 120));

      setState("DOWNLOADING");
      setDetail("Pacote sendo obtido em segundo plano pelo launcher.");

      const result = await bridge.update({
        targetVersion,
        candidate,
        requireSha256: true,
        createRestorePoint: true,
        restartAfterInstall: true,
      });

      if (!result.ok) throw new Error(result.message || "Falha na atualização.");

      setState("DONE");
      setDetail("Atualização concluída pelo launcher com verificação e restauração disponíveis.");
    } catch (error) {
      setState("ERROR");
      setDetail(error instanceof Error ? error.message : "Falha não identificada.");
    }
  }

  return (
    <section className="rounded-xl border border-primary/30 bg-primary/5 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-display text-sm font-semibold">Atualização automática</p>
            <Badge variant="outline">{targetVersion}</Badge>
            <Badge variant="outline">ONE-CLICK</Badge>
          </div>
          <p className="mt-1 max-w-2xl text-xs text-muted-foreground">{detail}</p>
        </div>
        <Button size="sm" onClick={() => void run()} disabled={!["IDLE", "ERROR"].includes(state)}>
          {state === "IDLE" || state === "ERROR" ? (
            <Download className="h-4 w-4" aria-hidden="true" />
          ) : (
            <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
          )}
          {LABEL[state]}
        </Button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <ShieldCheck className="h-3 w-3" aria-hidden="true" /> SHA-256 obrigatório
        </span>
        <span>backup/restore point antes de instalar</span>
        <span>rollback se falhar</span>
        <span>reabertura automática</span>
      </div>
    </section>
  );
}
