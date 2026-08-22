const EPS=1e-12;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const db=v=>20*Math.log10(Math.max(EPS,v));
const dbPower=v=>10*Math.log10(Math.max(EPS,v));
const pct=(arr,p)=>{if(!arr.length)return 0;const a=[...arr].sort((x,y)=>x-y);return a[Math.min(a.length-1,Math.max(0,Math.floor((a.length-1)*p)))]};

function monoSample(audio,maxPoints=900000){
  const len=audio.length, ch=audio.numberOfChannels, step=Math.max(1,Math.ceil(len/maxPoints));
  const out=new Float32Array(Math.ceil(len/step)); let k=0;
  for(let i=0;i<len;i+=step){let s=0;for(let c=0;c<ch;c++)s+=audio.getChannelData(c)[i]||0;out[k++]=s/ch}
  return {data:out.subarray(0,k),rate:audio.sampleRate/step,step};
}

function basicSignal(audio){
  const len=audio.length,ch=audio.numberOfChannels,step=Math.max(1,Math.ceil(len/1200000));
  let sum2=0,sum=0,peak=0,clip=0,n=0,truePeak=0;
  for(let c=0;c<ch;c++){
    const d=audio.getChannelData(c);
    for(let i=0;i<len;i+=step){const x=d[i]||0;sum+=x;sum2+=x*x;peak=Math.max(peak,Math.abs(x));if(Math.abs(x)>=.999)clip++;n++}
    const tstep=Math.max(1,Math.ceil(len/350000));
    for(let i=1;i<len-2;i+=tstep){const p0=d[i-1],p1=d[i],p2=d[i+1],p3=d[i+2];truePeak=Math.max(truePeak,Math.abs(p1),Math.abs(p2));for(const t of [.25,.5,.75]){const t2=t*t,t3=t2*t;const y=.5*((2*p1)+(-p0+p2)*t+(2*p0-5*p1+4*p2-p3)*t2+(-p0+3*p1-3*p2+p3)*t3);truePeak=Math.max(truePeak,Math.abs(y))}}
  }
  const rms=Math.sqrt(sum2/Math.max(1,n)),mean=sum/Math.max(1,n);
  return {peakDb:db(peak),truePeakApproxDb:db(Math.max(truePeak,peak)),rmsDb:db(rms),crestDb:db(Math.max(peak,EPS)/Math.max(rms,EPS)),clippingPct:n?clip/n*100:0,dcOffset:mean};
}

function dynamics(mono){
  const {data,rate}=mono,win=Math.max(32,Math.round(rate*.4)),hop=Math.max(16,Math.round(win*.25));
  const vals=[];for(let s=0;s+win<data.length;s+=hop){let ss=0;for(let i=s;i<s+win;i++)ss+=data[i]*data[i];vals.push(db(Math.sqrt(ss/win)))}
  const active=vals.filter(v=>v>-60);const p10=pct(active,.1),p50=pct(active,.5),p90=pct(active,.9);
  return {dynamicDb:Math.max(0,p90-p10),shortTermMedianDb:p50,shortTermRangeDb:Math.max(0,pct(active,.95)-pct(active,.05)),blocks:active};
}

function silenceMetrics(mono){
  const {data,rate}=mono,thr=Math.pow(10,-50/20),hold=Math.max(1,Math.round(rate*.08));
  let first=0,last=data.length-1,run=0;
  for(let i=0;i<data.length;i++){run=Math.abs(data[i])>thr?run+1:0;if(run>=hold){first=Math.max(0,i-hold+1);break}}
  run=0;for(let i=data.length-1;i>=0;i--){run=Math.abs(data[i])>thr?run+1:0;if(run>=hold){last=Math.min(data.length-1,i+hold-1);break}}
  return {headSilenceSec:first/rate,tailSilenceSec:Math.max(0,(data.length-1-last)/rate)};
}

