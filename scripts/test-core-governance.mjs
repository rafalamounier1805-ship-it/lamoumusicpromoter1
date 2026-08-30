#!/usr/bin/env node
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import path from 'node:path';

const root=process.cwd(),sandbox={window:{},console};
vm.createContext(sandbox);
for(const rel of [
  'suite/core-studio/core-code-registry.js',
  'suite/core-studio/core-code-registry-v2-4-additions.js',
  'suite/core-studio/core-governance.js',
  'suite/core-studio/core-v2-4-governance-extension.js'
]){
  vm.runInContext(fs.readFileSync(path.join(root,rel),'utf8'),sandbox,{filename:rel});
}
const W=sandbox.window;
assert.equal(W.CORE_GOVERNANCE.validate().ok,true,'registry governance should be valid');
assert.equal(W.CORE_CODES.length,61,'V2.4 must govern 61 CORE codes');
for(const code of ['CORE-UPD','CORE-BKP','CORE-SIGN','CORE-OBS','CORE-MEDIA','CORE-FEED']) assert.ok(W.CORE_CODES.some(c=>c.code===code),`${code} must be integrated`);

const exp=new Date(Date.now()+60000).toISOString();
const passport={valid:true,code:'CORE-INDEX',policyVersion:'p1',subject:'u1',tenant:'t1',expiresAt:exp};
let r=W.CORE_FAST_PATH.canUse('CORE-INDEX',{policyVersion:'p1',subject:'u1',tenant:'t1',risk:'LOW',dataClass:'OPERATIONAL',action:'read_fragment'},passport);
assert.equal(r.allow,true,'low-risk indexed read should be fast-path eligible');

r=W.CORE_FAST_PATH.canUse('CORE-KMS',{policyVersion:'p1',subject:'u1',tenant:'t1',risk:'LOW',dataClass:'OPERATIONAL',action:'read'}, {...passport,code:'CORE-KMS'});
assert.equal(r.allow,false,'KMS must never bypass');

r=W.CORE_FAST_PATH.canUse('CORE-SIGN',{policyVersion:'p1',subject:'u1',tenant:'t1',risk:'LOW',dataClass:'OPERATIONAL',action:'read'}, {...passport,code:'CORE-SIGN'});
assert.equal(r.allow,false,'CORE-SIGN must never use Fast Path');
r=W.CORE_FAST_PATH.canUse('CORE-UPD',{policyVersion:'p1',subject:'u1',tenant:'t1',risk:'LOW',dataClass:'OPERATIONAL',action:'read'}, {...passport,code:'CORE-UPD'});
assert.equal(r.allow,false,'CORE-UPD release decision must never bypass gates');
r=W.CORE_FAST_PATH.canUse('CORE-BKP',{policyVersion:'p1',subject:'u1',tenant:'t1',risk:'LOW',dataClass:'OPERATIONAL',action:'read'}, {...passport,code:'CORE-BKP'});
assert.equal(r.allow,false,'CORE-BKP recovery must never bypass gates');

r=W.CORE_FAST_PATH.canUse('CORE-OBS',{policyVersion:'p1',subject:'u1',tenant:'t1',risk:'LOW',dataClass:'OPERATIONAL',action:'read_metrics'}, {...passport,code:'CORE-OBS'});
assert.equal(r.allow,true,'CORE-OBS may reuse stable low-risk baselines with passport');
r=W.CORE_FAST_PATH.canUse('CORE-OBS',{policyVersion:'p2',subject:'u1',tenant:'t1',risk:'LOW',dataClass:'OPERATIONAL',action:'read_metrics'}, {...passport,code:'CORE-OBS'});
assert.equal(r.allow,false,'policy version change invalidates CORE-OBS passport');

r=W.CORE_FAST_PATH.canUse('CORE-INDEX',{policyVersion:'p1',subject:'u1',tenant:'t1',risk:'HIGH',dataClass:'OPERATIONAL',action:'read_fragment'},passport);
assert.equal(r.allow,false,'high risk invalidates fast path');

const g=W.CORE_BENEFITS.gain(1000,400,'lower');
assert.equal(g.gainPct,60,'latency gain formula');
const report=W.CORE_BENEFITS.report({user_wait_ms:1000,bytes_moved:1000000},{user_wait_ms:400,bytes_moved:250000},100);
assert.equal(report.timeSavedMs,60000);
assert.equal(report.bytesSaved,75000000);

const sign=W.CORE_CODES.find(c=>c.code==='CORE-SIGN');
assert.equal(sign.contractLock,'LOCKED_CRITICAL_CONTRACT');
assert.ok(sign.measurableBy.includes('signature_verification_pct'));

console.log(JSON.stringify({ok:true,tests:16,codeCount:W.CORE_CODES.length,governanceVersion:W.CORE_GOVERNANCE.version},null,2));