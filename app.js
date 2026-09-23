(function(){
  const KEY = 'yagod_state_v1';
  const DEFAULT_STATE = {
    ty: 9,
    tok: 1000,
    xp: 0,
    lvl: 1,
    chest: 1,
    goals: {
      twitch:  { min: 20, next: 120 },
      kick:    { min: 0,  next: 120 },
      youtube: { min: 0,  next: 120 }
    },
    missions: [
      { name: 'Jogue Yagod por 30 min', rarity: 'comum',   prog: 0, target: 30, reward: '50 Yagod Coins' },
      { name: 'Vença 1 partida ranqueada', rarity: 'raro',   prog: 0, target: 1,  reward: '1 Chave de Rubi' },
      { name: 'Abra 2 baús', rarity: 'incomum', prog: 0, target: 2,  reward: '100 Tokens' }
    ],
    streak: 2,
    calDone: [1,2],
    lastCollect: null
  };

  function load(){
    try{
      const raw = localStorage.getItem(KEY);
      if(!raw) return JSON.parse(JSON.stringify(DEFAULT_STATE));
      return Object.assign(JSON.parse(JSON.stringify(DEFAULT_STATE)), JSON.parse(raw));
    }catch(e){ return JSON.parse(JSON.stringify(DEFAULT_STATE)); }
  }
  function save(){ try{ localStorage.setItem(KEY, JSON.stringify(window.YGD.state)); }catch(e){} }

  window.YGD = {
    state: load(),
    save: save,
    toast: function(msg){
      const t = document.getElementById('toast');
      if(!t) return;
      t.textContent = msg;
      t.classList.add('show');
      clearTimeout(window.__ygdToastTimer);
      window.__ygdToastTimer = setTimeout(()=>t.classList.remove('show'), 1800);
    },
    renderHeader: function(){
      const st = this.state;
      const ty = document.getElementById('tyCount');
      const tok = document.getElementById('tokCount');
      const lvl = document.getElementById('lvlCount');
      if(ty) ty.textContent = st.ty;
      if(tok) tok.textContent = st.tok;
      if(lvl) lvl.textContent = st.lvl;
    },
    RANKING: [
      {pos:1, name:'Draven', lvl:457, ic:'🐉'},
      {pos:2, name:'Kael',   lvl:437, ic:'🛡️'},
      {pos:3, name:'Sylas',  lvl:400, ic:'🏹'},
      {pos:4, name:'Mira',   lvl:335, ic:'🗡️'},
      {pos:5, name:'Orin',   lvl:335, ic:'🔥'},
      {pos:6, name:'Vex',    lvl:332, ic:'⚔️'},
      {pos:7, name:'Talia',  lvl:323, ic:'🌙'},
      {pos:8, name:'Bram',   lvl:323, ic:'🪓'},
      {pos:9, name:'Nyra',   lvl:322, ic:'✨'},
      {pos:10,name:'Ezra',   lvl:308, ic:'🎯'}
    ]
  };

  document.addEventListener('DOMContentLoaded', function(){
    window.YGD.renderHeader();

    // monthly reward modal (present in every page via header click)
    const trigger = document.getElementById('openMonthly');
    const modalBg = document.getElementById('modalBg');
    if(trigger && modalBg){
      trigger.addEventListener('click', ()=> modalBg.classList.add('show'));
      const closeb = document.getElementById('closeModal');
      if(closeb) closeb.addEventListener('click', ()=> modalBg.classList.remove('show'));
      modalBg.addEventListener('click', (e)=>{ if(e.target === modalBg) modalBg.classList.remove('show'); });
      renderCalendar();
      const collectBtn = document.getElementById('collectBtn');
      if(collectBtn){
        collectBtn.addEventListener('click', ()=>{
          const st = window.YGD.state;
          const today = new Date().toISOString().slice(0,10);
          if(st.lastCollect === today){ window.YGD.toast('Já coletado hoje'); return; }
          st.streak += 1;
          st.calDone.push(st.streak);
          st.lastCollect = today;
          st.ty += 1;
          window.YGD.save();
          window.YGD.renderHeader();
          renderCalendar();
          window.YGD.toast('Recompensa coletada! +1 Yagod Coin');
        });
      }
    }
  });

  function renderCalendar(){
    const st = window.YGD.state;
    const streakVal = document.getElementById('streakVal');
    if(streakVal) streakVal.textContent = st.streak + ' dias';
    const grid = document.getElementById('calGrid');
    if(!grid) return;
    grid.innerHTML = '';
    for(let d=1; d<=28; d++){
      const done = st.calDone.includes(d);
      const div = document.createElement('div');
      div.className = 'day ' + (done?'done':'') + (d===st.streak+1?' today':'');
      div.innerHTML = '<b>D'+d+'</b>🎁x1';
      grid.appendChild(div);
    }
  }
})();