function stereoMetrics(audio){
  if(audio.numberOfChannels<2)return {available:false,correlation:null,width:null,sideRatioDb:null};
  const l=audio.getChannelData(0),r=audio.getChannelData(1),step=Math.max(1,Math.ceil(audio.length/500000));
  let lr=0,l2=0,r2=0,mid2=0,side2=0,n=0;
  for(let i=0;i<audio.length;i+=step){const a=l[i]||0,b=r[i]||0;lr+=a*b;l2+=a*a;r2+=b*b;const m=(a+b)*.5,s=(a-b)*.5;mid2+=m*m;side2+=s*s;n++}
  const corr=lr/Math.sqrt(Math.max(EPS,l2*r2));const ratio=Math.sqrt(side2/Math.max(EPS,mid2));
  return {available:true,correlation:clamp(corr,-1,1),width:clamp(ratio*100,0,200),sideRatioDb:db(ratio)};
}

function fftRadix2(re,im){
  const n=re.length;for(let i=1,j=0;i<n;i++){let bit=n>>1;for(;j&bit;bit>>=1)j^=bit;j^=bit;if(i<j){[re[i],re[j]]=[re[j],re[i]];[im[i],im[j]]=[im[j],im[i]]}}
  for(let len=2;len<=n;len<<=1){const ang=-2*Math.PI/len,wlr=Math.cos(ang),wli=Math.sin(ang);for(let i=0;i<n;i+=len){let wr=1,wi=0;for(let j=0;j<len/2;j++){const uR=re[i+j],uI=im[i+j],vR=re[i+j+len/2]*wr-im[i+j+len/2]*wi,vI=re[i+j+len/2]*wi+im[i+j+len/2]*wr;re[i+j]=uR+vR;im[i+j]=uI+vI;re[i+j+len/2]=uR-vR;im[i+j+len/2]=uI-vI;const nw=wr*wlr-wi*wli;wi=wr*wli+wi*wlr;wr=nw}}}}
function spectralFrame(data,start,n,rate){
  const re=new Float64Array(n),im=new Float64Array(n);for(let i=0;i<n;i++){const x=data[start+i]||0;re[i]=x*(.5-.5*Math.cos(2*Math.PI*i/(n-1)))}fftRadix2(re,im);
  const mags=new Float64Array(n/2);let total=0,weighted=0,geo=0,maxMag=0;for(let k=1;k<n/2;k++){const m=Math.hypot(re[k],im[k])+EPS;mags[k]=m;const f=k*rate/n;total+=m;weighted+=m*f;geo+=Math.log(m);maxMag=Math.max(maxMag,m)}
  let low=0,mid=0,high=0,cum=0,roll=0;for(let k=1;k<n/2;k++){const f=k*rate/n,m=mags[k];if(f<200)low+=m*m;else if(f<4000)mid+=m*m;else high+=m*m;cum+=m;if(!roll&&cum>=total*.85)roll=f}
  const bins=n/2-1,arith=total/Math.max(1,bins),flat=Math.exp(geo/Math.max(1,bins))/Math.max(EPS,arith);
  return {centroidHz:weighted/Math.max(EPS,total),rolloff85Hz:roll,low,mid,high,flatness:flat,mags};
}
function spectralMetrics(mono){
  const {data,rate}=mono;let n=4096;while(n>data.length&&n>512)n>>=1;if(n<512)return {available:false};
  const frames=Math.min(16,Math.max(4,Math.floor(data.length/n))),acc={centroid:0,roll:0,low:0,mid:0,high:0,flat:0},chroma=new Float64Array(12);let used=0;
  for(let f=0;f<frames;f++){const start=Math.floor((data.length-n)*(f+.5)/frames),s=spectralFrame(data,start,n,rate);acc.centroid+=s.centroidHz;acc.roll+=s.rolloff85Hz;acc.low+=s.low;acc.mid+=s.mid;acc.high+=s.high;acc.flat+=s.flatness;used++;for(let k=1;k<s.mags.length;k++){const hz=k*rate/n;if(hz<55||hz>5000)continue;const midi=Math.round(69+12*Math.log2(hz/440)),pc=((midi%12)+12)%12;chroma[pc]+=s.mags[k]}}
  const energy=acc.low+acc.mid+acc.high||1;const lowPct=acc.low/energy*100,midPct=acc.mid/energy*100,highPct=acc.high/energy*100;
  const key=estimateKey(chroma);
  return {available:true,centroidHz:acc.centroid/used,rolloff85Hz:acc.roll/used,lowPct,midPct,highPct,flatness:acc.flat/used,brightness:clamp((acc.centroid/used)/5000*100,0,100),key};
}
function estimateKey(chroma){
  const major=[6.35,2.23,3.48,2.33,4.38,4.09,2.52,5.19,2.39,3.66,2.29,2.88],minor=[6.33,2.68,3.52,5.38,2.60,3.53,2.54,4.75,3.98,2.69,3.34,3.17],names=['C','C♯/D♭','D','D♯/E♭','E','F','F♯/G♭','G','G♯/A♭','A','A♯/B♭','B'];
  const norm=Math.sqrt(chroma.reduce((a,x)=>a+x*x,0))||1;const c=[...chroma].map(x=>x/norm),scores=[];for(let root=0;root<12;root++){for(const [mode,prof] of [['maior',major],['menor',minor]]){let dot=0,pn=0;for(let i=0;i<12;i++){const p=prof[(i-root+12)%12];dot+=c[i]*p;pn+=p*p}scores.push({root,mode,score:dot/Math.sqrt(pn)})}}
  scores.sort((a,b)=>b.score-a.score);const best=scores[0],second=scores[1],confidence=clamp((best.score-second.score)/Math.max(.001,best.score)*100*4,0,100);return {label:`${names[best.root]} ${best.mode}`,confidence,score:best.score};
}

