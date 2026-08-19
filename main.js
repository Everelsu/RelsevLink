/* ═══════════════════════════════════════════════════════════════
   Relsev — silver reliquary
   a parallax stage · a rosary of nine beads · one cross
   ═══════════════════════════════════════════════════════════════ */
'use strict';

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const rand = (a, b) => a + Math.random() * (b - a);

/* ═══════════════════════════════════════════════════════════════
   THE TONGUES — every string the site can speak.
   Add a locale by adding a block; anything it omits falls back
   to English, so a half-finished tongue is still safe to ship.
   ═══════════════════════════════════════════════════════════════ */
const DICT = {
  en: {
    label: 'English', tag: 'EN',
    loading: 'now loading',
    sealAria: 'Break the seal and enter',
    sealHint: '[ break the what? ]',
    brandAria: 'Relsev — home',
    navAria: 'Sections',
    navHome: 'home',
    navElsewhere: 'elsewhere',
    navLitany: 'litany',
    navRosary: 'the rosary',
    langTitle: 'Language',
    ambTitle: 'Ambient drone',
    sfxTitle: 'Interface sounds',
    letters: 'letters',
    plateAlt: 'Relsev — a winged figure rendered in silver',
    epithet: 'where shadows whisper',
    status: 'present · somewhere east of midnight',
    findMe: 'find me elsewhere',
    elsewhereSub: 'nine doors, plainly named.',
    dropcap: 'I',
    inscribed: ' keep building things in a world that keeps falling apart — small altars of light against a very large dark.',
    amen: 'amen',
    scribedBy: 'scribed by',
    anno: 'anno',
    thrice: 'press thrice',
    rosarySub: 'you found the cross at the foot of the frame. nine beads, nine doors — take it in your hand.',
    push: 'give it a push',
    rosaryHint: 'drag a bead · let it fall',
    cue: 'scroll',
    cueAria: 'Next section',
    copied: 'inscribed to clipboard',
    chamber: 'a chamber unlocks',

    nm_telegram: 'telegram', nm_channel: 'channel', nm_discord: 'discord',
    nm_letters: 'letters', nm_youtube: 'youtube', nm_tiktok: 'tiktok',
    nm_github: 'github', nm_x: 'on x', nm_steam: 'steam',
    nm_twitch: 'twitch', nm_boosty: 'boosty', nm_donate: 'donate',
    sb_profile: 'profile', sb_telegram: 'telegram', sb_post: 'by post',
    sb_works: 'works', sb_play: 'pastimes',
    sb_live: 'live', sb_monthly: 'monthly', sb_once: 'one-off',

    litany: [
      'i keep building things in a world that keeps falling apart.',
      'the dark is not empty. it is only unlit.',
      'every altar begins as a pile of ordinary stones.',
      'i am not finished. that is the whole point.',
      'silence is an instrument too — learn its fingering.',
      'what you make at 3am belongs to no one else.',
      'wings are heavy. that is why so few of us fly.',
      'grief and craft share a workshop.',
      'to build in the dark is to trust your hands.',
      'nothing holy was ever convenient.'
    ],
    secrets: [
      'you pressed thrice. the door was never locked.',
      'ⳤ nothing here is hidden — only quiet ⳤ',
      'built in the dark, on purpose.'
    ]
  },

  ru: {
    label: 'Русский', tag: 'RU',
    loading: 'идёт загрузка',
    sealAria: 'Сломать печать и войти',
    sealHint: '[ сломать что? ]',
    brandAria: 'Relsev — начало',
    navAria: 'Разделы',
    navHome: 'начало',
    navElsewhere: 'где искать',
    navLitany: 'литания',
    navRosary: 'чётки',
    langTitle: 'Язык',
    ambTitle: 'Фоновый гул',
    sfxTitle: 'Звуки интерфейса',
    letters: 'письма',
    plateAlt: 'Relsev — крылатая фигура, вычерченная серебром',
    epithet: 'где шепчут тени',
    status: 'здесь · где-то к востоку от полуночи',
    findMe: 'искать меня в других местах',
    elsewhereSub: 'девять дверей, названных прямо.',
    dropcap: 'Я',
    inscribed: ' продолжаю строить в мире, который продолжает рушиться, — маленькие алтари света против очень большой тьмы.',
    amen: 'аминь',
    scribedBy: 'записал',
    anno: 'лета',
    thrice: 'нажми трижды',
    rosarySub: 'ты нашёл крест у подножия рамы. девять бусин, девять дверей — возьми их в руку.',
    push: 'качни их',
    rosaryHint: 'потяни бусину · отпусти',
    cue: 'листай',
    cueAria: 'Следующий раздел',
    copied: 'вписано в буфер',
    chamber: 'открылась потайная комната',

    nm_channel: 'канал', nm_letters: 'письма', nm_x: 'в x', nm_donate: 'донат',
    sb_profile: 'профиль', sb_telegram: 'телеграм', sb_post: 'почтой',
    sb_works: 'работы', sb_play: 'досуг',
    sb_live: 'стрим', sb_monthly: 'подписка', sb_once: 'разово',

    litany: [
      'я продолжаю строить в мире, который продолжает рушиться.',
      'тьма не пуста. она просто не освещена.',
      'любой алтарь начинается с кучи обычных камней.',
      'я не закончен. в этом и весь смысл.',
      'тишина — тоже инструмент. выучи её аппликатуру.',
      'то, что сделано в три ночи, не принадлежит никому другому.',
      'крылья тяжелы. потому так мало кто летает.',
      'горе и ремесло делят одну мастерскую.',
      'строить в темноте — значит доверять рукам.',
      'ничто святое никогда не было удобным.'
    ],
    secrets: [
      'ты нажал трижды. дверь никогда не была заперта.',
      'ⳤ здесь ничего не спрятано — только тихо ⳤ',
      'построено в темноте. намеренно.'
    ]
  }
};

const i18n = (function () {
  const STORE = 'relsev-lang';
  const codes = Object.keys(DICT);
  let lang = 'en';

  /* what the visitor's browser asks for, in order of preference */
  function detect() {
    const saved = (() => { try { return localStorage.getItem(STORE); } catch (e) { return null; } })();
    if (saved && DICT[saved]) return saved;
    const asked = navigator.languages && navigator.languages.length
      ? navigator.languages : [navigator.language || 'en'];
    for (const raw of asked) {
      const base = String(raw).toLowerCase().split('-')[0];
      if (DICT[base]) return base;
    }
    return 'en';
  }

  function t(key) {
    const here = DICT[lang], home = DICT.en;
    const v = (here && here[key] !== undefined) ? here[key] : home[key];
    return v === undefined ? key : v;
  }

  function apply() {
    document.documentElement.lang = lang;
    document.body.dataset.lang = lang;

    $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    $$('[data-i18n-label]').forEach(el => el.setAttribute('aria-label', t(el.dataset.i18nLabel)));
    $$('[data-i18n-title]').forEach(el => el.title = t(el.dataset.i18nTitle));
    $$('[data-i18n-alt]').forEach(el => el.alt = t(el.dataset.i18nAlt));

    document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
  }

  function set(next, remember) {
    if (!DICT[next] || next === lang) return;
    lang = next;
    if (remember !== false) { try { localStorage.setItem(STORE, lang); } catch (e) {} }
    apply();
  }

  lang = detect();

  return {
    t, apply, set, codes,
    get lang() { return lang; },
    /* the name of a link, and the small word after it */
    nm: id => t('nm_' + id),
    sb: id => (id ? t('sb_' + id) : '')
  };
})();
const t = i18n.t;

const EMAIL = 'egor.dagbaev@list.ru';

/* the doors, in the order they hang — add one here and it appears
   in the index, on the rosary and in every tongue at once */
