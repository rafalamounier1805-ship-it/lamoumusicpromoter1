import { LamouCore } from './core-runtime.js';
const core = new LamouCore({
  appId: 'pharmedice-ops360',
  version: '0.3.0-integration',
  product: 'PHARMÉDICE OPS 360',
  environment: 'SIMULATION'
});
window.opsCore = core;
core.audit('core-bootstrap', {environment:'SIMULATION', source:'APP CORE CUSTOM'});
core.emit('core:ready', core.health());
window.dispatchEvent(new CustomEvent('lamou-core-ready', {detail: core.health()}));