function tempoMetrics(mono){
  const {data,rate}=mono;if(data.length<rate*10)return {bpm:null,confidence:0,stability:null};
  const frame=Math.max(64,Math.round(rate*.02)),hop=frame,en=[];for(let s=0;s+frame<data.length;s+=hop){let v=0;for(let i=s;i<s+frame;i++)v+=Math.abs(data[i]);en.push(v/frame)}
  const onset=new Float64Array(en.length);let mean=0;for(let i=1;i<en.length;i++){onset[i]=Math.max(0,en[i]-en[i-1]);mean+=onset[i]}mean/=Math.max(1,onset.length);for(let i=0;i<onset.length;i++)onset[i]=Math.max(0,onset[i]-mean*.35);
  const fps=rate/hop;let best={bpm:0,corr:-1,lag:0},second=-1;for(let bpm=70;bpm<=180;bpm++){const lag=Math.round(fps*60/bpm);let num=0,a2=0,b2=0;for(let i=lag;i<onset.length;i++){const a=onset[i],b=onset[i-lag];num+=a*b;a2+=a*a;b2+=b*b}const corr=num/Math.sqrt(Math.max(EPS,a2*b2));if(corr>best.corr){second=best.corr;best={bpm,corr,lag}}else if(corr>second)second=corr}
  const conf=clamp((best.corr-Math.max(0,second))*250+best.corr*45,0,100);
  const peaks=[];const minGap=Math.max(1,Math.round(best.lag*.45));let last=-minGap;for(let i=1;i<onset.length-1;i++){if(onset[i]>onset[i-1]&&onset[i]>=onset[i+1]&&onset[i]>mean*1.8&&i-last>=minGap){peaks.push(i);last=i}}
  const intervals=[];for(let i=1;i<peaks.length;i++){const d=peaks[i]-peaks[i-1];if(d>best.lag*.45&&d<best.lag*1.55)intervals.push(d)}const im=intervals.reduce((a,x)=>a+x,0)/Math.max(1,intervals.length),sd=Math.sqrt(intervals.reduce((a,x)=>a+(x-im)**2,0)/Math.max(1,intervals.length));const stability=intervals.length>3?clamp(100-(sd/Math.max(1,im))*180,0,100):null;
  return {bpm:best.bpm,confidence:conf,stability,autocorr:best.corr};
}

