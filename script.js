// =============================================
//  BESTIES SPACE — script.js
// =============================================

// ---- STATE ----
let state = {
  events:      [],
  invites:     [],
  outfits:     [],
  schedule:    [],
  messages:    [],
  ratings:     [],
  gallery:     [],
  music:       [],
  todos:       [],
  polls:       [],
  food:        [],
  bucket:      [],
  gifts:       [],
  timeline:    [],
  confessions: []
};

let currentRating = 0;

// ---- PERSIST ----
function save() {
  try { localStorage.setItem('bestiesspace', JSON.stringify(state)); } catch (e) {}
}

function load() {
  try {
    const d = localStorage.getItem('bestiesspace');
    if (d) state = Object.assign(state, JSON.parse(d));
  } catch (e) {}
}

// ---- HELPERS ----
function v(id)       { return (document.getElementById(id) || {}).value || ''; }
function clr(...ids) { ids.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; }); }
function uid()       { return Date.now(); }

// ---- NAV ----
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  // Highlight matching nav button
  document.querySelectorAll('.nav-btn').forEach(b => {
    if ((id === 'home' && b.textContent.includes('🏠')) ||
        b.getAttribute('onclick') === `showPage('${id}')`) {
      b.classList.add('active');
    }
  });
  renderAll();
  window.scrollTo(0, 0);
}

// ---- RENDER ALL ----
function renderAll() {
  renderHome();
  renderEvents();
  renderInvites();
  renderOutfits();
  renderSchedule();
  renderMessages();
  renderRatings();
  renderGallery();
  renderMusic();
  renderTodos();
  renderPolls();
  renderFood();
  renderBucket();
  renderGifts();
  renderTimeline();
  renderConfessions();
}

// =============================================
//  HOME
// =============================================
function renderHome() {
  const el = document.getElementById('home-upcoming');
  if (!el) return;
  const today = new Date().toISOString().split('T')[0];
  const upcoming = [...state.events, ...state.invites]
    .filter(e => e.date >= today)
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .slice(0, 4);
  if (!upcoming.length) {
    el.innerHTML = '<div class="empty"><span class="empty-icon">🌸</span>No upcoming events yet!</div>';
    return;
  }
  el.innerHTML = upcoming.map(e =>
    `<div class="item">
       <span class="item-icon">${e.icon || '🎉'}</span>
       <div class="item-body">
         <div class="item-title">${e.title || e.name || ''}</div>
         <div class="item-sub">${e.date || ''}</div>
       </div>
     </div>`
  ).join('');
}

// =============================================
//  CALENDAR
// =============================================
function addEvent() {
  const title = v('ev-title');
  if (!title) return;
  state.events.push({ id: uid(), title, date: v('ev-date'), icon: v('ev-type') });
  clr('ev-title', 'ev-date');
  save(); renderAll();
}

function renderEvents() {
  const el = document.getElementById('calendar-list');
  if (!el) return;
  if (!state.events.length) {
    el.innerHTML = '<div class="empty"><span class="empty-icon">📅</span>No events yet!</div>';
    return;
  }
  const sorted = [...state.events].sort((a, b) => (a.date > b.date ? 1 : -1));
  el.innerHTML = sorted.map(e =>
    `<div class="item">
       <span class="item-icon">${e.icon}</span>
       <div class="item-body">
         <div class="item-title">${e.title}</div>
         <div class="item-sub">${e.date || 'Date TBD'}</div>
       </div>
       <button class="item-del" onclick="del('events', ${e.id})">✕</button>
     </div>`
  ).join('');
}

// =============================================
//  INVITES
// =============================================
function addInvite() {
  const title = v('inv-title');
  if (!title) return;
  state.invites.push({ id: uid(), title, desc: v('inv-desc'), date: v('inv-date'), rsvp: 'pending' });
  clr('inv-title', 'inv-desc', 'inv-date');
  save(); renderAll();
}

