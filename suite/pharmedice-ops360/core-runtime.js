/** APP CORE CUSTOM — browser runtime, v2.0 */
export class LamouCore {
  constructor(config={}){this.config={appId:'app',version:'2.0.0',...config};this.bus=new EventTarget();this.startedAt=Date.now();}
  on(type,handler){this.bus.addEventListener(type,e=>handler(e.detail));return()=>this.bus.removeEventListener(type,handler)}
  emit(type,detail={}){this.bus.dispatchEvent(new CustomEvent(type,{detail:{...detail,at:new Date().toISOString(),appId:this.config.appId}}))}
  get(key,fallback=null){try{const raw=localStorage.getItem(`${this.config.appId}:${key}`);return raw===null?fallback:JSON.parse(raw)}catch{return fallback}}
  set(key,value){localStorage.setItem(`${this.config.appId}:${key}`,JSON.stringify(value));this.emit('core:persist',{key});return value}
  flag(name,fallback=false){return this.get(`flag:${name}`,fallback)}
  setFlag(name,value){return this.set(`flag:${name}`,!!value)}
  health(){return{ok:true,appId:this.config.appId,version:this.config.version,uptimeMs:Date.now()-this.startedAt,storage:'localStorage',online:navigator.onLine,ts:new Date().toISOString()}}
  audit(action,meta={}){const log=this.get('audit',[]);log.push({action,meta,ts:new Date().toISOString()});this.set('audit',log.slice(-500));return log.at(-1)}
  smoke(){const checks=[['dom',!!document.body],['storage',(()=>{try{localStorage.setItem('__core_test','1');localStorage.removeItem('__core_test');return true}catch{return false}})()],['online-api','onLine' in navigator]];const result={ok:checks.every(c=>c[1]),checks,ts:new Date().toISOString()};this.audit('smoke-test',result);return result}
}
window.LamouCore=LamouCore;
