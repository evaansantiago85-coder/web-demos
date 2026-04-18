
const h = React.createElement;
const {useState, useEffect, useMemo} = React;

const STAGES = ['NUEVO','CONTACTADO','RESPONDIO_FRIO','RESPONDIO_CALIENTE','DEMO_ENVIADA','NEGOCIANDO','OBJECION','CERRADO_GANADO','CERRADO_PERDIDO','GHOSTED'];
const SL = {NUEVO:'Nuevo',CONTACTADO:'Contactado',RESPONDIO_FRIO:'Resp. Frío',RESPONDIO_CALIENTE:'Resp. Caliente',DEMO_ENVIADA:'Demo Enviada',NEGOCIANDO:'Negociando',OBJECION:'Objeción',CERRADO_GANADO:'Cerrado Ganado',CERRADO_PERDIDO:'Cerrado Perdido',GHOSTED:'Ghosted'};
const NAV = [
  {id:'afiliados',i:'💰',l:'Afiliados'},
  {id:'home',i:'🏠',l:'Home'},
  {id:'local',i:'🏖️',l:'Locales'},
  {id:'freelance',i:'💼',l:'Freelance'},
  {id:'casos',i:'🏆',l:'Casos'},
  {id:'demos',i:'🖥️',l:'Demos'},
  {id:'agenda',i:'📅',l:'Agenda'},
  {id:'analytics',i:'📊',l:'Analytics'},
  {id:'settings',i:'⚙️',l:'Ajustes'}
];

function toast(msg){var el=document.createElement('div');el.className='toast';el.textContent=msg;document.body.appendChild(el);setTimeout(()=>el.remove(),2800);}
function queue(type,payload){var q=JSON.parse(localStorage.getItem('q')||'[]');q.push({ts:new Date().toISOString(),type,payload});localStorage.setItem('q',JSON.stringify(q));toast('✅ Cambio guardado · pendiente sync');}
function getQ(){return JSON.parse(localStorage.getItem('q')||'[]');}
function clearQ(){localStorage.removeItem('q');}
function flag(p){return p==='US'?'🇺🇸':p==='MX'?'🇲🇽':'🌐';}
function money(n){return '$'+(n||0).toLocaleString('en-US');}
function fdate(s){if(!s)return '—';try{return new Date(s).toLocaleDateString('es',{day:'2-digit',month:'short'});}catch(e){return '—';}}

function canalBadge(c){
  var map={whatsapp:{bg:'#BBF7D0',co:'#166534',l:'🟢 WhatsApp'},
           whatsapp_dudoso:{bg:'#FEF3C7',co:'#92400E',l:'🟡 Verificar WA'},
           email:{bg:'#DBEAFE',co:'#1E40AF',l:'🔵 Email'},
           instagram_dm:{bg:'#F3E8FF',co:'#6B21A8',l:'🟣 Instagram'},
           facebook_dm:{bg:'#DBEAFE',co:'#1E3A8A',l:'🔵 Facebook'},
           call:{bg:'#FED7AA',co:'#9A3412',l:'🟠 Llamada'},no_contact:{bg:'#F3F4F6',co:'#6B7280',l:'⚪ Sin contacto'}};
  var v=map[c]||{bg:'#E5E7EB',co:'#374151',l:c||'—'};
  return h('span',{className:'badge',style:{background:v.bg,color:v.co}},v.l);
}

function Login(props){
  var [pw,setPw]=useState('');
  var attempt=function(){if(pw===props.password)props.onLogin();else toast('❌ Contraseña incorrecta');};
  return h('div',{className:'min-h-screen flex items-center justify-center p-4',style:{background:'linear-gradient(135deg,#F0F9FF,#F8FAFC)'}},
    h('div',{className:'card p-8 max-w-sm w-full'},
      h('div',{className:'text-center mb-6'},
        h('div',{className:'text-4xl mb-2'},'🌊'),
        h('h1',{className:'text-2xl font-black'},'Coastal Dashboard'),
        h('p',{className:'text-sm text-slate-500 mt-1'},'Acceso restringido')
      ),
      h('input',{type:'password',className:'w-full px-4 py-3 border border-slate-300 rounded-lg mb-3',placeholder:'Contraseña',value:pw,onChange:function(e){setPw(e.target.value);},onKeyDown:function(e){if(e.key==='Enter')attempt();},autoFocus:true}),
      h('button',{className:'btn-p w-full',onClick:attempt},'Entrar'),
      h('p',{className:'text-xs text-slate-400 mt-4 text-center'},'Tip: añade a pantalla de inicio como PWA')
    )
  );
}

function KPI(p){
  return h('div',{className:'card p-5'},
    h('div',{className:'text-2xl mb-2'},p.icon),
    h('div',{className:'text-3xl font-black',style:{color:p.color||'#0EA5E9'}},p.value),
    h('div',{className:'text-sm text-slate-600 mt-1'},p.label)
  );
}


function Sidebar(p){
  return h('aside',{className:'sidebar fixed left-0 top-0 bottom-0 w-60 bg-white border-r border-slate-200 flex flex-col',style:{zIndex:10}},
    h('div',{className:'p-5 border-b border-slate-100'},
      h('div',{className:'flex items-center gap-2 mb-1'},
        h('span',{className:'text-2xl'},'🌊'),
        h('span',{className:'font-black text-lg'},'Coastal')
      ),
      h('div',{className:'text-xs text-slate-500'},'Freelance + Web Hunter')
    ),
    h('nav',{className:'flex-1 p-3 overflow-y-auto',style:{display:'flex',flexDirection:'column',gap:4}},
      NAV.map(function(n){return h('button',{key:n.id,onClick:function(){p.setActive(n.id);},
        className:'w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 text-sm',
        style:p.active===n.id?{background:'#F0F9FF',color:'#0EA5E9',fontWeight:700}:{color:'#475569',background:'transparent'}},
        h('span',{className:'text-lg'},n.i),n.l);})
    ),
    h('div',{className:'p-3 border-t border-slate-100 text-xs text-slate-500'},
      h('div',{className:'mb-1'},'Revenue mes: ',h('span',{className:'font-bold',style:{color:'#059669'}},money(p.stats.revenue_month_usd))),
      h('div',null,'Pipeline: ',h('span',{className:'font-bold',style:{color:'#F59E0B'}},money(p.stats.pipeline_potential)))
    )
  );
}

function BottomNav(p){
  return h('div',{className:'bottom-nav',style:{display:'none',position:'fixed',bottom:0,left:0,right:0,background:'#fff',borderTop:'1px solid #E2E8F0',overflowX:'auto',zIndex:40}},
    h('div',{className:'scroll-hide',style:{display:'flex',minWidth:'max-content'}},
      NAV.map(function(n){return h('button',{key:n.id,onClick:function(){p.setActive(n.id);},
        style:{flex:1,minWidth:72,padding:'8px',display:'flex',flexDirection:'column',alignItems:'center',gap:2,border:0,background:'transparent',color:p.active===n.id?'#0EA5E9':'#64748B',cursor:'pointer'}},
        h('span',{style:{fontSize:20}},n.i),
        h('span',{style:{fontSize:10,fontWeight:600}},n.l));})
    )
  );
}

function mergePipeline(leads,pipeline){
  var pmap={};pipeline.forEach(function(p){pmap[p.lead_id]=p;});
  return leads.map(function(l){return Object.assign({},l,{pipeline:pmap[l.id]||null,stage:pmap[l.id]?pmap[l.id].stage:'NUEVO'});});
}

