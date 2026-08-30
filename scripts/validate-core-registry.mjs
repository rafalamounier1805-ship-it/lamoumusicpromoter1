#!/usr/bin/env node
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import process from 'node:process';

const root=process.cwd();
const registryPath=path.join(root,'suite/core-studio/core-code-registry.js');
const governancePath=path.join(root,'suite/core-studio/core-governance.js');
const versionPolicyPath=path.join(root,'suite/core-version-policy.json');
const manifestPath=path.join(root,'suite/app-core-manifest.json');
const modulesPath=path.join(root,'suite/core-studio/modules.js');
const runtimePath=path.join(root,'suite/core-runtime.js');

const sandbox={window:{},console};
vm.createContext(sandbox);
for(const p of [registryPath,governancePath]) vm.runInContext(fs.readFileSync(p,'utf8'),sandbox,{filename:p});

const report=sandbox.window.CORE_GOVERNANCE.validate();
const codes=sandbox.window.CORE_CODES||[];
const known=new Set(codes.map(x=>x.code));
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
const out={...report,ok:report.ok&&!versionIssues.length,legacyIssues,versionIssues,versionPolicy:policy,actualVersions:actual,governanceVersion:sandbox.window.CORE_GOVERNANCE.version};
console.log(JSON.stringify(out,null,2));
if(!out.ok) process.exit(1);