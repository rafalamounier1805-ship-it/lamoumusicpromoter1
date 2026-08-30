#!/usr/bin/env node
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import path from 'node:path';

const root=process.cwd(),sandbox={window:{},console};
vm.createContext(sandbox);
for(const rel of ['suite/core-studio/core-code-registry.js','suite/core-studio/core-governance.js']){
  vm.runInContext(fs.readFileSync(path.join(root,rel),'utf8'),sandbox,{filename:rel});
}
const W=sandbox.window;
assert.equal(W.CORE_GOVERNANCE.validate().ok,true,'registry governance should be valid');

const exp=new Date(Date.now()+60000).toISOString();
const passport={valid:true,code:'CORE-INDEX',policyVersion:'p1',subject:'u1',tenant:'t1',expiresAt:exp};
let r=W.CORE_FAST_PATH.canUse('CORE-INDEX',{policyVersion:'p1',subject:'u1',tenant:'t1',risk:'LOW',dataClass:'OPERATIONAL',action:'read_fragment'},passport);
assert.equal(r.allow,true,'low-risk indexed read should be fast-path eligible');

r=W.CORE_FAST_PATH.canUse('CORE-KMS',{policyVersion:'p1',subject:'u1',tenant:'t1',risk:'LOW',dataClass:'OPERATIONAL',action:'read'}, {...passport,code:'CORE-KMS'});
assert.equal(r.allow,false,'KMS must never bypass');

r=W.CORE_FAST_PATH.canUse('CORE-INDEX',{policyVersion:'p2',subject:'u1',tenant:'t1',risk:'LOW',dataClass:'OPERATIONAL',action:'read_fragment'},passport);
assert.equal(r.allow,false,'policy version change invalidates passport');

r=W.CORE_FAST_PATH.canUse('CORE-INDEX',{policyVersion:'p1',subject:'u1',tenant:'t1',risk:'HIGH',dataClass:'OPERATIONAL',action:'read_fragment'},passport);
assert.equal(r.allow,false,'high risk invalidates fast path');

const g=W.CORE_BENEFITS.gain(1000,400,'lower');
assert.equal(g.gainPct,60,'latency gain formula');
const report=W.CORE_BENEFITS.report({user_wait_ms:1000,bytes_moved:1000000},{user_wait_ms:400,bytes_moved:250000},100);
assert.equal(report.timeSavedMs,60000);
assert.equal(report.bytesSaved,75000000);

console.log(JSON.stringify({ok:true,tests:6,codeCount:W.CORE_CODES.length},null,2));