function rsvp(id, status) {
  const inv = state.invites.find(i => i.id === id);
  if (inv) { inv.rsvp = status; save(); renderInvites(); }
}

function renderInvites() {
  const el = document.getElementById('invite-list');
  if (!el) return;
  if (!state.invites.length) {
    el.innerHTML = '<div class="empty"><span class="empty-icon">🎟️</span>No invites yet!</div>';
    return;
  }
  el.innerHTML = state.invites.map(inv =>
    `<div class="invite-card">
       <div style="display:flex;justify-content:space-between;align-items:flex-start">
         <div>
           <div style="font-weight:800;font-size:14px">🎟️ ${inv.title}</div>
           <div style="font-size:11px;color:var(--muted);margin-top:2px">${inv.date || 'Date TBD'}</div>
           ${inv.desc ? `<div style="font-size:12px;margin-top:4px">${inv.desc}</div>` : ''}
         </div>
         <button class="item-del" onclick="del('invites', ${inv.id})">✕</button>
       </div>
       <div class="rsvp-row">
         <button class="rsvp-btn${inv.rsvp === 'going'  ? ' going'  : ''}" onclick="rsvp(${inv.id}, 'going')">✅ Going</button>
         <button class="rsvp-btn${inv.rsvp === 'maybe'  ? ' maybe'  : ''}" onclick="rsvp(${inv.id}, 'maybe')">🤔 Maybe</button>
         <button class="rsvp-btn${inv.rsvp === 'cant'   ? ' cantgo' : ''}" onclick="rsvp(${inv.id}, 'cant')">❌ Can't</button>
       </div>
     </div>`
  ).join('');
}

// =============================================
//  OUTFITS
// =============================================
function addOutfit() {
  const theme = v('out-theme');
  if (!theme) return;
  state.outfits.push({ id: uid(), theme, desc: v('out-desc'), event: v('out-event'), color: v('out-color') });
  clr('out-theme', 'out-desc', 'out-event');
  save(); renderOutfits();
}

function renderOutfits() {
  const el = document.getElementById('outfit-list');
  if (!el) return;
  if (!state.outfits.length) {
    el.innerHTML = '<div class="empty"><span class="empty-icon">👗</span>No outfit ideas yet!</div>';
    return;
  }
  el.innerHTML = state.outfits.map(o =>
    `<div class="outfit-card">
       <div class="outfit-theme">${o.color} ${o.theme}</div>
       ${o.desc ? `<div style="font-size:13px;margin-bottom:6px">${o.desc}</div>` : ''}
       ${o.event ? `<span class="tag tag-purple">For: ${o.event}</span>` : ''}
       <button class="item-del" style="float:right;margin-top:-4px" onclick="del('outfits', ${o.id})">✕</button>
     </div>`
  ).join('');
}

// =============================================
//  SCHEDULE
// =============================================
function addSchedule() {
  const title = v('sch-title');
  if (!title) return;
  state.schedule.push({ id: uid(), title, time: v('sch-time'), where: v('sch-where') });
  clr('sch-title', 'sch-time', 'sch-where');
  save(); renderSchedule();
}

function renderSchedule() {
  const el = document.getElementById('schedule-list');
  if (!el) return;
  if (!state.schedule.length) {
    el.innerHTML = '<div class="empty"><span class="empty-icon">⏰</span>No activities yet!</div>';
    return;
  }
  el.innerHTML = state.schedule.map(s =>
    `<div class="item">
       <span class="item-icon">⏰</span>
       <div class="item-body">
         <div class="item-title">${s.title}</div>
         <div class="item-sub">${[s.time, s.where].filter(Boolean).join(' · ')}</div>
       </div>
       <button class="item-del" onclick="del('schedule', ${s.id})">✕</button>
     </div>`
  ).join('');
}

