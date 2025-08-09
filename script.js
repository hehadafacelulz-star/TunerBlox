// script.js — TunerBLOX (2016-style) single shared logic + demo data
(() => {
  // Demo data (replace with fetch() to your backend later)
  const sampleNews = [
    {id:1,date:'Aug 1, 2025',title:'TunerBLOX Alpha',body:'TunerBLOX is live in alpha — enjoy!'},
    {id:2,date:'Jul 25, 2025',title:'Maintenance',body:'Scheduled maintenance tonight 02:00 UTC.'}
  ];

  const samplePlaces = [
    {id:1,title:'Midnight Drifts',creator:'DriftKing',thumb:'assets/park1.jpg',players:12,visits:1245,desc:'Night drift map.'},
    {id:2,title:'Street Tuner Show',creator:'AutoExpo',thumb:'assets/park2.jpg',players:6,visits:842,desc:'Showcase your car.'},
    {id:3,title:'Tune Garage',creator:'Wrench',thumb:'assets/park3.jpg',players:2,visits:391,desc:'Customize cars.'},
    {id:4,title:'City Circuit',creator:'SpeedLab',thumb:'assets/park4.jpg',players:9,visits:1589,desc:'Fast city race.'},
    {id:5,title:'Classic Obby',creator:'Builderman',thumb:'assets/obby.png',players:1,visits:480}
  ];

  const sampleUsers = [
    {username:'ROBLOX',display:'ROBLOX',avatar:'RB',bio:'Admin',places:[5]},
    {username:'DriftKing',display:'DriftKing',avatar:'DK',bio:'Drifts',places:[1]},
    {username:'AutoExpo',display:'AutoExpo',avatar:'AE',bio:'Events',places:[2]},
    {username:'Wrench',display:'Wrench',avatar:'WR',bio:'Mechanic',places:[3]}
  ];

  const sampleThreads = [
    {id:1,section:'Announcements',title:'Welcome to TunerBLOX',author:'ROBLOX',replies:10,last:'Aug 1, 2025'},
    {id:2,section:'General',title:'Share builds',author:'AutoExpo',replies:4,last:'Jul 30, 2025'}
  ];

  const $ = (s, ctx=document) => ctx.querySelector(s);
  const $$ = (s, ctx=document) => Array.from(ctx.querySelectorAll(s));
  const q = new URLSearchParams(window.location.search);

  // auth (demo)
  const AUTH_KEY = 'tunerblox_user';
  function getCurrent() { return localStorage.getItem(AUTH_KEY); }
  function setCurrent(u) { if(u) localStorage.setItem(AUTH_KEY,u); else localStorage.removeItem(AUTH_KEY); updateLoginUI(); }

  // populate years + header logo
  function populateCommon() {
    $$('[id^="year"]').forEach(el => el.textContent = (new Date()).getFullYear());
    // insert logo img if present (already in HTML)
    $('#player-count') && ($('#player-count').textContent = Math.floor(Math.random()*200)+10);
    $('#place-count') && ($('#place-count').textContent = samplePlaces.length);
  }

  // renderers
  function renderNews() {
    const c = $('#news-list'); if(!c) return; c.innerHTML='';
    sampleNews.forEach(n => {
      const d = document.createElement('div'); d.className='news-item';
      d.innerHTML = `<strong>${n.date}</strong><h4>${n.title}</h4><p>${n.body}</p>`;
      c.appendChild(d);
    });
  }

  function makeTile(p) {
    const el = document.createElement('div'); el.className='place-card';
    el.innerHTML = `<img src="${p.thumb||'assets/placeholder.png'}" alt=""><strong>${p.title}</strong><div class="muted">by ${p.creator} • ${p.players} online</div><div style="margin-top:6px"><a class="btn" href="place.html?id=${p.id}">Play</a></div>`;
    return el;
  }

  function renderFeatured() {
    const f = $('#featured-list'); if(!f) return; f.innerHTML='';
    samplePlaces.slice(0,3).forEach(p => f.appendChild(makeTile(p)));
  }

  function renderGamesPreview() {
    const gl = $('#games-list'); if(!gl) return; gl.innerHTML='';
    samplePlaces.slice(0,6).forEach(p => gl.appendChild(makeTile(p)));
  }

  function renderAllPlaces() {
    const all = $('#all-places'); if(!all) return; all.innerHTML='';
    const query = q.get('q');
    const list = query ? samplePlaces.filter(p => p.title.toLowerCase().includes(query.toLowerCase())) : samplePlaces;
    list.forEach(p => all.appendChild(makeTile(p)));
    if(list.length===0) all.innerHTML = '<div class="box">No places found.</div>';
  }

  function renderUsers() {
    const ul = $('#user-list'); if(!ul) return; ul.innerHTML='';
    sampleUsers.forEach(u => {
      const el = document.createElement('div'); el.className='box';
      el.innerHTML = `<div style="display:flex;gap:10px;align-items:center"><div class="avatar">${u.avatar}</div><div><strong><a href="profile.html?user=${u.username}">${u.display}</a></strong><div class="muted">${u.bio}</div></div></div>`;
      ul.appendChild(el);
    });
  }

  function renderForums() {
    const f = $('#forum-threads'); if(!f) return; f.innerHTML='';
    sampleThreads.forEach(t => {
      const el = document.createElement('div'); el.className='box';
      el.innerHTML = `<strong>${t.section}</strong><div><a href="#">${t.title}</a></div><div class="muted">by ${t.author} • ${t.replies} replies • ${t.last}</div>`;
      f.appendChild(el);
    });
  }

  function renderPlace() {
    const id = q.get('id'); if(!id) return; const p = samplePlaces.find(x=>String(x.id)===String(id)); if(!p) return;
    $('#place-title') && ($('#place-title').textContent = p.title);
    $('#place-thumb') && ($('#place-thumb').src = p.thumb||'assets/placeholder.png');
    $('#place-creator') && ($('#place-creator').innerHTML = `<a href="profile.html?user=${p.creator}">${p.creator}</a>`);
    $('#place-desc') && ($('#place-desc').textContent = p.desc || 'No description.');
    $('#play-btn') && ($('#play-btn').onclick = ()=>alert('Launch place (hook to launcher)'));
    // players preview
    const row = $('#place-players'); if(row) {
      row.innerHTML='';
      for(let i=0;i<Math.min(8,(p.players||0));i++){
        const a = document.createElement('div'); a.className='avatar'; a.textContent = 'P'+(i+1);
        row.appendChild(a);
      }
    }
  }

  function renderProfile() {
    const userParam = q.get('user'); if(!userParam) return; const u = sampleUsers.find(x=>x.username===userParam); if(!u) return;
    $('#profile-name') && ($('#profile-name').textContent = u.display);
    $('#profile-bio') && ($('#profile-bio').textContent = u.bio);
    const avatar = document.querySelector('.avatar.big'); if(avatar) avatar.textContent = u.avatar;
    const places = $('#profile-places'); if(places) {
      places.innerHTML='';
      (u.places||[]).forEach(pid => {
        const p = samplePlaces.find(x=>x.id===pid);
        if(p) places.appendChild(makeTile(p));
      });
    }
  }

  // login handling
  function setupLoginShort() {
    const form = $('#login-form'); if(!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const user = $('#login-user').value.trim();
      const pass = $('#login-pass').value;
      const found = sampleUsers.find(u => u.username.toLowerCase()===user.toLowerCase());
      if(!found){ alert('Unknown user (demo). Try ROBLOX or DriftKing.'); return; }
      if(found.username==='ROBLOX' && pass!=='adminpass'){ alert('Invalid admin password (demo).'); return; }
      setCurrent(found.username);
      alert('Logged in (demo).');
      window.location.href='index.html';
    });
  }

  function setupLoginFull() {
    const form = $('#login-form-full'); if(!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const user = form.username.value.trim(); const pass = form.password.value;
      const found = sampleUsers.find(u => u.username.toLowerCase()===user.toLowerCase());
      if(!found){ alert('Unknown user (demo).'); return; }
      if(found.username==='ROBLOX' && pass!=='adminpass'){ alert('Invalid admin pass (demo).'); return; }
      setCurrent(found.username);
      alert('Logged in (demo).');
      window.location.href='index.html';
    });
  }

  function setupSignup() {
    const block = $('#signup-block'); if(!block) return;
    const form = $('#signup-form');
    const adminParam = q.get('admin');
    const isAdmin = adminParam==='ROBLOX' || getCurrent() === 'ROBLOX';
    if(isAdmin){ if(form) form.style.display='block'; block.querySelectorAll('p').forEach(p=>p.style.display='none'); }
    if(!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const u = $('#su-user').value.trim();
      const p = $('#su-pass').value;
      const p2 = $('#su-pass2').value;
      if(!u||!p){ alert('Fill username + password'); return; }
      if(p!==p2){ alert('Passwords do not match'); return; }
      // demo: push to sampleUsers
      sampleUsers.push({username:u,display:u,avatar:u.slice(0,2).toUpperCase(),bio:'New user (demo)',places:[]});
      alert('Created (demo).');
      window.location.href='users.html';
    });
  }

  function setCurrent(u){ if(u) localStorage.setItem(AUTH_KEY,u); else localStorage.removeItem(AUTH_KEY); updateLoginUI(); }
  function getCurrent(){ return localStorage.getItem(AUTH_KEY); }

  function updateLoginUI(){
    const current = getCurrent();
    $$('.login-toggle').forEach(a => {
      if(current){ a.textContent='Logout'; a.href='#'; a.addEventListener('click',e=>{ e.preventDefault(); setCurrent(null); location.reload(); }); }
      else { a.textContent='Login'; a.href='login.html'; }
    });
    $$('.login-username').forEach(el => { el.textContent = current || 'Guest'; });
  }

  function initSearchBoxes() {
    const gs = $('#games-search'); if(gs) gs.addEventListener('keypress', e => { if(e.key==='Enter'){ const qv=gs.value.trim(); window.location.href='games.html'+(qv?`?q=${encodeURIComponent(qv)}`:''); } });
  }

  function init(){
    populateCommon();
    renderNews(); renderFeatured(); renderGamesPreview(); renderAllPlaces(); renderUsers(); renderForums();
    renderPlace(); renderProfile();
    setupLoginShort(); setupLoginFull(); setupSignup(); initSearchBoxes(); updateLoginUI();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();

  // expose for debug
  window.TunerBLOX = { samplePlaces, sampleUsers, sampleThreads, sampleNews, getCurrent };
})();
