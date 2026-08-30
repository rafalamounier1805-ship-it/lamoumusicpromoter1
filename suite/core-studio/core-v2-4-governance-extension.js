(function(){
'use strict';
const metrics={
 lead_time_ms:{label:'Lead time de atualização',unit:'ms',direction:'lower'},
 rollout_success_pct:{label:'Sucesso de rollout',unit:'%',direction:'higher'},
 rollback_rate_pct:{label:'Taxa de rollback',unit:'%',direction:'lower'},
 skipped_update_count:{label:'Atualizações desnecessárias evitadas',unit:'count',direction:'higher'},
 downtime_ms:{label:'Indisponibilidade',unit:'ms',direction:'lower'},
 backup_success_pct:{label:'Sucesso de backup',unit:'%',direction:'higher'},
 restore_success_pct:{label:'Sucesso de restauração',unit:'%',direction:'higher'},
 protected_assets_count:{label:'Ativos protegidos',unit:'count',direction:'higher'},
 signature_verification_pct:{label:'Assinaturas verificadas',unit:'%',direction:'higher'},
 evidence_completeness_pct:{label:'Completude da evidência',unit:'%',direction:'higher'},
 invalid_signature_rate_pct:{label:'Assinaturas inválidas',unit:'%',direction:'lower'},
 detection_time_ms:{label:'Tempo de detecção',unit:'ms',direction:'lower'},
 efficiency_delta_pct:{label:'Variação de eficiência',unit:'p.p.',direction:'higher'},
 false_positive_rate_pct:{label:'Falso positivo',unit:'%',direction:'lower'},
 media_processing_ms:{label:'Tempo de processamento de mídia',unit:'ms',direction:'lower'},
 media_quality_score:{label:'Qualidade de mídia',unit:'score',direction:'higher'},
 provider_switch_success_pct:{label:'Sucesso de troca de provider',unit:'%',direction:'higher'},
 feedback_response_pct:{label:'Taxa de resposta',unit:'%',direction:'higher'},
 satisfaction_score:{label:'Satisfação',unit:'score',direction:'higher'},
 perceived_security_score:{label:'Segurança percebida',unit:'score',direction:'higher'},
 abandonment_pct:{label:'Abandono',unit:'%',direction:'lower'}
};
Object.assign(window.CORE_METRICS||{},metrics);
const config={
 'CORE-UPD':{contractLock:'LOCKED_CRITICAL_CONTRACT',fastPath:'NEVER_BYPASS',measurableBy:['lead_time_ms','rollout_success_pct','rollback_rate_pct','skipped_update_count','downtime_ms'],data:'Metadados de releases, dependências, apps/clientes impactados, testes e evidências. Não contém segredos de cliente.',source:'V2.4: arquitetura/contrato; runtime ainda não implementado.'},
 'CORE-BKP':{contractLock:'LOCKED_CRITICAL_CONTRACT',fastPath:'NEVER_BYPASS',measurableBy:['rpo_ms','rto_ms','backup_success_pct','restore_success_pct','protected_assets_count'],data:'Inventário de ativos, políticas, recovery points e evidências de restore. Segredos seguem KMS/HSM e nunca plaintext.',source:'V2.4: arquitetura/contrato; complementa CORE-BDR.'},
 'CORE-SIGN':{contractLock:'LOCKED_CRITICAL_CONTRACT',fastPath:'NEVER_BYPASS',measurableBy:['signature_verification_pct','evidence_completeness_pct','invalid_signature_rate_pct','latency_p95_ms'],data:'Hash, identidade, nível de autenticação, timestamp, intenção/consentimento e pacote de evidência; chave privada não é exposta.',source:'V2.4: arquitetura/contrato; validade jurídica depende do caso e configuração.'},
 'CORE-OBS':{contractLock:'STABLE_VERSIONED_CONTRACT',fastPath:'ELIGIBLE_WITH_PASSPORT',measurableBy:['detection_time_ms','rto_ms','error_rate','efficiency_delta_pct','false_positive_rate_pct'],data:'Métricas, logs, traces e correlações. Deve separar fato, correlação, hipótese e causa confirmada.',source:'V2.4: arquitetura/contrato; observabilidade genérica já existe no catálogo.'},
 'CORE-MEDIA':{contractLock:'STABLE_VERSIONED_CONTRACT',fastPath:'CONDITIONAL_WITH_PASSPORT',measurableBy:['media_processing_ms','cost_per_op','media_quality_score','provider_switch_success_pct','bytes_moved'],data:'Mídia e metadados autorizados; política define privacidade, retenção, licença e destino.',source:'V2.4: arquitetura/contrato; providers serão adapters intercambiáveis.'},
 'CORE-FEED':{contractLock:'STABLE_VERSIONED_CONTRACT',fastPath:'CONDITIONAL_WITH_PASSPORT',measurableBy:['feedback_response_pct','satisfaction_score','perceived_security_score','abandonment_pct','accessibility_pass_pct'],data:'Respostas de feedback, contexto mínimo e tendências; pseudonimizar e separar identidade quando possível.',source:'V2.4: arquitetura/contrato; mascote e UX são camada de experiência.'}
};
const existing=new Set((window.CORE_CODES||[]).map(c=>c.code));
for(const raw of (window.CORE_V24_ADDITIONS||[])){
 if(existing.has(raw.code)) continue;
 const x=config[raw.code]||{};
 window.CORE_CODES.push({...raw,relatedDepends:raw.relatedDepends||raw.depends||[],hardDepends:raw.hardDepends||[],contractLock:x.contractLock||raw.contractClass||'STABLE_VERSIONED_CONTRACT',fastPath:x.fastPath||'CONDITIONAL_WITH_PASSPORT',measurableBy:x.measurableBy||[],data:x.data||'Metadados operacionais governados por política.',source:x.source||'V2.4: arquitetura/contrato proposto.',executionRules:['fail_closed_on_unknown_policy','no_silent_data_loss','idempotency_when_retryable','timeout_and_cancellation','observable_state','versioned_contract']});
 existing.add(raw.code);
}
window.CORE_V24={version:'2.4.0-draft',addedCodes:['CORE-UPD','CORE-BKP','CORE-SIGN','CORE-OBS','CORE-MEDIA','CORE-FEED'],status:'DERIVED_NOT_PRODUCTION'};
})();