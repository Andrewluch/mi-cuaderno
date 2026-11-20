'use strict';
/* Mi Cuaderno · versión 1
   Todo se guarda en este dispositivo (localStorage). Botón de copia de seguridad en Más. */

const ICONS={
  hoy:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  libros:'<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 21V5"/>',
  calendario:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  deporte:'<path d="M13 4a2 2 0 1 0 0 .01M9 21l2-6 3 3v3M7 12l3-4 4 1 3 4M11 15l-2-3"/>',
  idiomas:'<path d="M4 5h16v11H10l-5 4v-4H4z"/><path d="M8 9.5h8M8 12.5h5"/>',
  notas:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8l1.5 1.5L12 7M8 14l1.5 1.5L12 13M14 8.5h3M14 14.5h3"/>',
  mas:'<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>',
  tarea:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12l3 3 5-6"/>',
  evento:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M12 13v5M9.5 15.5h5"/>',
  libro:'<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 21V5"/>',
  recurso:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  frase:'<path d="M7 7h4v4c0 3-1.5 5-4 6M14 7h4v4c0 3-1.5 5-4 6"/>',
  lista:'<path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/>',
  peso:'<path d="M5 7h14l-1.5 13h-11z"/><path d="M9 11a3 3 0 0 1 6 0"/>',
  run:'<path d="M13 4a2 2 0 1 0 0 .01M9 21l2-6 3 3v3M7 12l3-4 4 1 3 4"/>',
  gym:'<path d="M3 10v4M6 7v10M18 7v10M21 10v4M6 12h12"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  news:'<path d="M4 5h13v14H6a2 2 0 0 1-2-2zM17 9h3v8a2 2 0 0 1-2 2"/><path d="M7 9h7M7 12h7M7 15h4"/>',
  backup:'<path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',
  left:'<path d="M15 5l-7 7 7 7"/>', right:'<path d="M9 5l7 7-7 7"/>'
};
const svg=(k,w=2)=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[k]}</svg>`;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const info=t=>`<div class="info">${svg('info')}<span>${t}</span></div>`;
const href=u=>esc(/^https?:\/\//i.test(u)?u:'https://'+u);
const host=u=>{try{return new URL(/^https?:\/\//i.test(u)?u:'https://'+u).hostname.replace(/^www\./,'')}catch(_){return ''}};
const looksUrl=s=>/^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(s.trim());

const DIAS=['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
const DIAS_L=['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
const MESES=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
let today=new Date(); today.setHours(0,0,0,0);
const addDays=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
const key=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const fromKey=k=>{const [y,m,d]=k.split('-').map(Number);return new Date(y,m-1,d)};
const cap=s=>s?s[0].toUpperCase()+s.slice(1):s;
const kg=v=>Number(v).toFixed(1).replace('.',',');
const shortDate=k=>{const d=fromKey(k);return `${d.getDate()} ${MESES[d.getMonth()].slice(0,3)}`};
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const monday=d=>addDays(d,-((d.getDay()+6)%7));

/* ---------- Datos ---------- */
const KEY='mi-cuaderno:v1';
function fresh(){return {v:1,start:key(today),books:[],quotes:[],resources:[],events:[],
  lists:[{id:uid(),t:'Cosas por hacer',items:[]},{id:uid(),t:'Lista de la compra',items:[]}],
  sport:{plan:{},log:{},acts:[],done:{}},weights:[],weightGoal:null,
  lang:{ingles:{days:[],h:'17:00',url:'https://preply.com/es/',homework:[],materials:[],vocab:[]},
        euskera:{days:[],h:'19:00',url:'',homework:[],materials:[],vocab:[]}}}}
function load(){
  let d=null; try{d=JSON.parse(localStorage.getItem(KEY)||'null')}catch(_){}
  return normalize(d);
}
function normalize(d){
  const f=fresh(); if(!d||typeof d!=='object'||d.v!==1)return f;
  for(const k in f)if(d[k]===undefined||d[k]===null&&k!=='weightGoal')d[k]=f[k];
  d.lang=d.lang||{}; for(const l of ['ingles','euskera'])d.lang[l]={...f.lang[l],...(d.lang[l]||{})};
  d.sport={plan:{},log:{},acts:[],done:{},...d.sport};
  return d;
}
let warned=false;
function save(){try{localStorage.setItem(KEY,JSON.stringify(db))}catch(_){if(!warned){warned=true;toast('No se ha podido guardar en este dispositivo')}}}
let db=load();
try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(_){}

const ui={entrenos:null,news:null,newsSec:'Todas',tab:'hoy',libSeg:'libros',resTag:'Todos',langSeg:'ingles',flipped:new Set(),calOff:0,calSel:key(today),sportOff:0,addType:'tarea',addDate:null};

/* ---------- Deporte y agenda ---------- */
const SPORT={run:{n:'Correr',c:'var(--s-run)'},gym:{n:'Fuerza',c:'var(--s-gym)'}};
const evs=()=>ui.entrenos&&ui.entrenos.items||[];
const isDone=e=>db.sport.done[e.id]===true||(db.sport.done[e.id]!==false&&e.date<=key(today)&&db.sport.log[e.date]===e.k);
function sportFor(d){
  const k=key(d),E=evs().filter(e=>e.date===k);
  if(E.length)return E.map(e=>({h:e.h,t:e.t,done:isDone(e)}));
  const log=db.sport.log[k]; return log?[{h:'',t:(db.sport.acts.find(a=>a.date===k&&a.k===log)||{}).name||SPORT[log].n,done:true}]:[];
}
function weekStats(){const m=key(monday(today)),e=key(addDays(monday(today),6));
  const E=evs().filter(x=>x.date>=m&&x.date<=e);
  if(E.length)return {planned:E.length,done:E.filter(isDone).length};
  let done=0;for(let i=0;i<7;i++)if(db.sport.log[key(addDays(monday(today),i))])done++;return {planned:done,done};}
const CAT={plan:{n:'Planes',c:'var(--k-plan)'},deporte:{n:'Deporte',c:'var(--k-sport)'},idiomas:{n:'Idiomas',c:'var(--k-lang)'},tarea:{n:'Tareas',c:'var(--k-task)'}};
const LANG={ingles:'Inglés · Preply',euskera:'Euskera · EOI'};
function itemsFor(d){
  const k=key(d),out=db.events.filter(e=>e.date===k).map(e=>({h:e.h||'',t:e.t,cat:e.cat,id:e.id}));
  for(const w of sportFor(d))out.push({h:w.h,t:w.t+(w.done?' ✓':''),cat:'deporte'});
  for(const l in LANG){const L=db.lang[l];if(L.days.includes(d.getDay()))out.push({h:L.h,t:LANG[l],cat:'idiomas'})}
  return out.sort((a,b)=>(a.h||'99').localeCompare(b.h||'99'));
}
const evRow=(e,del)=>`<div class="ev"><span class="stripe" style="background:${CAT[e.cat].c}"></span><span class="t">${esc(e.h)||'·'}</span><span class="body">${esc(e.t)}</span><span class="tag">${CAT[e.cat].n}</span>${del&&e.id?`<button class="del" data-act="delev" data-id="${e.id}" aria-label="Borrar">×</button>`:''}</div>`;
const pending=()=>db.lists.reduce((n,l)=>n+l.items.filter(i=>!i.d).length,0);
function nextClass(L){
  if(!L.days.length)return null;
  const now=new Date(),hm=`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  for(let i=0;i<8;i++){const d=addDays(today,i);if(!L.days.includes(d.getDay()))continue;if(i===0&&L.h&&L.h<hm)continue;
    return `${i===0?'Hoy':i===1?'Mañana':cap(DIAS_L[d.getDay()])} · ${L.h}`}
  return null;
}

