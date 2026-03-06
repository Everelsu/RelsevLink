'use strict';

/* ═══════════════════════════════════════════════════════════════
   AUDIO
   ═══════════════════════════════════════════════════════════════ */
let AX = null;
let masterG = null;
let revNode = null;
let ambRunning = false;
let ambNodes = [];
let sfxOn = true;
let ambOn = true;

function initAX() {
  if (AX) return;
  AX = new (window.AudioContext || window.webkitAudioContext)();
  masterG = AX.createGain();
  masterG.gain.value = 0.48;
  masterG.connect(AX.destination);
  revNode = AX.createConvolver();
  const len = AX.sampleRate * 3.2;
  const buf = AX.createBuffer(2, len, AX.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < len; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
  }
  revNode.buffer = buf;
  const rg = AX.createGain();
  rg.gain.value = 0.3;
  revNode.connect(rg);
  rg.connect(masterG);
}

function rAX() {
  if (AX && AX.state === 'suspended') AX.resume();
}

function startAmb() {
  if (!AX || ambRunning || !ambOn) return;
  ambRunning = true;
  const t0 = AX.currentTime;
  [[55, 0.018], [82.5, 0.014], [110, 0.011], [165, 0.008]].forEach(([freq, vol], i) => {
    const osc = AX.createOscillator();
    const g = AX.createGain();
    const lfo = AX.createOscillator();
    const lg = AX.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    lfo.type = 'sine';
    lfo.frequency.value = 0.04 + i * 0.02;
    lg.gain.value = freq * 0.002;
    lfo.connect(lg);
    lg.connect(osc.frequency);
    osc.connect(g);
    g.connect(revNode);
    g.connect(masterG);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + 3 + i * 0.5);
    osc.start();
    lfo.start();
    ambNodes.push({ osc, g });
    ambNodes.push({ osc: lfo });
  });
  [220, 330].forEach((freq, i) => {
    const o = AX.createOscillator();
    const g = AX.createGain();
    o.type = 'sine';
    o.frequency.value = freq;
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(0.004, t0 + 4);
    o.connect(g);
    g.connect(revNode);
    o.start();
    ambNodes.push({ osc: o, g });
  });
}

function stopAmb() {
  if (!AX) { ambNodes = []; ambRunning = false; return; }
  const t = AX.currentTime;
  const fadeDur = 0.8;
  ambNodes.forEach((n) => {
    if (n.g) n.g.gain.linearRampToValueAtTime(0, t + fadeDur);
  });
  setTimeout(() => {
    ambNodes.forEach((n) => {
      try { if (n.osc) n.osc.stop(); } catch (e) {}
    });
    ambNodes = [];
  }, (fadeDur + 0.1) * 1000);
  ambRunning = false;
}

const SFX = {
  0: { type: 'osc', oscType: 'triangle', freqs: [2200, 180], dur: 0.08, vol: 0.2, stopAt: 0.12 },
  1: { type: 'osc', oscType: 'sine', freqs: [110, 38], dur: 0.12, vol: 0.28, stopAt: 0.18 },
  2: { type: 'noise', bufDur: 0.06, filterFreq: 3000, q: 1.5, vol: 0.16 },
  3: { type: 'chord', freqs: [880, 1320, 1760], vol: 0.022, ramp: 0.45, toRev: true },
  4: { type: 'osc', oscType: 'sawtooth', freqs: [700, 55], dur: 0.12, vol: 0.16, stopAt: 0.16 }
};