function structureMetrics(mono){
  const {data,rate}=mono,segments=12,vals=[];for(let s=0;s<segments;s++){const a=Math.floor(data.length*s/segments),b=Math.floor(data.length*(s+1)/segments);let ss=0,n=0;for(let i=a;i<b;i+=Math.max(1,Math.floor((b-a)/12000))){ss+=data[i]*data[i];n++}vals.push(db(Math.sqrt(ss/Math.max(1,n))))}
  const min=Math.min(...vals),max=Math.max(...vals),norm=vals.map(v=>clamp((v-min)/Math.max(.5,max-min)*100,0,100));let novelty=0;for(let i=1;i<vals.length;i++)novelty+=Math.abs(vals[i]-vals[i-1]);novelty/=Math.max(1,vals.length-1);
  return {energySegments:norm,energyDbSegments:vals,contrastDb:max-min,noveltyDb:novelty,sectionChanges:vals.slice(1).filter((v,i)=>Math.abs(v-vals[i])>3).length};
}

function loudnessApprox(mono){
  const {data,rate}=mono;if(data.length<100)return {lufs:null,confidence:'baixa'};
  const b1=[1.53512485958697,-2.69169618940638,1.19839281085285],a1=[1,-1.69065929318241,0.73248077421585];
  const b2=[1,-2,1],a2=[1,-1.99004745483398,0.99007225036621];
  let x1=0,x2=0,y1=0,y2=0,u1=0,u2=0,v1=0,v2=0;const weighted=new Float32Array(data.length);
  for(let i=0;i<data.length;i++){const x=data[i];const y=b1[0]*x+b1[1]*x1+b1[2]*x2-a1[1]*y1-a1[2]*y2;x2=x1;x1=x;y2=y1;y1=y;const v=b2[0]*y+b2[1]*u1+b2[2]*u2-a2[1]*v1-a2[2]*v2;u2=u1;u1=y;v2=v1;v1=v;weighted[i]=v}
  const win=Math.max(32,Math.round(rate*.4)),hop=Math.max(16,Math.round(rate*.1)),blocks=[];for(let s=0;s+win<weighted.length;s+=hop){let p=0;for(let i=s;i<s+win;i++)p+=weighted[i]*weighted[i];p/=win;blocks.push({p,l:-.691+dbPower(p)})}
  let gated=blocks.filter(x=>x.l>-70);if(!gated.length)return {lufs:-70,confidence:'baixa'};let mean=gated.reduce((a,x)=>a+x.p,0)/gated.length,rel=-.691+dbPower(mean)-10;gated=gated.filter(x=>x.l>rel);mean=gated.reduce((a,x)=>a+x.p,0)/Math.max(1,gated.length);return {lufs:-.691+dbPower(mean),confidence:(rate>40000&&rate<50000)?'média':'baixa'};
}

