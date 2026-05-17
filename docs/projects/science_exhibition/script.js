/* ══════════════════════════════════════════════════════════════
   ANUJ KUMAR | ENGINEERING DOSSIER — Premium Script v3.0
   Fully repaired & completed to match science_exhibition.html + style.css
   ──────────────────────────────────────────────────────────────
   Fixes & Additions vs v2.0:
   - Loader sequence (bar + status messages → hide on complete)
   - Cursor trail (#cursorTrail) animation
   - Cursor size synced to CSS defaults (8px dot / 36px ring)
   - Side-nav dot scroll-spy (IntersectionObserver per section)
   - Magnetic button effect ([data-magnetic])
   - Tilt card effect ([data-tilt])
   - Counter suffix driven by data-suffix attribute (not hard-coded)
   - roleBar targets correct id (#roleBar / .role-fill)
   - Stat items with .stat-static excluded from counter animation
   - All original v2.0 functionality fully preserved
   ══════════════════════════════════════════════════════════════ */

/* ══════════════════
   LOADER
══════════════════ */
(function initLoader() {
  const loader = document.getElementById('loader');
  const bar    = document.getElementById('loaderBar');
  const status = document.getElementById('loaderStatus');

  if (!loader) return;

  const messages = [
    'INITIALIZING DOSSIER...',
    'LOADING SUBSYSTEMS...',
    'RESTORING MODULES...',
    'CALIBRATING SENSORS...',
    'SYSTEM READY ✓'
  ];

  const steps   = [18, 36, 55, 72, 88, 100];
  let stepIdx   = 0;
  let msgIdx    = 0;

  function tick() {
    if (stepIdx >= steps.length) return;

    const pct = steps[stepIdx];
    bar.style.width = pct + '%';

    if (msgIdx < messages.length) {
      status.textContent = messages[msgIdx];
      msgIdx++;
    }

    stepIdx++;

    if (pct < 100) {
      const delay = 220 + Math.random() * 160;
      setTimeout(tick, delay);
    } else {
      /* Pause at 100% then fade out */
      setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 700);
      }, 420);
    }
  }

  setTimeout(tick, 180);
})();


/* ══════════════════
   CUSTOM CURSOR
══════════════════ */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');
const trail  = document.getElementById('cursorTrail');

let mx = 0, my = 0;   /* mouse position   */
let rx = 0, ry = 0;   /* ring lag         */
let tx = 0, ty = 0;   /* trail lag        */

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

function animateRing() {
  /* Ring follows with 10% easing */
  rx += (mx - rx) * 0.10;
  ry += (my - ry) * 0.10;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';

  /* Trail follows with 5.5% easing — slower than ring */
  if (trail) {
    tx += (mx - tx) * 0.055;
    ty += (my - ty) * 0.055;
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';
  }

  requestAnimationFrame(animateRing);
}
animateRing();

/* Scale cursor on interactive elements */
document.querySelectorAll('a, button, .module-card, .lesson-card, .gallery-ph').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width  = '16px';
    cursor.style.height = '16px';
    ring.style.width    = '52px';
    ring.style.height   = '52px';
    ring.style.borderColor = 'rgba(0,229,255,0.8)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width  = '8px';   /* match CSS .cursor default */
    cursor.style.height = '8px';
    ring.style.width    = '36px';  /* match CSS .cursor-ring default */
    ring.style.height   = '36px';
    ring.style.borderColor = 'rgba(0,229,255,0.50)';
  });
});

/* Hide cursor elements when pointer leaves the window */
document.addEventListener('mouseleave', () => {
  [cursor, ring, trail].forEach(el => { if (el) el.style.opacity = '0'; });
});
document.addEventListener('mouseenter', () => {
  [cursor, ring, trail].forEach(el => { if (el) el.style.opacity = '1'; });
});


/* ══════════════════
   SCROLL PROGRESS BAR
══════════════════ */
const progressBar = document.getElementById('scrollProgress');

function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct       = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}


/* ══════════════════
   NAV SCROLL STATE
══════════════════ */
const mainNav = document.getElementById('mainNav');

function updateNav() {
  if (window.scrollY > 60) {
    mainNav.classList.add('scrolled');
  } else {
    mainNav.classList.remove('scrolled');
  }
}

/* Single efficient scroll listener */
window.addEventListener('scroll', () => {
  updateProgress();
  updateNav();
}, { passive: true });

updateProgress();
updateNav();


/* ══════════════════
   CANVAS PARTICLE GRID
══════════════════ */
const canvas = document.getElementById('bg');
const ctx    = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();

window.addEventListener('resize', () => {
  resize();
  particles = [];
  buildParticles();
}, { passive: true });

class Particle {
  constructor() { this.reset(); }