const LINKS = [
  { id: 'telegram', icon: 'fa-brands fa-telegram',       sub: 'profile',  href: 'https://t.me/Re1sev',                          tone: 523.25 },
  { id: 'channel',  icon: 'fa-solid fa-tower-broadcast', sub: 'telegram', href: 'https://t.me/relsev',                          tone: 587.33 },
  { id: 'discord',  icon: 'fa-brands fa-discord',        sub: '',         href: 'https://discord.com/users/490411567620423680', tone: 659.25 },
  { id: 'letters',  icon: 'fa-regular fa-envelope',      sub: 'post',     act: 'email',                                         tone: 698.46 },
  { id: 'twitch',   icon: 'fa-brands fa-twitch',         sub: 'live',     href: 'https://www.twitch.tv/relsev',                 tone: 783.99 },
  { id: 'youtube',  icon: 'fa-brands fa-youtube',        sub: '',         href: 'https://www.youtube.com/@Re1s3v',              tone: 880.00 },
  { id: 'tiktok',   icon: 'fa-brands fa-tiktok',         sub: '',         href: 'https://www.tiktok.com/@everelsu',             tone: 987.77 },
  { id: 'github',   icon: 'fa-brands fa-github',         sub: 'works',    href: 'https://github.com/Everelsu',                  tone: 1046.5 },
  { id: 'x',        icon: 'fa-brands fa-x-twitter',      sub: '',         href: 'https://x.com/Rels3v',                         tone: 1174.7 },
  { id: 'steam',    icon: 'fa-brands fa-steam',          sub: 'play',     href: 'https://steamcommunity.com/id/Relsev/',        tone: 1318.5 },
  { id: 'boosty',   icon: 'fa-solid fa-hand-holding-heart', sub: 'monthly', href: 'https://boosty.to/relsev',                   tone: 1396.9 },
  { id: 'donate',   icon: 'fa-solid fa-coins',           sub: 'once',     href: 'https://www.donationalerts.com/r/relsev',      tone: 1568.0 }
];


/* ═══════════════════════════════════════════════════════════════
   AUDIO — everything synthesised, no files
   ═══════════════════════════════════════════════════════════════ */
const audio = {
  ax: null, master: null, ambGain: null, ambNodes: [],
  amb: false, sfx: true, noise: null, lastClink: 0,

  init() {
    if (this.ax) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ax = new AC();
    this.master = this.ax.createGain();
    this.master.gain.value = 0.9;
    this.master.connect(this.ax.destination);

    const len = this.ax.sampleRate * 2;
    const buf = this.ax.createBuffer(1, len, this.ax.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    this.noise = buf;
  },

  resume() { if (this.ax && this.ax.state === 'suspended') this.ax.resume(); },
  wake() { this.init(); this.resume(); },

  /* struck metal */
  ping(freq = 660, vol = 0.16, dur = 1.3) {
    if (!this.sfx || !this.ax) return;
    const t = this.ax.currentTime;
    [1, 2.01, 2.98, 4.2].forEach((h, i) => {
      const o = this.ax.createOscillator();
      const g = this.ax.createGain();
      o.type = i ? 'sine' : 'triangle';
      o.frequency.value = freq * h;
      const v = vol / (1 + i * 1.7);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(v, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur / (1 + i * 0.5));
      o.connect(g).connect(this.master);
      o.start(t); o.stop(t + dur + 0.1);
    });
  },

  /* bead against bead */
  clink(strength = 1) {
    if (!this.sfx || !this.ax) return;
    const now = performance.now();
    if (now - this.lastClink < 55) return;
    this.lastClink = now;
    const t = this.ax.currentTime;
    const src = this.ax.createBufferSource();
    src.buffer = this.noise;
    const bp = this.ax.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = rand(2600, 5200);
    bp.Q.value = 9;
    const g = this.ax.createGain();
    g.gain.setValueAtTime(clamp(0.05 * strength, 0.008, 0.09), t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    src.connect(bp).connect(g).connect(this.master);
    src.start(t); src.stop(t + 0.12);
  },

  /* the seal cracks */
  crack() {
    if (!this.ax) return;
    const t = this.ax.currentTime;
    const src = this.ax.createBufferSource();
    src.buffer = this.noise;
    const f = this.ax.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.setValueAtTime(5200, t);
    f.frequency.exponentialRampToValueAtTime(180, t + 1.5);
    const g = this.ax.createGain();
    g.gain.setValueAtTime(0.16, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.7);
    src.connect(f).connect(g).connect(this.master);
    src.start(t); src.stop(t + 1.8);
    this.ping(196, 0.13, 3.4);
    setTimeout(() => this.ping(392, 0.07, 2.6), 130);
  },

  /* slow cathedral drone */
  startAmb() {
    if (!this.ax || this.ambNodes.length) return;
    const t = this.ax.currentTime;
    this.ambGain = this.ax.createGain();
    this.ambGain.gain.setValueAtTime(0.0001, t);
    this.ambGain.gain.linearRampToValueAtTime(0.05, t + 4);
    const lp = this.ax.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 520; lp.Q.value = 0.6;
    this.ambGain.connect(lp).connect(this.master);

    [65.41, 98.0, 130.81, 196.0].forEach((f, i) => {
      const o = this.ax.createOscillator();
      const g = this.ax.createGain();
      o.type = i % 2 ? 'sine' : 'triangle';
      o.frequency.value = f * (1 + (i - 1.5) * 0.0016);
      g.gain.value = 0.4 / (i + 1.4);

      const lfo = this.ax.createOscillator();
      const lg = this.ax.createGain();
      lfo.frequency.value = 0.035 + i * 0.021;
      lg.gain.value = g.gain.value * 0.65;
      lfo.connect(lg).connect(g.gain);
      lfo.start();

      o.connect(g).connect(this.ambGain);
      o.start();
      this.ambNodes.push(o, lfo);
    });
    this.amb = true;
  },

  stopAmb() {
    if (!this.ambGain) return;
    const t = this.ax.currentTime;
    this.ambGain.gain.cancelScheduledValues(t);
    this.ambGain.gain.setValueAtTime(Math.max(this.ambGain.gain.value, 0.0001), t);
    this.ambGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
    const nodes = this.ambNodes;
    setTimeout(() => nodes.forEach(n => { try { n.stop(); } catch (e) {} }), 1600);
    this.ambNodes = [];
    this.ambGain = null;
    this.amb = false;
  }
};

/* ═══════════════════════════════════════════════════════════════
   TOAST
   ═══════════════════════════════════════════════════════════════ */
let toastTimer;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('on'), 2400);
}

i18n.apply();

/* ═══════════════════════════════════════════════════════════════
   PRELOADER — hold the door until the plate has arrived
   ═══════════════════════════════════════════════════════════════ */
let loaded = false;
(function preload() {
  const fill = $('#ldFill'), pct = $('#ldPct');
  const imgs = $$('img[src]');
  const started = performance.now();
  let done = 0, shown = 0, creep;

  const set = v => {
    fill.style.width = v.toFixed(1) + '%';
    pct.innerHTML = Math.round(v) + '<em>%</em>';
  };

  const finish = () => {
    if (loaded) return;
    loaded = true;
    clearInterval(creep);
    set(100);
    // let the word "loading" be readable even on a fast connection
    const wait = Math.max(0, 620 - (performance.now() - started));
    setTimeout(() => { document.body.dataset.loaded = 'true'; }, wait + 260);
  };

  const target = () => imgs.length ? (done / imgs.length) * 100 : 100;
  creep = setInterval(() => {
    const t = target();
    shown = Math.min(shown + Math.max(1.2, (t - shown) * 0.2), t < 100 ? 96 : 100);
    set(shown);
  }, 60);

  const tick = () => { if (++done >= imgs.length) finish(); };
  if (!imgs.length) finish();
  imgs.forEach(im => {
    if (im.complete) tick();
    else { im.addEventListener('load', tick, { once: true }); im.addEventListener('error', tick, { once: true }); }
  });

  // never hold the door shut for more than 14s
  setTimeout(finish, 14000);
})();

/* ═══════════════════════════════════════════════════════════════
   THE SEAL
   ═══════════════════════════════════════════════════════════════ */
let entered = false;
function enterSite() {
  if (entered || !loaded) return;
  entered = true;
  audio.wake();
  audio.crack();
  document.body.dataset.entered = 'true';
  setTimeout(() => $('#seal').setAttribute('tabindex', '-1'), 900);
}
$('#seal').addEventListener('click', enterSite);