function HomeView(p){
  var data=p.data;
  var leads=mergePipeline(data.leads,data.pipeline_stages);
  var won=data.pipeline_stages.filter(function(x){return x.stage==='CERRADO_GANADO';}).length;
  var total=data.pipeline_stages.length;
  var rate=total>0?Math.round(won/total*100):0;
  var activos=data.pipeline_stages.filter(function(x){return ['CERRADO_GANADO','CERRADO_PERDIDO','GHOSTED'].indexOf(x.stage)===-1;}).length+leads.filter(function(l){return !data.pipeline_stages.find(function(p){return p.lead_id===l.id;});}).length;
  var today=new Date().toISOString().slice(0,10);
  var msgs7=data.whatsapp_send_log.filter(function(w){return new Date(w.sent_at_date)>new Date(Date.now()-7*86400000);}).length;
  var todayCount=data.whatsapp_send_log.filter(function(w){return w.sent_at_date===today;}).length;
  var uniqDays=[...new Set(data.whatsapp_send_log.map(function(w){return w.sent_at_date;}))].length;
  var risk='bajo',rc='#16A34A',rm='Protocolo seguro. Envía con tranquilidad.';
  if(todayCount>12){risk='alto';rc='#DC2626';rm='⚠️ Más de 12 hoy. Baja a 8-10.';}
  else if(todayCount>10){risk='medio';rc='#CA8A04';rm='En el límite. No pases de 12.';}
  if(msgs7>70){risk='alto';rc='#DC2626';rm='⚠️ 70+ en 7 días. Descansa mañana.';}
  if(uniqDays>=6){risk='alto';rc='#DC2626';rm='⚠️ 6+ días seguidos. Descansa hoy.';}

  var hot=data.pipeline_stages.filter(function(x){return ['RESPONDIO_CALIENTE','NEGOCIANDO','OBJECION'].indexOf(x.stage)>=0;}).slice(0,3);
  var byCountry={};leads.filter(function(l){return l.tipo==='local'&&l.pais;}).forEach(function(l){byCountry[l.pais]=(byCountry[l.pais]||0)+1;});
  var byStage=STAGES.map(function(s){return {stage:SL[s],count:data.pipeline_stages.filter(function(x){return x.stage===s;}).length};});
  var maxStage=Math.max.apply(null,byStage.map(function(b){return b.count;}).concat(1));

  return h('div',{className:'space-y-5',style:{display:'flex',flexDirection:'column',gap:20}},
    h('h1',{className:'text-2xl md:text-3xl font-black'},'🏠 Dashboard'),
    h('div',{className:'grid grid-cols-2 lg:grid-cols-4 gap-4'},
      h(KPI,{label:'Revenue del mes',value:money(data.stats.revenue_month_usd),icon:'💰',color:'#10B981'}),
      h(KPI,{label:'Pipeline potencial',value:money(data.stats.pipeline_potential),icon:'🎯',color:'#F59E0B'}),
      h(KPI,{label:'Tasa de cierre',value:rate+'%',icon:'📈',color:'#0EA5E9'}),
      h(KPI,{label:'Leads activos',value:activos,icon:'🔥',color:'#EF4444'})
    ),
    h('div',{className:'grid md:grid-cols-2 gap-4'},
      h('div',{className:'card p-5'},
        h('div',{className:'flex items-center justify-between mb-3'},
          h('h3',{className:'font-bold'},'📱 WhatsApp Health'),
          h('span',{className:'badge',style:{background:rc+'22',color:rc}},risk.toUpperCase())
        ),
        h('div',{className:'flex gap-4 mb-3',style:{display:'flex',gap:16}},
          h('div',{style:{textAlign:'center'}},h('div',{className:'text-2xl font-black'},todayCount),h('div',{className:'text-xs text-slate-500'},'hoy')),
          h('div',{style:{textAlign:'center'}},h('div',{className:'text-2xl font-black'},msgs7),h('div',{className:'text-xs text-slate-500'},'7 días')),
          h('div',{style:{textAlign:'center'}},h('div',{className:'text-2xl font-black'},uniqDays),h('div',{className:'text-xs text-slate-500'},'días activos'))
        ),
        h('div',{className:'text-sm rounded-lg p-3',style:{background:rc+'15',borderLeft:'3px solid '+rc}},rm)
      ),
      h('div',{className:'card p-5'},
        h('h3',{className:'font-bold mb-3'},'🔥 Leads calientes'),
        hot.length===0?h('div',{className:'text-sm text-slate-400 italic'},'Sin leads calientes aún'):
          hot.map(function(l){return h('div',{key:l.lead_id,className:'py-2',style:{borderBottom:'1px solid #F1F5F9',display:'flex',justifyContent:'space-between',alignItems:'center',gap:8}},
            h('div',{style:{minWidth:0,flex:1}},h('div',{className:'font-semibold text-sm',style:{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}},l.nombre),h('div',{className:'text-xs text-slate-500'},l.plataforma_ciudad)),
            h('span',{className:'badge s-'+l.stage},SL[l.stage]));})
      ),
      h('div',{className:'card p-5'},
        h('h3',{className:'font-bold mb-3'},'🌍 Leads por país'),
        h('div',{style:{display:'flex',justifyContent:'space-around',padding:'20px 0'}},
          Object.keys(byCountry).length===0?h('div',{className:'text-sm text-slate-400'},'Sin datos'):
          Object.keys(byCountry).map(function(k){return h('div',{key:k,style:{textAlign:'center'}},
            h('div',{style:{fontSize:48}},k==='US'?'🇺🇸':'🇲🇽'),
            h('div',{className:'text-3xl font-black'},byCountry[k]),
            h('div',{className:'text-xs text-slate-500'},k==='US'?'USA':'México')
          );})
        )
      ),
      h('div',{className:'card p-5'},
        h('h3',{className:'font-bold mb-3'},'📊 Pipeline por etapa'),
        h('div',{style:{display:'flex',flexDirection:'column',gap:6}},
          byStage.map(function(b,i){return h('div',{key:i,style:{display:'flex',alignItems:'center',gap:8}},
            h('div',{style:{width:100,fontSize:11,color:'#64748B'}},b.stage),
            h('div',{style:{flex:1,height:18,background:'#F1F5F9',borderRadius:4,overflow:'hidden',position:'relative'}},
              h('div',{style:{height:'100%',width:(b.count/maxStage*100)+'%',background:'#0EA5E9'}}),
              h('div',{style:{position:'absolute',inset:0,display:'flex',alignItems:'center',paddingLeft:8,fontSize:11,fontWeight:700,color:b.count>maxStage*0.3?'#fff':'#0F172A'}},b.count)
            )
          );})
        )
      )
    )
  );
}