// =============================================
//  MESSAGES
// =============================================
function addMessage() {
  const text = v('msg-text');
  if (!text) return;
  state.messages.push({
    id: uid(),
    from: v('msg-from') || 'Anonymous',
    text,
    type: v('msg-type'),
    date: new Date().toLocaleDateString()
  });
  clr('msg-from', 'msg-text');
  save(); renderMessages();
}

function renderMessages() {
  const el = document.getElementById('message-list');
  if (!el) return;
  if (!state.messages.length) {
    el.innerHTML = '<div class="empty"><span class="empty-icon">💌</span>No messages yet!</div>';
    return;
  }
  el.innerHTML = [...state.messages].reverse().map(m =>
    `<div class="item" style="background:linear-gradient(135deg,#fff0f7,#fdf4ff)">
       <span class="item-icon">${m.type}</span>
       <div class="item-body">
         <div class="item-title">${m.from} <span style="font-weight:400;font-size:11px;color:var(--muted)">· ${m.date}</span></div>
         <div style="font-size:13px;margin-top:3px">${m.text}</div>
       </div>
       <button class="item-del" onclick="del('messages', ${m.id})">✕</button>
     </div>`
  ).join('');
}

// =============================================
//  RATINGS
// =============================================
function setRating(n) {
  currentRating = n;
  document.querySelectorAll('#rating-stars .star').forEach((s, i) => {
    s.classList.toggle('lit', i < n);
  });
}

function addRating() {
  const name = v('rat-name');
  if (!name) return;
  state.ratings.push({
    id: uid(), name,
    by: v('rat-by'),
    cat: v('rat-cat'),
    stars: currentRating,
    note: v('rat-note')
  });
  clr('rat-name', 'rat-by', 'rat-note');
  currentRating = 0;
  document.querySelectorAll('#rating-stars .star').forEach(s => s.classList.remove('lit'));
  save(); renderRatings();
}

function renderRatings() {
  const el = document.getElementById('ratings-list');
  if (!el) return;
  if (!state.ratings.length) {
    el.innerHTML = '<div class="empty"><span class="empty-icon">⭐</span>No ratings yet!</div>';
    return;
  }
  el.innerHTML = [...state.ratings].reverse().map(r =>
    `<div class="item">
       <span class="item-icon">${r.cat}</span>
       <div class="item-body">
         <div class="item-title">${r.name}</div>
         <div style="color:var(--yellow);font-size:14px;margin:2px 0">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div>
         ${r.note ? `<div class="item-sub">${r.note}</div>` : ''}
         ${r.by   ? `<span class="tag tag-pink">${r.by}</span>` : ''}
       </div>
       <button class="item-del" onclick="del('ratings', ${r.id})">✕</button>
     </div>`
  ).join('');
}

// =============================================
//  GALLERY
// =============================================
const GALLERY_GRADIENTS = [
  '#f9a8d4,#c084fc', '#93c5fd,#818cf8',
  '#6ee7b7,#34d399', '#fbbf24,#fb923c', '#f472b6,#e879f9'
];

function addGallery() {
  const cap = v('gal-caption');
  if (!cap) return;
  const emoji    = v('gal-emoji') || ['🌸','💕','✨','🌈','🎀','🦋','🌺','💫'][Math.floor(Math.random() * 8)];
  const gradient = GALLERY_GRADIENTS[Math.floor(Math.random() * GALLERY_GRADIENTS.length)];
  state.gallery.push({ id: uid(), caption: cap, emoji, gradient });
  clr('gal-caption', 'gal-emoji');
  save(); renderGallery();
}

function renderGallery() {
  const el = document.getElementById('gallery-grid');
  if (!el) return;
  el.innerHTML =
    `<div class="gallery-item gallery-upload" onclick="document.getElementById('gal-caption').focus()">+</div>` +
    [...state.gallery].reverse().map(g =>
      `<div class="gallery-item" style="background:linear-gradient(135deg,${g.gradient})" title="${g.caption}">
         <div style="text-align:center">
           <div style="font-size:28px">${g.emoji}</div>
           <div style="font-size:9px;color:white;font-weight:700;margin-top:4px;padding:0 4px;text-shadow:0 1px 4px rgba(0,0,0,0.3)">${g.caption.substring(0, 20)}</div>
         </div>
       </div>`
    ).join('');
}

