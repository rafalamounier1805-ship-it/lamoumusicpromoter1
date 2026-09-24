import { createServerFn } from "@tanstack/react-start";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Modelos disponíveis pelo provider de IA do ambiente (gateway LAMOU/Lovable AI).
 *  Nenhum modelo fora desta lista é oferecido: CTA só existe com destino real. */
export const CORE_AI_MODELS = [
  { id: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash", provider: "Google (gateway)" },
  { id: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro", provider: "Google (gateway)" },
  {
    id: "google/gemini-2.5-flash-lite",
    label: "Gemini 2.5 Flash Lite",
    provider: "Google (gateway)",
  },
  { id: "openai/gpt-5-mini", label: "GPT-5 Mini", provider: "OpenAI (gateway)" },
] as const;

export interface ProviderCheckResult {
  ok: boolean;
  model: string;
  provider: string;
  latencyMs: number;
  outputChars: number;
  error: string | null;
  checkedAt: string;
}

/** Executa uma chamada REAL ao provider de IA, mede latência e registra evidência.
 *  Falha é registrada como falha — nunca convertida em sucesso simulado. */
export const runProviderCheck = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { model: string; slot?: string }) => {
    const allowed = CORE_AI_MODELS.map((m) => m.id) as readonly string[];
    if (!allowed.includes(input.model)) throw new Error("Modelo não reconhecido pelo CORE.");
    return { model: input.model, slot: input.slot ?? "SLOT-AI-MODEL" };
  })
  .handler(async ({ data, context }): Promise<ProviderCheckResult> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    const meta = CORE_AI_MODELS.find((m) => m.id === data.model)!;
    const started = Date.now();
    let ok = false;
    let outputChars = 0;
    let error: string | null = null;

    if (!apiKey) {
      error = "Credencial do provider ausente no ambiente.";
    } else {
      try {
        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: data.model,
            messages: [
              {
                role: "user",
                content: "Responda apenas: CORE OK",
              },
            ],
            max_completion_tokens: 200,
          }),
        });
        if (!response.ok) {
          error = `Provider respondeu ${response.status}.`;
        } else {
          const json = (await response.json()) as {
            choices?: { message?: { content?: string } }[];
          };
          const text = json.choices?.[0]?.message?.content ?? "";
          outputChars = text.length;
          ok = text.length > 0;
          if (!ok) error = "Provider respondeu sem conteúdo.";
        }
      } catch (cause) {
        error = cause instanceof Error ? cause.message : "Falha de rede ao chamar o provider.";
      }
    }

    const latencyMs = Date.now() - started;

    await context.supabase.from("core_provider_checks").insert({
      owner_id: context.userId,
      slot: data.slot,
      provider: meta.provider,
      model: data.model,
      ok,
      latency_ms: latencyMs,
      output_chars: outputChars,
      error,
    });

    return {
      ok,
      model: data.model,
      provider: meta.provider,
      latencyMs,
      outputChars,
      error,
      checkedAt: new Date().toISOString(),
    };
  });