function LeadDrawer(p){
  var lead=p.lead,pipe=p.pipeline;
  var [stage,setStage]=useState(lead.stage||'NUEVO');
  var [notes,setNotes]=useState(lead.notas||(pipe&&pipe.notes)||'');
  var [closeAmt,setCloseAmt]=useState(lead.ticket_estimado||797);
  var [showClose,setShowClose]=useState(false);
  var photos=Array.isArray(lead.photo_urls)?lead.photo_urls:[];
  var closerMsgs=p.closerMsgs.filter(function(m){return m.lead_id===lead.id;});
  var waDudoso=(lead.whatsapp_probable_score!=null&&lead.whatsapp_probable_score<5);

  function changeStage(ns){setStage(ns);queue('STAGE_UPDATE',{lead_id:lead.id,new_stage:ns});if(ns==='CERRADO_GANADO')setShowClose(true);}
  function saveNotes(){queue('NOTES',{lead_id:lead.id,notes:notes});}
  function markClosed(){queue('CASO_EXITO',{nombre_cliente:lead.nombre,ciudad:lead.plataforma_ciudad,nicho:lead.nicho,pais:lead.pais,resultado_concreto:'Cerrado '+new Date().toLocaleDateString('es'),monto_usd:closeAmt,testimonio_corto:''});queue('STAGE_UPDATE',{lead_id:lead.id,new_stage:'CERRADO_GANADO',closed_amount_usd:closeAmt});setShowClose(false);p.onClose();}

  return h('div',{style:{position:'fixed',inset:0,zIndex:50,display:'flex'}},
    h('div',{style:{flex:1,background:'rgba(15,23,42,.55)',backdropFilter:'blur(4px)'},onClick:p.onClose}),
    h('div',{style:{width:'100%',maxWidth:640,background:'#fff',overflowY:'auto',boxShadow:'-10px 0 30px rgba(0,0,0,.2)'}},
      h('div',{style:{position:'sticky',top:0,background:'#fff',borderBottom:'1px solid #E2E8F0',padding:'16px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',zIndex:10}},
        h('div',{style:{minWidth:0}},
          h('div',{className:'text-xs text-slate-500'},flag(lead.pais)+' '+(lead.plataforma_ciudad||'')+' · '+(lead.nicho||'')),
          h('h2',{className:'text-xl font-black',style:{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}},lead.nombre)
        ),
        h('button',{style:{fontSize:24,color:'#94A3B8',border:0,background:'transparent',cursor:'pointer',padding:'0 8px'},onClick:p.onClose},'×')
      ),
      h('div',{style:{padding:20,display:'flex',flexDirection:'column',gap:20}},
        waDudoso?h('div',{className:'card p-3',style:{background:'#FEF3C7',border:'1px solid #FDE68A'}},h('div',{className:'text-xs font-bold',style:{color:'#92400E'}},'🟡 WhatsApp dudoso (score '+lead.whatsapp_probable_score+'/10)'),h('div',{className:'text-xs mt-1',style:{color:'#92400E'}},'Usa canal alternativo si hay, o verifica marcando desde WhatsApp antes de enviar.')):null,
        h('div',{style:{display:'flex',flexWrap:'wrap',gap:8,alignItems:'center'}},
          h('span',{className:'badge s-'+stage},SL[stage]),
          h('select',{value:stage,onChange:function(e){changeStage(e.target.value);},style:{fontSize:13,padding:'6px 10px',border:'1px solid #CBD5E1',borderRadius:8,background:'#fff'}},
            STAGES.map(function(s){return h('option',{key:s,value:s},SL[s]);})),
          lead.canal_sugerido?canalBadge(lead.canal_sugerido):null,
          lead.rating?h('span',{className:'text-sm text-slate-600'},'⭐ '+lead.rating+' ('+lead.reviews_count+')'):null,
          lead.ticket_estimado?h('span',{className:'badge',style:{background:'#ECFDF5',color:'#065F46'}},'💰 '+money(lead.ticket_estimado)):null
        ),
        h('div',{style:{display:'flex',flexWrap:'wrap',gap:8}},
          lead.whatsapp?h('a',{href:lead.whatsapp,target:'_blank',className:'btn-p'},'💬 WhatsApp'):null,
          lead.demo_url?h('a',{href:lead.demo_url,target:'_blank',className:'btn-s'},'🖥️ Ver demo'):null,
          lead.link?h('a',{href:lead.link,target:'_blank',className:'btn-o'},'🔗 Fuente'):null,
          h('button',{className:'btn-p',onClick:function(){changeStage('CERRADO_GANADO');}},'✅ Marcar Cerrado')
        ),
        photos.length>0?h('div',null,
          h('h3',{className:'font-bold text-sm mb-2'},'📷 Fotos reales de Google'),
          h('div',{style:{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}},
            photos.slice(0,6).map(function(u,i){return h('img',{key:i,src:u,loading:'lazy',style:{aspectRatio:'1/1',objectFit:'cover',borderRadius:8,width:'100%'}});})
          )
        ):null,
        lead.propuesta?h('div',null,
          h('h3',{className:'font-bold text-sm mb-2'},'📋 Auditoría'),
          h('div',{className:'card p-3 text-sm',style:{whiteSpace:'pre-wrap',color:'#334155'}},lead.propuesta)
        ):null,
        lead.mensaje_whatsapp?h('div',null,
          h('h3',{className:'font-bold text-sm mb-2'},'💬 Mensaje inicial (copy-paste)'),
          h('div',{className:'card p-3 text-sm',style:{whiteSpace:'pre-wrap',background:'#ECFDF5',border:'1px solid #BBF7D0',color:'#334155'}},lead.mensaje_whatsapp),
          h('button',{className:'btn-o',style:{fontSize:11,marginTop:8},onClick:function(){navigator.clipboard.writeText(lead.mensaje_whatsapp);toast('📋 Copiado');}},'📋 Copiar')
        ):null,
        lead.pitch_script_text?h('div',null,
          h('h3',{className:'font-bold text-sm mb-2'},'🎙️ Pitch de voz'),
          h('div',{className:'card p-3 text-sm',style:{whiteSpace:'pre-wrap',background:'#FAF5FF',border:'1px solid #E9D5FF',fontFamily:'monospace'}},lead.pitch_script_text),
          h('div',{className:'text-xs mt-2',style:{color:'#7E22CE'}},'💡 Copia a ',h('a',{href:'https://elevenlabs.io',target:'_blank',style:{textDecoration:'underline'}},'ElevenLabs'),' o grábate tú mismo')
        ):null,
        
        (function(){
          var canales = (p.canales || []).filter(function(c){return c.lead_id===lead.id;});
          if(canales.length===0) return null;
          return h('div',null,
            h('h3',{className:'font-bold text-sm mb-2'},'📬 Canales alternativos de contacto'),
            canales.map(function(c,i){
              var iconMap={email:'📧',instagram_dm:'📸',facebook_dm:'📘',call:'📞'};
              var linkMap={email:'mailto:'+c.contacto,instagram_dm:c.contacto,facebook_dm:c.contacto,call:'tel:'+c.contacto};
              var labelMap={email:'Email',instagram_dm:'Instagram DM',facebook_dm:'Facebook DM',call:'Llamar'};
              return h('div',{key:i,className:'card p-3',style:{marginBottom:8,background:'#F0F9FF',border:'1px solid #BAE6FD'}},
                h('div',{style:{display:'flex',alignItems:'center',gap:6,marginBottom:6}},
                  h('span',{style:{fontSize:20}},iconMap[c.canal]||'📬'),
                  h('span',{className:'font-bold text-sm'},labelMap[c.canal]||c.canal),
                  h('a',{href:linkMap[c.canal]||'#',target:'_blank',style:{marginLeft:'auto',fontSize:11,color:'#0369A1',wordBreak:'break-all',textAlign:'right',maxWidth:'60%',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}},c.contacto)
                ),
                h('div',{style:{background:'#fff',border:'1px solid #E0F2FE',borderRadius:6,padding:10,fontSize:13,whiteSpace:'pre-wrap',color:'#334155',marginBottom:8}},c.mensaje_preparado),
                h('div',{style:{display:'flex',gap:6}},
                  h('a',{href:linkMap[c.canal]||'#',target:'_blank',className:'btn-s',style:{fontSize:11,flex:1,textAlign:'center'}},'Abrir '+(labelMap[c.canal]||'link')),
                  h('button',{className:'btn-o',style:{fontSize:11},onClick:function(){navigator.clipboard.writeText(c.mensaje_preparado);toast('📋 Copiado');}},'📋 Copiar')
                )
              );
            })
          );
        })(),
        closerMsgs.length>0?h('div',null,
          h('h3',{className:'font-bold text-sm mb-2'},'📬 Mensajes de seguimiento ('+closerMsgs.length+')'),
          closerMsgs.map(function(m){return h('div',{key:m.id,className:'card p-3',style:{marginBottom:8,background:'#F0F9FF',border:'1px solid #BAE6FD'}},
            h('div',{className:'text-xs',style:{color:'#0369A1',fontWeight:700,marginBottom:4}},m.message_type+' · '+m.scheduled_send_date),
            h('div',{style:{fontSize:13,color:'#334155',whiteSpace:'pre-wrap'}},m.message_text),
            m.wa_link?h('a',{href:m.wa_link,target:'_blank',className:'btn-p',style:{fontSize:11,marginTop:8,display:'inline-block'}},'💬 Enviar'):null
          );})
        ):null,
        lead.demo_url?h('div',null,
          h('h3',{className:'font-bold text-sm mb-2'},'🖥️ Preview demo'),
          h('iframe',{src:lead.demo_url,style:{width:'100%',height:320,borderRadius:8,border:'1px solid #E2E8F0'}})
        ):null,
        h('div',null,
          h('h3',{className:'font-bold text-sm mb-2'},'📝 Notas'),
          h('textarea',{value:notes,onChange:function(e){setNotes(e.target.value);},onBlur:saveNotes,placeholder:'Notas internas...',style:{width:'100%',minHeight:100,padding:12,border:'1px solid #CBD5E1',borderRadius:8,fontSize:13,resize:'vertical'}})
        )
      ),
      showClose?h('div',{style:{position:'fixed',inset:0,zIndex:60,display:'flex',alignItems:'center',justifyContent:'center',padding:16,background:'rgba(15,23,42,.55)',backdropFilter:'blur(4px)'}},
        h('div',{className:'card p-6',style:{maxWidth:360,width:'100%'}},
          h('h3',{className:'font-black text-lg mb-3'},'✅ Cerrar como ganado'),
          h('div',{className:'text-sm text-slate-600 mb-3'},'¿Cuánto cobraste (USD)?'),
          h('input',{type:'number',value:closeAmt,onChange:function(e){setCloseAmt(+e.target.value);},style:{width:'100%',padding:12,border:'1px solid #CBD5E1',borderRadius:8,marginBottom:16}}),
          h('div',{style:{display:'flex',gap:8}},
            h('button',{className:'btn-o',style:{flex:1},onClick:function(){setShowClose(false);}},'Cancelar'),
            h('button',{className:'btn-p',style:{flex:1},onClick:markClosed},'✅ Confirmar')
          )
        )
      ):null
    )
  );
}