/* ═══════════════════════════════════════════════════════════════
   AUDIO BUTTONS
   ═══════════════════════════════════════════════════════════════ */
$('#btnAmb').addEventListener('click', function () {
  audio.wake();
  if (audio.amb) { audio.stopAmb(); this.setAttribute('aria-pressed', 'false'); }
  else { audio.startAmb(); this.setAttribute('aria-pressed', 'true'); }
});
$('#btnSfx').addEventListener('click', function () {
  audio.wake();
  audio.sfx = !audio.sfx;
  this.setAttribute('aria-pressed', String(audio.sfx));
  if (audio.sfx) audio.ping(880, 0.1, 0.7);
});

/* ═══════════════════════════════════════════════════════════════
   POINTER — one shared reading of the hand
   ═══════════════════════════════════════════════════════════════ */
const hand = { x: 0.5, y: 0.45, nx: 0, ny: 0, moved: false, last: 0 };
addEventListener('pointermove', e => {
  hand.x = e.clientX / innerWidth;
  hand.y = e.clientY / innerHeight;
  hand.nx = hand.x - 0.5;
  hand.ny = hand.y - 0.5;
  hand.moved = true;
  hand.last = performance.now();
}, { passive: true });

/* ═══════════════════════════════════════════════════════════════
   THE SCENE — depth cut from a single plate
   ═══════════════════════════════════════════════════════════════ */
(function scene() {
  const st = $('#scene');
  if (!st) return;
  const els = $$('[data-depth]');
  let cx = 0, cy = 0, drift = 0;

  (function tick() {
    // when the hand is still, the scene breathes on its own
    const idle = performance.now() - hand.last > 2600 || !hand.moved;
    let tx = hand.nx, ty = hand.ny;
    if (idle && !REDUCED) {
      drift += 0.0035;
      tx = Math.sin(drift) * 0.22 + Math.sin(drift * 2.7) * 0.06;
      ty = Math.cos(drift * 0.77) * 0.16;
    }
    cx += (tx - cx) * 0.055;
    cy += (ty - cy) * 0.055;

    for (const el of els) {
      const d = +el.dataset.depth;
      el.style.setProperty('--px', (-cx * d).toFixed(2) + 'px');
      el.style.setProperty('--py', (-cy * d * 0.6).toFixed(2) + 'px');
    }
    requestAnimationFrame(tick);
  })();

})();

/* ═══════════════════════════════════════════════════════════════
   EMBERS — motes rising through the scene light
   ═══════════════════════════════════════════════════════════════ */
(function embers() {
  const cv = $('#embers');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  let W = 0, H = 0, dpr = 1, ps = [];

  function resize() {
    const w = cv.clientWidth, h = cv.clientHeight;
    dpr = Math.min(devicePixelRatio || 1, 2);
    if (w === W && h === H) return;
    if (w < 2 || h < 2) return;
    W = w; H = h;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = W < 700 ? 34 : 66;
    ps = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: rand(0.5, 2.1), vy: rand(-0.34, -0.08), vx: rand(-0.1, 0.1),
      a: rand(0.1, 0.55), ph: rand(0, 6.28), sp: rand(0.5, 1.7),
      star: Math.random() < 0.18
    }));
  }

  function star(x, y, r) {
    ctx.beginPath();
    ctx.moveTo(x, y - r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.quadraticCurveTo(x, y, x, y + r);
    ctx.quadraticCurveTo(x, y, x - r, y);
    ctx.quadraticCurveTo(x, y, x, y - r);
    ctx.fill();
  }

  let t = 0;
  (function frame() {
    resize();
    t += REDUCED ? 0 : 0.016;
    ctx.clearRect(0, 0, W, H);
    for (const p of ps) {
      if (!REDUCED) {
        p.y += p.vy;
        p.x += p.vx + Math.sin(t * 0.6 + p.ph) * 0.14;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 10; else if (p.x > W + 10) p.x = -10;
      }
      const fade = clamp(p.y / (H * 0.9), 0, 1);
      const a = p.a * fade * (0.45 + 0.55 * Math.sin(t * p.sp + p.ph));
      if (a <= 0.01) continue;
      ctx.fillStyle = `rgba(222,235,255,${a})`;
      if (p.star) star(p.x, p.y, p.r * 3.2);
      else { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill(); }
    }
    requestAnimationFrame(frame);
  })();

})();

/* ═══════════════════════════════════════════════════════════════
   THE LAMP — a light that follows the hand
   ═══════════════════════════════════════════════════════════════ */
(function lamp() {
  const el = $('#lamp');
  let x = innerWidth / 2, y = innerHeight * 0.4;
  (function tick() {
    x += (hand.x * innerWidth - x) * 0.09;
    y += (hand.y * innerHeight - y) * 0.09;
    el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    requestAnimationFrame(tick);
  })();
})();

/* ═══════════════════════════════════════════════════════════════
   THE PLATE — move the light across the icon
   ═══════════════════════════════════════════════════════════════ */
(function plate() {
  const box = $('#avOuter');
  if (!box) return;
  const lit = $('.av-lit', box);
  const img = $('#avi');

  img.addEventListener('error', () => {
    $$('#avOuter img').forEach(i => i.style.display = 'none');
    $('#avf').style.display = 'grid';
  });

  let idle = true, t = 0;

  box.addEventListener('pointermove', e => {
    const r = box.getBoundingClientRect();
    idle = false;
    lit.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(2) + '%');
    lit.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(2) + '%');
    lit.style.setProperty('--lit', '.8');
  }, { passive: true });

  box.addEventListener('pointerleave', () => {
    idle = true;
    lit.style.setProperty('--lit', REDUCED ? '0' : '.2');
  });

  if (!REDUCED) {
    lit.style.setProperty('--lit', '.2');
    (function drift() {
      if (idle) {
        t += 0.0042;
        lit.style.setProperty('--mx', (50 + Math.sin(t) * 27 + Math.sin(t * 2.3) * 9).toFixed(2) + '%');
        lit.style.setProperty('--my', (42 + Math.cos(t * 0.83) * 22 + Math.sin(t * 1.7) * 7).toFixed(2) + '%');
      }
      requestAnimationFrame(drift);
    })();
  }
})();

/* ═══════════════════════════════════════════════════════════════
   DUST — motes, four-point stars, hanging strings of light
   ═══════════════════════════════════════════════════════════════ */