function playSfx(t = 0) {
  if (!AX || !sfxOn) return;
  const cfg = SFX[t];
  if (!cfg) return;
  const n = AX.currentTime;

  if (cfg.type === 'osc') {
    const o = AX.createOscillator();
    const g = AX.createGain();
    o.type = cfg.oscType;
    o.frequency.setValueAtTime(cfg.freqs[0], n);
    o.frequency.exponentialRampToValueAtTime(cfg.freqs[1], n + cfg.dur);
    g.gain.setValueAtTime(cfg.vol, n);
    g.gain.exponentialRampToValueAtTime(0.001, n + (cfg.stopAt || cfg.dur + 0.02));
    o.connect(g);
    g.connect(masterG);
    o.start(n);
    o.stop(n + (cfg.stopAt || 0.2));
    return;
  }
  if (cfg.type === 'noise') {
    const buf = AX.createBuffer(1, AX.sampleRate * cfg.bufDur, AX.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const s = AX.createBufferSource();
    const f = AX.createBiquadFilter();
    const g = AX.createGain();
    s.buffer = buf;
    f.type = 'bandpass';
    f.frequency.value = cfg.filterFreq;
    f.Q.value = cfg.q;
    g.gain.setValueAtTime(cfg.vol, n);
    g.gain.linearRampToValueAtTime(0, n + cfg.bufDur);
    s.connect(f);
    f.connect(g);
    g.connect(masterG);
    s.start(n);
    return;
  }
  if (cfg.type === 'chord') {
    cfg.freqs.forEach((freq, i) => {
      const o = AX.createOscillator();
      const g = AX.createGain();
      o.type = 'sine';
      o.frequency.value = freq;
      g.gain.setValueAtTime(0, n);
      g.gain.linearRampToValueAtTime(cfg.vol, n + 0.01 + i * 0.008);
      g.gain.exponentialRampToValueAtTime(0.001, n + cfg.ramp);
      o.connect(g);
      g.connect(cfg.toRev ? revNode : masterG);
      o.start(n);
      o.stop(n + cfg.ramp + 0.05);
    });
  }
}

function playWhoosh() {
  if (!AX) return;
  const n = AX.currentTime;
  // Мягкий вход: тихий аккорд синусов с плавным появлением
  const freqs = [220, 277, 330, 440];
  const dur = 1.8;
  freqs.forEach((freq, i) => {
    const o = AX.createOscillator();
    const g = AX.createGain();
    o.type = 'sine';
    o.frequency.value = freq;
    g.gain.setValueAtTime(0, n);
    g.gain.linearRampToValueAtTime(0.06, n + 0.4 + i * 0.05);
    g.gain.linearRampToValueAtTime(0, n + dur);
    o.connect(g);
    g.connect(revNode);
    g.connect(masterG);
    o.start(n);
    o.stop(n + dur + 0.1);
  });
}

function toggleAmb() {
  ambOn = !ambOn;
  const btn = document.getElementById('btnAmb');
  btn.classList.toggle('muted', !ambOn);
  btn.setAttribute('aria-pressed', ambOn);
  if (ambOn) {
    rAX();
    startAmb();
  } else {
    stopAmb();
  }
}

function toggleSfx() {
  sfxOn = !sfxOn;
  const btn = document.getElementById('btnSfx');
  btn.classList.toggle('muted', !sfxOn);
  btn.setAttribute('aria-pressed', sfxOn);
}

document.querySelectorAll('.lnk[data-snd]').forEach((el) => {
  el.addEventListener('click', () => playSfx(+el.dataset.snd));
});

/* ═══════════════════════════════════════════════════════════════
   BACKGROUND — gradient (bgc) + veins (veinsC, accumulation)
   Veins: like CodePen dackmin/GROZpZ — no clear, lines accumulate
   ═══════════════════════════════════════════════════════════════ */
const bgc = document.getElementById('bgc');
const bgx = bgc.getContext('2d');
const veinsC = document.getElementById('veinsC');
const vctx = veinsC.getContext('2d');
let W = 0;
let H = 0;
let acR = 122;
let acG = 90;
let acB = 248;

const VEINS = {
  particleNum: 1000,
  step: 1,
  base: 300,
  zInc: 0.0001,
  lineWidth: 0.4,
  fadeAlpha: 0.018
};

let veinsParticles = [];
let veinsZoff = 0;
let simplexNoise = null;

// Inline 3D Simplex (fallback if CDN fails) — permutation-based
function makeSimplex3D() {
  const F3 = 1 / 3, G3 = 1 / 6;
  const p = new Uint8Array(256);
  const perm = new Uint8Array(512);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  const grad3 = new Float32Array([1,1,0, -1,1,0, 1,-1,0, -1,-1,0, 1,0,1, -1,0,1, 1,0,-1, -1,0,-1, 0,1,1, 0,-1,1, 0,1,-1, 0,-1,-1]);
  return function(x, y, z) {
    const s = (x + y + z) * F3;
    const i = (x + s) | 0, j = (y + s) | 0, k = (z + s) | 0;
    const t = (i + j + k) * G3;
    const X0 = i - t, Y0 = j - t, Z0 = k - t;
    const x0 = x - X0, y0 = y - Y0, z0 = z - Z0;
    let i1, j1, k1, i2, j2, k2;
    if (x0 >= y0) { if (y0 >= z0) { i1=1;j1=0;k1=0;i2=1;j2=1;k2=0; } else if (x0 >= z0) { i1=1;j1=0;k1=0;i2=1;j2=0;k2=1; } else { i1=0;j1=0;k1=1;i2=1;j2=0;k2=1; } }
    else { if (y0 < z0) { i1=0;j1=0;k1=1;i2=0;j2=1;k2=1; } else if (x0 < z0) { i1=0;j1=1;k1=0;i2=0;j2=1;k2=1; } else { i1=0;j1=1;k1=0;i2=1;j2=1;k2=0; } }
    const x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2*G3, y2 = y0 - j2 + 2*G3, z2 = z0 - k2 + 2*G3;
    const x3 = x0 - 1 + 3*G3, y3 = y0 - 1 + 3*G3, z3 = z0 - 1 + 3*G3;
    const ii = i & 255, jj = j & 255, kk = k & 255;
    const gi0 = (perm[ii + perm[jj + perm[kk]]] % 12) * 3;
    const n0 = Math.max(0, 0.6 - x0*x0 - y0*y0 - z0*z0) * (grad3[gi0]*x0 + grad3[gi0+1]*y0 + grad3[gi0+2]*z0);
    const gi1 = (perm[ii+i1 + perm[jj+j1 + perm[kk+k1]]] % 12) * 3;
    const n1 = Math.max(0, 0.6 - x1*x1 - y1*y1 - z1*z1) * (grad3[gi1]*x1 + grad3[gi1+1]*y1 + grad3[gi1+2]*z1);
    const gi2 = (perm[ii+i2 + perm[jj+j2 + perm[kk+k2]]] % 12) * 3;
    const n2 = Math.max(0, 0.6 - x2*x2 - y2*y2 - z2*z2) * (grad3[gi2]*x2 + grad3[gi2+1]*y2 + grad3[gi2+2]*z2);
    const gi3 = (perm[ii+1 + perm[jj+1 + perm[kk+1]]] % 12) * 3;
    const n3 = Math.max(0, 0.6 - x3*x3 - y3*y3 - z3*z3) * (grad3[gi3]*x3 + grad3[gi3+1]*y3 + grad3[gi3+2]*z3);
    return 32 * (n0 + n1 + n2 + n3);
  };
}

let noise3DFn = null;

function getNoise3D(x, y, z) {
  const octaves = 2;
  const fallout = 0.5;
  let amp = 1, f = 1, sum = 0;
  for (let i = 0; i < octaves; i++) {
    amp *= fallout;
    let v = simplexNoise && typeof simplexNoise.noise3D === 'function'
      ? simplexNoise.noise3D(x * f, y * f, z * f)
      : (noise3DFn || (noise3DFn = makeSimplex3D()))(x * f, y * f, z * f);
    v = Math.max(-1, Math.min(1, v));
    sum += amp * (v + 1) * 0.5;
    f *= 2;
  }
  return Math.max(0, Math.min(1, sum));
}

function initVeinsParticles() {
  veinsParticles = [];
  for (let i = 0; i < VEINS.particleNum; i++) {
    veinsParticles.push({
      x: W * Math.random(),
      y: H * Math.random(),
      pastX: 0,
      pastY: 0,
      alpha: 0
    });
  }
}

function resizeBg() {
  W = bgc.width = veinsC.width = window.innerWidth;
  H = bgc.height = veinsC.height = window.innerHeight;
  try {
    if (typeof SimplexNoise !== 'undefined') simplexNoise = new SimplexNoise();
  } catch (e) {}
  initVeinsParticles();
  drawBgStatic();
}

function drawBgStatic() {
  if (!W || !H) return;
  const cx = W / 2;
  const cy = H * 0.4;
  const R = Math.min(W, H) * 0.6;
  const bgGrad = bgx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, '#050508');
  bgGrad.addColorStop(0.4, '#08060e');
  bgGrad.addColorStop(0.7, '#0a0812');
  bgGrad.addColorStop(1, '#030305');
  bgx.fillStyle = bgGrad;
  bgx.fillRect(0, 0, W, H);
  const glow = bgx.createRadialGradient(cx, cy, 0, cx, cy, R);
  glow.addColorStop(0, `rgba(${acR}, ${acG}, ${acB}, 0.08)`);
  glow.addColorStop(0.5, `rgba(${acR}, ${acG}, ${acB}, 0.02)`);
  glow.addColorStop(1, 'transparent');
  bgx.fillStyle = glow;
  bgx.fillRect(0, 0, W, H);
}