function technicalScores(m){
  const master=clamp(100-(m.clippingPct>.01?28:m.clippingPct>0?8:0)-(m.truePeakApproxDb>0?18:m.truePeakApproxDb>-.2?7:0)-(m.lufsApprox>-6?18:m.lufsApprox>-8?9:m.lufsApprox<-25?8:0)-(m.crestDb<4?14:m.crestDb<6?6:0),0,100);
  const tonal=Math.abs(m.lowPct-28)*.35+Math.abs(m.midPct-57)*.22+Math.abs(m.highPct-15)*.35;
  const stereoPenalty=m.stereoAvailable?(m.stereoCorrelation<-.2?24:m.stereoCorrelation<0?12:0)+(m.stereoWidth>140?10:0):3;
  const mix=clamp(96-tonal-stereoPenalty-Math.min(12,Math.abs(m.dcOffset)*1600),0,100);
  const production=clamp(92-Math.max(0,m.flatness-.45)*35-Math.max(0,(1800-m.centroidHz)/120)-Math.max(0,(m.centroidHz-6000)/220),0,100);
  const structure=clamp(72+m.structureContrastDb*2.1+m.structureNoveltyDb*1.2-Math.max(0,m.headSilenceSec-2)*3-Math.max(0,m.tailSilenceSec-4)*2,0,100);
  const dur=m.duration,replay=clamp(92-(dur<75?(75-dur)*.22:dur>360?(dur-360)*.05:0),55,100);
  const weights={structure:10,production:10,mix:12,mastering:8,replay:5},sum=45;
  const partial=Math.round((structure*10+production*10+mix*12+master*8+replay*5)/sum);
  const signal=Math.round(clamp(partial*.72+master*.28,0,100));
  return {partialTqs:partial,coveragePct:45,signalReadiness:signal,subscores:{structure:Math.round(structure),production:Math.round(production),mix:Math.round(mix),mastering:Math.round(master),replay:Math.round(replay)},weights};
}

export async function analyzeDeepAudio(audio){
  const mono=monoSample(audio),basic=basicSignal(audio),dyn=dynamics(mono),sil=silenceMetrics(mono),st=stereoMetrics(audio),spec=spectralMetrics(mono),tempo=tempoMetrics(mono),structure=structureMetrics(mono),loud=loudnessApprox(mono);
  const m={duration:audio.duration,channels:audio.numberOfChannels,sampleRate:audio.sampleRate,...basic,...dyn,...sil,stereoAvailable:st.available,stereoCorrelation:st.correlation,stereoWidth:st.width,sideRatioDb:st.sideRatioDb,centroidHz:spec.centroidHz||0,rolloff85Hz:spec.rolloff85Hz||0,lowPct:spec.lowPct||0,midPct:spec.midPct||0,highPct:spec.highPct||0,flatness:spec.flatness||0,brightness:spec.brightness||0,key:spec.key||null,bpm:tempo.bpm,bpmConfidence:tempo.confidence,tempoStability:tempo.stability,structureContrastDb:structure.contrastDb,structureNoveltyDb:structure.noveltyDb,sectionChanges:structure.sectionChanges,energySegments:structure.energySegments,lufsApprox:loud.lufs,lufsConfidence:loud.confidence};
  return {...m,...technicalScores(m)};
}

export function deterministicInterpretation(m){
  const positives=[],alerts=[];
  if(m.clippingPct===0)positives.push('nenhum clipping amostrado');else alerts.push(`clipping amostrado em ${m.clippingPct.toFixed(4)}%`);
  if(m.truePeakApproxDb<=-.2)positives.push('folga de pico aceitável');else alerts.push('pico intersample aproximado muito próximo de 0 dBFS');
  if(m.crestDb>=6&&m.crestDb<=16)positives.push('relação pico/RMS equilibrada');else if(m.crestDb<6)alerts.push('crest factor baixo, compatível com compressão intensa');
  if(m.dynamicDb>=5&&m.dynamicDb<=16)positives.push('variação dinâmica moderada');else if(m.dynamicDb<5)alerts.push('variação dinâmica curta');
  if(m.stereoAvailable&&m.stereoCorrelation<0)alerts.push('correlação estéreo negativa em parte do sinal pode exigir checagem de fase');
  if(m.headSilenceSec>2)alerts.push('silêncio inicial acima de 2 s');
  return `${positives.length?'Pontos favoráveis: '+positives.join(', ')+'. ':''}${alerts.length?'Atenções: '+alerts.join(', ')+'. ':''}A leitura descreve o master e não substitui avaliação de composição, letra, hook ou interpretação vocal.`;
}
