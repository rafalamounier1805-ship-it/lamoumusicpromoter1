/* LAMOU IA — Product Home loader + CORE 2.1.2 single password reveal control */
(async function loadProductHome(){
  const source='https://raw.githubusercontent.com/rafalamounier1805-ship-it/lamoumusicpromoter1/608804164622a2c3d63fef0230c0cad12e056c7b/suite/product-home.js';
  try{
    const res=await fetch(source,{cache:'no-store'});
    if(!res.ok)throw new Error('Falha ao carregar Product Home');
    const code=await res.text();
    (0,eval)(code);

    const p1=document.querySelector('#setupPassword');
    const p2=document.querySelector('#setupPassword2');
    const login=document.querySelector('#loginPassword');

    /* Cadastro: somente um olho; ele controla senha + confirmação. */
    if(p2){
      const wrap2=p2.closest('.pw-wrap');
      if(wrap2){
        wrap2.querySelector('.pw-eye')?.remove();
        wrap2.parentNode?.insertBefore(p2,wrap2);
        wrap2.remove();
      }
    }
    const setupEye=p1?.closest('.pw-wrap')?.querySelector('.pw-eye');
    if(setupEye){
      setupEye.textContent='👁';
      setupEye.setAttribute('aria-label','Mostrar senhas');
      setupEye.onclick=()=>{
        const show=p1.type==='password';
        p1.type=show?'text':'password';
        if(p2)p2.type=show?'text':'password';
        setupEye.textContent=show?'🙈':'👁';
        setupEye.setAttribute('aria-label',show?'Ocultar senhas':'Mostrar senhas');
      };
    }

    /* Login: garante apenas um controle de visualização. */
    const loginWrap=login?.closest('.pw-wrap');
    if(loginWrap){
      const eyes=[...loginWrap.querySelectorAll('.pw-eye')];
      eyes.slice(1).forEach(x=>x.remove());
    }
  }catch(err){
    console.error('LAMOU Product Home:',err);
  }
})();