// =============================================
//  MUSIC
// =============================================
function addMusic() {
  const song = v('mus-song');
  if (!song) return;
  state.music.push({ id: uid(), song, artist: v('mus-artist'), by: v('mus-by'), vibe: v('mus-vibe') });
  clr('mus-song', 'mus-artist', 'mus-by', 'mus-vibe');
  save(); renderMusic();
}

function renderMusic() {
  const el = document.getElementById('music-list');
  if (!el) return;
  if (!state.music.length) {
    el.innerHTML = '<div class="empty"><span class="empty-icon">🎵</span>No songs yet!</div>';
    return;
  }
  el.innerHTML = [...state.music].reverse().map(m =>
    `<div class="music-item">
       <button class="music-play">▶</button>
       <div style="flex:1;min-width:0">
         <div style="font-weight:700;font-size:13px">${m.song}</div>
         <div style="font-size:11px;color:var(--muted)">${m.artist || 'Unknown artist'}${m.by ? ' · Added by ' + m.by : ''}</div>
         ${m.vibe ? `<span class="tag tag-purple">${m.vibe}</span>` : ''}
       </div>
       <button class="item-del" onclick="del('music', ${m.id})">✕</button>
     </div>`
  ).join('');
}

// =============================================
//  TO-DO
// =============================================
function addTodo() {
  const text = v('todo-text');
  if (!text) return;
  state.todos.push({ id: uid(), text, cat: v('todo-cat'), done: false });
  clr('todo-text');
  save(); renderTodos();
}

function toggleTodo(id) {
  const t = state.todos.find(t => t.id === id);
  if (t) { t.done = !t.done; save(); renderTodos(); }
}

function renderTodos() {
  const el = document.getElementById('todo-list');
  if (!el) return;
  if (!state.todos.length) {
    el.innerHTML = '<div class="empty"><span class="empty-icon">📝</span>List is empty!</div>';
    return;
  }
  const done = state.todos.filter(t => t.done).length;
  const pct  = state.todos.length ? Math.round(done / state.todos.length * 100) : 0;
  el.innerHTML =
    `<div class="card" style="margin-bottom:12px">
       <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;margin-bottom:4px">
         <span>Progress</span><span>${done}/${state.todos.length} done ✨</span>
       </div>
       <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
     </div>` +
    state.todos.map(t =>
      `<div class="check-item">
         <input type="checkbox" id="todo-${t.id}" ${t.done ? 'checked' : ''} onchange="toggleTodo(${t.id})">
         <label for="todo-${t.id}" class="${t.done ? 'done' : ''}">${t.cat} ${t.text}</label>
         <button class="item-del" onclick="del('todos', ${t.id})">✕</button>
       </div>`
    ).join('');
}

// =============================================
//  POLLS
// =============================================
function addPoll() {
  const q = v('poll-q'), a = v('poll-a'), b = v('poll-b');
  if (!q || !a || !b) return;
  const opts = [a, b];
  if (v('poll-c')) opts.push(v('poll-c'));
  state.polls.push({ id: uid(), q, opts, votes: new Array(opts.length).fill(0) });
  clr('poll-q', 'poll-a', 'poll-b', 'poll-c');
  save(); renderPolls();
}

function vote(pollId, optIdx) {
  const poll = state.polls.find(p => p.id === pollId);
  if (poll) { poll.votes[optIdx]++; save(); renderPolls(); }
}