(function dust() {
  const cv = $('#dust');
  const ctx = cv.getContext('2d');
  let W = 0, H = 0, dpr = 1;
  let motes = [], stars = [], strings = [];
  let scroll = 0;

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  function seed() {
    const n = W < 700 ? 34 : 64;
    motes = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: rand(0.4, 1.5), vy: rand(-0.16, -0.04), vx: rand(-0.07, 0.07),
      a: rand(0.05, 0.28), ph: rand(0, 6.28), sp: rand(0.4, 1.5)
    }));

    stars = Array.from({ length: W < 700 ? 10 : 20 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: rand(3, 9), ph: rand(0, 6.28), sp: rand(0.25, 0.8), a: rand(0.2, 0.6)
    }));

    const cols = W < 700 ? 3 : 6;
    strings = Array.from({ length: cols }, (_, i) => ({
      x: (i + 0.5) / cols * W + rand(-40, 40),
      len: rand(0.35, 0.95) * H,
      gap: rand(20, 34),
      ph: rand(0, 6.28), sw: rand(4, 13), sp: rand(0.12, 0.3),
      a: rand(0.04, 0.11)
    }));
  }

  function star(x, y, r) {
    ctx.beginPath();
    ctx.moveTo(x, y - r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.quadraticCurveTo(x, y, x, y + r);
    ctx.quadraticCurveTo(x, y, x - r, y);
    ctx.quadraticCurveTo(x, y, x, y - r);
    ctx.fill();
  }

  let t = 0;
  (function frame() {
    if (innerWidth !== W || innerHeight !== H) resize();
    t += REDUCED ? 0 : 0.016;
    ctx.clearRect(0, 0, W, H);

    const ox = hand.nx * 14, oy = -scroll * 0.06 + hand.ny * 10;

    strings.forEach(s => {
      const sway = Math.sin(t * s.sp + s.ph) * s.sw;
      const x0 = s.x + ox * 1.6;
      ctx.strokeStyle = `rgba(206,222,250,${s.a * 0.5})`;
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(x0, -20);
      ctx.quadraticCurveTo(x0 + sway * 0.5, s.len * 0.5 + oy, x0 + sway, s.len + oy);
      ctx.stroke();

      const n = Math.floor(s.len / s.gap);
      for (let i = 0; i < n; i++) {
        const f = i / n;
        const by = f * s.len + oy;
        if (by < -20 || by > H + 20) continue;
        const tw = 0.55 + 0.45 * Math.sin(t * 1.6 + i * 0.7 + s.ph);
        ctx.fillStyle = `rgba(222,234,255,${s.a * tw * 1.9})`;
        ctx.beginPath();
        ctx.arc(x0 + sway * f * f, by, 1.15, 0, 6.283);
        ctx.fill();
      }
    });

    motes.forEach(m => {
      if (!REDUCED) {
        m.y += m.vy; m.x += m.vx + Math.sin(t * 0.5 + m.ph) * 0.08;
        if (m.y < -8) { m.y = H + 8; m.x = Math.random() * W; }
        if (m.x < -8) m.x = W + 8; else if (m.x > W + 8) m.x = -8;
      }
      const a = m.a * (0.55 + 0.45 * Math.sin(t * m.sp + m.ph));
      ctx.fillStyle = `rgba(214,228,252,${a})`;
      ctx.beginPath();
      ctx.arc(m.x + ox, m.y + oy * 0.5, m.r, 0, 6.283);
      ctx.fill();
    });

    stars.forEach(s => {
      const k = 0.5 + 0.5 * Math.sin(t * s.sp + s.ph);
      const a = s.a * k;
      if (a < 0.02) return;
      ctx.fillStyle = `rgba(236,244,255,${a})`;
      star(s.x + ox * 0.6, s.y + oy * 0.35, s.r * (0.6 + k * 0.6));
      ctx.fillStyle = `rgba(236,244,255,${a * 0.35})`;
      star(s.x + ox * 0.6, s.y + oy * 0.35, s.r * (0.25 + k * 0.25));
    });

    requestAnimationFrame(frame);
  })();

  addEventListener('resize', resize);
  addEventListener('scroll', () => { scroll = scrollY; }, { passive: true });
  resize();
})();

/* ═══════════════════════════════════════════════════════════════
   THE ROSARY — verlet chain, nine beads, one cross
   ═══════════════════════════════════════════════════════════════ */