function LocalView(p){
  var data=p.data;
  var [sel,setSel]=useState(null);
  var [fPais,setFPais]=useState('all');
  var [fNicho,setFNicho]=useState('all');
  var [fEstado,setFEstado]=useState('all');
  var [search,setSearch]=useState('');
  var leads=mergePipeline(data.leads.filter(function(l){return l.tipo==='local';}),data.pipeline_stages);
  var nichos=[...new Set(leads.map(function(l){return l.nicho;}).filter(Boolean))];
  var filtered=leads.filter(function(l){
    if(fPais!=='all'&&l.pais!==fPais)return false;
    if(fNicho!=='all'&&l.nicho!==fNicho)return false;
    if(fEstado!=='all'&&l.stage!==fEstado)return false;
    if(search&&l.nombre.toLowerCase().indexOf(search.toLowerCase())===-1)return false;
    return true;
  });
  return h('div',{style:{display:'flex',flexDirection:'column',gap:16}},
    h('h1',{className:'text-2xl md:text-3xl font-black'},'🏖️ Leads Locales ',h('span',{className:'text-slate-400 text-base font-normal'},'('+filtered.length+'/'+leads.length+')')),
    h('div',{className:'card p-4',style:{display:'flex',flexWrap:'wrap',gap:8,alignItems:'center'}},
      h('input',{placeholder:'🔍 Buscar...',value:search,onChange:function(e){setSearch(e.target.value);},style:{padding:'8px 12px',border:'1px solid #CBD5E1',borderRadius:8,fontSize:13,flex:1,minWidth:160}}),
      h('select',{value:fPais,onChange:function(e){setFPais(e.target.value);},style:{padding:'8px 12px',border:'1px solid #CBD5E1',borderRadius:8,fontSize:13}},
        h('option',{value:'all'},'Todos países'),h('option',{value:'US'},'🇺🇸 USA'),h('option',{value:'MX'},'🇲🇽 México')),
      h('select',{value:fNicho,onChange:function(e){setFNicho(e.target.value);},style:{padding:'8px 12px',border:'1px solid #CBD5E1',borderRadius:8,fontSize:13}},
        h('option',{value:'all'},'Todos nichos'),nichos.map(function(n){return h('option',{key:n,value:n},n);})),
      h('select',{value:fEstado,onChange:function(e){setFEstado(e.target.value);},style:{padding:'8px 12px',border:'1px solid #CBD5E1',borderRadius:8,fontSize:13}},
        h('option',{value:'all'},'Todos estados'),STAGES.map(function(s){return h('option',{key:s,value:s},SL[s]);}))
    ),
    h('div',{className:'card',style:{overflowX:'auto'}},
      h('table',null,
        h('thead',null,h('tr',null,
          h('th',null,'País'),h('th',null,'Negocio'),h('th',null,'Rating'),h('th',null,'Ticket'),h('th',null,'Canal'),h('th',null,'Estado'),h('th',null,'')
        )),
        h('tbody',null,
          filtered.length===0?h('tr',null,h('td',{colSpan:7,style:{textAlign:'center',color:'#94A3B8',fontStyle:'italic',padding:'32px'}},'Sin resultados')):
          filtered.map(function(l){return h('tr',{key:l.id,onClick:function(){setSel(l);}},
            h('td',null,h('span',{className:'flag'},flag(l.pais))),
            h('td',null,
              h('div',{style:{fontWeight:600}},l.nombre),
              h('div',{style:{fontSize:11,color:'#64748B'}},(l.plataforma_ciudad||'')+' · '+(l.nicho||''))
            ),
            h('td',null,l.rating?'⭐ '+l.rating+' ('+l.reviews_count+')':'—'),
            h('td',{style:{fontWeight:700,color:'#059669'}},money(l.ticket_estimado)),
            h('td',null,l.canal_sugerido?canalBadge(l.canal_sugerido):'—'),
            h('td',null,h('span',{className:'badge s-'+l.stage},SL[l.stage])),
            h('td',{onClick:function(e){e.stopPropagation();},style:{whiteSpace:'nowrap'}},
              l.whatsapp?h('a',{href:l.whatsapp,target:'_blank',style:{fontSize:18,marginRight:8,textDecoration:'none'},title:'WhatsApp'},'💬'):null,
              l.demo_url?h('a',{href:l.demo_url,target:'_blank',style:{fontSize:18,textDecoration:'none'},title:'Demo'},'🖥️'):null
            )
          );})
        )
      )
    ),
    sel?h(LeadDrawer,{lead:sel,pipeline:data.pipeline_stages.find(function(p){return p.lead_id===sel.id;}),closerMsgs:data.closer_messages,onClose:function(){setSel(null);},canales:data.canales_alternativos||[]}):null
  );
}