function renderPolls() {
  const el = document.getElementById('polls-list');
  if (!el) return;
  if (!state.polls.length) {
    el.innerHTML = '<div class="empty"><span class="empty-icon">🗳️</span>No polls yet!</div>';
    return;
  }
  el.innerHTML = [...state.polls].reverse().map(p => {
    const total = p.votes.reduce((a, b) => a + b, 0);
    const options = p.opts.map((opt, i) => {
      const pct = total ? Math.round(p.votes[i] / total * 100) : 0;
      return `<div class="poll-option">
                <div class="poll-bar" onclick="vote(${p.id}, ${i})">
                  <div class="poll-fill" style="width:${pct}%"></div>
                  <span class="poll-label">${opt}</span>
                </div>
                <span class="poll-count">${p.votes[i]}</span>
              </div>`;
    }).join('');
    return `<div class="card" style="margin-bottom:10px">
              <div style="font-weight:800;font-size:14px;margin-bottom:12px">🗳️ ${p.q}</div>
              ${options}
              <div style="font-size:11px;color:var(--muted);margin-top:4px">${total} vote${total !== 1 ? 's' : ''} · Tap to vote!</div>
              <button class="item-del" style="float:right;margin-top:-20px" onclick="del('polls', ${p.id})">✕</button>
            </div>`;
  }).join('');
}

// =============================================
//  FOOD
// =============================================
function addFood() {
  const name = v('food-name');
  if (!name) return;
  state.food.push({ id: uid(), name, type: v('food-type'), by: v('food-by'), note: v('food-note') });
  clr('food-name', 'food-type', 'food-by', 'food-note');
  save(); renderFood();
}

function renderFood() {
  const el = document.getElementById('food-list');
  if (!el) return;
  if (!state.food.length) {
    el.innerHTML = '<div class="empty"><span class="empty-icon">🍔</span>No food faves yet!</div>';
    return;
  }
  el.innerHTML = [...state.food].reverse().map(f =>
    `<div class="food-item">
       <span style="font-size:24px">🍽️</span>
       <div style="flex:1;min-width:0">
         <div style="font-weight:700;font-size:13px">${f.name}</div>
         <div style="font-size:11px;color:var(--muted)">${[f.type, f.by ? 'by ' + f.by : ''].filter(Boolean).join(' · ')}</div>
         ${f.note ? `<div style="font-size:12px;margin-top:3px;color:#be185d">${f.note}</div>` : ''}
       </div>
       <button class="item-del" onclick="del('food', ${f.id})">✕</button>
     </div>`
  ).join('');
}

// =============================================
//  BUCKET LIST
// =============================================
function addBucket() {
  const item = v('bkt-item');
  if (!item) return;
  state.bucket.push({ id: uid(), item, cat: v('bkt-cat'), with: v('bkt-with'), done: false });
  clr('bkt-item', 'bkt-with');
  save(); renderBucket();
}

function toggleBucket(id) {
  const b = state.bucket.find(b => b.id === id);
  if (b) { b.done = !b.done; save(); renderBucket(); }
}

function renderBucket() {
  const el = document.getElementById('bucket-list');
  if (!el) return;
  if (!state.bucket.length) {
    el.innerHTML = '<div class="empty"><span class="empty-icon">🎯</span>Bucket list is empty!</div>';
    return;
  }
  el.innerHTML = state.bucket.map(b =>
    `<div class="check-item">
       <input type="checkbox" id="bkt-${b.id}" ${b.done ? 'checked' : ''} onchange="toggleBucket(${b.id})">
       <label for="bkt-${b.id}" class="${b.done ? 'done' : ''}">
         <strong>${b.cat}</strong> ${b.item}
         ${b.with ? `<span class="tag tag-sky">with ${b.with}</span>` : ''}
       </label>
       <button class="item-del" onclick="del('bucket', ${b.id})">✕</button>
     </div>`
  ).join('');
}