/* ---------- Libros ---------- */
const PASTEL=['#F2A3B3','#A9C4E4','#B9D19A','#F5D88A','#CDB8E0','#F6C4A0'];
const bookPct=b=>b.src==='kindle'?(b.pct||0):(b.total?Math.min(100,Math.round((b.page||0)/b.total*100)):0);
const stars=n=>`<span class="stars" aria-label="${n} de 5 estrellas">${'★'.repeat(n)}<span class="off">${'★'.repeat(5-n)}</span></span>`;
const srcChip=s=>s==='kindle'?'<span class="chip kindle">Kindle</span>':'<span class="chip papel">Papel</span>';
const initials=t=>esc(String(t).split(' ').filter(w=>w.length>2).map(w=>w[0]).slice(0,2).join('').toUpperCase()||String(t).slice(0,2));
const findBook=id=>db.books.find(b=>b.id===id);

/* ---------- Vistas ---------- */
const NEWS=[
  ['España',[['El País','https://elpais.com'],['El Mundo','https://www.elmundo.es'],['elDiario.es','https://www.eldiario.es'],['RTVE Noticias','https://www.rtve.es/noticias/'],['La Vanguardia','https://www.lavanguardia.com']]],
  ['Euskadi',[['EITB','https://www.eitb.eus/es/'],['El Correo','https://www.elcorreo.com'],['Berria','https://www.berria.eus']]],
  ['Mundo',[['BBC Mundo','https://www.bbc.com/mundo'],['Reuters','https://www.reuters.com'],['The Guardian','https://www.theguardian.com/international']]]
];
const views={
  hoy(){
    const evs=itemsFor(today),reading=db.books.find(b=>b.st==='reading'),wk=weekStats(),w=db.weights.at(-1);
    return `
    <section>
      <div class="sec-head"><h2>Tu día</h2><button class="link" data-act="go" data-to="calendario">Ver agenda</button></div>
      <div class="list feature">${evs.length?evs.map(e=>evRow(e)).join(''):'<div class="empty">Nada para hoy. Añade un plan con el botón +.</div>'}</div>
    </section>
    <div class="today-grid">
      <button class="tile run" data-act="go" data-to="deporte"><span class="small muted">Deporte esta semana</span><span class="big">${wk.done}<small> / ${wk.planned} sesiones</small></span><span class="small muted">${wk.planned?'Toca para ver tus entrenos':'Sin entrenos esta semana'}</span></button>
      ${reading?`<button class="tile book" data-act="book" data-id="${reading.id}"><span class="small muted">Leyendo</span><h3>${esc(reading.t)}</h3><div class="bar"><span style="width:${bookPct(reading)}%"></span></div><span class="small muted num">${bookPct(reading)}%</span></button>`
               :`<button class="tile book" data-act="add" data-type="libro"><span class="small muted">Leyendo</span><h3>Añade el libro que estás leyendo</h3></button>`}
      <button class="tile ice" data-act="go" data-to="deporte"><span class="small muted">Peso</span>${w?`<span class="big">${kg(w.kg)}<small> kg</small></span><span class="small muted">${shortDate(w.date)}</span>`:'<h3>Apunta tu peso</h3>'}</button>
      <button class="tile choc" data-act="go" data-to="notas"><span class="small muted">Por hacer</span><span class="big">${pending()}</span><span class="small">tareas pendientes</span></button>
    </div>
    ${newsHoy()}
    <section>
      <h2>Apuntar algo</h2>
      <form class="quick" data-form="quick"><input id="quick-in" placeholder="Añadir a «${esc(db.lists[0]?db.lists[0].t:'Cosas por hacer')}»…" aria-label="Nueva tarea" autocomplete="off"><button class="btn" type="submit">Añadir</button></form>
    </section>`;
  },

  libros(){
    const seg=`<div class="seg" style="--n:3" role="group" aria-label="Tipo">${[['libros','Libros'],['frases','Frases'],['recursos','Recursos']].map(([k,n])=>`<button data-act="libseg" data-v="${k}" aria-pressed="${ui.libSeg===k}">${n}</button>`).join('')}</div>`;
    if(ui.libSeg==='libros'){
      if(!db.books.length)return seg+info('Aún no hay libros. Añade el primero con el botón + → Libro.');
      const lab={reading:'Leyendo',todo:'Pendientes',read:'Leídos'};
      return seg+['reading','todo','read'].map(g=>{
        const bs=db.books.filter(b=>b.st===g); if(!bs.length)return'';
        return `<section><h2>${lab[g]}</h2><div class="list booklist">${bs.map(b=>`
          <button class="row" data-act="book" data-id="${b.id}"><div class="cover" style="background:${b.c}">${initials(b.t)}</div>
          <div class="body"><div class="title">${esc(b.t)}</div><div class="small muted">${esc(b.a)}</div>
          ${g==='reading'?`<div class="bar"><span style="width:${bookPct(b)}%"></span></div>`:''}
          ${g==='read'&&b.rating?`<div style="margin-top:4px">${stars(b.rating)}</div>`:''}</div>
          ${g==='reading'?`<div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px"><span class="pct">${bookPct(b)}%</span>${srcChip(b.src)}</div>`:srcChip(b.src)}</button>`).join('')}</div></section>`;
      }).join('');
    }
    if(ui.libSeg==='frases'){
      return seg+`<section><div class="sec-head"><h2>Frases que me gustan</h2><span class="small muted">${db.quotes.length}</span></div>
      ${db.quotes.length?db.quotes.map(q=>`<div class="quote"><button class="del" data-act="delquote" data-id="${q.id}" aria-label="Borrar frase">×</button><div class="q">${esc(q.q)}</div><div class="src"><b>${esc(q.b)}</b>${q.p?' · '+esc(q.p):''}</div></div>`).join(''):info('Guarda aquí las frases que te gusten con el botón + → Frase, o desde la ficha de cada libro.')}</section>`;
    }
    const tags=['Todos',...new Set(db.resources.map(r=>r.tag).filter(Boolean))];
    const rs=db.resources.filter(r=>ui.resTag==='Todos'||r.tag===ui.resTag);
    if(!db.resources.length)return seg+info('Guarda enlaces interesantes con el botón + → Recurso.');
    return seg+`<div class="chips">${tags.map(t=>`<button class="chip ${t===ui.resTag?'on':''}" data-act="tag" data-v="${esc(t)}">${esc(t)}</button>`).join('')}</div>
    <div class="list">${rs.map(r=>`<div class="row"><div class="fav">${esc((r.t||'?')[0].toUpperCase())}</div><div class="body">${r.u?`<a class="title" href="${href(r.u)}" target="_blank" rel="noopener">${esc(r.t)}</a>`:`<div class="title">${esc(r.t)}</div>`}<div class="domain">${r.u?esc(host(r.u))+' · ':''}${shortDate(r.date)}</div></div>${r.tag?`<span class="chip">${esc(r.tag)}</span>`:''}<button class="del" data-act="delres" data-id="${r.id}" aria-label="Borrar">×</button></div>`).join('')}</div>`;
  },

  calendario(){
    const base=new Date(today.getFullYear(),today.getMonth()+ui.calOff,1);
    const n=new Date(base.getFullYear(),base.getMonth()+1,0).getDate(), off=(base.getDay()+6)%7;
    let cells='';
    for(let i=0;i<off;i++)cells+='<span class="mcell out"></span>';
    for(let d=1;d<=n;d++){
      const dt=new Date(base.getFullYear(),base.getMonth(),d),k=key(dt);
      const cats=[...new Set(itemsFor(dt).map(x=>x.cat))];
      cells+=`<button class="mcell ${k===key(today)?'today':''}" data-act="cal" data-v="${k}" aria-pressed="${k===ui.calSel}" aria-label="${d} de ${MESES[base.getMonth()]}"><span>${d}</span><span class="dots">${cats.map(c=>`<i style="background:${CAT[c].c}"></i>`).join('')}</span></button>`;
    }
    const sel=fromKey(ui.calSel),its=itemsFor(sel);
    return `
    <section>
      <div class="cal-head"><h2>${cap(MESES[base.getMonth()])} ${base.getFullYear()}</h2><div class="cal-nav"><button data-act="calnav" data-v="-1" aria-label="Mes anterior">${svg('left')}</button><button data-act="calnav" data-v="1" aria-label="Mes siguiente">${svg('right')}</button></div></div>
      <div class="month">${['L','M','X','J','V','S','D'].map(x=>`<span class="dow">${x}</span>`).join('')}${cells}</div>
      <div class="legend">${Object.values(CAT).map(c=>`<span><i style="background:${c.c}"></i>${c.n}</span>`).join('')}</div>
    </section>
    <section>
      <div class="sec-head"><h2>${ui.calSel===key(today)?'Hoy':cap(DIAS_L[sel.getDay()])+' '+sel.getDate()}</h2><button class="link" data-act="add" data-type="evento" data-date="${ui.calSel}">+ Añadir plan</button></div>
      <div class="list">${its.length?its.map(e=>evRow(e,true)).join(''):'<div class="empty">Día libre.</div>'}</div>
    </section>`;
  },

  deporte(){
    const wk=weekStats(),base=new Date(today.getFullYear(),today.getMonth(),1);
    const gymMonth=db.sport.acts.filter(a=>a.k==='gym'&&a.date.startsWith(key(base).slice(0,7))).length;
    const m=key(monday(today)),sun=key(addDays(monday(today),6)),E=evs();
    const week=E.filter(e=>e.date>=m&&e.date<=sun),next=E.filter(e=>e.date>sun).slice(0,12);
    const list=(arr)=>`<div class="list">${arr.map(entRow).join('')}</div>`;
    const cal=!ui.entrenos?info('Cargando tus entrenos…'):!E.length?info('Aún no llegan entrenos de tu calendario. Se actualizan cada mañana y cada vez que se publica la app.'):'';
    return `
    ${cal}
    ${week.length?`<section><div class="sec-head"><h2>Esta semana</h2><span class="small muted num">${wk.done}/${wk.planned} hechos</span></div>${list(week)}</section>`:''}
    ${next.length?`<section><h2>Próximos entrenos</h2>${list(next)}</section>`:''}
    <div class="stats">
      <div class="stat"><div class="v">${wk.done}/${wk.planned}</div><div class="l">entrenos semana</div></div>
      <div class="stat"><div class="v">${kmMonth(base)}</div><div class="l">km corridos (mes)</div></div>
      <div class="stat"><div class="v">${gymMonth}</div><div class="l">días de fuerza (mes)</div></div>
    </div>
    <div class="card connect"><div><h3>Strava</h3><div class="small muted">${db.sport.stravaAt?`Importado el ${shortDate(db.sport.stravaAt)} · ${db.sport.acts.length} actividades. Los entrenos del día que tengan actividad en Strava se marcan solos.`:'Importa tus actividades con el archivo de Strava.'}</div></div><button class="btn ghost" data-act="importstrava">Importar</button></div>
    <input type="file" id="strava-file" accept="application/json,.json" hidden>
    ${actsSection()}
    ${weightSection()}
    <section class="steps"><span class="small muted">Pasos · app Salud</span><span>Llegarán solos en la fase 2, con un Atajo del iPhone.</span></section>`;
  },

  idiomas(){
    const L=ui.langSeg,en=L==='ingles',D=db.lang[L],next=nextClass(D);
    const seg=`<div class="seg" role="group" aria-label="Idioma"><button data-act="lang" data-v="ingles" aria-pressed="${en}">Inglés · Preply</button><button data-act="lang" data-v="euskera" aria-pressed="${!en}">Euskera · EOI</button></div>`;
    return seg+`
    <div class="lesson"><span class="small muted">${en?'Próxima clase con tu profe':'Escuela Oficial de Idiomas'}</span><span class="when">${next||'Sin horario todavía'}</span>
      <div class="acts">${D.url?`<a class="btn lang" href="${href(D.url)}" target="_blank" rel="noopener">${en?'Abrir Preply':'Abrir mi Moodle'}</a>`:''}<button class="btn ghost" data-act="langcfg">${D.url||D.days.length?'Horario y enlace':'Poner horario y enlace'}</button></div></div>
    <section><h2>Deberes</h2><div class="ncard"><div class="stack">${D.homework.map(h=>`<label class="check ${h.d?'done':''}"><input type="checkbox" data-hw="${h.id}" ${h.d?'checked':''}><span style="flex:1">${esc(h.t)}</span><button class="del" data-act="delhw" data-id="${h.id}" aria-label="Borrar">×</button></label>`).join('')}
      <form class="addline" data-form="hw"><input placeholder="Añadir deberes…" aria-label="Añadir deberes" autocomplete="off"><button type="submit" aria-label="Añadir">+</button></form></div></div></section>
    <section><h2>Materiales</h2><div class="list">${D.materials.map(m=>`<div class="row"><div class="fav lang">${esc((m.t||'?')[0].toUpperCase())}</div><div class="body">${m.u?`<a class="title" href="${href(m.u)}" target="_blank" rel="noopener">${esc(m.t)}</a>`:`<div class="title">${esc(m.t)}</div>`}<div class="domain">${m.u?esc(host(m.u))+' · ':''}${shortDate(m.date)}</div></div><button class="del" data-act="delmat" data-id="${m.id}" aria-label="Borrar">×</button></div>`).join('')}
      <form class="addline" data-form="mat" style="padding:8px 16px"><input placeholder="Título o enlace del material…" aria-label="Añadir material" autocomplete="off"><button type="submit" aria-label="Añadir">+</button></form></div></section>
    <section><div class="sec-head"><h2>${en?'Vocabulario':'Hiztegia'}</h2>${D.vocab.length?'<span class="small muted">Toca para ver la traducción</span>':''}</div>
      ${D.vocab.length?`<div class="vocab">${D.vocab.map(v=>{const on=ui.flipped.has(v.id);return `<div class="vcard"><button class="del" data-act="delvoc" data-id="${v.id}" aria-label="Borrar">×</button><button class="vflip" data-act="flip" data-id="${v.id}"><span class="w">${esc(v.w)}</span>${on?`<span class="tr">${esc(v.tr)}</span>`:'<span class="hint">¿Qué significa?</span>'}</button></div>`}).join('')}</div>`:''}
      <form class="addline" data-form="voc"><input placeholder="palabra = traducción" aria-label="Añadir palabra" autocomplete="off"><button type="submit" aria-label="Añadir">+</button></form></section>`;
  },

  notas(){
    if(!db.lists.length)return info('No tienes listas. Crea una con el botón + → Lista.');
    return `<div class="notes">${db.lists.map(l=>{
      const items=[...l.items].sort((a,b)=>a.d-b.d);
      return `<div class="ncard"><div class="nh"><h3>${esc(l.t)}</h3><span class="small muted num">${l.items.filter(i=>i.d).length}/${l.items.length}</span></div>
        ${items.map(it=>`<label class="check ${it.d?'done':''}"><input type="checkbox" data-check="${l.id}:${it.id}" ${it.d?'checked':''}><span>${esc(it.t)}</span></label>`).join('')}
        <form class="addline" data-form="item" data-list="${l.id}"><input placeholder="Añadir…" aria-label="Añadir a ${esc(l.t)}" autocomplete="off"><button type="submit" aria-label="Añadir">+</button></form>
        <div class="lactions">${l.items.some(i=>i.d)?`<button data-act="cleardone" data-id="${l.id}">Borrar tachadas</button>`:''}<button data-act="dellist" data-id="${l.id}" data-confirm>Eliminar lista</button></div></div>`;
    }).join('')}</div>`;
  },

  mas(){
    const n=ui.news&&ui.news.items?ui.news.items.length:0,D=db.lang;
    const nx=nextClass(D.ingles)||nextClass(D.euskera);
    return `<div class="mgrid">
      <button class="mtile m-ice" data-act="go" data-to="idiomas"><span class="mico">${svg('idiomas')}</span><span class="mlabel">Idiomas<small>${nx?'Próxima clase: '+esc(nx):'Inglés · Euskera'}</small></span></button>
      <button class="mtile m-butter" data-act="go" data-to="noticias"><span class="mico">${svg('news')}</span><span class="mlabel">Noticias<small>${n?n+' titulares hoy':'Tus periódicos'}</small></span></button>
      <button class="mtile m-choc" data-act="go" data-to="gastos"><span class="mico">${svg('lock')}</span><span class="mlabel">Gastos<small>Próximamente</small></span></button>
      <button class="mtile m-pink" data-act="go" data-to="copia"><span class="mico">${svg('backup')}</span><span class="mlabel">Copia de seguridad<small>Guarda tus datos</small></span></button>
    </div>
    <div class="mtip">${svg('info')}<span>Aquí irán apareciendo los apartados nuevos que vayamos añadiendo.</span></div>`;
  },

  noticias(){
    const N=ui.news,items=N&&N.items||[];
    const secs=['Todas',...new Set(items.map(n=>n.s))];
    const ns=items.filter(n=>ui.newsSec==='Todas'||n.s===ui.newsSec);
    const head=!N?info('Cargando los titulares de hoy…'):!items.length?info('Los titulares se actualizan cada mañana. Si aún no aparecen, vuelve a abrir la app más tarde.'):'';
    return `${head}
    ${items.length?`<div class="sec-head"><span class="small muted news-upd">Actualizado ${newsTime(N.updated)}</span></div>
    <div class="chips">${secs.map(x=>`<button class="chip ${x===ui.newsSec?'on':''}" data-act="newssec" data-v="${esc(x)}">${esc(x)}</button>`).join('')}</div>
    <div class="list news">${ns.map(n=>newsRow(n)).join('')}</div>`:''}
    <section><h2>Tus periódicos</h2>${NEWS.map(([g,ls])=>`<div class="chips">${ls.map(([n,u])=>`<a class="chip" href="${u}" target="_blank" rel="noopener">${n}</a>`).join('')}</div>`).join('')}</section>`;
  },

  gastos(){
    return `<div class="lockbox"><div class="lock-band"></div><div class="lock-ico">${svg('lock')}</div><h2>Gastos</h2>
      <span class="muted small">Llegará en la fase 2: tus tarjetas, el % por categoría y protegido con Face ID.</span></div>`;
  },

  copia(){
    const c=[[db.books.length,'libros'],[db.quotes.length,'frases'],[db.resources.length,'recursos'],[db.events.length,'planes'],[db.lists.reduce((n,l)=>n+l.items.length,0),'tareas'],[db.weights.length,'pesos']];
    return `${info('Tus datos se guardan solo en este iPhone. Haz una copia de vez en cuando y guárdala en Archivos o en iCloud Drive.')}
    <div class="stats">${c.slice(0,3).map(([v,l])=>`<div class="stat"><div class="v">${v}</div><div class="l">${l}</div></div>`).join('')}</div>
    <div class="stats">${c.slice(3).map(([v,l])=>`<div class="stat"><div class="v">${v}</div><div class="l">${l}</div></div>`).join('')}</div>
    <button class="btn full" data-act="export">${svg('backup')} Guardar copia de seguridad</button>
    <button class="btn ghost full" data-act="import">Recuperar una copia</button>
    <input type="file" id="import-file" accept="application/json,.json" hidden>
    <button class="btn danger full" data-act="wipe" data-confirm>Borrar todos los datos</button>`;
  }
};