const rosary = (function () {
  const wrap = $('#rosary');
  const cv = $('#rc');
  const host = $('#beads');
  if (!wrap || !cv || !host) return null;

  const ctx = cv.getContext('2d');
  const FILL = 4;              // chain links between beads
  const GRAV = 0.58;
  const DAMP = 0.9935;
  const ITER = 14;

  let W = 0, H = 0, dpr = 1, seg = 14;
  let pts = [], sticks = [], kinds = [];
  let beadIdx = [], crossIdx = -1;
  let nodes = [], crossNode = null;
  let sparks = [];
  let dragIdx = -1, dragX = 0, dragY = 0, dragMoved = 0, dragDown = null, suppress = false;
  let hover = -1, t = 0, acc = 0, last = performance.now();
  let live = true;

  /* ── the chain ───────────────────────────────────────────── */
  function layout() {
    kinds = ['anchor'];
    LINKS.forEach(() => {
      for (let f = 0; f < FILL; f++) kinds.push('link');
      kinds.push('bead');
    });
    for (let f = 0; f < FILL + 1; f++) kinds.push('link');
    kinds.push('cross');

    const n = kinds.length;
    seg = (H * 0.70) / (n - 1);   // leaves the cross clear of the tools bar

    const ax = W / 2, ay = 10;
    pts = kinds.map((k, i) => ({
      x: ax, y: ay + i * seg, px: ax, py: ay + i * seg,
      pin: k === 'anchor', k
    }));
    sticks = [];
    for (let i = 1; i < n; i++) sticks.push({ a: i - 1, b: i, len: seg });

    beadIdx = [];
    kinds.forEach((k, i) => {
      if (k === 'bead') beadIdx.push(i);
      else if (k === 'cross') crossIdx = i;
    });
  }

  function resize() {
    const nw = wrap.clientWidth, nh = wrap.clientHeight;
    dpr = Math.min(devicePixelRatio || 1, 2);
    if (nw === W && nh === H) return;
    if (nw < 2 || nh < 2) return;
    W = nw; H = nh;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    layout();
  }

  layout();

  /* ── the DOM beads ───────────────────────────────────────── */
  LINKS.forEach((l, i) => {
    const a = document.createElement(l.act ? 'button' : 'a');
    a.className = 'bead';
    if (l.act) a.type = 'button';
    else { a.href = l.href; a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    a.innerHTML =
      `<i class="${l.icon}" aria-hidden="true"></i>` +
      '<span class="blabel"></span>';
    a.addEventListener('pointerenter', () => hover = beadIdx[i]);
    a.addEventListener('pointerleave', () => { if (hover === beadIdx[i]) hover = -1; });
    a.addEventListener('focus', () => hover = beadIdx[i]);
    a.addEventListener('blur', () => { if (hover === beadIdx[i]) hover = -1; });
    a.addEventListener('click', e => {
      if (suppress) { e.preventDefault(); return; }
      audio.wake();
      audio.ping(l.tone, 0.15, 1.5);
      burst(pts[beadIdx[i]].x, pts[beadIdx[i]].y, 18);
      if (l.act === 'email') { e.preventDefault(); copyEmail(); }
    });
    host.appendChild(a);
    nodes.push(a);
  });

  crossNode = document.createElement('button');
  crossNode.type = 'button';
  crossNode.className = 'bead cross';
  crossNode.innerHTML = '<span class="blabel"></span>';
  crossNode.addEventListener('pointerenter', () => hover = crossIdx);
  crossNode.addEventListener('pointerleave', () => { if (hover === crossIdx) hover = -1; });
  crossNode.addEventListener('focus', () => hover = crossIdx);
  crossNode.addEventListener('blur', () => { if (hover === crossIdx) hover = -1; });
  crossNode.addEventListener('click', () => {
    if (suppress) return;
    audio.wake();
    audio.ping(261.63, 0.17, 3.2);
    burst(pts[crossIdx].x, pts[crossIdx].y, 30);
    nextLitany();
  });
  host.appendChild(crossNode);

  /* the beads are engraved once and re-lettered on demand */
  function relabel() {
    LINKS.forEach((l, i) => {
      const sub = i18n.sb(l.sub);
      $('.blabel', nodes[i]).innerHTML = i18n.nm(l.id) + (sub ? ' <em>&middot; ' + sub + '</em>' : '');
      nodes[i].setAttribute('aria-label', i18n.nm(l.id) + (sub ? ' - ' + sub : ''));
    });
    $('.blabel', crossNode).textContent = i18n.t('navLitany');
    crossNode.setAttribute('aria-label', i18n.t('navLitany'));
  }
  relabel();
  document.addEventListener('langchange', relabel);

  /* ── physics ─────────────────────────────────────────────── */
  function step() {
    const wind = REDUCED ? 0
      : (Math.sin(t * 0.41) * 0.018 + Math.sin(t * 1.13 + 1.7) * 0.026);

    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      if (p.pin) continue;
      if (i === dragIdx) { p.px = p.x; p.py = p.y; p.x = dragX; p.y = dragY; continue; }
      const vx = (p.x - p.px) * DAMP;
      const vy = (p.y - p.py) * DAMP;
      p.px = p.x; p.py = p.y;
      p.x += vx + wind;
      p.y += vy + GRAV;
    }

    for (let k = 0; k < ITER; k++) {
      for (let s = 0; s < sticks.length; s++) {
        const st = sticks[s], a = pts[st.a], b = pts[st.b];
        let dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 0.0001;
        const diff = (d - st.len) / d * 0.5;
        dx *= diff; dy *= diff;
        if (!a.pin && st.a !== dragIdx) { a.x += dx; a.y += dy; }
        if (!b.pin && st.b !== dragIdx) { b.x -= dx; b.y -= dy; }
      }
      pts[0].x = W / 2; pts[0].y = 10;
    }

    const pad = 14;
    for (let i = 1; i < pts.length; i++) {
      if (i === dragIdx) continue;
      const p = pts[i];
      if (p.x < pad) { p.x = pad; p.px = pad + (p.px - p.x) * 0.4; }
      else if (p.x > W - pad) { p.x = W - pad; p.px = W - pad + (p.px - p.x) * 0.4; }
      if (p.y > H - pad) { p.y = H - pad; p.px = p.x - (p.x - p.px) * 0.6; p.py = p.y; }
      if (p.y < 4) { p.y = 4; p.py = p.y; }
    }

    // beads that swing hard, speak
    for (let i = 0; i < beadIdx.length; i++) {
      const p = pts[beadIdx[i]];
      const sp = Math.hypot(p.x - p.px, p.y - p.py);
      if (sp > 6.5) {
        audio.clink(sp / 9);
        if (Math.random() < 0.35) burst(p.x, p.y, 2, 0.5);
      }
    }
  }

  function burst(x, y, n = 14, scale = 1) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.283, s = rand(0.6, 3.4) * scale;
      sparks.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 0.4, life: 1, r: rand(0.6, 1.9) });
    }
    if (sparks.length > 320) sparks.splice(0, sparks.length - 320);
  }

  /* ── painting ────────────────────────────────────────────── */
  function metal(x, y, r) {
    const g = ctx.createRadialGradient(x - r * 0.38, y - r * 0.44, r * 0.08, x, y, r);
    g.addColorStop(0.00, '#ffffff');
    g.addColorStop(0.20, '#e6ecf6');
    g.addColorStop(0.46, '#9aa2b1');
    g.addColorStop(0.72, '#565c67');
    g.addColorStop(0.90, '#2b2f36');
    g.addColorStop(1.00, '#14161a');
    return g;
  }

  function drawChain() {
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i];
      const len = Math.hypot(b.x - a.x, b.y - a.y);
      const flat = i % 2 === 0;
      ctx.save();
      ctx.translate((a.x + b.x) / 2, (a.y + b.y) / 2);
      ctx.rotate(Math.atan2(b.y - a.y, b.x - a.x));
      ctx.strokeStyle = `rgba(206,220,244,${flat ? 0.5 : 0.72})`;
      ctx.lineWidth = flat ? 0.9 : 1.35;
      ctx.beginPath();
      ctx.ellipse(0, 0, len * 0.56, flat ? len * 0.1 : len * 0.24, 0, 0, 6.283);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,.22)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.ellipse(0, -0.6, len * 0.5, flat ? len * 0.07 : len * 0.18, 0, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawBead(p, r, hot) {
    if (hot) {
      const g = ctx.createRadialGradient(p.x, p.y, r * 0.5, p.x, p.y, r * 3.1);
      g.addColorStop(0, 'rgba(200,220,255,.34)');
      g.addColorStop(1, 'rgba(200,220,255,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(p.x, p.y, r * 3.1, 0, 6.283); ctx.fill();
    }
    ctx.fillStyle = metal(p.x, p.y, r);
    ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 6.283); ctx.fill();

    ctx.strokeStyle = hot ? 'rgba(244,250,255,.85)' : 'rgba(226,238,255,.4)';
    ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.arc(p.x, p.y, r - 0.4, 0, 6.283); ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,.75)';
    ctx.beginPath();
    ctx.ellipse(p.x - r * 0.36, p.y - r * 0.42, r * 0.2, r * 0.13, -0.7, 0, 6.283);
    ctx.fill();
  }

  function drawCross(p, s, hot) {
    const arm = s * 0.34, len = s;
    const prev = pts[crossIdx - 1];
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(Math.atan2(p.y - prev.y, p.x - prev.x) - Math.PI / 2);

    if (hot) {
      const g = ctx.createRadialGradient(0, 0, 2, 0, 0, s * 2.4);
      g.addColorStop(0, 'rgba(206,224,255,.36)');
      g.addColorStop(1, 'rgba(206,224,255,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(0, 0, s * 2.4, 0, 6.283); ctx.fill();
    }

    const grad = ctx.createLinearGradient(-arm, -len * 0.6, arm, len * 0.9);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.3, '#c3cbd9');
    grad.addColorStop(0.55, '#6a707c');
    grad.addColorStop(0.78, '#eef2f9');
    grad.addColorStop(1, '#4d525c');
    ctx.fillStyle = grad;

    ctx.beginPath();
    ctx.rect(-arm * 0.34, -len * 0.42, arm * 0.68, len * 1.28);
    ctx.rect(-arm * 1.25, -len * 0.06, arm * 2.5, arm * 0.66);
    ctx.fill();

    ctx.strokeStyle = hot ? 'rgba(248,252,255,.9)' : 'rgba(226,238,255,.45)';
    ctx.lineWidth = 0.7;
    ctx.stroke();

    ctx.strokeStyle = 'rgba(214,228,250,.7)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(0, -len * 0.52, arm * 0.36, 0, 6.283); ctx.stroke();
    ctx.restore();
  }

  function drawSparks() {
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.x += s.vx; s.y += s.vy; s.vy += 0.09; s.vx *= 0.985; s.life -= 0.026;
      if (s.life <= 0) { sparks.splice(i, 1); continue; }
      ctx.fillStyle = `rgba(238,246,255,${s.life * 0.85})`;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r * s.life, 0, 6.283); ctx.fill();
    }
  }

  /* beads shrink as the chain grows, so they never overlap */
  const beadR = () => {
    const room = seg * (FILL + 1);          // the span from bead to bead
    return clamp(room * 0.42, 9, W < 560 ? 15 : 18);
  };

  function paint() {
    ctx.clearRect(0, 0, W, H);
    drawChain();
    const r = beadR();
    for (const i of beadIdx) drawBead(pts[i], r, hover === i);
    if (crossIdx > 0) drawCross(pts[crossIdx], r * 2.1, hover === crossIdx);
    drawSparks();
  }

  function place() {
    const r = beadR();
    const hit = Math.max(30, Math.round(r * 2.3));
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      if (n._hit !== hit) {
        n._hit = hit;
        n.style.width = n.style.height = hit + 'px';
        n.style.margin = (-hit / 2) + 'px 0 0 ' + (-hit / 2) + 'px';
      }
    }
    for (let i = 0; i < nodes.length; i++) {
      const p = pts[beadIdx[i]];
      nodes[i].style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0)`;
      nodes[i].classList.toggle('flip', p.x > W * 0.56);
    }
    if (crossIdx > 0) {
      const p = pts[crossIdx];
      crossNode.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0)`;
      crossNode.classList.toggle('flip', p.x > W * 0.56);
      const d = r * 2.6;
      crossNode.style.width = crossNode.style.height = d + 'px';
      crossNode.style.margin = `${-d / 2}px 0 0 ${-d / 2}px`;
    }
  }

  /* ── grabbing ────────────────────────────────────────────── */
  function local(e) {
    const r = wrap.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  function nearest(x, y) {
    let best = -1, bd = Infinity;
    for (let i = 1; i < pts.length; i++) {
      const d = Math.hypot(pts[i].x - x, pts[i].y - y);
      if (d < bd) { bd = d; best = i; }
    }
    return { i: best, d: bd };
  }

  wrap.addEventListener('pointerdown', e => {
    const { x, y } = local(e);
    const n = nearest(x, y);
    if (n.i < 0) return;
    const solid = pts[n.i].k === 'bead' || pts[n.i].k === 'cross';
    // touch may only grab a bead — everything else scrolls the page
    const reach = e.pointerType === 'touch' ? (solid ? 34 : -1) : 46;
    if (n.d > reach) return;

    audio.wake();
    dragIdx = n.i; dragX = x; dragY = y; dragMoved = 0; dragDown = { x, y };
    wrap.classList.add('grabbing');
    try { wrap.setPointerCapture(e.pointerId); } catch (err) {}
    e.preventDefault();
  });

  wrap.addEventListener('pointermove', e => {
    if (dragIdx < 0) return;
    const { x, y } = local(e);
    dragX = clamp(x, 6, W - 6);
    dragY = clamp(y, 6, H - 6);
    dragMoved = Math.max(dragMoved, Math.hypot(x - dragDown.x, y - dragDown.y));
    e.preventDefault();
  });

  function release(e) {
    if (dragIdx < 0) return;
    dragIdx = -1;
    wrap.classList.remove('grabbing');
    try { wrap.releasePointerCapture(e.pointerId); } catch (err) {}
    // a drag must never open a door on release
    if (dragMoved > 7) {
      suppress = true;
      setTimeout(() => { suppress = false; }, 400);
    }
    dragMoved = 0;
  }
  wrap.addEventListener('pointerup', release);
  wrap.addEventListener('pointercancel', release);

  function push(force) {
    const f = force === undefined ? rand(7, 13) * (Math.random() < 0.5 ? -1 : 1) : force;
    for (let i = 1; i < pts.length; i++) {
      pts[i].px -= f * (i / pts.length) * (0.7 + Math.random() * 0.6);
    }
    audio.wake(); audio.clink(1.2);
  }

  /* ── loop — sleeps while off screen ──────────────────────── */
  if (window.IntersectionObserver) {
    new IntersectionObserver(es => { live = es[0].isIntersecting; }, { rootMargin: '120px' }).observe(wrap);
  }

  function frame(now) {
    resize();
    const dt = Math.min(now - last, 60);
    last = now;
    t = now / 1000;
    if (live && W > 2) {
      acc += dt;
      let guard = 0;
      while (acc >= 16.667 && guard++ < 4) { step(); acc -= 16.667; }
      paint();
      place();
    } else acc = 0;
    requestAnimationFrame(frame);
  }

  resize();
  requestAnimationFrame(frame);

  $('#btnSwing').addEventListener('click', () => push());

  return { push };
})();