function FreelanceView(p){
  var data=p.data;
  var [sel,setSel]=useState(null);
  var leads=mergePipeline(data.leads.filter(function(l){return l.tipo==='freelance';}),data.pipeline_stages);
  return h('div',{style:{display:'flex',flexDirection:'column',gap:16}},
    h('h1',{className:'text-2xl md:text-3xl font-black'},'💼 Leads Freelance ',h('span',{className:'text-slate-400 text-base font-normal'},'('+leads.length+')')),
    h('div',{className:'card',style:{overflowX:'auto'}},
      h('table',null,
        h('thead',null,h('tr',null,h('th',null,'Plataforma'),h('th',null,'Título'),h('th',null,'Idioma'),h('th',null,'Score'),h('th',null,'Estado'))),
        h('tbody',null,
          leads.map(function(l){return h('tr',{key:l.id,onClick:function(){setSel(l);}},
            h('td',{style:{fontSize:11,color:'#64748B'}},l.plataforma_ciudad),
            h('td',null,
              h('div',{style:{fontWeight:600,maxWidth:400,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}},l.nombre),
              h('div',{style:{fontSize:11,color:'#64748B'}},l.servicio_pedido||'')
            ),
            h('td',null,h('span',{className:'badge',style:{background:'#E0F2FE',color:'#075985'}},l.idioma||'en')),
            h('td',null,h('span',{className:'badge',style:{background:l.score>=7?'#BBF7D0':l.score>=5?'#FEF3C7':'#E5E7EB',color:l.score>=7?'#166534':l.score>=5?'#92400E':'#374151'}},l.score+'/10')),
            h('td',null,h('span',{className:'badge s-'+l.stage},SL[l.stage]))
          );})
        )
      )
    ),
    sel?h(LeadDrawer,{lead:sel,pipeline:data.pipeline_stages.find(function(p){return p.lead_id===sel.id;}),closerMsgs:data.closer_messages,onClose:function(){setSel(null);},canales:data.canales_alternativos||[]}):null
  );
}


function CasosView(p){
  var [showAdd,setShowAdd]=useState(false);
  var [f,setF]=useState({nombre_cliente:'',ciudad:'',nicho:'',pais:'MX',resultado_concreto:'',monto_usd:797,testimonio_corto:''});
  var casos=p.data.casos_exito;
  return h('div',{style:{display:'flex',flexDirection:'column',gap:16}},
    h('div',{style:{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:12,alignItems:'center'}},
      h('h1',{className:'text-2xl md:text-3xl font-black'},'🏆 Casos de Éxito ',h('span',{className:'text-slate-400 text-base font-normal'},'('+casos.length+')')),
      h('button',{className:'btn-p',onClick:function(){setShowAdd(true);}},'+ Agregar caso')
    ),
    h('div',{className:'grid md:grid-cols-2 lg:grid-cols-3 gap-4',style:{display:'grid',gap:16}},
      casos.map(function(c){return h('div',{key:c.id,className:'card p-4',style:{display:'flex',flexDirection:'column',gap:8}},
        h('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'start'}},
          h('div',null,
            h('div',{style:{display:'flex',alignItems:'center',gap:8,marginBottom:4}},
              h('span',{className:'flag'},c.pais==='GENERIC'?'🌐':flag(c.pais)),
              h('span',{className:'font-bold'},c.nombre_cliente)),
            h('div',{className:'text-xs text-slate-500'},(c.ciudad||'')+' · '+(c.nicho||''))
          ),
          h('span',{className:'badge',style:c.pais==='GENERIC'?{background:'#E5E7EB',color:'#374151'}:{background:'#BBF7D0',color:'#166534'}},c.pais==='GENERIC'?'Industria':'REAL')
        ),
        h('div',{className:'text-sm font-semibold',style:{color:'#047857'}},c.resultado_concreto),
        c.testimonio_corto?h('div',{className:'text-xs text-slate-600',style:{fontStyle:'italic'}},'"'+c.testimonio_corto+'"'):null,
        h('div',{style:{display:'flex',justifyContent:'space-between',fontSize:11,color:'#64748B',paddingTop:8,borderTop:'1px solid #F1F5F9'}},
          c.monto_usd?h('span',{style:{fontWeight:700,color:'#F59E0B'}},money(c.monto_usd)):h('span'),
          h('span',null,'Usado '+c.usado_count+'x')
        )
      );})
    ),
    showAdd?h('div',{style:{position:'fixed',inset:0,zIndex:60,display:'flex',alignItems:'center',justifyContent:'center',padding:16,background:'rgba(15,23,42,.55)',backdropFilter:'blur(4px)'}},
      h('div',{className:'card p-6',style:{maxWidth:400,width:'100%',maxHeight:'90vh',overflowY:'auto'}},
        h('h3',{className:'font-black text-lg mb-4'},'+ Agregar caso de éxito'),
        h('div',{style:{display:'flex',flexDirection:'column',gap:10}},
          h('input',{placeholder:'Nombre del cliente',value:f.nombre_cliente,onChange:function(e){setF(Object.assign({},f,{nombre_cliente:e.target.value}));},style:{padding:10,border:'1px solid #CBD5E1',borderRadius:8,fontSize:13}}),
          h('input',{placeholder:'Ciudad',value:f.ciudad,onChange:function(e){setF(Object.assign({},f,{ciudad:e.target.value}));},style:{padding:10,border:'1px solid #CBD5E1',borderRadius:8,fontSize:13}}),
          h('select',{value:f.nicho,onChange:function(e){setF(Object.assign({},f,{nicho:e.target.value}));},style:{padding:10,border:'1px solid #CBD5E1',borderRadius:8,fontSize:13}},
            h('option',{value:''},'Nicho...'),['hotel','tour operator','charter fishing','dive shop','restaurante','spa wellness','wedding planner'].map(function(n){return h('option',{key:n},n);})),
          h('select',{value:f.pais,onChange:function(e){setF(Object.assign({},f,{pais:e.target.value}));},style:{padding:10,border:'1px solid #CBD5E1',borderRadius:8,fontSize:13}},
            h('option',{value:'MX'},'🇲🇽 México'),h('option',{value:'US'},'🇺🇸 USA')),
          h('textarea',{placeholder:'Resultado (ej: +30% reservas en 45 días)',value:f.resultado_concreto,onChange:function(e){setF(Object.assign({},f,{resultado_concreto:e.target.value}));},style:{padding:10,border:'1px solid #CBD5E1',borderRadius:8,fontSize:13,minHeight:70}}),
          h('input',{type:'number',placeholder:'Monto USD',value:f.monto_usd,onChange:function(e){setF(Object.assign({},f,{monto_usd:+e.target.value}));},style:{padding:10,border:'1px solid #CBD5E1',borderRadius:8,fontSize:13}}),
          h('textarea',{placeholder:'Testimonio corto',value:f.testimonio_corto,onChange:function(e){setF(Object.assign({},f,{testimonio_corto:e.target.value}));},style:{padding:10,border:'1px solid #CBD5E1',borderRadius:8,fontSize:13,minHeight:60}})
        ),
        h('div',{style:{display:'flex',gap:8,marginTop:16}},
          h('button',{className:'btn-o',style:{flex:1},onClick:function(){setShowAdd(false);}},'Cancelar'),
          h('button',{className:'btn-p',style:{flex:1,opacity:(!f.nombre_cliente||!f.resultado_concreto)?.5:1},disabled:!f.nombre_cliente||!f.resultado_concreto,onClick:function(){queue('CASO_EXITO',f);setShowAdd(false);setF({nombre_cliente:'',ciudad:'',nicho:'',pais:'MX',resultado_concreto:'',monto_usd:797,testimonio_corto:''});}},'Guardar')
        )
      )
    ):null
  );
}