const kmMonth=base=>{const p=key(base).slice(0,7);const v=db.sport.acts.filter(a=>a.k==='run'&&a.date.startsWith(p)).reduce((n,a)=>n+(parseFloat(String(a.km).replace(',','.'))||0),0);return v?v.toFixed(1).replace('.',','):'0'};
const ACT_ICON={run:'run',gym:'gym'};
function actsSection(){
  const A=db.sport.acts.slice(0,8); if(!A.length)return '';
  return `<section><h2>Últimas actividades</h2><div class="list">${A.map(a=>{const sp=SPORT[a.k];return `<div class="row"><div class="act-ico" data-k="${a.k}" style="--c:${sp?sp.c:'var(--muted)'}">${svg(ACT_ICON[a.k]||'deporte')}</div><div class="body"><div class="title">${esc(a.name)}</div><div class="act-meta">${[a.km&&a.km!=='0,0'?a.km+' km':'',a.time,a.pace].filter(Boolean).map(x=>`<span>${esc(x)}</span>`).join('')}</div></div><span class="small muted">${shortDate(a.date)}</span></div>`}).join('')}</div></section>`;
}
function mergeStrava(d){
  const have=new Set(db.sport.acts.map(a=>a.id));let n=0;
  for(const a of d.activities||[]){if(!a||!a.id||!a.date||have.has(a.id))continue;db.sport.acts.push(a);have.add(a.id);n++;
    if((a.k==='run'||a.k==='gym')&&!db.sport.log[a.date])db.sport.log[a.date]=a.k}
  db.sport.acts.sort((x,y)=>y.date.localeCompare(x.date)||String(y.start||'').localeCompare(String(x.start||'')));
  db.sport.stravaAt=key(today); ui.tab='deporte'; commit(n?`${n} actividades importadas`:'Ya estaban todas importadas');
}
const newsTime=u=>{try{const d=new Date(u);return `${d.getDate()} ${MESES[d.getMonth()].slice(0,3)}, ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`}catch(_){return ''}};
const newsRow=(n,i)=>`<a class="row" href="${href(n.u)}" target="_blank" rel="noopener">${i!=null?`<span class="news-num">${i+1}</span>`:''}<div class="body"><div class="sec">${esc(n.s)}</div><div class="title">${esc(n.t)}</div><div class="src">${esc(n.src)}</div></div></a>`;
function newsHoy(){
  const items=ui.news&&ui.news.items||[];
  const head=`<div class="sec-head"><h2>Noticias de hoy</h2><button class="link" data-act="go" data-to="noticias">Ver todas</button></div>`;
  if(!ui.news)return `<section>${head}<div class="list news"><div class="empty">Cargando titulares…</div></div></section>`;
  if(!items.length)return `<section>${head}<div class="list news"><button class="row" data-act="go" data-to="noticias"><div class="body"><div class="title">Abre tus periódicos</div><div class="src">Los titulares llegan cada mañana</div></div></button></div></section>`;
  return `<section>${head}<div class="list news">${items.slice(0,5).map((n,i)=>newsRow(n,i)).join('')}</div></section>`;
}
function loadNews(){
  fetch('news.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw 0;return r.json()})
    .then(d=>{ui.news=d&&Array.isArray(d.items)?d:{items:[]}}).catch(()=>{ui.news={items:[]}})
    .finally(()=>{if(['hoy','noticias'].includes(ui.tab))render()});
}
function entRow(e){
  const d=fromKey(e.date),done=isDone(e),past=e.date<key(today);
  const when=e.date===key(today)?'Hoy':e.date===key(addDays(today,1))?'Mañana':`${cap(DIAS[d.getDay()])} ${d.getDate()}`;
  return `<div class="row ent ${done?'is-done':''} ${past&&!done?'is-missed':''}">
    <button class="entcheck" data-act="evdone" data-id="${esc(e.id)}" aria-pressed="${done}" aria-label="${done?'Desmarcar':'Marcar como hecho'}" style="--c:${SPORT[e.k].c}">${done?'✓':''}</button>
    <button class="body entbody" data-act="evinfo" data-id="${esc(e.id)}"><div class="title">${esc(e.t)}</div><div class="act-meta"><span>${when}${e.h?' · '+e.h:''}</span>${e.desc?'<span>Ver detalles ›</span>':''}</div></button>
    <span class="act-ico" data-k="${e.k}" style="--c:${SPORT[e.k].c}">${svg(e.k)}</span></div>`;
}
function entSheet(id){
  const e=evs().find(x=>x.id===id); if(!e)return;
  const d=fromKey(e.date),done=isDone(e);
  openSheet(`<div style="display:flex;gap:12px;align-items:center"><span class="act-ico" data-k="${e.k}" style="--c:${SPORT[e.k].c}">${svg(e.k)}</span><div style="min-width:0"><h2>${esc(e.t)}</h2><div class="muted">${cap(DIAS_L[d.getDay()])} ${d.getDate()} de ${MESES[d.getMonth()]}${e.h?' · '+e.h:''}</div></div></div>
    ${e.desc?`<div class="entdesc">${esc(e.desc)}</div>`:'<span class="small muted">Este entreno no tiene descripción en el calendario.</span>'}
    ${e.loc?`<span class="small muted">📍 ${esc(e.loc)}</span>`:''}
    <button class="btn full ${done?'ghost':''}" data-act="evdone" data-id="${esc(e.id)}" data-close="1">${done?'Desmarcar':'Marcar como hecho'}</button>`,e.t);
}
function loadEntrenos(){
  fetch('entrenos.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw 0;return r.json()})
    .then(d=>{ui.entrenos=d&&Array.isArray(d.items)?d:{items:[]}}).catch(()=>{ui.entrenos={items:[]}})
    .finally(()=>render());
}
function weightSection(){
  const W=db.weights.slice(-12),g=db.weightGoal;
  const head=`<div class="sec-head"><h2>Peso</h2><button class="link" data-act="add" data-type="peso">+ Apuntar</button></div>`;
  if(!W.length)return `<section class="card">${head}<span class="small muted">Aún no hay registros. Apunta tu peso cuando te peses.</span></section>`;
  const cur=W.at(-1).kg,first=W[0].kg,d=cur-first;
  let chart='';
  if(W.length>=2){
    const vals=W.map(w=>w.kg).concat(g?[g]:[]);
    const mx=Math.max(...vals)+.4,mn=Math.min(...vals)-.4,n=W.length,X=i=>14+i*(286/(n-1)),Y=v=>10+(mx-v)/(mx-mn)*96;
    const pts=W.map((w,i)=>`${X(i).toFixed(1)},${Y(w.kg).toFixed(1)}`).join(' ');
    chart=`<div class="wchart"><svg viewBox="0 0 320 130" role="img" aria-label="Evolución del peso: de ${kg(first)} a ${kg(cur)} kg">
      <line class="wgrid" x1="14" x2="300" y1="106" y2="106"/>
      ${g?`<line class="wg" x1="14" x2="300" y1="${Y(g)}" y2="${Y(g)}"/><text class="wg-t" x="300" y="${Y(g)-5}" text-anchor="end">Objetivo ${kg(g)}</text>`:''}
      <polygon class="wa" points="14,106 ${pts} ${X(n-1)},106"/><polyline class="wl" points="${pts}"/>
      <circle class="wd" cx="${X(n-1)}" cy="${Y(cur)}" r="4.5"/>
      <text class="wt" x="14" y="124">${shortDate(W[0].date)}</text><text class="wt" x="300" y="124" text-anchor="end">${shortDate(W.at(-1).date)}</text></svg></div>`;
  }
  return `<section class="card">${head}
    <div class="wbig"><span class="v">${kg(cur)} <small class="small muted">kg</small></span>${W.length>=2?`<span class="delta">${d<=0?'−':'+'}${kg(Math.abs(d))} kg desde el ${shortDate(W[0].date)}</span>`:''}</div>
    ${chart}${g?`<span class="small muted">${cur>g?`Te faltan ${kg(cur-g)} kg para tu objetivo.`:'¡Objetivo conseguido!'}</span>`:''}
  </section>`;
}

const TITLES={hoy:'Buenos días',libros:'Biblioteca',calendario:'Agenda',deporte:'Deporte',idiomas:'Idiomas',notas:'Notas',mas:'Más',noticias:'Noticias',gastos:'Gastos',copia:'Copia de seguridad'};
const TAB={hoy:'Hoy',calendario:'Agenda',libros:'Libros',deporte:'Deporte',notas:'Notas',mas:'Más'};
const SUB=['idiomas','noticias','gastos','copia'];

function greeting(){const h=new Date().getHours();return h<6?'Buenas noches':h<14?'Buenos días':h<21?'Buenas tardes':'Buenas noches'}
function render(){
  document.getElementById('main').innerHTML=`<div class="view">${views[ui.tab]()}</div>`;
  document.getElementById('page-title').textContent=ui.tab==='hoy'?greeting():TITLES[ui.tab];
  const pat=['hoy','calendario','libros','deporte','notas','mas'].includes(ui.tab);
  document.body.dataset.tab=ui.tab; document.body.classList.toggle('pat',pat); document.body.dataset.pat=pat?ui.tab:'';
  const cur=SUB.includes(ui.tab)?'mas':ui.tab;
  document.getElementById('tabs').innerHTML=Object.keys(TAB).map(k=>`<button data-act="tab" data-to="${k}" ${k===cur?'aria-current="page"':''}>${svg(k,1.8)}${TAB[k]}</button>`).join('');
  document.getElementById('today-label').textContent=`${cap(DIAS_L[today.getDay()])}, ${today.getDate()} de ${MESES[today.getMonth()]}`;
}
function go(t){ui.tab=t;render();window.scrollTo({top:0})}
function commit(msg){save();render();if(msg)toast(msg)}
function toast(m){const t=document.getElementById('toast');t.textContent=m;t.hidden=false;clearTimeout(toast._t);toast._t=setTimeout(()=>t.hidden=true,2000)}

/* ---------- Hojas ---------- */
const sheet=document.getElementById('sheet'),scrim=document.getElementById('scrim');
function openSheet(html,label){sheet.innerHTML='<div class="grab"></div>'+html;sheet.setAttribute('aria-label',label);sheet.hidden=false;scrim.hidden=false;sheet.scrollTop=0}
function closeSheet(){sheet.hidden=true;scrim.hidden=true}
const segPick=(group,opts,val)=>`<div class="seg" style="--n:${opts.length}" data-group="${group}">${opts.map(([v,n])=>`<button type="button" data-act="pick" data-v="${v}" aria-pressed="${v===val}">${n}</button>`).join('')}</div>`;
const picked=g=>{const b=sheet.querySelector(`[data-group="${g}"] [aria-pressed="true"]`);return b?b.dataset.v:null};
const val=id=>{const e=document.getElementById(id);return e?e.value.trim():''};

let editing=null;
function bookSheet(id){
  const b=findBook(id); if(!b)return; editing={id,rating:b.rating||0};
  const qs=db.quotes.filter(q=>q.bookId===id||q.b===b.t);
  openSheet(`
    <div style="display:flex;gap:14px;align-items:center"><div class="cover" style="background:${b.c};width:52px;height:72px">${initials(b.t)}</div>
    <div style="min-width:0"><h2>${esc(b.t)}</h2><div class="muted">${esc(b.a)}</div></div></div>
    <div class="field"><span class="flabel">Estado</span>${segPick('st',[['todo','Pendiente'],['reading','Leyendo'],['read','Leído']],b.st)}</div>
    <div class="field"><span class="flabel">¿Dónde lo lees?</span>${segPick('src',[['kindle','Kindle'],['papel','Papel']],b.src)}</div>
    <div id="prog"></div>
    <div class="field"><span class="flabel">¿Te está gustando?</span><div class="starpick" id="starpick">${[1,2,3,4,5].map(n=>`<button type="button" data-act="star" data-v="${n}" class="${n<=editing.rating?'on':''}" aria-label="${n} estrellas">★</button>`).join('')}</div></div>
    <div class="field"><label for="b-review">Reseña</label><textarea id="b-review" placeholder="¿Qué te ha parecido?">${esc(b.review||'')}</textarea></div>
    <div class="field"><span class="flabel">Frases de este libro</span>
      ${qs.map(q=>`<div class="quote"><div class="q">${esc(q.q)}</div>${q.p?`<div class="src">${esc(q.p)}</div>`:''}</div>`).join('')}
      <input id="b-quote" placeholder="Añadir una frase…" autocomplete="off" style="border:1px solid var(--line);background:var(--bg);color:var(--fg);border-radius:12px;padding:12px 14px;font:inherit">
    </div>
    <button class="btn full" data-act="savebook">Guardar</button>
    <button class="btn danger full" data-act="delbook" data-confirm>Eliminar libro</button>`, b.t);
  progFields(b.src,b);
}
function progFields(src,b){
  const p=document.getElementById('prog');
  if(src==='kindle')p.innerHTML=`<div class="field"><label for="b-pct">% leído (el que te marca el Kindle)</label><input id="b-pct" type="number" inputmode="numeric" min="0" max="100" value="${b.pct||''}"></div>`;
  else p.innerHTML=`<div class="pair"><div class="field"><label for="b-page">Voy por la página</label><input id="b-page" type="number" inputmode="numeric" min="0" value="${b.page||''}"></div><span class="of">de</span><div class="field"><label for="b-total">Páginas totales</label><input id="b-total" type="number" inputmode="numeric" min="1" value="${b.total||''}"></div></div>`;
  p.insertAdjacentHTML('beforeend',`<div class="bigpct"><span class="v" id="bp">0%</span><div class="bar"><span id="bb"></span></div></div>`);
  const upd=()=>{let v=0;if(src==='kindle')v=Math.max(0,Math.min(100,+val('b-pct')||0));else{const t=+val('b-total')||0;v=t?Math.min(100,Math.round((+val('b-page')||0)/t*100)):0}
    document.getElementById('bp').textContent=v+'%';document.getElementById('bb').style.width=v+'%'};
  p.querySelectorAll('input').forEach(i=>i.oninput=upd); upd();
}
function saveBook(){
  const b=findBook(editing.id); if(!b)return;
  b.src=picked('src')||b.src; b.st=picked('st')||b.st;
  if(b.src==='kindle')b.pct=Math.max(0,Math.min(100,+val('b-pct')||0));
  else{b.page=+val('b-page')||0;b.total=+val('b-total')||0}
  b.rating=editing.rating; b.review=val('b-review');
  const q=val('b-quote'); if(q)db.quotes.unshift({id:uid(),q,b:b.t,bookId:b.id,p:b.src==='papel'&&b.page?'pág. '+b.page:''});
  if(bookPct(b)>=100)b.st='read'; else if(bookPct(b)>0&&b.st==='todo')b.st='reading';
  closeSheet();commit('Libro guardado');
}

const TYPES={
  tarea:{n:'Tarea'},evento:{n:'Plan'},libro:{n:'Libro'},frase:{n:'Frase'},
  recurso:{n:'Recurso'},lista:{n:'Lista'},peso:{n:'Peso'}
};
function addSheet(type,opts={}){
  ui.addType=type||ui.addType; const t=ui.addType;
  const f=(id,label,attrs='')=>`<div class="field"><label for="${id}">${label}</label><input id="${id}" ${attrs} autocomplete="off"></div>`;
  let body='';
  if(t==='tarea')body=f('f-a','¿Qué tienes que hacer?','required')+(db.lists.length>1?`<div class="field"><label for="f-list">Lista</label><select id="f-list">${db.lists.map(l=>`<option value="${l.id}">${esc(l.t)}</option>`).join('')}</select></div>`:'');
  if(t==='evento')body=f('f-a','¿Qué plan?','required')+`<div class="pair" style="grid-template-columns:1fr 1fr"><div class="field"><label for="f-date">Día</label><input id="f-date" type="date" value="${opts.date||ui.calSel||key(today)}" required></div><div class="field"><label for="f-h">Hora (opcional)</label><input id="f-h" type="time"></div></div>
    <div class="field"><span class="flabel">Tipo</span>${segPick('cat',[['plan','Plan'],['tarea','Tarea'],['idiomas','Idiomas'],['deporte','Deporte']],'plan')}</div>`;
  if(t==='libro')body=f('f-a','Título','required')+f('f-b','Autor/a')+`<div class="field"><span class="flabel">¿Dónde lo lees?</span>${segPick('src',[['kindle','Kindle'],['papel','Papel']],'kindle')}</div><div class="field"><span class="flabel">Estado</span>${segPick('st',[['reading','Leyendo'],['todo','Pendiente'],['read','Leído']],'reading')}</div>`;
  if(t==='frase')body=`<div class="field"><label for="f-a">La frase que te ha gustado</label><textarea id="f-a" required></textarea></div>`+f('f-b','¿De qué libro?','list="dl-books"')+f('f-c','Página (opcional)','inputmode="numeric"')+`<datalist id="dl-books">${db.books.map(b=>`<option value="${esc(b.t)}">`).join('')}</datalist>`;
  if(t==='recurso')body=f('f-a','Título o enlace','required')+f('f-u','Enlace (opcional)','type="url" inputmode="url"')+f('f-b','Etiqueta (p. ej. Deporte)','list="dl-tags"')+`<datalist id="dl-tags">${[...new Set(db.resources.map(r=>r.tag).filter(Boolean))].map(x=>`<option value="${esc(x)}">`).join('')}</datalist>`;
  if(t==='lista')body=f('f-a','Nombre de la lista','required');
  if(t==='peso')body=`<div class="pair" style="grid-template-columns:1fr 1fr"><div class="field"><label for="f-a">Peso (kg)</label><input id="f-a" type="text" inputmode="decimal" placeholder="63,5" required autocomplete="off"></div><div class="field"><label for="f-date">Día</label><input id="f-date" type="date" value="${key(today)}" required></div></div>`+f('f-goal','Objetivo (opcional)',`type="text" inputmode="decimal" value="${db.weightGoal!=null?kg(db.weightGoal):''}"`);
  openSheet(`<h2>Añadir</h2>
    <div class="types">${Object.entries(TYPES).map(([k,v])=>`<button type="button" data-act="type" data-v="${k}" aria-pressed="${k===t}">${svg(k,1.8)}${v.n}</button>`).join('')}</div>
    <form data-form="add" style="display:flex;flex-direction:column;gap:12px">${body}<button class="btn full" type="submit">Guardar</button></form>`,'Añadir');
}
function submitAdd(){
  const t=ui.addType,a=val('f-a'),b=val('f-b'); if(!a)return;
  let dest=null,msg='Guardado';
  if(t==='tarea'){let l=db.lists.find(x=>x.id===val('f-list'))||db.lists[0];if(!l){l={id:uid(),t:'Cosas por hacer',items:[]};db.lists.push(l)}l.items.unshift({id:uid(),t:a,d:false});dest='notas';msg='Tarea añadida'}
  if(t==='evento'){const date=val('f-date')||key(today);db.events.push({id:uid(),t:a,date,h:val('f-h'),cat:picked('cat')||'plan'});ui.calSel=date;const d=fromKey(date);ui.calOff=(d.getFullYear()-today.getFullYear())*12+d.getMonth()-today.getMonth();dest='calendario';msg='Plan añadido'}
  if(t==='libro'){db.books.push({id:uid(),t:a,a:b,src:picked('src')||'kindle',st:picked('st')||'reading',pct:0,page:0,total:0,rating:0,review:'',c:PASTEL[db.books.length%PASTEL.length]});ui.libSeg='libros';dest='libros';msg='Libro añadido'}
  if(t==='frase'){const bk=db.books.find(x=>x.t.toLowerCase()===b.toLowerCase());const pg=val('f-c');db.quotes.unshift({id:uid(),q:a,b:bk?bk.t:b,bookId:bk?bk.id:null,p:pg?'pág. '+pg:''});ui.libSeg='frases';dest='libros';msg='Frase guardada'}
  if(t==='recurso'){let u=val('f-u'),title=a;if(!u&&looksUrl(a)){u=a;title=host(a)||a}db.resources.unshift({id:uid(),t:title,u,tag:b,date:key(today)});ui.libSeg='recursos';ui.resTag='Todos';dest='libros';msg='Recurso guardado'}
  if(t==='lista'){db.lists.push({id:uid(),t:a,items:[]});dest='notas';msg='Lista creada'}
  if(t==='peso'){const v=parseFloat(a.replace(',','.'));if(!(v>0))return toast('Escribe un peso válido');const date=val('f-date')||key(today);
    db.weights=db.weights.filter(w=>w.date!==date);db.weights.push({date,kg:v});db.weights.sort((x,y)=>x.date.localeCompare(y.date));
    const g=parseFloat(val('f-goal').replace(',','.'));db.weightGoal=g>0?g:null;dest='deporte';msg='Peso apuntado'}
  closeSheet();save();if(dest)go(dest);toast(msg);
}
function planSheet(){
  const order=[1,2,3,4,5,6,0];
  openSheet(`<h2>Plan semanal</h2><span class="small muted">Elige qué entreno toca cada día. Los días que lo hagas, tócalos en el calendario para marcarlos.</span>
    <div class="stack">${order.map(wd=>{const p=db.sport.plan[wd]||{};return `<div class="planrow"><span class="dn">${DIAS[wd]}</span>${segPick('p'+wd,[['','—'],['run','Correr'],['gym','Fuerza']],p.k||'')}<input id="ph-${wd}" type="time" value="${p.h||''}" aria-label="Hora del ${DIAS_L[wd]}"></div>`}).join('')}</div>
    <button class="btn full" data-act="saveplan">Guardar plan</button>`,'Plan semanal');
}
function langSheet(){
  const L=ui.langSeg,D=db.lang[L],order=[1,2,3,4,5,6,0];
  openSheet(`<h2>${L==='ingles'?'Inglés · Preply':'Euskera · EOI'}</h2>
    <div class="field"><span class="flabel">Días de clase</span><div class="daypick" id="daypick">${order.map(wd=>`<button type="button" data-act="dpick" data-v="${wd}" aria-pressed="${D.days.includes(wd)}">${DIAS[wd][0]}</button>`).join('')}</div></div>
    <div class="field"><label for="l-h">Hora</label><input id="l-h" type="time" value="${D.h||''}"></div>
    <div class="field"><label for="l-u">${L==='ingles'?'Enlace a Preply':'Enlace a tu Moodle'}</label><input id="l-u" type="url" inputmode="url" value="${esc(D.url||'')}" placeholder="https://…"></div>
    <button class="btn full" data-act="savelang">Guardar</button>`,'Horario');
}

/* ---------- Copia de seguridad ---------- */
async function exportData(){
  const name=`mi-cuaderno-${key(today)}.json`,blob=new Blob([JSON.stringify(db,null,1)],{type:'application/json'});
  try{const file=new File([blob],name,{type:'application/json'});
    if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:'Copia de Mi Cuaderno'});return}}catch(e){if(e&&e.name==='AbortError')return}
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000);
}
function importData(file){
  const r=new FileReader();
  r.onload=()=>{let d;try{d=JSON.parse(r.result)}catch(_){return toast('No se ha podido leer el archivo')}
    if(d&&d.type==='mi-cuaderno-strava')return mergeStrava(d);
    if(!d||d.v!==1)return toast('Ese archivo no es una copia de Mi Cuaderno');
    db=normalize(d);commit('Copia recuperada')};
  r.readAsText(file);
}