function drawVeins() {
  if (veinsParticles.length === 0 || !W || !H) return;
  vctx.fillStyle = `rgba(0,0,0,${VEINS.fadeAlpha})`;
  vctx.fillRect(0, 0, W, H);
  const step = VEINS.step;
  const base = VEINS.base;
  const scale = 1.75;
  vctx.lineWidth = VEINS.lineWidth;
  vctx.lineCap = 'round';
  vctx.lineJoin = 'round';
  for (let i = 0; i < veinsParticles.length; i++) {
    const p = veinsParticles[i];
    p.pastX = p.x;
    p.pastY = p.y;
    const angle = Math.PI * 6 * getNoise3D((p.x / base) * scale, (p.y / base) * scale, veinsZoff);
    p.x += Math.cos(angle) * step;
    p.y += Math.sin(angle) * step;
    if (p.alpha < 1) p.alpha += 0.004;
    const a = Math.min(1, p.alpha * 0.5);
    vctx.strokeStyle = `rgba(${acR}, ${acG}, ${acB}, ${a})`;
    vctx.beginPath();
    vctx.moveTo(p.pastX, p.pastY);
    vctx.lineTo(p.x, p.y);
    vctx.stroke();
    if (p.x < -50 || p.x > W + 50 || p.y < -50 || p.y > H + 50) {
      p.x = W * Math.random();
      p.y = H * Math.random();
      p.pastX = p.x;
      p.pastY = p.y;
      p.alpha = 0;
    }
  }
  veinsZoff += VEINS.zInc;
}