/* ═══════════════════════════════════════════════════════════════
   THE PLAIN INDEX
   ═══════════════════════════════════════════════════════════════ */
(function plates() {
  const host = $('#plates');
  if (!host) return;
  const roman = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x', 'xi', 'xii'];

  function render() {
    host.innerHTML = '';
    LINKS.forEach((l, i) => {
      const a = document.createElement(l.act ? 'button' : 'a');
      a.className = 'plate';
      if (l.act) a.type = 'button';
      else { a.href = l.href; a.target = '_blank'; a.rel = 'noopener noreferrer'; }
      const sub = i18n.sb(l.sub);
      a.innerHTML =
        '<i class="' + l.icon + '" aria-hidden="true"></i>' +
        '<span class="p-nm">' + i18n.nm(l.id) + (sub ? ' <em>&middot; ' + sub + '</em>' : '') + '</span>' +
        '<span class="p-arr">' + roman[i] + ' &rarr;</span>';
      a.addEventListener('click', e => {
        audio.wake(); audio.ping(l.tone, 0.12, 1.1);
        if (l.act === 'email') { e.preventDefault(); copyEmail(); }
      });
      host.appendChild(a);
    });
  }

  render();
  document.addEventListener('langchange', render);
})();

/* ═══════════════════════════════════════════════════════════════
   EMAIL
   ═══════════════════════════════════════════════════════════════ */
function copyEmail() {
  const done = () => toast(t('copied') + ' · ' + EMAIL);
  const fallback = () => {
    const ta = document.createElement('textarea');
    ta.value = EMAIL;
    ta.style.cssText = 'position:fixed;top:-999px;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); }
    catch (e) { toast(EMAIL); }
    ta.remove();
  };
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(EMAIL).then(done).catch(fallback);
  } else fallback();
}

/* ═══════════════════════════════════════════════════════════════
   LITANY
   ═══════════════════════════════════════════════════════════════ */
let litIdx = 1;
function litanyLine() {
  const lines = t('litany');
  return lines[litIdx % lines.length];
}
function nextLitany() {
  const el = $('#litanyTxt');
  litIdx = (litIdx + 1) % t('litany').length;
  el.classList.add('fade');
  setTimeout(() => { el.textContent = litanyLine(); el.classList.remove('fade'); }, 250);
}
document.addEventListener('langchange', () => { $('#litanyTxt').textContent = litanyLine(); });
$('#litanyTxt').textContent = litanyLine();
$('#litany').addEventListener('click', () => {
  audio.wake();
  audio.ping(329.63, 0.12, 2);
  nextLitany();
});

/* ═══════════════════════════════════════════════════════════════
   SMALL RITES
   ═══════════════════════════════════════════════════════════════ */
$('#yr').textContent = new Date().getFullYear();

(function secret() {
  const el = $('#ftName'), out = $('#secret');
  let n = 0, timer;

  el.addEventListener('click', () => {
    n++;
    clearTimeout(timer);
    timer = setTimeout(() => n = 0, 700);
    if (n >= 3) {
      n = 0;
      out.hidden = false;
      const lines = t('secrets');
      out.textContent = lines[Math.floor(Math.random() * lines.length)];
      audio.wake(); audio.ping(1174.7, 0.13, 2.4);
      rosary && rosary.push();
    }
  });
})();

/* the cross at the foot of the frame — the way in */
(function hiddenDoor() {
  const btn = $('#hiddenDoor'), tab = $('.tab-secret');
  if (!btn || !tab) return;
  btn.addEventListener('click', () => {
    audio.wake();
    if (tab.hidden) {
      tab.hidden = false;
      btn.classList.add('found');
      btn.setAttribute('aria-label', 'the rosary');
      btn.title = 'the rosary';
      audio.ping(261.63, 0.16, 3.4);
      toast(t('chamber'));
    }
    router.go('rosary');
  });
})();

/* letters, wherever you are */
$('#btnLetters').addEventListener('click', () => {
  audio.wake();
  audio.ping(698.46, 0.13, 1.4);
  copyEmail();
});

/* the name, struck like a bell */
$('#heroName').addEventListener('click', () => {
  audio.wake();
  audio.ping(392, 0.14, 2.8);
});