/* ---------- Acciones ---------- */
const A={
  tab:(el,d)=>go(d.to), go:(el,d)=>go(d.to),
  libseg:(el,d)=>{ui.libSeg=d.v;render()}, tag:(el,d)=>{ui.resTag=d.v;render()},
  lang:(el,d)=>{ui.langSeg=d.v;render()},
  newssec:(el,d)=>{ui.newsSec=d.v;render()},
  evdone:(el,d)=>{const e=evs().find(x=>x.id===d.id);if(!e)return;const now=!isDone(e);db.sport.done[e.id]=now;if(d.close)closeSheet();commit(now?'¡Entreno hecho!':'Desmarcado')},
  evinfo:(el,d)=>entSheet(d.id),
  flip:(el,d)=>{ui.flipped.has(d.id)?ui.flipped.delete(d.id):ui.flipped.add(d.id);render()},
  book:(el,d)=>bookSheet(d.id),
  cal:(el,d)=>{ui.calSel=d.v;render()},
  calnav:(el,d)=>{ui.calOff+= +d.v;ui.calSel=ui.calOff===0?key(today):key(new Date(today.getFullYear(),today.getMonth()+ui.calOff,1));render()},
  sportnav:(el,d)=>{ui.sportOff+= +d.v;render()},
  sday:(el,d)=>{const dt=fromKey(d.v);if(dt>today)return toast('Ese día aún no ha llegado');
    const L=db.sport.log,p=db.sport.plan[dt.getDay()];
    if(L[d.v]){ if(!p&&L[d.v]==='run'){L[d.v]='gym'} else delete L[d.v] } else L[d.v]=p?p.k:'run';
    commit(L[d.v]?`${SPORT[L[d.v]].n}: ¡hecho!`:'Desmarcado')},
  star:(el,d)=>{editing.rating=editing.rating===+d.v?0:+d.v;sheet.querySelectorAll('#starpick button').forEach(x=>x.classList.toggle('on',+x.dataset.v<=editing.rating))},
  pick:(el)=>{const g=el.closest('[data-group]');g.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===el));
    if(g.dataset.group==='src'&&editing&&!sheet.querySelector('[data-form="add"]')){const b=findBook(editing.id);progFields(el.dataset.v,b)}},
  savebook:()=>saveBook(),
  delbook:()=>{db.books=db.books.filter(b=>b.id!==editing.id);closeSheet();commit('Libro eliminado')},
  type:(el,d)=>addSheet(d.v),
  add:(el,d)=>addSheet(d.type,{date:d.date}),
  delev:(el,d)=>{db.events=db.events.filter(e=>e.id!==d.id);commit('Plan borrado')},
  delres:(el,d)=>{db.resources=db.resources.filter(r=>r.id!==d.id);commit('Recurso borrado')},
  delquote:(el,d)=>{db.quotes=db.quotes.filter(q=>q.id!==d.id);commit('Frase borrada')},
  delhw:(el,d)=>{const D=db.lang[ui.langSeg];D.homework=D.homework.filter(x=>x.id!==d.id);commit()},
  delmat:(el,d)=>{const D=db.lang[ui.langSeg];D.materials=D.materials.filter(x=>x.id!==d.id);commit()},
  delvoc:(el,d)=>{const D=db.lang[ui.langSeg];D.vocab=D.vocab.filter(x=>x.id!==d.id);commit()},
  cleardone:(el,d)=>{const l=db.lists.find(x=>x.id===d.id);l.items=l.items.filter(i=>!i.d);commit('Tachadas borradas')},
  dellist:(el,d)=>{db.lists=db.lists.filter(x=>x.id!==d.id);commit('Lista eliminada')},
  plan:()=>planSheet(),
  saveplan:()=>{const plan={};for(const wd of [0,1,2,3,4,5,6]){const k=picked('p'+wd);if(k)plan[wd]={k,t:SPORT[k].n,h:val('ph-'+wd)}}db.sport.plan=plan;closeSheet();commit('Plan guardado')},
  langcfg:()=>langSheet(),
  dpick:(el)=>el.setAttribute('aria-pressed',el.getAttribute('aria-pressed')!=='true'),
  savelang:()=>{const D=db.lang[ui.langSeg];D.days=[...sheet.querySelectorAll('#daypick [aria-pressed="true"]')].map(b=>+b.dataset.v);D.h=val('l-h');D.url=val('l-u');closeSheet();commit('Guardado')},
  export:()=>exportData(),
  import:()=>document.getElementById('import-file').click(),
  importstrava:()=>document.getElementById('strava-file').click(),
  wipe:()=>{db=fresh();commit('Datos borrados')}
};
document.addEventListener('click',e=>{
  const el=e.target.closest('[data-act]'); if(!el)return;
  const d=el.dataset;
  if(d.confirm!==undefined&&!d.armed){
    d.armed='1';const txt=el.textContent;el.textContent='¿Seguro? Toca otra vez';
    setTimeout(()=>{if(el.isConnected){delete el.dataset.armed;el.textContent=txt}},3500);e.preventDefault();return;
  }
  if(A[d.act]){e.preventDefault();A[d.act](el,d)}
});
document.addEventListener('change',e=>{
  const t=e.target;
  if(t.dataset.check){const [lid,iid]=t.dataset.check.split(':');const it=db.lists.find(l=>l.id===lid)?.items.find(i=>i.id===iid);if(it){it.d=t.checked;commit()}}
  else if(t.dataset.hw){const h=db.lang[ui.langSeg].homework.find(x=>x.id===t.dataset.hw);if(h){h.d=t.checked;commit()}}
  else if((t.id==='import-file'||t.id==='strava-file')&&t.files[0]){importData(t.files[0]);t.value=''}
});
document.addEventListener('submit',e=>{
  const f=e.target.closest('[data-form]'); if(!f)return; e.preventDefault();
  const kind=f.dataset.form,inp=f.querySelector('input'),v=inp?inp.value.trim():'';
  if(kind==='add')return submitAdd();
  if(!v)return;
  const D=db.lang[ui.langSeg];
  if(kind==='quick'){let l=db.lists[0];if(!l){l={id:uid(),t:'Cosas por hacer',items:[]};db.lists.push(l)}l.items.unshift({id:uid(),t:v,d:false});commit(`Añadido a «${l.t}»`)}
  if(kind==='item'){const l=db.lists.find(x=>x.id===f.dataset.list);if(l){l.items.push({id:uid(),t:v,d:false});save();render();document.querySelector(`[data-list="${l.id}"] input`)?.focus()}}
  if(kind==='hw'){D.homework.push({id:uid(),t:v,d:false});commit()}
  if(kind==='mat'){D.materials.unshift(looksUrl(v)?{id:uid(),t:host(v)||v,u:v,date:key(today)}:{id:uid(),t:v,u:'',date:key(today)});commit('Material guardado')}
  if(kind==='voc'){const [w,...r]=v.split('=');if(!r.length)return toast('Escribe «palabra = traducción»');D.vocab.push({id:uid(),w:w.trim(),tr:r.join('=').trim()});commit('Palabra añadida')}
});
scrim.onclick=closeSheet;
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!sheet.hidden)closeSheet()});
document.getElementById('fab').onclick=()=>addSheet(ui.tab==='calendario'?'evento':ui.tab==='libros'?(ui.libSeg==='frases'?'frase':ui.libSeg==='recursos'?'recurso':'libro'):ui.tab==='notas'?'tarea':ui.tab==='deporte'?'peso':'tarea');

/* Si la app se queda abierta y cambia el día, se actualiza */
document.addEventListener('visibilitychange',()=>{if(document.visibilityState!=='visible')return;const n=new Date();n.setHours(0,0,0,0);if(n.getTime()!==today.getTime()){today=n;ui.calSel=key(today);render()}});
window.addEventListener('storage',e=>{if(e.key===KEY){db=load();render()}});

render();
loadNews();
loadEntrenos();
if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('sw.js').catch(()=>{});