// =============================================
//  GIFTS
// =============================================
function addGift() {
  const item = v('gift-item');
  if (!item) return;
  state.gifts.push({ id: uid(), item, for: v('gift-for'), price: v('gift-price'), where: v('gift-where') });
  clr('gift-item', 'gift-for', 'gift-price', 'gift-where');
  save(); renderGifts();
}

function renderGifts() {
  const el = document.getElementById('gift-list');
  if (!el) return;
  if (!state.gifts.length) {
    el.innerHTML = '<div class="empty"><span class="empty-icon">🎁</span>No gift ideas yet!</div>';
    return;
  }
  el.innerHTML = [...state.gifts].reverse().map(g =>
    `<div class="gift-item">
       <div style="display:flex;justify-content:space-between;align-items:flex-start">
         <div>
           <span style="font-size:18px">🎁</span> <strong>${g.item}</strong>
           ${g.for   ? `<span class="tag tag-pink">For: ${g.for}</span>` : ''}
           ${g.price ? `<span class="tag tag-mint">${g.price}</span>`    : ''}
           ${g.where ? `<div style="font-size:11px;color:var(--muted);margin-top:4px">📍 ${g.where}</div>` : ''}
         </div>
         <button class="item-del" onclick="del('gifts', ${g.id})">✕</button>
       </div>
     </div>`
  ).join('');
}

// =============================================
//  TIMELINE
// =============================================
function addTimeline() {
  const title = v('tl-title');
  if (!title) return;
  state.timeline.push({ id: uid(), title, desc: v('tl-desc'), date: v('tl-date'), emoji: v('tl-emoji') || '🌸' });
  clr('tl-title', 'tl-desc', 'tl-date', 'tl-emoji');
  save(); renderTimeline();
}

function renderTimeline() {
  const el = document.getElementById('timeline-list');
  if (!el) return;
  if (!state.timeline.length) {
    el.innerHTML = '<div class="empty"><span class="empty-icon">✨</span>Add your first friendship memory!</div>';
    return;
  }
  const sorted = [...state.timeline].sort((a, b) => (a.date < b.date ? 1 : -1));
  el.innerHTML = sorted.map((t, i) =>
    `<div class="timeline-item">
       ${i < sorted.length - 1 ? '<div class="timeline-line"></div>' : ''}
       <div class="timeline-dot"></div>
       <div style="flex:1;padding-bottom:8px">
         <div style="font-size:11px;color:var(--muted);font-weight:700">${t.date || 'Timeless ✨'}</div>
         <div style="font-size:20px;margin:4px 0">${t.emoji}</div>
         <div style="font-weight:800;font-size:14px">${t.title}</div>
         ${t.desc ? `<div style="font-size:12px;color:var(--muted);margin-top:4px">${t.desc}</div>` : ''}
         <button class="item-del" style="margin-top:4px" onclick="del('timeline', ${t.id})">✕</button>
       </div>
     </div>`
  ).join('');
}

// =============================================
//  CONFESSIONS
// =============================================
function addConfession() {
  const text = v('conf-text');
  if (!text) return;
  state.confessions.push({ id: uid(), text, type: v('conf-type') });
  clr('conf-text');
  save(); renderConfessions();
}

function renderConfessions() {
  const el = document.getElementById('confession-list');
  if (!el) return;
  if (!state.confessions.length) {
    el.innerHTML = '<div class="empty"><span class="empty-icon">🤫</span>No confessions yet! Be brave 💕</div>';
    return;
  }
  el.innerHTML = [...state.confessions].reverse().map(c =>
    `<div class="confession-bubble">
       <div style="font-size:13px;margin-top:4px">${c.type} ${c.text}</div>
       <button class="item-del" style="float:right;margin-top:-18px" onclick="del('confessions', ${c.id})">✕</button>
     </div>`
  ).join('');
}

// =============================================
//  DELETE
// =============================================
function del(key, id) {
  state[key] = state[key].filter(i => i.id !== id);
  save(); renderAll();
}

// =============================================
//  INIT
// =============================================
load();
renderAll();