function DemosView(p){
  var demos=p.data.leads.filter(function(l){return l.demo_url;});
  function copy(url){navigator.clipboard.writeText(url);toast('📋 Link copiado');}
  return h('div',{style:{display:'flex',flexDirection:'column',gap:16}},
    h('h1',{className:'text-2xl md:text-3xl font-black'},'🖥️ Demos Web ',h('span',{className:'text-slate-400 text-base font-normal'},'('+demos.length+')')),
    demos.length===0?h('div',{className:'card p-8',style:{textAlign:'center',color:'#94A3B8'}},'Aún no hay demos publicadas'):
    h('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:16}},
      demos.map(function(d){return h('div',{key:d.id,className:'card',style:{overflow:'hidden'}},
        h('div',{style:{aspectRatio:'16/10',background:'#F1F5F9',overflow:'hidden'}},
          h('img',{src:'https://image.thum.io/get/width/600/'+encodeURIComponent(d.demo_url),loading:'lazy',style:{width:'100%',height:'100%',objectFit:'cover'}})
        ),
        h('div',{style:{padding:16}},
          h('div',{style:{display:'flex',alignItems:'center',gap:6,marginBottom:4}},
            h('span',{className:'flag'},flag(d.pais)),
            h('div',{style:{fontWeight:700,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}},d.nombre)
          ),
          h('div',{style:{fontSize:11,color:'#64748B',marginBottom:12}},(d.plataforma_ciudad||'')+' · '+(d.nicho||'')),
          h('div',{style:{display:'flex',gap:8}},
            h('button',{className:'btn-o',style:{flex:1,fontSize:11},onClick:function(){copy(d.demo_url);}},'📋 Copiar'),
            h('a',{href:d.demo_url,target:'_blank',className:'btn-s',style:{flex:1,fontSize:11,textAlign:'center'}},'🔗 Abrir')
          )
        )
      );})
    )
  );
}

function AgendaView(p){
  var data=p.data;
  var today=new Date().toISOString().slice(0,10);
  var hot=mergePipeline(data.leads.filter(function(l){return l.tipo==='local';}),data.pipeline_stages).filter(function(l){return ['RESPONDIO_CALIENTE','NEGOCIANDO','OBJECION'].indexOf(l.stage)>=0;});
  var newToday=data.leads.filter(function(l){return l.fecha_captura===today;});
  var fups=data.closer_messages.filter(function(m){return m.message_type&&(m.message_type.indexOf('day3')>=0||m.message_type.indexOf('checkin')>=0);});
  var breakups=data.closer_messages.filter(function(m){return m.message_type&&(m.message_type.indexOf('day7')>=0||m.message_type.indexOf('breakup')>=0);});
  var upsells=data.closer_messages.filter(function(m){return m.message_type&&m.message_type.indexOf('upsell')>=0;});
  function Section(title,items,empty){
    return h('div',{className:'card p-4'},
      h('h3',{className:'font-bold mb-3'},title+' ',h('span',{className:'text-slate-400 text-sm'},'('+items.length+')')),
      items.length===0?h('div',{className:'text-sm text-slate-400',style:{fontStyle:'italic'}},empty):
      items.map(function(it,i){return h('div',{key:i,style:{padding:'12px 0',borderBottom:'1px solid #F1F5F9'}},
        h('div',{style:{display:'flex',justifyContent:'space-between',gap:8,alignItems:'start'}},
          h('div',{style:{minWidth:0,flex:1}},
            h('div',{className:'font-semibold text-sm',style:{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}},it.nombre||it.lead_id),
            it.plataforma_ciudad?h('div',{className:'text-xs text-slate-500'},it.plataforma_ciudad):null,
            it.message_text?h('div',{className:'text-xs text-slate-600 mt-1',style:{whiteSpace:'pre-wrap'}},it.message_text.slice(0,160)+(it.message_text.length>160?'…':'')):null
          ),
          (it.wa_link||it.whatsapp)?h('a',{href:it.wa_link||it.whatsapp,target:'_blank',className:'btn-p',style:{fontSize:11,flexShrink:0}},'📤 Enviar'):null
        )
      );})
    );
  }
  return h('div',{style:{display:'flex',flexDirection:'column',gap:16}},
    h('h1',{className:'text-2xl md:text-3xl font-black'},'📅 Agenda Hoy'),
    h('div',{className:'grid md:grid-cols-2 gap-4',style:{display:'grid',gap:16}},
      Section('🔥 Calientes',hot,'Sin leads calientes'),
      Section('🌅 Nuevos del día',newToday,'Sin leads nuevos'),
      Section('🔄 Follow-ups',fups,'Sin follow-ups'),
      Section('🔄 Breakups',breakups,'Sin breakups'),
      Section('💸 Upsells',upsells,'Sin upsells')
    )
  );
}


