/* CURSOR */
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cursor.style.left = mx + 'px'; cursor.style.top = my + 'px' });
function animateRing() { rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12; ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; requestAnimationFrame(animateRing) }
animateRing();
document.querySelectorAll('a,button,.module-card,.lesson-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.style.width = '16px'; cursor.style.height = '16px'; ring.style.width = '50px'; ring.style.height = '50px' });
  el.addEventListener('mouseleave', () => { cursor.style.width = '10px'; cursor.style.height = '10px'; ring.style.width = '38px'; ring.style.height = '38px' });
});

/* CANVAS PARTICLE GRID */
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let W, H, particles = [];
function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight }
resize(); window.addEventListener('resize', resize);
class Particle {
  constructor() { this.reset() }
  reset() { this.x = Math.random() * W; this.y = Math.random() * H; this.vx = (Math.random() - .5) * 0.4; this.vy = (Math.random() - .5) * 0.4; this.r = Math.random() * 1.5 + 0.5; this.alpha = Math.random() * 0.4 + 0.1 }
  update() { this.x += this.vx; this.y += this.vy; if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset() }
  draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(0,229,255,${this.alpha})`; ctx.fill() }
}
for (let i = 0; i < 120; i++)particles.push(new Particle());
function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 130) { ctx.strokeStyle = `rgba(0,229,255,${0.08 * (1 - d / 130)})`; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke() }
    }
  }
}
function loop() { ctx.clearRect(0, 0, W, H); particles.forEach(p => { p.update(); p.draw() }); drawLines(); requestAnimationFrame(loop) }
loop();

/* SCROLL REVEAL */
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active') });
}, { threshold: 0.08 });
reveals.forEach(r => obs.observe(r));

/* COUNTER ANIMATION */
function animateCounter(el, target, suffix = '') {
  let start = 0; const dur = 2200; const step = timestamp => {
    if (!start) start = timestamp;
    const prog = Math.min((timestamp - start) / dur, 1);
    const ease = 1 - Math.pow(1 - prog, 4);
    el.textContent = Math.floor(ease * target) + (suffix);
    if (prog < 1) requestAnimationFrame(step);
  }; requestAnimationFrame(step);
}
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('[data-target]').forEach(el => {
        animateCounter(el, parseInt(el.dataset.target), el.dataset.target === '90' ? '%' : '+');
      });
      counterObs.disconnect();
    }
  });
}, { threshold: 0.5 });
const strip = document.querySelector('.stats-strip');
if (strip) counterObs.observe(strip);

/* ROLE BAR */
const roleObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.getElementById('roleBar').style.width = '88%';
      const pct = document.getElementById('rolePct');
      let v = 0; const t = setInterval(() => { v = Math.min(v + 1, 88); pct.textContent = v + '%'; if (v >= 88) clearInterval(t) }, 20);
      roleObs.disconnect();
    }
  });
}, { threshold: 0.3 });
const rv = document.querySelector('.role-visual');
if (rv) roleObs.observe(rv);
/* ── helpers ── */
function showImg() {
  document.getElementById('lightbox-img').style.display = 'block';
  document.getElementById('lightbox-video').style.display = 'none';
}
function showVideo() {
  document.getElementById('lightbox-img').style.display = 'none';
  document.getElementById('lightbox-video').style.display = 'block';
}

/* ── open image ── */
function openLightbox(src, alt) {
  const overlay = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  img.src = src;
  img.alt = alt;
  showImg();
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/* ── open video ── */
function openLightboxVideo(cell) {
  const thumbVid = cell.querySelector('video');
  const src = thumbVid.querySelector('source').src;

  const overlay = document.getElementById('lightbox');
  const lbVideo = document.getElementById('lightbox-video');

  // pause the thumbnail so two copies don't play at once
  thumbVid.pause();

  lbVideo.muted = true;
  lbVideo.src = src;
  lbVideo.load();
  lbVideo.play();

  showVideo();
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/* ── close ── */
function closeLightbox(e) {
  const img = document.getElementById('lightbox-img');
  const video = document.getElementById('lightbox-video');

  // clicking directly on the media does nothing
  if (e && (e.target === img || e.target === video)) return;

  const overlay = document.getElementById('lightbox');
  overlay.classList.remove('active');
  document.body.style.overflow = '';

  // stop + clear lightbox video; resume all thumbnail videos
  video.pause();
  video.src = '';

  document.querySelectorAll('.gallery-ph video').forEach(v => v.play());
}

/* ── Escape key ── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});