/* keyboard: escape the seal */
addEventListener('keydown', e => {
  if (!entered && (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape')) {
    e.preventDefault();
    enterSite();
  }
});

/* ═══════════════════════════════════════════════════════════════
   THE CURTAIN — the liquid that carries you between views.
   A wavy front floods the screen, the view is swapped underneath
   it, then the front drains away. The liquid is the plate itself:
   smeared downward, edge-traced, drawn in cold silver.
   ═══════════════════════════════════════════════════════════════ */
const curtain = (function () {
  const cv = $('#curtain');
  if (!cv) return null;

  let gl = null;
  const opts = { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false };
  try { gl = cv.getContext('webgl', opts) || cv.getContext('experimental-webgl', opts); } catch (e) {}
  if (!gl || REDUCED) { document.body.classList.add('no-curtain'); return null; }

  const VS = [
    'attribute vec2 aPos;',
    'varying vec2 vUv;',
    'void main() {',
    '  vUv = aPos * 0.5 + 0.5;',
    '  vUv.y = 1.0 - vUv.y;',
    '  gl_Position = vec4(aPos, 0.0, 1.0);',
    '}'
  ].join('\n');

  const FS = [
    'precision highp float;',
    'varying vec2 vUv;',
    'uniform sampler2D uTex;',
    'uniform vec2  uRes;',
    'uniform vec2  uTexS;',
    'uniform vec2  uTexO;',
    'uniform float uTime;',
    'uniform float uFlow;',
    'uniform float uPan;',
    'const vec3 SILVER = vec3(0.80, 0.855, 0.97);',
    'const vec3 LUMA = vec3(0.299, 0.587, 0.114);',

    'vec3 plate(vec2 q) {',
    '  return texture2D(uTex, clamp(q * uTexS + uTexO, 0.002, 0.998)).rgb;',
    '}',

    // the plate, dragged along the pan - five taps make the smear
    'vec3 smear(vec2 q, float amount) {',
    '  vec3 c = vec3(0.0);',
    '  for (int i = 0; i < 5; i++) {',
    '    float f = float(i) / 4.0;',
    '    c += plate(vec2(q.x, q.y - f * amount));',
    '  }',
    '  return c * 0.2;',
    '}',

    'void main() {',
    '  if (uFlow <= 0.004) discard;',
    '  vec2 uv = vUv;',
    '  float warp = uFlow;',

    // the panorama slides under the glass
    '  vec2 q = uv;',
    '  q.y += uPan * 0.16;',
    '  q.x += sin(uv.y * 17.0 + uTime * 1.8) * 0.016 * warp;',
    '  q.x += sin(uv.y * 32.0 - uTime * 2.6) * 0.006 * warp;',
    '  q.y += sin(uv.x * 9.0 - uTime * 1.1) * 0.010 * warp;',

    '  vec3 t = smear(q, 0.02 + 0.10 * warp);',
    '  float lum = dot(t, LUMA);',

    // the white line-work floating on the surface
    '  float px = 1.8 / uRes.x, py = 1.8 / uRes.y;',
    '  float l1 = dot(plate(q + vec2(px, 0.0)), LUMA);',
    '  float l2 = dot(plate(q - vec2(px, 0.0)), LUMA);',
    '  float l3 = dot(plate(q + vec2(0.0, py)), LUMA);',
    '  float l4 = dot(plate(q - vec2(0.0, py)), LUMA);',
    '  float edge = clamp(length(vec2(l1 - l2, l3 - l4)) * 5.0, 0.0, 1.0);',

    '  vec3 col = SILVER * pow(lum, 1.6) * 0.44;',
    '  col += SILVER * edge * (0.16 + 0.40 * warp);',
    '  col *= 0.92 + 0.08 * sin(uv.y * 96.0 + uTime * 1.2);',

    // it thins across the middle, where the words are
    '  float mid = smoothstep(0.16, 0.40, uv.y) * smoothstep(0.86, 0.60, uv.y);',
    '  float a = uFlow * mix(1.0, 0.34, mid) * (1.0 - smoothstep(0.86, 1.0, uv.y) * 0.8);',
    '  gl_FragColor = vec4(col * a, a);',
    '}'
  ].join('\n');

  function compile(type, src) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.warn('curtain shader:', gl.getShaderInfoLog(sh));
      return null;
    }
    return sh;
  }

  const vs = compile(gl.VERTEX_SHADER, VS), fs = compile(gl.FRAGMENT_SHADER, FS);
  if (!vs || !fs) { document.body.classList.add('no-curtain'); return null; }
  const prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { document.body.classList.add('no-curtain'); return null; }
  gl.useProgram(prog);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const U = {};
  ['uTex', 'uRes', 'uTexS', 'uTexO', 'uTime', 'uFlow', 'uPan']
    .forEach(n => U[n] = gl.getUniformLocation(prog, n));

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.uniform1i(U.uTex, 0);

  let hasTex = false;
  function upload(img) {
    if (!img || !img.naturalWidth) return;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    hasTex = true;
  }
  const src = $('#avi');
  if (src && src.complete) upload(src);
  else if (src) src.addEventListener('load', () => upload(src), { once: true });

  let W = 0, H = 0;
  const QUALITY = 0.75;
  function resize() {
    const w = innerWidth, h = innerHeight;
    if (w < 2 || h < 2) return;
    const q = Math.min(devicePixelRatio || 1, 1.6) * QUALITY;
    const nw = Math.round(w * q), nh = Math.round(h * q);
    if (nw === W && nh === H) return;
    W = nw; H = nh;
    cv.width = W; cv.height = H;
    gl.viewport(0, 0, W, H);
    gl.uniform2f(U.uRes, W, H);
    const a = w / h;
    let sx = 1, sy = 1, ox = 0, oy = 0;
    if (a >= 1) { sy = 1 / a; oy = (1 - sy) * 0.34; }
    else { sx = a; ox = (1 - sx) * 0.5; }
    gl.uniform2f(U.uTexS, sx, sy);
    gl.uniform2f(U.uTexO, ox, oy);
  }
  addEventListener('resize', resize);
  resize();

  /* the liquid is drawn only while the camera moves */
  let flow = 0, shown = 0, pan = 0;
  const clock = () => performance.now() / 1000;

  function paint() {
    resize();
    shown += (flow - shown) * (flow > shown ? 0.24 : 0.12);
    if (shown < 0.006) shown = 0;
    if (hasTex && W > 2) {
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (shown > 0.004) {
        gl.uniform1f(U.uTime, clock());
        gl.uniform1f(U.uFlow, Math.min(shown, 0.40));
        gl.uniform1f(U.uPan, pan);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
    }
    requestAnimationFrame(paint);
  }
  requestAnimationFrame(paint);

  return {
    flow(speed, position) { flow = speed; pan = position; }
  };
})();

/* ═══════════════════════════════════════════════════════════════
   THE ROUTER — four views, one curtain
   ═══════════════════════════════════════════════════════════════ */
const router = (function () {
  const VIEWS = ['home', 'elsewhere', 'litany', 'rosary'];
  const tabs = $$('#tabs button');
  let current = 'home';

  function mark() {
    tabs.forEach(b => {
      const on = b.dataset.go === current;
      if (on) {
        b.setAttribute('aria-current', 'page');
        // on a phone the strip slides — keep the current tab in sight
        const strip = b.parentElement;
        if (strip && strip.scrollWidth > strip.clientWidth + 1) {
          const want = b.offsetLeft - (strip.clientWidth - b.offsetWidth) / 2;
          strip.scrollTo({ left: Math.max(0, want), behavior: 'smooth' });
        }
      } else b.removeAttribute('aria-current');
    });
  }

  function order() {
    const secret = $('.tab-secret');
    return (secret && secret.hidden) ? VIEWS.slice(0, 3) : VIEWS.slice();
  }

  function apply(name) {
    current = name;
    document.body.dataset.view = name;
    mark();
    document.dispatchEvent(new CustomEvent('viewchange', { detail: name }));
    try { history.replaceState(null, '', name === 'home' ? location.pathname : '#' + name); } catch (e) {}
    const view = $('.view[data-view="' + name + '"]');
    if (view) view.scrollTop = 0;
    if (name === 'rosary' && rosary) setTimeout(() => rosary.push(), 320);
  }

  function go(name) {
    if (!VIEWS.includes(name)) return;
    const i = order().indexOf(name);
    if (i < 0) return;
    audio.wake();
    if (name !== current) audio.ping(name === 'home' ? 392 : 523.25, 0.1, 1.1);
    glide.goTo(i);
  }

  document.addEventListener('click', e => {
    const trigger = e.target.closest('[data-go]');
    if (!trigger) return;
    e.preventDefault();
    go(trigger.dataset.go);
  });

  addEventListener('hashchange', () => {
    const name = location.hash.replace('#', '') || 'home';
    if (name === 'rosary' && $('.tab-secret') && $('.tab-secret').hidden) return;
    go(name);
  });

  const initial = location.hash.replace('#', '');
  if (VIEWS.includes(initial) && initial !== 'home' && initial !== 'rosary') apply(initial);
  else mark();

  return { go, apply, order, get current() { return current; } };
})();

/* ═══════════════════════════════════════════════════════════════
   THE LANGUAGE MENU
   ═══════════════════════════════════════════════════════════════ */