function AnalyticsView(p){
  var data=p.data;
  var leads=mergePipeline(data.leads,data.pipeline_stages);
  var byCity={};leads.filter(function(l){return l.tipo==='local';}).forEach(function(l){if(l.plataforma_ciudad)byCity[l.plataforma_ciudad]=(byCity[l.plataforma_ciudad]||0)+1;});
  var cityData=Object.entries(byCity).sort(function(a,b){return b[1]-a[1];}).slice(0,10);
  var localLeads=leads.filter(function(l){return l.tipo==='local';});
  var usLeads=localLeads.filter(function(l){return l.pais==='US';});
  var mxLeads=localLeads.filter(function(l){return l.pais==='MX';});
  var avgUS=usLeads.length?Math.round(usLeads.reduce(function(a,b){return a+(b.ticket_estimado||0);},0)/usLeads.length):0;
  var avgMX=mxLeads.length?Math.round(mxLeads.reduce(function(a,b){return a+(b.ticket_estimado||0);},0)/mxLeads.length):0;
  var won=data.pipeline_stages.filter(function(p){return p.stage==='CERRADO_GANADO';});
  var funnel=[
    {stage:'Total leads',count:data.pipeline_stages.length+leads.filter(function(l){return !data.pipeline_stages.find(function(p){return p.lead_id===l.id;});}).length},
    {stage:'Contactados',count:data.pipeline_stages.length},
    {stage:'Respondieron',count:data.pipeline_stages.filter(function(p){return ['RESPONDIO_FRIO','RESPONDIO_CALIENTE','DEMO_ENVIADA','NEGOCIANDO','OBJECION','CERRADO_GANADO','CERRADO_PERDIDO'].indexOf(p.stage)>=0;}).length},
    {stage:'Demo enviada',count:data.pipeline_stages.filter(function(p){return ['DEMO_ENVIADA','NEGOCIANDO','OBJECION','CERRADO_GANADO'].indexOf(p.stage)>=0;}).length},
    {stage:'Cerrados ganados',count:won.length}
  ];
  var maxCity=Math.max.apply(null,cityData.map(function(c){return c[1];}).concat(1));
  var maxFunnel=Math.max.apply(null,funnel.map(function(f){return f.count;}).concat(1));
  return h('div',{style:{display:'flex',flexDirection:'column',gap:16}},
    h('h1',{className:'text-2xl md:text-3xl font-black'},'📊 Analytics'),
    h('div',{className:'grid md:grid-cols-2 gap-4',style:{display:'grid',gap:16}},
      h('div',{className:'card p-5'},
        h('h3',{className:'font-bold mb-3'},'🏙️ Top ciudades'),
        cityData.length===0?h('div',{className:'text-sm text-slate-400'},'Sin datos'):
        h('div',{style:{display:'flex',flexDirection:'column',gap:6}},
          cityData.map(function(c){return h('div',{key:c[0],style:{display:'flex',alignItems:'center',gap:8}},
            h('div',{style:{width:100,fontSize:11,color:'#64748B',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}},c[0]),
            h('div',{style:{flex:1,height:18,background:'#F1F5F9',borderRadius:4,overflow:'hidden',position:'relative'}},
              h('div',{style:{height:'100%',width:(c[1]/maxCity*100)+'%',background:'#0EA5E9'}}),
              h('div',{style:{position:'absolute',inset:0,display:'flex',alignItems:'center',paddingLeft:8,fontSize:11,fontWeight:700,color:'#fff'}},c[1])
            )
          );})
        )
      ),
      h('div',{className:'card p-5'},
        h('h3',{className:'font-bold mb-3'},'💰 Ticket promedio por país'),
        h('div',{style:{padding:'20px 0',display:'flex',flexDirection:'column',gap:20}},
          h('div',null,
            h('div',{style:{display:'flex',justifyContent:'space-between',marginBottom:6}},h('span',null,'🇺🇸 USA'),h('span',{style:{fontWeight:700}},money(avgUS))),
            h('div',{style:{height:12,background:'#F1F5F9',borderRadius:999,overflow:'hidden'}},h('div',{style:{height:'100%',background:'#0EA5E9',width:Math.min(100,avgUS/2500*100)+'%'}}))
          ),
          h('div',null,
            h('div',{style:{display:'flex',justifyContent:'space-between',marginBottom:6}},h('span',null,'🇲🇽 México'),h('span',{style:{fontWeight:700}},money(avgMX))),
            h('div',{style:{height:12,background:'#F1F5F9',borderRadius:999,overflow:'hidden'}},h('div',{style:{height:'100%',background:'#F59E0B',width:Math.min(100,avgMX/2500*100)+'%'}}))
          )
        )
      ),
      h('div',{className:'card p-5',style:{gridColumn:'1/-1'}},
        h('h3',{className:'font-bold mb-3'},'🎯 Funnel de conversión'),
        h('div',{style:{display:'flex',flexDirection:'column',gap:8}},
          funnel.map(function(f){return h('div',{key:f.stage,style:{display:'flex',alignItems:'center',gap:12}},
            h('div',{style:{width:150,fontSize:13,fontWeight:600}},f.stage),
            h('div',{style:{flex:1,height:32,background:'#F1F5F9',borderRadius:8,overflow:'hidden',position:'relative'}},
              h('div',{style:{height:'100%',width:(f.count/maxFunnel*100)+'%',background:'linear-gradient(90deg,#0EA5E9,#F59E0B)',borderRadius:8}}),
              h('div',{style:{position:'absolute',inset:0,display:'flex',alignItems:'center',paddingLeft:12,fontSize:12,fontWeight:700,color:'#fff'}},f.count)
            )
          );})
        )
      )
    )
  );
}


function AfiliadosView(p){
  var [tab,setTab]=useState('programas');
  var data=p.data;
  var progs=data.programas_afiliados||[];
  var cont=data.contenido_afiliados||[];
  var Tab=function(id,label,count){return h('button',{onClick:function(){setTab(id);},style:{padding:'8px 14px',borderRadius:8,border:0,cursor:'pointer',fontWeight:600,fontSize:13,background:tab===id?'#0EA5E9':'#F1F5F9',color:tab===id?'#fff':'#475569'}},label+' ('+count+')');};
  return h('div',{style:{display:'flex',flexDirection:'column',gap:16}},
    h('h1',{className:'text-2xl md:text-3xl font-black'},'💰 Afiliados Turísticos'),
    h('div',{style:{display:'flex',gap:8,flexWrap:'wrap'}},
      Tab('programas','📋 Programas',progs.length),
      Tab('contenido','📹 Contenido',cont.length),
      Tab('ingresos','💵 Ingresos',0)
    ),
    tab==='programas'?h('div',{className:'card',style:{overflowX:'auto'}},
      h('table',null,
        h('thead',null,h('tr',null,h('th',null,'Prio'),h('th',null,'Programa'),h('th',null,'Nicho'),h('th',null,'Comisión'),h('th',null,'Estado'),h('th',null,'Requisitos'),h('th',null,''))),
        h('tbody',null,progs.map(function(pr){
          var pColor={A:'#16A34A',B:'#CA8A04',C:'#64748B'}[pr.prioridad]||'#64748B';
          return h('tr',{key:pr.id},
            h('td',null,h('span',{className:'badge',style:{background:pColor+'22',color:pColor}},pr.prioridad)),
            h('td',null,h('div',{style:{fontWeight:600}},pr.nombre_programa),h('div',{style:{fontSize:11,color:'#64748B'}},pr.empresa)),
            h('td',null,h('span',{className:'badge',style:{background:'#E0F2FE',color:'#075985'}},pr.nicho)),
            h('td',null,h('span',{style:{fontWeight:700,color:'#059669'}},pr.comision_pct+'%')),
            h('td',null,h('span',{className:'badge',style:pr.status==='active'?{background:'#BBF7D0',color:'#166534'}:{background:'#E5E7EB',color:'#374151'}},pr.status)),
            h('td',{style:{fontSize:11,maxWidth:200}},pr.requisitos),
            h('td',null,h('a',{href:pr.url_signup,target:'_blank',className:'btn-p',style:{fontSize:11,padding:'4px 10px'}},'Aplicar'))
          );
        }))
      )
    ):null,
    tab==='contenido'?h('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:16}},
      cont.map(function(c){return h('div',{key:c.id,className:'card p-4',style:{display:'flex',flexDirection:'column',gap:8}},
        h('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'start',gap:8}},
          h('div',null,h('div',{className:'text-xs',style:{color:'#64748B',textTransform:'uppercase',fontWeight:700}},c.fecha+' · '+c.plataforma),h('div',{className:'font-bold text-sm',style:{marginTop:4}},c.tema)),
          h('span',{className:'badge',style:c.status==='publicado'?{background:'#BBF7D0',color:'#166534'}:{background:'#FEF3C7',color:'#92400E'}},c.status)
        ),
        h('div',{className:'card p-3',style:{background:'#FAF5FF',border:'1px solid #E9D5FF',fontSize:13,fontWeight:700}},'🎬 '+c.hook),
        h('div',{className:'card p-3',style:{background:'#F8FAFC',border:'1px solid #E2E8F0',fontSize:13,whiteSpace:'pre-wrap',maxHeight:120,overflow:'auto'}},c.script),
        h('div',{style:{fontSize:11,color:'#0369A1'}},'🔗 '+c.link_afiliado_usado),
        h('div',{style:{fontSize:11,color:'#64748B',fontStyle:'italic',wordBreak:'break-word'}},c.hashtags),
        h('div',{style:{display:'flex',gap:6,flexWrap:'wrap'}},
          h('button',{className:'btn-o',style:{fontSize:11,flex:1},onClick:function(){navigator.clipboard.writeText(c.script);toast('📋 Script copiado');}},'📋 Script'),
          h('button',{className:'btn-o',style:{fontSize:11,flex:1},onClick:function(){navigator.clipboard.writeText(c.caption_larga);toast('📋 Caption IG');}},'📝 Caption IG'),
          h('button',{className:'btn-o',style:{fontSize:11,flex:1},onClick:function(){navigator.clipboard.writeText(c.caption_corta);toast('📋 Caption TT');}},'📱 Caption TT')
        )
      );})
    ):null,
    tab==='ingresos'?h('div',{className:'card p-8',style:{textAlign:'center',color:'#94A3B8'}},
      h('div',{style:{fontSize:40,marginBottom:12}},'💵'),
      h('div',{className:'font-bold mb-2'},'Sin comisiones reportadas aún'),
      h('div',{className:'text-sm'},'Reporta publicaciones y comisiones respondiendo al email semanal con formato: COMISION_AFILIADO: [programa] | [monto_usd] | [fecha]')
    ):null
  );
}

