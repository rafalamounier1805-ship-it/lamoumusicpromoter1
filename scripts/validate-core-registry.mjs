#!/usr/bin/env node
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import process from 'node:process';

const root=process.cwd();
const files=[
  'suite/core-studio/core-code-registry.js',
  'suite/core-studio/core-code-registry-v2-4-additions.js',
  'suite/core-studio/core-governance.js',
  'suite/core-studio/core-v2-4-governance-extension.js'
].map(p=>path.join(root,p));
const versionPolicyPath=path.join(root,'suite/core-version-policy.json');
const manifestPath=path.join(root,'suite/app-core-manifest.json');
const modulesPath=path.join(root,'suite/core-studio/modules.js');
const runtimePath=path.join(root,'suite/core-runtime.js');

const sandbox={window:{},console};
vm.createContext(sandbox);
for(const p of files) vm.runInContext(fs.readFileSync(p,'utf8'),sandbox,{filename:p});

const report=sandbox.window.CORE_GOVERNANCE.validate();
const codes=sandbox.window.CORE_CODES||[];
const known=new Set(codes.map(x=>x.code));
const expectedV24=new Set(['CORE-UPD','CORE-BKP','CORE-SIGN','CORE-OBS','CORE-MEDIA','CORE-FEED']);
const integrationIssues=[];
for(const code of expectedV24) if(!known.has(code)) integrationIssues.push({severity:'ERROR',type:'V24_CODE_NOT_INTEGRATED',code});
if(codes.length!==61) integrationIssues.push({severity:'ERROR',type:'UNEXPECTED_CODE_COUNT',expected:61,actual:codes.length});

const legacyIssues=[];
for(const c of codes){
  for(const d of c.relatedDepends||[]){
    if(d.startsWith('CORE-')&&!known.has(d)) legacyIssues.push({severity:'WARN',code:c.code,type:'LEGACY_RELATED_DEP_NOT_CODE',dep:d});
  }
}
const policy=JSON.parse(fs.readFileSync(versionPolicyPath,'utf8'));
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
const modules=fs.readFileSync(modulesPath,'utf8');
const runtime=fs.readFileSync(runtimePath,'utf8');
const catalogVersion=(modules.match(/CORE_VERSION='([^']+)'/)||[])[1]||null;
const runtimeVersion=(runtime.match(/version:'([^']+)'/)||[])[1]||null;
const actual={manifestVersion:manifest.version,catalogVersion,runtimeVersion};
const versionIssues=[];
for(const k of Object.keys(actual)){
  if(policy[k]!==actual[k]) versionIssues.push({severity:'ERROR',type:'VERSION_POLICY_MISMATCH',field:k,expected:policy[k],actual:actual[k]});
}
if(policy.architectureSpecVersion!==sandbox.window.CORE_GOVERNANCE.version){
  versionIssues.push({severity:'ERROR',type:'GOVERNANCE_VERSION_MISMATCH',expected:policy.architectureSpecVersion,actual:sandbox.window.CORE_GOVERNANCE.version});
}
if(policy.promotionAllowed!==false) versionIssues.push({severity:'ERROR',type:'DERIVED_PROMOTION_MUST_REMAIN_BLOCKED'});

const out={...report,ok:report.ok&&!versionIssues.length&&!integrationIssues.length,legacyIssues,integrationIssues,versionIssues,versionPolicy:policy,actualVersions:actual,governanceVersion:sandbox.window.CORE_GOVERNANCE.version,codeCount:codes.length};
console.log(JSON.stringify(out,null,2));
if(!out.ok) process.exit(1);