(function tongues() {
  const btn = $('#btnLang'), menu = $('#langMenu');
  if (!btn || !menu) return;

  function build() {
    menu.innerHTML = '';
    i18n.codes.forEach(code => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'lang-opt';
      b.setAttribute('role', 'menuitemradio');
      b.setAttribute('aria-checked', String(code === i18n.lang));
      b.innerHTML = '<span>' + DICT[code].label + '</span><em>' + DICT[code].tag + '</em>';
      b.addEventListener('click', () => {
        audio.wake(); audio.ping(880, 0.1, 0.8);
        i18n.set(code);
        close();
      });
      menu.appendChild(b);
    });
  }

  function open() {
    build();
    menu.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
  }
  function close() {
    menu.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
  }

  btn.addEventListener('click', e => {
    e.stopPropagation();
    audio.wake();
    menu.hidden ? open() : close();
  });
  document.addEventListener('click', e => {
    if (!menu.hidden && !menu.contains(e.target) && e.target !== btn) close();
  });
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  document.addEventListener('langchange', () => { if (!menu.hidden) build(); });
})();

/* ═══════════════════════════════════════════════════════════════
   THE RAIL — numbered sections, the way a codex numbers its leaves
   ═══════════════════════════════════════════════════════════════ */
const rail = (function () {
  const list = $('#railList');
  if (!list) return null;

  function build() {
    const order = router.order();
    list.innerHTML = '';
    order.forEach((name, i) => {
      const li = document.createElement('li');
      li.className = 'rail-item' + (name === router.current ? ' on' : '');
      li.dataset.view = name;
      li.innerHTML =
        '<span class="rail-name">' + t('nav' + name[0].toUpperCase() + name.slice(1)) + '</span>' +
        '<span class="rail-num">' + String(i + 1).padStart(2, '0') + '</span>' +
        '<span class="rail-tick"></span>';
      list.appendChild(li);
    });
  }

  document.addEventListener('viewchange', build);
  document.addEventListener('langchange', build);
  build();
  return { build };
})();

/* ═══════════════════════════════════════════════════════════════
   THE GLIDE — the whole site is one tall panorama. Scrolling does
   not swap pages; it moves the camera. Position is a float in
   section units, eased every frame and settled onto a station
   once the hand lets go.
   ═══════════════════════════════════════════════════════════════ */
const glide = (function () {
  const views = $$('.view');
  const sc = $('#sc');
  const thumb = $('#thumb');
  const track = $('#thumbTrack');

  let pos = 0, target = 0, vel = 0, lastInput = 0, settled = true;
  let from = 0;            // the station the current gesture started at
  const GAP = 200;         // a pause this long ends a gesture

  const count = () => router.order().length;
  const clampT = v => clamp(v, 0, count() - 1);
  const indexOf = name => router.order().indexOf(name);

  /* ── what the hand does ──────────────────────────────────── */
  function nudge(delta) {
    const now = performance.now();
    if (now - lastInput > GAP) from = Math.round(pos);   // a fresh gesture
    target = clampT(target + delta);
    lastInput = now;
    settled = false;
  }

  function goTo(i) {
    target = clampT(Math.round(i));
    from = target;
    lastInput = 0;
    settled = true;         // a named destination needs no settling
  }

  /* ── the camera ──────────────────────────────────────────── */
  function frame() {
    const n = count();
    if (target > n - 1) target = n - 1;

    // once the hand rests, fall onto a station. A deliberate flick
    // always carries you at least one along; a stray nudge springs back.
    if (!settled && performance.now() - lastInput > GAP) {
      const moved = target - from;
      const want = Math.abs(moved) > 0.22
        ? clampT(from + Math.sign(moved) * Math.max(1, Math.round(Math.abs(moved))))
        : clampT(Math.round(from));
      target += (want - target) * 0.26;
      if (Math.abs(want - target) < 0.003) { target = want; settled = true; }
    }

    const prev = pos;
    pos += (target - pos) * 0.09;
    if (Math.abs(target - pos) < 0.0004) pos = target;
    vel = pos - prev;

    const speed = Math.min(Math.abs(vel) * 34, 1);

    // the sheets drift past one another
    for (let i = 0; i < views.length; i++) {
      const v = views[i];
      const idx = router.order().indexOf(v.dataset.view);
      if (idx < 0) { v.style.visibility = 'hidden'; v.style.pointerEvents = 'none'; continue; }
      const off = idx - pos;
      const away = Math.abs(off);
      v.style.setProperty('--off', off.toFixed(4));
      if (away >= 1.05) {
        v.style.visibility = 'hidden';
        v.style.pointerEvents = 'none';
        v.style.opacity = '0';
      } else {
        v.style.visibility = 'visible';
        v.style.opacity = Math.max(0, 1 - away * 1.28).toFixed(3);
        v.style.pointerEvents = away < 0.32 ? 'auto' : 'none';
      }
    }

    // the scene behind travels slower, the way a far wall does
    if (sc) sc.style.setProperty('--sy', (-pos * 7).toFixed(2) + 'vh');

    // the thin rule on the right
    if (thumb && track) {
      const n1 = Math.max(1, count() - 1);
      const th = 100 / count();
      thumb.style.height = th.toFixed(2) + '%';
      thumb.style.top = ((pos / n1) * (100 - th)).toFixed(2) + '%';
    }

    // the wash belongs to the space between stations, where the sheets
    // have already faded — at a station it stays out of the way entirely
    if (curtain) {
      const between = Math.min(Math.abs(pos - Math.round(pos)) * 2, 1);
      curtain.flow(Math.min(speed * 1.2, 1) * (0.18 + 0.82 * between), pos);
    }

    // tell the rest of the world which station is nearest
    const near = router.order()[clamp(Math.round(pos), 0, count() - 1)];
    if (near && near !== router.current) router.apply(near);

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  return {
    nudge, goTo,
    get pos() { return pos; }
  };
})();

/* ═══════════════════════════════════════════════════════════════
   THE HAND ON THE PANORAMA
   ═══════════════════════════════════════════════════════════════ */
(function reins() {
  const cue = $('#cue');

  const viewEl = () => $('.view[data-view="' + router.current + '"]');

  /* a long sheet keeps its own scroll; only at its edge does the
     wheel move the camera */
  function atEdge(dir) {
    const v = viewEl();
    if (!v) return true;
    const max = v.scrollHeight - v.clientHeight;
    if (max <= 4) return true;
    return dir > 0 ? v.scrollTop >= max - 4 : v.scrollTop <= 4;
  }

  addEventListener('wheel', e => {
    if (!entered) return;
    const dir = e.deltaY > 0 ? 1 : -1;
    if (!atEdge(dir)) return;
    e.preventDefault();
    // browsers report wheels in pixels, lines or pages — level them first
    const px = e.deltaMode === 1 ? e.deltaY * 16
             : e.deltaMode === 2 ? e.deltaY * innerHeight
             : e.deltaY;
    // one notch of a mouse wheel is ~100px; a section is a short flick away
    glide.nudge(clamp(px / 300, -0.7, 0.7));
  }, { passive: false });

  let y0 = null, guarded = false;
  addEventListener('touchstart', e => {
    y0 = e.touches[0].clientY;
    guarded = !!e.target.closest('#rosary, #tabs');
  }, { passive: true });

  addEventListener('touchmove', e => {
    if (y0 === null || guarded || !entered) return;
    const y = e.touches[0].clientY;
    const dy = y0 - y;
    if (!atEdge(dy > 0 ? 1 : -1)) { y0 = y; return; }
    glide.nudge(dy / (innerHeight * 0.85));
    y0 = y;
  }, { passive: true });

  addEventListener('touchend', () => { y0 = null; guarded = false; }, { passive: true });

  addEventListener('keydown', e => {
    if (!entered) return;
    const down = e.key === 'ArrowDown' || e.key === 'PageDown';
    const up = e.key === 'ArrowUp' || e.key === 'PageUp';
    if (!down && !up) return;
    if (!atEdge(down ? 1 : -1)) return;
    e.preventDefault();
    glide.goTo(Math.round(glide.pos) + (down ? 1 : -1));
  });

  if (cue) cue.addEventListener('click', () => glide.goTo(Math.round(glide.pos) + 1));

  function markEnd() {
    const order = router.order();
    document.body.classList.toggle('at-end', order.indexOf(router.current) === order.length - 1);
  }
  document.addEventListener('viewchange', markEnd);
  markEnd();
})();