function SettingsView(p){
  var [q,setQ]=useState(getQ());
  var data=p.data;
  var s=data.settings;
  var text=q.length===0?'':'SYNC_QUEUE from dashboard\n\n'+q.map(function(x){return x.type+': '+JSON.stringify(x.payload);}).join('\n\n');
  var mailto='mailto:robertmartinez.og@gmail.com?subject='+encodeURIComponent('[DASHBOARD SYNC] '+q.length+' updates')+'&body='+encodeURIComponent(text);
  return h('div',{style:{display:'flex',flexDirection:'column',gap:16}},
    h('h1',{className:'text-2xl md:text-3xl font-black'},'⚙️ Ajustes'),
    h('div',{className:'card p-5',style:{background:'#FEF3C7',border:'1px solid #FDE68A'}},
      h('h3',{className:'font-bold mb-2'},'🔄 Cambios pendientes ('+q.length+')'),
      h('p',{className:'text-sm',style:{color:'#334155',marginBottom:12}},'El dashboard es read-only contra la DB. Los cambios locales se sincronizan por email al agente.'),
      q.length>0?h('div',null,
        h('pre',{style:{fontSize:11,background:'#fff',border:'1px solid #FDE68A',padding:12,borderRadius:6,marginBottom:12,maxHeight:200,overflow:'auto',whiteSpace:'pre-wrap'}},text),
        h('div',{style:{display:'flex',gap:8,flexWrap:'wrap'}},
          h('a',{href:mailto,className:'btn-p'},'📧 Enviar por email'),
          h('button',{className:'btn-o',onClick:function(){navigator.clipboard.writeText(text);toast('📋 Copiado');}},'📋 Copiar'),
          h('button',{className:'btn-o',onClick:function(){clearQ();setQ([]);toast('🗑️ Cola limpiada');}},'🗑️ Limpiar cola')
        )
      ):h('div',{className:'text-sm text-slate-500',style:{fontStyle:'italic'}},'No hay cambios pendientes')
    ),
    h('div',{className:'card p-5'},
      h('h3',{className:'font-bold mb-3'},'🏙️ Ciudades activas'),
      h('div',{style:{display:'flex',flexWrap:'wrap',gap:6}},
        (s.ciudades_activas||'').split(',').map(function(c){return c.trim();}).filter(Boolean).map(function(c){return h('span',{key:c,className:'badge',style:{background:'#E0F2FE',color:'#075985'}},c);})
      )
    ),
    h('div',{className:'card p-5'},
      h('h3',{className:'font-bold mb-3'},'🎯 Nichos activos'),
      h('div',{style:{display:'flex',flexWrap:'wrap',gap:6}},
        (s.nichos_activos||'').split(',').map(function(n){return n.trim();}).filter(Boolean).map(function(n){return h('span',{key:n,className:'badge',style:{background:'#FEF3C7',color:'#92400E'}},n);})
      )
    ),
    h('div',{className:'card p-5'},
      h('h3',{className:'font-bold mb-3'},'📋 Datos'),
      h('div',{style:{fontSize:14}},
        h('div',null,h('b',null,'Nombre:'),' ',s.nombre_comercial||'—'),
        h('div',null,h('b',null,'Horario:'),' ',s.horario_preferido||'—'),
        h('div',null,h('b',null,'Password:'),' ',h('code',{style:{background:'#F1F5F9',padding:'2px 8px',borderRadius:4,fontSize:12}},s.dashboard_password))
      )
    ),
    h('div',{className:'card p-5'},
      h('h3',{className:'font-bold mb-3'},'📦 Snapshot'),
      h('div',{className:'text-sm'},'Generado: ',h('b',null,new Date(data.generated_at).toLocaleString('es'))),
      h('div',{className:'text-xs text-slate-500 mt-1'},'Se regenera con cada run del agente (7am Colombia).')
    )
  );
}

function App(){
  var [data,setData]=useState(null);
  var [status,setStatus]=useState('loading');
  var [active,setActive]=useState('home');
  var [logged,setLogged]=useState(false);
  var [error,setError]=useState(null);

  useEffect(function(){
    document.getElementById('loader-msg').textContent='🌊 Cargando datos...';
    fetch('./data.json?t='+Date.now()).then(function(r){
      if(!r.ok)throw new Error('HTTP '+r.status);
      return r.json();
    }).then(function(d){
      document.getElementById('loader-msg').textContent='✅ Listo';
      setData(d);setStatus('ok');
      setTimeout(function(){var l=document.getElementById('loader');if(l){l.classList.add('fade-out');setTimeout(function(){l.remove();},400);}},200);
    }).catch(function(e){
      setError(e.message);setStatus('error');
      document.getElementById('loader').remove();
    });
  },[]);

  if(status==='error')return h('div',{style:{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:16}},
    h('div',{className:'card p-6',style:{maxWidth:400}},
      h('h2',{className:'font-bold text-lg mb-2'},'⚠️ Error cargando datos'),
      h('p',{className:'text-sm text-slate-600 mb-3'},'No se pudo leer data.json: '+error),
      h('button',{className:'btn-p',onClick:function(){location.reload();}},'🔄 Reintentar')
    )
  );
  if(status==='loading'||!data)return null;

  if(!logged)return h(Login,{password:data.settings.dashboard_password||'coastal2026',onLogin:function(){setLogged(true);}});

  var viewMap={home:HomeView,local:LocalView,freelance:FreelanceView,casos:CasosView,demos:DemosView,agenda:AgendaView,analytics:AnalyticsView,afiliados:AfiliadosView,settings:SettingsView};
  var View=viewMap[active]||HomeView;

  return h('div',{style:{minHeight:'100vh'}},
    h(Sidebar,{active:active,setActive:setActive,stats:data.stats}),
    h('main',{style:{paddingBottom:80},className:'md:pl-60'},
      h('div',{style:{maxWidth:1200,margin:'0 auto',padding:'16px'}},
        (function(){try{return h(View,{data:data});}catch(e){console.error('View error:',e);return h('div',{className:'card p-5'},h('h3',{className:'font-bold mb-2'},'⚠️ Error en vista'),h('pre',{style:{fontSize:11,whiteSpace:'pre-wrap',color:'#B91C1C'}},e.message+'\n'+(e.stack||'')));}})()
      )
    ),
    h(BottomNav,{active:active,setActive:setActive})
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(h(App));