  reset() {
    this.x     = Math.random() * W;
    this.y     = Math.random() * H;
    this.vx    = (Math.random() - 0.5) * 0.38;
    this.vy    = (Math.random() - 0.5) * 0.38;
    this.r     = Math.random() * 1.4 + 0.5;
    this.alpha = Math.random() * 0.38 + 0.08;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,229,255,${this.alpha})`;
    ctx.fill();
  }
}

function buildParticles() {
  const count = window.innerWidth < 600 ? 55 : window.innerWidth < 900 ? 80 : 120;
  for (let i = 0; i < count; i++) particles.push(new Particle());
}
buildParticles();

function drawLines() {
  const maxDist = 130;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < maxDist) {
        ctx.strokeStyle = `rgba(0,229,255,${0.07 * (1 - d / maxDist)})`;
        ctx.lineWidth   = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function loop() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(loop);
}
loop();


/* ══════════════════
   SIDE-NAV SCROLL SPY
══════════════════ */
(function initScrollSpy() {
  const navItems = document.querySelectorAll('.side-nav-item');
  if (!navItems.length) return;

  /* Build a section → nav-item map */
  const navMap = new Map();
  navItems.forEach(item => {
    const sec = document.getElementById(item.dataset.section);
    if (sec) navMap.set(sec, item);
  });

  /* Click to smooth-scroll to section */
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const target = document.getElementById(item.dataset.section);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* IntersectionObserver — mark whichever section is in view */
  const spyObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const navItem = navMap.get(entry.target);
      if (!navItem) return;
      if (entry.isIntersecting) {
        navItems.forEach(n => n.classList.remove('active'));
        navItem.classList.add('active');
      }
    });
  }, {
    threshold: 0.25,
    rootMargin: '-10% 0px -60% 0px'
  });

  navMap.forEach((_, sec) => spyObs.observe(sec));
})();


/* ══════════════════
   SCROLL REVEAL
══════════════════ */
const reveals   = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('active');
  });
}, { threshold: 0.08 });

reveals.forEach(r => revealObs.observe(r));


/* ══════════════════
   COUNTER ANIMATION
══════════════════ */
function animateCounter(el, target, suffix) {
  let start = null;
  const dur  = 2400;

  const step = timestamp => {
    if (!start) start = timestamp;
    const prog = Math.min((timestamp - start) / dur, 1);
    /* Quart ease-out */
    const ease = 1 - Math.pow(1 - prog, 4);
    el.textContent = Math.floor(ease * target) + suffix;
    if (prog < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('[data-target]').forEach(el => {
        /* Skip static display items (e.g. "2nd" position) */
        if (el.classList.contains('stat-static')) return;

        /* Prefer data-suffix attribute; fall back to smart default */
        const suffix = el.dataset.suffix !== undefined
          ? el.dataset.suffix
          : (el.dataset.target === '90' ? '%' : '+');

        animateCounter(el, parseInt(el.dataset.target), suffix);
      });
      counterObs.disconnect();
    }
  });
}, { threshold: 0.5 });

const strip = document.querySelector('.stats-strip');
if (strip) counterObs.observe(strip);


/* ══════════════════
   ROLE BAR ANIMATION
══════════════════ */
const roleObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      /* Animate the fill bar width */
      const roleBar = document.getElementById('roleBar');
      if (roleBar) roleBar.style.width = '88%';

      /* Count-up percentage label */
      const pct = document.getElementById('rolePct');
      if (pct) {
        let v = 0;
        const t = setInterval(() => {
          v = Math.min(v + 1, 88);
          pct.textContent = v + '%';
          if (v >= 88) clearInterval(t);
        }, 22);
      }

      roleObs.disconnect();
    }
  });
}, { threshold: 0.3 });

const rv = document.querySelector('.role-visual');
if (rv) roleObs.observe(rv);


/* ══════════════════
   MAGNETIC BUTTONS
══════════════════ */
(function initMagnetic() {
  document.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) * 0.30;
      const dy   = (e.clientY - cy) * 0.30;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });
})();


/* ══════════════════
   TILT CARDS
══════════════════ */
(function initTilt() {
  const MAX = 8; /* max degrees of tilt */

  document.querySelectorAll('[data-tilt]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x    = (e.clientX - rect.left) / rect.width;   /* 0 → 1 */
      const y    = (e.clientY - rect.top)  / rect.height;  /* 0 → 1 */
      const rotX = (y - 0.5) * -MAX * 2;
      const rotY = (x - 0.5) *  MAX * 2;
      el.style.transition = 'transform 0.08s linear';
      el.style.transform  = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transition = 'transform 0.45s cubic-bezier(0.16,1,0.3,1)';
      el.style.transform  = 'perspective(700px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
})();


/* ══════════════════
   LIGHTBOX HELPERS
══════════════════ */
function showImg() {
  document.getElementById('lightbox-img').style.display   = 'block';
  document.getElementById('lightbox-video').style.display = 'none';
}

function showVideo() {
  document.getElementById('lightbox-img').style.display   = 'none';
  document.getElementById('lightbox-video').style.display = 'block';
}

/* Open image lightbox */
function openLightbox(src, alt) {
  const overlay = document.getElementById('lightbox');
  const img     = document.getElementById('lightbox-img');
  img.src = src;
  img.alt = alt || '';
  showImg();
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/* Open video lightbox */
function openLightboxVideo(cell) {
  const thumbVid = cell.querySelector('video');
  if (!thumbVid) return;

  const sourceEl = thumbVid.querySelector('source');
  const src      = sourceEl ? sourceEl.src : thumbVid.src;

  const overlay = document.getElementById('lightbox');
  const lbVideo = document.getElementById('lightbox-video');

  /* Pause thumbnail so two copies don't play simultaneously */
  thumbVid.pause();

  lbVideo.muted = true;
  lbVideo.src   = src;
  lbVideo.load();
  lbVideo.play().catch(() => {
    /* Autoplay policy blocked — fall back to muted */
    lbVideo.muted = true;
    lbVideo.play();
  });

  showVideo();
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/* Close lightbox */
function closeLightbox(e) {
  const img   = document.getElementById('lightbox-img');
  const video = document.getElementById('lightbox-video');

  /* Clicking directly on the media does nothing */
  if (e && (e.target === img || e.target === video)) return;

  const overlay = document.getElementById('lightbox');
  overlay.classList.remove('active');
  document.body.style.overflow = '';

  /* Stop + clear lightbox video; resume all thumbnail videos */
  video.pause();
  video.src = '';

  document.querySelectorAll('.gallery-ph video').forEach(v => {
    v.play().catch(() => {}); /* silence NotAllowedError in strict browsers */
  });
}

/* Escape key closes lightbox */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});