function loop() {
  drawVeins();
  requestAnimationFrame(loop);
}

function onResize() {
  resizeBg();
  resizeNoise();
}

/* ═══════════════════════════════════════════════════════════════
   NOISE overlay
   ═══════════════════════════════════════════════════════════════ */
const nc = document.getElementById('noiseC');
const nx = nc.getContext('2d');

function resizeNoise() {
  nc.width = window.innerWidth;
  nc.height = window.innerHeight;
}

function regenNoise() {
  const w = nc.width;
  const h = nc.height;
  const id = nx.createImageData(w, h);
  const d = id.data;
  const grain = 2;
  for (let y = 0; y < h; y += grain) {
    for (let x = 0; x < w; x += grain) {
      const v = 128 + (Math.random() * 32 - 16) | 0;
      const alpha = 8 + Math.random() * 6;
      for (let dy = 0; dy < grain && y + dy < h; dy++) {
        for (let dx = 0; dx < grain && x + dx < w; dx++) {
          const i = ((y + dy) * w + (x + dx)) * 4;
          d[i] = d[i + 1] = d[i + 2] = v;
          d[i + 3] = alpha;
        }
      }
    }
  }
  nx.putImageData(id, 0, 0);
  setTimeout(regenNoise, 220);
}

regenNoise();

/* init: after nc and resizeNoise exist */
window.addEventListener('resize', onResize);
resizeBg();
resizeNoise();
loop();

/* ═══════════════════════════════════════════════════════════════
   COLOR EXTRACTION from avatar
   ═══════════════════════════════════════════════════════════════ */
function extractColor(img) {
  try {
    const c = document.createElement('canvas');
    c.width = c.height = 50;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0, 50, 50);
    const d = ctx.getImageData(0, 0, 50, 50).data;
    let r = 0, g = 0, b = 0, n = 0;
    for (let i = 0; i < d.length; i += 16) {
      if (d[i + 3] < 128) continue;
      const br = (d[i] + d[i + 1] + d[i + 2]) / 3;
      if (br < 28 || br > 228) continue;
      r += d[i];
      g += d[i + 1];
      b += d[i + 2];
      n++;
    }
    if (n < 25) return;
    r = Math.round(r / n);
    g = Math.round(g / n);
    b = Math.round(b / n);
    const avg = (r + g + b) / 3;
    const sat = 1.75;
    r = Math.min(255, Math.round(avg + (r - avg) * sat));
    g = Math.min(255, Math.round(avg + (g - avg) * sat));
    b = Math.min(255, Math.round(avg + (b - avg) * sat));
    r = Math.round(r * 0.78);
    g = Math.round(g * 0.78);
    b = Math.round(b * 0.78);
    const root = document.documentElement;
    root.style.setProperty('--ac', `rgb(${r},${g},${b})`);
    root.style.setProperty('--ac-rgb', `${r}, ${g}, ${b}`);
    root.style.setProperty('--ac2', `rgb(${Math.round(r * 0.45)},${Math.round(g * 0.45)},${Math.round(b * 0.45)})`);
    root.style.setProperty('--ac3', `rgb(${Math.min(255, r + 75)},${Math.min(255, g + 75)},${Math.min(255, b + 75)})`);
    acR = r;
    acG = g;
    acB = b;
    drawBgStatic();
  } catch (e) {}
}

