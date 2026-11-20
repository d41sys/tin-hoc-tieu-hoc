import { LESSONS } from './lessons.js';
import { icon } from './icons.js';

const app = document.getElementById('app');
const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const ANIMALS = ['cat_face', 'dog_face', 'rabbit_face', 'fox', 'panda', 'koala', 'tiger_face', 'lion', 'frog', 'monkey_face', 'penguin', 'baby_chick', 'unicorn', 'octopus', 'turtle', 'dolphin', 'hamster'];
const GRADE_CRAYON = ['red', 'orange', 'yellow', 'green', 'blue'];
const art = (name, cls = '') => `<img src="/art/${name}.svg" alt="" class="${cls}" loading="lazy">`;
const avatar = (pos) => art(ANIMALS[pos % ANIMALS.length]);
const shuffle = (a) => a.map((x) => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map((p) => p[1]);
const fmtTime = (s) => `${Math.floor(s / 60)} phút ${s % 60} giây`;
const STAR = 'M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9z';
const stars = (n) => `<span class="stars" aria-label="${n} trên 3 sao">${[1, 2, 3].map((i) => `<svg viewBox="0 0 24 24" class="${i <= n ? 'on' : 'off'}" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="${STAR}"/></svg>`).join('')}</span>`;
// A label is a string or { text, art }.
const labelText = (l) => (typeof l === 'string' ? l : l.text || '');
const label = (l, size = '') => (typeof l === 'string' ? esc(l) : `${l.art ? art(l.art, size) : ''}${l.text ? `<span>${esc(l.text)}</span>` : ''}`);
// Big one-of-many choice: chunky buttons instead of a native <select>, which kids can't use well and which ignores the crayon look.
const chips = (id, name, items, cur) => `<div class="chips" id="${id}" role="group" aria-label="${name}">${items.map(([v, t]) => `<button class="chip" type="button" data-v="${v}" aria-pressed="${v === cur}">${esc(t)}</button>`).join('')}</div>`;
const onChip = (el, fn) => el.addEventListener('click', (e) => {
  const b = e.target.closest('.chip');
  if (!b) return;
  el.querySelectorAll('.chip').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  sfx.pop(); fn(b.dataset.v);
});
const chipVal = (id) => document.querySelector(`#${id} .chip[aria-pressed=true]`)?.dataset.v;

// ---------- API ----------
async function api(path, body) {
  const pin = sessionStorage.getItem('pin');
  const res = await fetch(path, {
    method: body ? 'POST' : 'GET',
    headers: { 'content-type': 'application/json', ...(pin && { 'x-pin': pin }) },
    body: body && JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw Object.assign(new Error(data.error || 'Lỗi'), { status: res.status });
  return data;
}

// ---------- Shell ----------
$('#navBoard').innerHTML = `${icon('trophy')}<span>Xếp hạng</span>`;
$('#navTeacher').innerHTML = `${icon('graduation-cap')}<span>Giáo viên</span>`;
const me = () => JSON.parse(localStorage.getItem('student') || 'null');
function showWho() {
  const s = me();
  $('#who').innerHTML = s ? `${avatar(s.pos)}<span class="nm">${esc(s.name)}</span><small class="muted">Lớp ${esc(s.class_name)}</small>
    <button class="navbtn pill-out" id="logout" type="button" aria-label="Đổi bạn khác">${icon('users', 20)}<span>Đổi bạn</span></button>` : '';
  $('#logout')?.addEventListener('click', () => { localStorage.removeItem('student'); location.hash = '#/'; });
}

// ---------- Sound + voice ----------
let muted = localStorage.getItem('muted') === '1';
let actx;
function tone(freqs, dur = 0.12, type = 'sine') {
  if (muted) return;
  actx ??= new AudioContext();
  freqs.forEach((f, i) => {
    const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + i * dur;
    o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(0.18, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur * 1.6);
    o.connect(g).connect(actx.destination); o.start(t); o.stop(t + dur * 1.6);
  });
}
const sfx = { ok: () => tone([660, 880]), bad: () => tone([220, 180], 0.15, 'triangle'), win: () => tone([523, 659, 784, 1046], 0.14), pop: () => tone([520], 0.06) };
const soundBtn = $('#sound');
const paintSound = () => { soundBtn.innerHTML = `${icon(muted ? 'volume-x' : 'volume-2')}<span>${muted ? 'Đang tắt tiếng' : 'Âm thanh'}</span>`; soundBtn.setAttribute('aria-pressed', String(!muted)); };
soundBtn.addEventListener('click', () => { muted = !muted; localStorage.setItem('muted', muted ? '1' : '0'); paintSound(); });
paintSound();

// ---------- Mascot ----------
const PRAISE = ['Giỏi quá!', 'Chính xác!', 'Tuyệt vời!', 'Em làm đúng rồi!'];
const CHEER = ['Không sao, thử lại nhé!', 'Gần đúng rồi, cố lên!', 'Xem vòng đỏ nhé, em sẽ nhớ!'];
const pick = (a) => a[Math.floor(Math.random() * a.length)];
let mascotTimer, quietTimer;
function say(text, mood) {
  const m = $('#mascot');
  $('#bubble').textContent = text;
  m.classList.remove('happy', 'sad', 'quiet');
  void m.offsetWidth; // restart animation
  if (mood) m.classList.add(mood);
  clearTimeout(mascotTimer); clearTimeout(quietTimer);
  mascotTimer = setTimeout(() => m.classList.remove('happy', 'sad'), 1200);
  quietTimer = setTimeout(() => m.classList.add('quiet'), 3500); // never covers game pieces for long
}
const good = () => { sfx.ok(); say(pick(PRAISE), 'happy'); };
const oops = (hint) => { sfx.bad(); say(hint || pick(CHEER), 'sad'); };

// ---------- Confetti ----------
function confetti() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const c = $('#confetti'), g = c.getContext('2d');
  c.width = innerWidth; c.height = innerHeight;
  const colors = ['#E0433A', '#FF9F1C', '#FFD23F', '#23955A', '#2A7FD4', '#8653C0'];
  const ps = Array.from({ length: 140 }, () => ({ x: Math.random() * c.width, y: -20 - Math.random() * c.height, vy: 2 + Math.random() * 4, vx: -2 + Math.random() * 4, r: Math.random() * 6, c: pick(colors), a: Math.random() * 6 }));
  const end = performance.now() + 3000;
  (function frame(now) {
    g.clearRect(0, 0, c.width, c.height);
    for (const p of ps) { p.x += p.vx; p.y += p.vy; p.a += 0.1; g.fillStyle = p.c; g.save(); g.translate(p.x, p.y); g.rotate(p.a); g.fillRect(-4, -2, 8 + p.r, 5); g.restore(); }
    if (now < end && location.hash.startsWith('#/lesson')) requestAnimationFrame(frame); else g.clearRect(0, 0, c.width, c.height);
  })(performance.now());
}

// ---------- Router ----------
const routes = [
  [/^#\/?$/, viewGrades],
  [/^#\/g\/(\d)$/, viewClass],
  [/^#\/map$/, viewMap],
  [/^#\/lesson\/([\w-]+)$/, viewLesson],
  [/^#\/leaderboard$/, viewLeaderboard],
  [/^#\/admin$/, viewAdmin],
];
let cleanup = () => {}, nav = 0;
async function route() {
  const my = ++nav;
  cleanup(); cleanup = () => {};
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  showWho();
  const hash = location.hash || '#/';
  $('#navBoard').toggleAttribute('aria-current', hash === '#/leaderboard');
  $('#navTeacher').toggleAttribute('aria-current', hash === '#/admin');
  for (const [re, view] of routes) {
    const m = hash.match(re);
    if (m) {
      // A view still loading when the child navigated away must not paint its error over the new page.
      try { await view(...m.slice(1)); } catch (e) { console.error(e); if (my === nav) app.innerHTML = `<p class="err">${esc(e.message)}</p>`; }
      scrollTo(0, 0);
      return;
    }
  }
  location.hash = '#/';
}
addEventListener('hashchange', route);

// ---------- Views: student ----------
function viewGrades() {
  if (me()) return (location.hash = '#/map');
  app.innerHTML = `<div class="head"><h1>Em học lớp mấy?</h1></div>
    <div class="grades">${[1, 2, 3, 4, 5].map((g) => `<button class="grade" data-g="${g}" data-crayon="${GRADE_CRAYON[g - 1]}" type="button" aria-label="Khối ${g}"><b>${g}</b><span>Khối ${g}</span></button>`).join('')}</div>`;
  app.querySelectorAll('[data-g]').forEach((b) => b.addEventListener('click', () => { sfx.pop(); location.hash = `#/g/${b.dataset.g}`; }));
  say('Chào em! Bấm vào số lớp của em nhé.');
}

async function viewClass(grade) {
  const my = nav, classes = await api(`/api/classes?grade=${grade}`);
  if (my !== nav) return;
  app.innerHTML = `<div class="head"><a class="iconbtn" href="#/" aria-label="Quay lại">${icon('arrow-left', 28)}</a><h1>Khối ${grade}: em ở lớp nào?</h1></div>
    <div class="picker">${classes.length ? chips('cls', 'Chọn lớp', classes.map((c) => [String(c.id), `Lớp ${c.name}`]), classes.length === 1 ? String(classes[0].id) : '')
      : '<p class="muted">Thầy cô chưa tạo lớp cho khối này.</p>'}</div><div class="names" id="students"></div>`;
  const showStudents = async (cls) => {
    const students = await api(`/api/students?class_id=${cls.id}`);
    if (!$('#students')) return;
    $('#students').innerHTML = students.map((s) => `<button class="name" data-id="${s.id}" type="button">${avatar(s.pos)}${esc(s.name)}</button>`).join('') || '<p class="muted">Lớp chưa có danh sách học sinh.</p>';
    say('Bấm vào tên của em nhé!');
    $('#students').querySelectorAll('[data-id]').forEach((b) => b.addEventListener('click', () => {
      const s = students.find((x) => x.id === Number(b.dataset.id));
      localStorage.setItem('student', JSON.stringify({ ...s, class_id: cls.id, class_name: cls.name, grade: cls.grade }));
      sfx.ok(); location.hash = '#/map';
    }));
  };
  if (classes.length) onChip($('#cls'), (v) => showStudents(classes.find((c) => c.id === Number(v))));
  if (classes.length === 1) showStudents(classes[0]); else say('Em học lớp nào?');
}

async function viewMap() {
  const s = me();
  if (!s) return (location.hash = '#/');
  const lessons = LESSONS.filter((l) => l.grade === s.grade);
  const my = nav, progress = Object.fromEntries((await api(`/api/progress?student_id=${s.id}`)).map((p) => [p.lesson_id, p]));
  if (my !== nav) return;
  const xp = Math.round(Object.values(progress).reduce((sum, p) => sum + p.score * 10, 0));
  const starCount = Object.values(progress).reduce((a, p) => a + p.stars, 0);
  const current = lessons.findIndex((l) => !progress[l.id]);
  const first = s.name.split(' ').pop();
  app.innerHTML = `<div class="head"><h1>Chào ${esc(first)}! Tô màu chặng nào hôm nay?</h1>
      <span class="chip">${icon('star', 20)} ${starCount} sao</span><span class="chip">${icon('award', 20)} ${xp} XP</span></div>
    ${lessons.length ? `<div class="stages">${lessons.map((l, i) => {
      const p = progress[l.id], locked = current !== -1 && i > current, state = p ? 'done' : locked ? 'locked' : 'current';
      return `<article class="stage" data-crayon="${l.crayon}" data-state="${state}">
        <div class="art">${art(locked ? `${l.art}_line` : l.art, 'pic')}${art('robot', 'peek')}<span class="badge">Chặng ${i + 1}</span></div>
        <div class="body"><h2>${esc(l.title)}</h2><p>${esc(l.blurb)}</p>${stars(p?.stars || 0)}
          ${locked ? `<div class="locknote">${icon('lock')} Tô xong chặng ${i} để mở</div>`
            : `<button class="btn wide${p ? ' ghost' : ''}" data-id="${l.id}" type="button">${icon(p ? 'rotate-ccw' : 'play', 28)} ${p ? 'Chơi lại' : 'Chơi ngay'}</button>`}</div></article>`;
    }).join('')}</div>`
    : `<div class="soon">${art('seedling')}<h2>Bài học khối ${s.grade} đang được chuẩn bị</h2><p class="muted">Em quay lại sau nhé!</p></div>`}`;
  app.querySelectorAll('[data-id]').forEach((b) => b.addEventListener('click', () => { sfx.pop(); location.hash = `#/lesson/${b.dataset.id}`; }));
  say(current === -1 && lessons.length ? 'Em đã tô màu hết các chặng!' : `Bấm Chơi ngay để tô màu chặng ${current + 1}!`);
}

function viewLesson(id) {
  const s = me(), lesson = LESSONS.find((l) => l.id === id);
  if (!s || !lesson) return (location.hash = '#/map');
  app.innerHTML = `<div class="head"><a class="iconbtn" href="#/map" aria-label="Về bản đồ">${icon('arrow-left', 28)}</a><h1>${esc(lesson.title)}</h1></div>
    <section class="treasure" data-crayon="${lesson.crayon}"><header>${art('open_book')}<h2>Kho báu kiến thức</h2></header>
      <ul>${lesson.summary.map(([a, t]) => `<li>${art(a)}<div>${t}</div></li>`).join('')}</ul></section>
    <div class="actions" data-crayon="green"><button class="btn" id="go" type="button">${icon('play', 28)} Bắt đầu chơi</button></div>`;
  say('Đọc kho báu kiến thức trước, rồi bấm Bắt đầu chơi!');
  $('#go').addEventListener('click', () => play(lesson, s));
}

function play(lesson, student) {
  const answers = [], start = Date.now(), n = lesson.challenges.length;
  app.innerHTML = `<div data-crayon="${lesson.crayon}"><div class="playbar"><a class="iconbtn" href="#/map" aria-label="Thoát về bản đồ">${icon('x', 28)}</a>
    <div class="slots" aria-label="Tiến độ">${lesson.challenges.map(() => '<span class="slot"></span>').join('')}</div></div><div id="stage"></div></div>`;
  const paintSlots = () => app.querySelectorAll('.slot').forEach((el, i) => {
    el.className = `slot${i < answers.length ? (answers[i] ? ' ok' : ' no') : i === answers.length ? ' now' : ''}`;
    el.innerHTML = i < answers.length ? icon(answers[i] ? 'check' : 'x', 18) : '';
  });
  const root = app.firstElementChild;
  const next = () => {
    if (!root.isConnected) return; // child left the game during the pause between challenges
    paintSlots();
    if (answers.length === n) return finish(lesson, student, answers, Math.round((Date.now() - start) / 1000));
    const c = lesson.challenges[answers.length];
    const stage = $('#stage');
    stage.innerHTML = `<div class="qcard">${c.art ? art(c.art) : ''}<h2>${esc(c.q)}</h2></div>`;
    GAMES[c.type](stage, c, (ok) => { answers.push(ok); setTimeout(next, 1100); });
  };
  next();
}

// Each game calls done(firstTryCorrect) exactly once.
const GAMES = {
  quiz(stage, c, done) {
    stage.insertAdjacentHTML('beforeend', `<div class="options">${c.options.map((o, i) => `<button class="option" data-i="${i}" type="button"><span class="key">${i + 1}</span>${label(o)}</button>`).join('')}</div>`);
    const btns = [...stage.querySelectorAll('.option')];
    btns.forEach((b) => b.addEventListener('click', () => {
      const ok = Number(b.dataset.i) === c.answer, right = btns[c.answer];
      btns.forEach((x) => { x.disabled = true; if (x !== b && x !== right) x.classList.add('dim'); });
      right.classList.add('right');
      right.querySelector('.key').innerHTML = icon('check', 24);
      if (ok) good(); else { b.classList.add('wrong'); b.querySelector('.key').innerHTML = icon('x', 24); oops(`Đáp án đúng là: ${labelText(c.options[c.answer])}`); }
      done(ok);
    }));
  },

  // Drag a piece onto a box, or tap a piece then tap a box (dragging is hard for young children, NN/g).
  drag(stage, c, done) {
    stage.insertAdjacentHTML('beforeend', `<div class="zones">${c.targets.map((t) => `<div class="zone" data-key="${esc(t.key)}" role="button" tabindex="0"><span class="lbl">${label(t.label)}</span></div>`).join('')}</div>
      <div class="tray">${shuffle(c.items.map((it, i) => `<button class="piece" data-i="${i}" type="button" aria-pressed="false">${label(it.label)}</button>`)).join('')}</div>`);
    const zones = $('.zones', stage);
    let mistakes = 0, placed = 0, selected = null;
    const select = (piece) => {
      if (selected) selected.setAttribute('aria-pressed', 'false');
      selected = piece === selected ? null : piece;
      selected?.setAttribute('aria-pressed', 'true');
      zones.classList.toggle('picking', !!selected);
    };
    const tryPlace = (piece, zone) => {
      select(null);
      if (zone.dataset.key !== c.items[piece.dataset.i].target) { mistakes++; return oops(); }
      const done_ = piece.cloneNode(true); // the clone drops every listener
      done_.className = 'piece placed'; done_.removeAttribute('aria-pressed'); done_.disabled = true;
      zone.append(done_); zone.classList.add('full'); piece.remove();
      good();
      if (++placed === c.items.length) done(mistakes === 0);
    };
    zones.querySelectorAll('.zone').forEach((z) => {
      const act = () => { if (selected) tryPlace(selected, z); };
      z.addEventListener('click', act);
      z.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } });
    });
    stage.querySelectorAll('.tray .piece').forEach((piece) => piece.addEventListener('pointerdown', (e) => {
      const x0 = e.clientX, y0 = e.clientY;
      let ghost = null, hover = null;
      const zoneAt = (ev) => document.elementsFromPoint(ev.clientX, ev.clientY).find((el) => el.classList.contains('zone'));
      const move = (ev) => {
        if (!ghost && Math.hypot(ev.clientX - x0, ev.clientY - y0) < 10) return; // still a tap
        if (!ghost) { ghost = piece.cloneNode(true); ghost.classList.add('ghost'); document.body.append(ghost); piece.classList.add('lifted'); }
        ghost.style.left = `${ev.clientX - ghost.offsetWidth / 2}px`; ghost.style.top = `${ev.clientY - ghost.offsetHeight / 2}px`;
        const z = zoneAt(ev);
        if (z !== hover) { hover?.classList.remove('hover'); z?.classList.add('hover'); hover = z; }
      };
      const up = (ev) => {
        removeEventListener('pointermove', move); removeEventListener('pointerup', up); removeEventListener('pointercancel', up);
        if (!ghost) { if (ev.type === 'pointerup') { sfx.pop(); select(piece); } return; }
        ghost.remove(); piece.classList.remove('lifted'); hover?.classList.remove('hover');
        const z = ev.type === 'pointerup' && zoneAt(ev);
        if (z) tryPlace(piece, z);
      };
      addEventListener('pointermove', move); addEventListener('pointerup', up); addEventListener('pointercancel', up);
    }));
    // Keyboard: Enter on a piece selects it, then Enter on a box places it.
    stage.querySelectorAll('.tray .piece').forEach((p) => p.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(p); } }));
  },

  memory(stage, c, done) {
    const cards = shuffle(c.pairs.flatMap((p, i) => p.map((l) => ({ l, pair: i }))));
    stage.insertAdjacentHTML('beforeend', `<div class="cards">${cards.map((k, i) => `<button class="flip" data-i="${i}" type="button" aria-label="Thẻ ${i + 1}">
      <span class="inner"><span class="face back">?</span><span class="face front">${label(k.l)}</span></span></button>`).join('')}</div>`);
    let open = [], misses = 0, matched = 0, busy = false;
    stage.querySelectorAll('.flip').forEach((b) => b.addEventListener('click', () => {
      if (busy || b.classList.contains('open')) return;
      sfx.pop(); b.classList.add('open'); open.push(b);
      if (open.length < 2) return;
      const [x, y] = open; open = [];
      if (cards[x.dataset.i].pair === cards[y.dataset.i].pair) {
        x.classList.add('matched'); y.classList.add('matched'); good();
        if (++matched === c.pairs.length) done(misses <= c.pairs.length); // first flips are guesses, so allow one miss per pair
      } else {
        misses++; busy = true; oops('Chưa khớp, nhớ vị trí rồi lật lại nhé!');
        setTimeout(() => { x.classList.remove('open'); y.classList.remove('open'); busy = false; }, 1000);
      }
    }));
  },
};

async function finish(lesson, student, answers, seconds) {
  const my = nav, r = await api('/api/attempts', { student_id: student.id, lesson_id: lesson.id, answers, seconds });
  if (my !== nav) return;
  sfx.win(); confetti();
  say(r.stars === 3 ? 'Xuất sắc! Em tô đủ 3 sao!' : 'Em đã tô xong chặng! Chơi lại để được 3 sao nhé!', 'happy');
  app.innerHTML = `<section class="result" data-crayon="${lesson.crayon}">
    <div class="art">${art(lesson.art)}</div>
    <h1>Em đã tô xong chặng!</h1>${stars(r.stars)}
    <p>Đúng <b>${r.correct}/${r.total}</b> câu · Điểm <b>${r.score}</b> · +${Math.round(r.score * 10)} XP · ${fmtTime(seconds)}</p>
    <div class="actions"><button class="btn" data-crayon="orange" id="cert" type="button">${icon('award', 28)} Nhận giấy khen</button>
      <button class="btn ghost" id="again" type="button">${icon('rotate-ccw', 28)} Chơi lại</button>
      <a class="btn" data-crayon="green" href="#/map">${icon('map', 28)} Bản đồ</a></div>
    <div id="certBox"></div></section>`;
  $('#again').addEventListener('click', () => play(lesson, student));
  $('#cert').addEventListener('click', async () => {
    const { teacher_name } = await api('/api/settings');
    const url = await drawCertificate({ name: student.name, cls: student.class_name, lesson, date: r.date, teacher: teacher_name, stars: r.stars });
    if (!$('#certBox')) return;
    $('#certBox').innerHTML = `<img class="certimg" src="${url}" alt="Giấy khen của ${esc(student.name)}">
      <div class="actions"><a class="btn" data-crayon="green" download="giay-khen-${esc(student.name)}.png" href="${url}">${icon('download', 28)} Tải ảnh về máy</a></div>`;
    $('#certBox').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

const loadImg = (src) => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });
async function drawCertificate({ name, cls, lesson, date, teacher, stars: n }) {
  await Promise.all(["800 96px 'Baloo 2'", "700 40px Nunito", "700 64px 'Dancing Script'"].map((f) => document.fonts.load(f, name + teacher)));
  const [pic, robot] = await Promise.all([loadImg(`/art/${lesson.art}.svg`), loadImg('/art/robot.svg')]);
  const css = getComputedStyle(document.documentElement), v = (k) => css.getPropertyValue(k).trim();
  const crayon = v(`--${lesson.crayon}`), tint = v(`--${lesson.crayon}-t`);
  const c = document.createElement('canvas'); c.width = 1600; c.height = 1130;
  const g = c.getContext('2d'), W = c.width;
  g.fillStyle = v('--paper'); g.fillRect(0, 0, W, c.height);
  g.lineWidth = 28; g.strokeStyle = crayon; g.lineJoin = 'round'; g.strokeRect(40, 40, W - 80, c.height - 80);
  g.lineWidth = 4; g.strokeStyle = v('--line-d'); g.strokeRect(84, 84, W - 168, c.height - 168);
  g.fillStyle = tint; g.beginPath(); g.arc(250, 250, 120, 0, Math.PI * 2); g.fill();
  g.drawImage(pic, 170, 170, 160, 160);
  g.drawImage(robot, W - 330, c.height - 330, 170, 170);
  g.textAlign = 'center'; g.fillStyle = v('--ink');
  g.font = "800 104px 'Baloo 2'"; g.fillText('GIẤY KHEN', W / 2, 260);
  g.font = '700 40px Nunito'; g.fillStyle = v('--ink-2'); g.fillText('Tin học vui khen tặng em', W / 2, 360);
  g.font = "800 92px 'Baloo 2'"; g.fillStyle = crayon === v('--yellow') ? v('--yellow-d') : crayon; g.fillText(name, W / 2, 470);
  g.font = '700 40px Nunito'; g.fillStyle = v('--ink'); g.fillText(`Lớp ${cls}`, W / 2, 540);
  g.fillText(`Đã tô xong chặng “${lesson.title}”`, W / 2, 620);
  const star = new Path2D(STAR);
  for (let i = 0; i < 3; i++) {
    g.save(); g.translate(W / 2 - 150 + i * 110, 660); g.scale(4, 4);
    g.fillStyle = i < n ? v('--yellow') : 'transparent'; g.strokeStyle = i < n ? v('--yellow-d') : v('--line-d'); g.lineWidth = 1.2; g.lineJoin = 'round';
    g.fill(star); g.stroke(star); g.restore();
  }
  g.textAlign = 'left'; g.font = '700 34px Nunito'; g.fillStyle = v('--ink-2'); g.fillText(`Ngày ${date}`, 170, 930);
  g.textAlign = 'center'; g.fillText('Giáo viên', 760, 860);
  g.fillStyle = v('--blue-d'); g.font = "700 64px 'Dancing Script'"; g.fillText(teacher, 760, 950);
  g.fillStyle = v('--ink'); g.font = '700 30px Nunito'; g.fillText(teacher, 760, 1005);
  return c.toDataURL('image/png');
}

async function viewLeaderboard() {
  const s = me();
  const my = nav, classes = await api('/api/classes');
  if (my !== nav) return;
  const scope = sessionStorage.getItem('lbScope') || (s ? `c${s.class_id}` : classes[0] ? `c${classes[0].id}` : '');
  app.innerHTML = `<div class="head"><h1>Bảng vàng thi đua</h1></div>
    ${chips('scope', 'Xếp hạng theo', [...classes.map((c) => [`c${c.id}`, `Lớp ${c.name}`]), ...[...new Set(classes.map((c) => c.grade))].map((g) => [`g${g}`, `Toàn khối ${g}`])], scope)}<div id="lb"></div>`;
  const load = async (v) => {
    sessionStorage.setItem('lbScope', v);
    const q = v[0] === 'c' ? `class_id=${v.slice(1)}` : `grade=${v.slice(1)}`;
    const rows = await api(`/api/leaderboard?${q}`);
    if (!$('#lb')) return;
    if (!rows.length) return ($('#lb').innerHTML = `<div class="soon">${art('trophy')}<h2>Chưa có ai tô xong chặng nào</h2><p class="muted">Em hãy là người đầu tiên!</p></div>`);
    const top = [[rows[1], 2, 'blue'], [rows[0], 1, 'yellow'], [rows[2], 3, 'orange']].map(([r, place, cr]) => r ? `<div class="p${place}" data-crayon="${cr}">
      ${art(['1st_place_medal', '2nd_place_medal', '3rd_place_medal'][place - 1])}<b>${esc(r.name)}</b><small>Lớp ${esc(r.class_name)} · ${r.points} điểm</small>
      <div class="block">${place}</div></div>` : '<div></div>').join('');
    $('#lb').innerHTML = `<div class="podium">${top}</div><table class="board"><thead><tr><th>Hạng</th><th>Họ tên</th><th>Lớp</th><th>Điểm</th><th>Sao</th><th>Thời gian</th></tr></thead>
      <tbody>${rows.map((r, i) => `<tr${s && r.id === s.id ? ' class="me"' : ''}><td>${i + 1}</td><td>${esc(r.name)}</td><td>${esc(r.class_name)}</td><td>${r.points}</td><td>${r.stars}</td><td>${fmtTime(r.seconds)}</td></tr>`).join('')}</tbody></table>`;
  };
  onChip($('#scope'), load);
  await load(scope);
  if (my !== nav) return;
  say('Ai sẽ đứng bục cao nhất nhỉ?');
}

// ---------- Views: teacher ----------
async function viewAdmin() {
  if (!sessionStorage.getItem('pin')) {
    app.innerHTML = `<form class="login" id="login">${art('books')}<h1>Trang giáo viên</h1><label for="pin">Nhập mã PIN giáo viên</label>
      <input class="field" type="password" id="pin" inputmode="numeric" autocomplete="off" required>
      <button class="btn" data-crayon="blue" type="submit">Vào trang giáo viên</button><p class="err" id="msg" role="alert"></p></form>`;
    $('#login').addEventListener('submit', async (e) => {
      e.preventDefault();
      sessionStorage.setItem('pin', $('#pin').value);
      try { await api('/api/admin/login', {}); route(); } catch (err) { sessionStorage.removeItem('pin'); $('#pin').value = ''; $('#msg').textContent = `${err.message}. Thử lại nhé.`; }
    });
    return;
  }
  const my = nav, [classes, settings] = await Promise.all([api('/api/classes'), api('/api/settings')]);
  if (my !== nav) return;
  const opts = classes.map((c) => [String(c.id), `Lớp ${c.name} (Khối ${c.grade})`]), first = opts[0]?.[0];
  app.innerHTML = `<div class="head"><h1>Trang giáo viên</h1><button class="btn small ghost" id="out" type="button">${icon('log-out', 22)} Thoát</button></div>
    <section class="panel"><h2>${icon('book-open')} Theo dõi lớp học <small class="muted">tự cập nhật mỗi 5 giây</small></h2>
      <div class="row">${chips('dashCls', 'Lớp', opts, first)}
      <button class="btn small" data-crayon="green" id="export" type="button">${icon('download', 22)} Xuất Excel (.csv)</button></div><div id="dash"></div></section>
    <section class="panel"><h2>${icon('users')} Danh sách học sinh</h2>
      <div class="row">${chips('stCls', 'Lớp', opts, first)}
      <label class="btn small ghost">${icon('upload', 22)} Tải file .csv/.txt<input type="file" id="file" accept=".csv,.txt" hidden></label></div>
      <p class="muted">Mỗi dòng một học sinh. Có thể dán thẳng cột từ Excel, cột STT sẽ tự bỏ qua.</p>
      <textarea id="names" aria-label="Danh sách học sinh"></textarea>
      <div class="row"><button class="btn small" data-crayon="blue" id="saveSt" type="button">${icon('save', 22)} Lưu danh sách</button><span id="stMsg" role="status"></span></div></section>
    <section class="panel"><h2>${icon('graduation-cap')} Lớp học</h2><form id="addCls" class="row">
      ${chips('newGrade', 'Khối', [1, 2, 3, 4, 5].map((g) => [String(g), `Khối ${g}`]), '3')}
      <input class="field" type="text" id="newName" placeholder="VD: 3A3" maxlength="20" required aria-label="Tên lớp"><button class="btn small" data-crayon="blue" type="submit">${icon('plus', 22)} Thêm lớp</button></form>
      <div class="tags">${classes.map((c) => `<span class="tag">${esc(c.name)} <button data-del="${c.id}" type="button" aria-label="Xoá lớp ${esc(c.name)}">${icon('trash-2', 18)}</button></span>`).join('')}</div></section>
    <section class="panel"><h2>${icon('award')} Tên giáo viên trên giấy khen</h2><form id="setT" class="row">
      <input class="field" type="text" id="tName" value="${esc(settings.teacher_name)}" maxlength="80" required aria-label="Tên giáo viên"><button class="btn small" data-crayon="blue" type="submit">${icon('save', 22)} Lưu</button><span id="tMsg" role="status"></span></form></section>`;

  const flash = (el, text) => { el.textContent = text; setTimeout(() => (el.textContent = ''), 2500); };
  const fail = (err) => alert(err.message);
  $('#out').addEventListener('click', () => { sessionStorage.removeItem('pin'); location.hash = '#/'; });

  const loadDash = async () => {
    const cls = classes.find((c) => c.id === Number(chipVal('dashCls')));
    if (!cls) return ($('#dash').innerHTML = '<p class="muted">Chưa có lớp. Thêm lớp ở bên dưới.</p>');
    const d = await api(`/api/admin/dashboard?class_id=${cls.id}`);
    if (!$('#dash')) return;
    const lessons = LESSONS.filter((l) => l.grade === cls.grade);
    const best = new Map(d.best.map((b) => [`${b.student_id}|${b.lesson_id}`, b]));
    const doneCount = (l) => d.students.filter((s) => best.has(`${s.id}|${l.id}`)).length;
    $('#dash').innerHTML = lessons.length ? `<div class="table-wrap"><table class="dash"><thead><tr><th>Học sinh</th>${lessons.map((l) => `<th>${esc(l.title)}<br><small class="muted">${doneCount(l)}/${d.students.length} xong</small></th>`).join('')}</tr></thead>
      <tbody>${d.students.map((s) => `<tr><td>${esc(s.name)}</td>${lessons.map((l) => {
        const b = best.get(`${s.id}|${l.id}`);
        return b ? `<td class="ok">${b.score} điểm ${stars(b.stars)}<small>${b.correct}/${b.total} · ${fmtTime(b.seconds)}</small></td>` : '<td class="todo">Chưa làm</td>';
      }).join('')}</tr>`).join('')}</tbody></table></div>
      <h3>Tỉ lệ trả lời đúng từng câu</h3>${lessons.map((l) => `<details><summary>${esc(l.title)}</summary><table class="dash">
        ${l.challenges.map((c, i) => { const r = d.rates[l.id]?.[i]; const pct = r?.n ? Math.round((r.right / r.n) * 100) : null;
          return `<tr><td>Câu ${i + 1}: ${esc(c.q)}</td><td>${pct === null ? 'Chưa có lượt' : `<div class="bar"><div style="width:${pct}%"></div></div>${pct}% đúng (${r.n} lượt)`}</td></tr>`; }).join('')}</table></details>`).join('')}`
      : '<p class="muted">Khối này chưa có bài học.</p>';
  };
  onChip($('#dashCls'), loadDash);
  await loadDash();
  if (my !== nav) return;
  const timer = setInterval(() => { if (!document.querySelector('#dash details[open]')) loadDash().catch(() => {}); }, 5000);
  cleanup = () => clearInterval(timer);

  $('#export').addEventListener('click', async () => {
    const res = await fetch(`/api/admin/export.csv?class_id=${chipVal('dashCls')}`, { headers: { 'x-pin': sessionStorage.getItem('pin') } });
    if (!res.ok) return alert((await res.json()).error);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(await res.blob());
    a.download = decodeURIComponent(res.headers.get('content-disposition').split("''")[1]);
    a.click(); URL.revokeObjectURL(a.href);
  });

  const loadNames = async () => {
    const id = chipVal('stCls');
    const list = id ? (await api(`/api/students?class_id=${id}`)).map((s) => s.name).join('\n') : '';
    if ($('#names')) $('#names').value = list;
  };
  onChip($('#stCls'), loadNames);
  await loadNames();
  if (my !== nav) return;
  $('#file').addEventListener('change', async (e) => { const f = e.target.files[0]; if (f) $('#names').value = await f.text(); e.target.value = ''; });
  $('#saveSt').addEventListener('click', async () => {
    // Each line may be an Excel row ("1<TAB>Nguyễn Văn A" or "1,Nguyễn Văn A"): keep the longest non-numeric cell.
    const names = $('#names').value.split(/\r?\n/).map((line) => line.split(/[\t,;]/).map((x) => x.trim().replace(/^"|"$/g, ''))
      .filter((x) => x && !/^\d+$/.test(x) && !/^(stt|họ và tên|họ tên|tên)$/i.test(x)).sort((a, b) => b.length - a.length)[0]).filter(Boolean);
    try {
      const r = await api('/api/admin/students', { class_id: Number(chipVal('stCls')), names });
      await loadNames(); flash($('#stMsg'), `Đã lưu ${r.count} học sinh`); loadDash();
    } catch (err) { fail(err); }
  });

  onChip($('#newGrade'), () => {});
  $('#addCls').addEventListener('submit', async (e) => {
    e.preventDefault();
    try { await api('/api/admin/classes', { grade: Number(chipVal('newGrade')), name: $('#newName').value }); route(); } catch (err) { fail(err); }
  });
  app.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', async () => {
    if (!confirm('Xoá lớp này cùng toàn bộ học sinh và kết quả?')) return;
    try { await api('/api/admin/classes/delete', { id: Number(b.dataset.del) }); route(); } catch (err) { fail(err); }
  }));

  $('#setT').addEventListener('submit', async (e) => {
    e.preventDefault();
    try { await api('/api/admin/settings', { teacher_name: $('#tName').value }); flash($('#tMsg'), 'Đã lưu'); } catch (err) { fail(err); }
  });
  say('Chào thầy cô!');
}

route();