const avi = document.getElementById('avi');
if (avi.complete && avi.naturalWidth > 0) {
  extractColor(avi);
} else {
  avi.addEventListener('load', () => extractColor(avi));
}

/* ═══════════════════════════════════════════════════════════════
   ENTER — FLIP: e-title morphs into hero-name
   ═══════════════════════════════════════════════════════════════ */
function enterSite() {
  initAX();
  rAX();
  playWhoosh();
  const eTitle = document.querySelector('.e-title');
  const heroName = document.getElementById('heroName');
  const el = document.getElementById('enter');

  // 1. Measure e-title position BEFORE any layout change
  const from = eTitle.getBoundingClientRect();

  // 2. Set data-entered, hide hero-name to measure its final position
  document.body.setAttribute('data-entered', 'true');
  heroName.style.opacity = '0';
  heroName.style.animation = 'none';
  const to = heroName.getBoundingClientRect();

  // 3. Deltas and scale (center-to-center)
  const dx = from.left + from.width / 2 - (to.left + to.width / 2);
  const dy = from.top + from.height / 2 - (to.top + to.height / 2);
  const scale = from.width / to.width;

  const acRgb = getComputedStyle(document.documentElement).getPropertyValue('--ac-rgb').trim() || '122, 90, 248';

  // 4. Clone e-title and place at destination, then transform to look like source
  const clone = eTitle.cloneNode(true);
  clone.style.cssText = `
    position: fixed;
    left: ${to.left}px;
    top: ${to.top}px;
    width: ${to.width}px;
    height: ${to.height}px;
    margin: 0;
    font-size: ${getComputedStyle(heroName).fontSize};
    transform: translate(${dx}px, ${dy}px) scale(${scale});
    transform-origin: center center;
    transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1),
                opacity 0.2s ease 0.55s;
    pointer-events: none;
    z-index: 9998;
    color: #fff;
    font-family: var(--frak);
    letter-spacing: 0.06em;
    text-shadow: 0 0 60px rgba(${acRgb}, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  document.body.appendChild(clone);
  eTitle.style.visibility = 'hidden';

  el.classList.add('hide');

  // 5. Next frame: animate clone to hero-name position, then fade out
  requestAnimationFrame(() => requestAnimationFrame(() => {
    clone.style.transform = 'translate(0, 0) scale(1)';
    clone.style.opacity = '0';
  }));

  // 6. When done: show hero-name, remove clone
  setTimeout(() => {
    heroName.style.opacity = '';
    heroName.style.animation = '';
    clone.remove();
    eTitle.style.visibility = '';
  }, 750);

  setTimeout(() => { el.style.display = 'none'; }, 1300);
  setTimeout(startAmb, 900);
}

/* ═══════════════════════════════════════════════════════════════
   ERROR PILLS (system.log)
   ═══════════════════════════════════════════════════════════════ */
const errMsgs = [
  'heart.exe has stopped working',
  'sleep.dll not found',
  'feeling.exe crashed unexpectedly',
  'reality.sys corrupted',
  'memory leak in soul.dll',
  "it's 4:04 again.",
  'stay strange.',
  'you are not alone in this.',
  'everything is fine.  (it is not fine)',
  'connection to self: l o s t',
  'sorrow overflow',
  'null — nothing here',
  'cannot allocate memory for hope',
  "you've been here a while. that's nice.",
  'the seventh fragment is you.',
  '+++ out of cheese error +++'
];

const spawnMsgs = [
  'process terminated',
  'signal: broken heart',
  'null pointer exception',
  'divide by zero',
  'stack overflow',
  'fatal: cannot DFUHIOX',
  'segfault in meaning'
];

let errIdx = 0;
let spawnCnt = 0;

function nextErr(pill) {
  playSfx(2);
  errIdx = (errIdx + 1) % errMsgs.length;
  document.getElementById('errtxt').textContent = errMsgs[errIdx];
  pill.classList.add('gflash');
  setTimeout(() => pill.classList.remove('gflash'), 100);
  if (spawnCnt < 5 && errIdx % 3 === 0) spawnPill();
}

function spawnPill() {
  spawnCnt++;
  const sec = document.querySelector('.err-section');
  const p = document.createElement('button');
  p.type = 'button';
  p.className = 'epill';
  p.style.cssText = 'opacity:0;transform:translateY(8px);transition:opacity .3s,transform .3s';
  p.innerHTML = `<span class="ep-ico" aria-hidden="true">⚠</span><span class="ep-txt">${spawnMsgs[spawnCnt % spawnMsgs.length]}</span><span class="ep-ok">dismiss</span>`;
  p.querySelector('.ep-ok').addEventListener('click', (e) => {
    e.stopPropagation();
    playSfx(1);
    p.style.opacity = '0';
    p.style.transform = 'translateY(8px)';
    setTimeout(() => {
      p.remove();
      spawnCnt = Math.max(0, spawnCnt - 1);
    }, 320);
  });
  p.addEventListener('click', () => {
    playSfx(2);
    p.classList.add('gflash');
    setTimeout(() => p.classList.remove('gflash'), 100);
  });
  sec.appendChild(p);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    p.style.opacity = '1';
    p.style.transform = 'translateY(0)';
  }));
}

/* ═══════════════════════════════════════════════════════════════
   EMAIL copy
   ═══════════════════════════════════════════════════════════════ */
function copyEmail(e) {
  e.preventDefault();
  playSfx(4);
  navigator.clipboard.writeText('egor.dagbaev@list.ru').catch(() => {});
  const arr = document.getElementById('earr');
  arr.textContent = 'copied ✓';
  arr.style.color = 'var(--ac)';
  const t = document.getElementById('toast');
  t.textContent = t.dataset.default || 'email copied';
  t.classList.add('show');
  setTimeout(() => {
    t.classList.remove('show');
    t.textContent = t.dataset.default || 'email copied';
    arr.textContent = 'copy ✦';
    arr.style.color = '';
  }, 2200);
}

/* ═══════════════════════════════════════════════════════════════
   CUSTOM CURSOR
   ═══════════════════════════════════════════════════════════════ */
if (window.matchMedia('(pointer: fine)').matches) {
  const cur = document.getElementById('cur');
  document.addEventListener('mousemove', (e) => {
    cur.style.left = e.clientX + 'px';
    cur.style.top = e.clientY + 'px';
  });
}

document.getElementById('yr').textContent = new Date().getFullYear();

setInterval(() => {
  if (Math.random() > 0.96) {
    document.body.classList.add('gflash');
    setTimeout(() => document.body.classList.remove('gflash'), 90);
  }
}, 5000);

/* ═══════════════════════════════════════════════════════════════
   EASTER EGGS & SECRETS
   ═══════════════════════════════════════════════════════════════ */
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIdx = 0;
document.addEventListener('keydown', (e) => {
  if (e.key === KONAMI[konamiIdx]) {
    konamiIdx++;
    if (konamiIdx === KONAMI.length) {
      konamiIdx = 0;
      document.body.classList.add('konami');
      const toast = document.getElementById('toast');
      toast.textContent = '↑↑↓↓←→←→BA · you found it';
      toast.classList.add('show');
      setTimeout(() => { toast.classList.remove('show'); toast.textContent = toast.dataset.default || 'email copied'; }, 3000);
    }
  } else konamiIdx = 0;
});

function multiClick(el, count, delay, cb) {
  let n = 0;
  let t = null;
  el.addEventListener('click', () => {
    n++;
    clearTimeout(t);
    t = setTimeout(() => { n = 0; }, delay);
    if (n >= count) {
      n = 0;
      cb();
    }
  });
}

multiClick(document.getElementById('heroName'), 3, 600, () => {
  const el = document.getElementById('heroName');
  if (el.dataset.secret) return;
  el.dataset.secret = '1';
  el.title = 'hello from the other side';
  const toast = document.getElementById('toast');
  toast.textContent = '✧ hello from the other side';
  toast.classList.add('show');
  setTimeout(() => { toast.classList.remove('show'); toast.textContent = toast.dataset.default || 'email copied'; }, 2500);
});

multiClick(document.querySelector('.ftxt-name'), 7, 1200, () => {
  const secretMsg = document.getElementById('secret-msg');
  secretMsg.textContent = 'the site has 7 fragments. you found one.';
  secretMsg.hidden = false;
  setTimeout(() => { secretMsg.hidden = true; secretMsg.textContent = ''; }, 6000);
});
