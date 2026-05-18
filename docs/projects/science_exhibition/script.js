/* ══════════════════════════════════════════════════════════════
   ANUJ KUMAR | ENGINEERING DOSSIER — Premium Script v4.0
   Upgrades vs v3.0:
   - Mouse parallax on ambient layers (smooth 6-axis depth)
   - Particle mouse attraction / repulsion field
   - Animated timeline progress line on scroll
   - Role item staggered reveal (opacity cascade)
   - Ripple effect on [data-ripple] buttons
   - Typewriter animation for hero eyebrow
   - Enhanced scroll spy with smooth indicator transitions
   - Improved counter with easing and suffix logic preserved
   - All v3.0 functionality fully preserved
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

let mx = 0, my = 0;
let rx = 0, ry = 0;
let tx = 0, ty = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

function animateRing() {
  rx += (mx - rx) * 0.10;
  ry += (my - ry) * 0.10;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';

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
    cursor.style.width  = '8px';
    cursor.style.height = '8px';
    ring.style.width    = '36px';
    ring.style.height   = '36px';
    ring.style.borderColor = 'rgba(0,229,255,0.50)';
  });
});

document.addEventListener('mouseleave', () => {
  [cursor, ring, trail].forEach(el => { if (el) el.style.opacity = '0'; });
});
document.addEventListener('mouseenter', () => {
  [cursor, ring, trail].forEach(el => { if (el) el.style.opacity = '1'; });
});


/* ══════════════════
   MOUSE PARALLAX — AMBIENT LAYERS
══════════════════ */
(function initParallax() {
  const layers = [
    { el: document.getElementById('ambientTop'),    xFactor: 0.012, yFactor: 0.008 },
    { el: document.getElementById('ambientMid'),    xFactor: -0.018, yFactor: -0.012 },
    { el: document.getElementById('ambientAccent'), xFactor: 0.022, yFactor: 0.014 },
    { el: document.getElementById('ambientBottom'), xFactor: -0.008, yFactor: 0.010 },
    { el: document.getElementById('ambientViolet'), xFactor: 0.016, yFactor: -0.018 },
  ].filter(l => l.el);

  // Smoothed parallax positions
  const smooth = layers.map(() => ({ x: 0, y: 0 }));
  const target = layers.map(() => ({ x: 0, y: 0 }));

  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;

  document.addEventListener('mousemove', e => {
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    layers.forEach((l, i) => {
      target[i].x = dx * l.xFactor;
      target[i].y = dy * l.yFactor;
    });
  });

  function tickParallax() {
    layers.forEach((l, i) => {
      smooth[i].x += (target[i].x - smooth[i].x) * 0.06;
      smooth[i].y += (target[i].y - smooth[i].y) * 0.06;
      l.el.style.transform = `translate(${smooth[i].x}px, ${smooth[i].y}px)`;
    });
    requestAnimationFrame(tickParallax);
  }
  tickParallax();
})();


/* ══════════════════
   RIPPLE BUTTONS
══════════════════ */
document.querySelectorAll('[data-ripple]').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect   = btn.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height) * 2;
    const x      = e.clientX - rect.left - size / 2;
    const y      = e.clientY - rect.top  - size / 2;
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
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

window.addEventListener('scroll', () => {
  updateProgress();
  updateNav();
  updateTimelineProgress();
}, { passive: true });

updateProgress();
updateNav();


/* ══════════════════
   CANVAS PARTICLE GRID — WITH MOUSE ATTRACTION
══════════════════ */
const canvas = document.getElementById('bg');
const ctx    = canvas.getContext('2d');
let W, H, particles = [];

// Mouse world position for particle interaction
let pMouseX = -9999, pMouseY = -9999;

document.addEventListener('mousemove', e => {
  pMouseX = e.clientX;
  pMouseY = e.clientY;
});

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
    this.baseVx = this.vx;
    this.baseVy = this.vy;
  }

  update() {
    // Subtle mouse repulsion field
    const dx   = this.x - pMouseX;
    const dy   = this.y - pMouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const influenceR = 120;

    if (dist < influenceR && dist > 0) {
      const force  = (influenceR - dist) / influenceR;
      const angle  = Math.atan2(dy, dx);
      this.vx += Math.cos(angle) * force * 0.28;
      this.vy += Math.sin(angle) * force * 0.28;
    }

    // Dampen back toward base velocity
    this.vx += (this.baseVx - this.vx) * 0.04;
    this.vy += (this.baseVy - this.vy) * 0.04;

    // Cap speed
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > 1.8) {
      this.vx = (this.vx / speed) * 1.8;
      this.vy = (this.vy / speed) * 1.8;
    }

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

  const navMap = new Map();
  navItems.forEach(item => {
    const sec = document.getElementById(item.dataset.section);
    if (sec) navMap.set(sec, item);
  });

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const target = document.getElementById(item.dataset.section);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

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
   TIMELINE PROGRESS LINE
══════════════════ */
function updateTimelineProgress() {
  const tl = document.getElementById('timelineEl');
  const progressLine = document.getElementById('timelineProgress');
  if (!tl || !progressLine) return;

  const rect      = tl.getBoundingClientRect();
  const viewH     = window.innerHeight;
  const totalH    = tl.offsetHeight;

  // How far we've scrolled into the timeline
  const entered   = viewH - rect.top;
  const pct       = Math.max(0, Math.min(1, entered / (totalH + viewH * 0.5)));
  progressLine.style.height = (pct * 100) + '%';
}

// Observe timeline section to kick off
const timelineSection = document.getElementById('timeline');
if (timelineSection) {
  const tlObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) updateTimelineProgress();
    });
  }, { threshold: 0 });
  tlObs.observe(timelineSection);
}


/* ══════════════════
   COUNTER ANIMATION
══════════════════ */
function animateCounter(el, target, suffix) {
  let start = null;
  const dur  = 2400;

  const step = timestamp => {
    if (!start) start = timestamp;
    const prog = Math.min((timestamp - start) / dur, 1);
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
        if (el.classList.contains('stat-static')) return;

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
      // Animate fill bar
      const roleBar = document.getElementById('roleBar');
      if (roleBar) roleBar.style.width = '88%';

      // Count-up percentage label
      const pct = document.getElementById('rolePct');
      if (pct) {
        let v = 0;
        const t = setInterval(() => {
          v = Math.min(v + 1, 88);
          pct.textContent = v + '%';
          if (v >= 88) clearInterval(t);
        }, 22);
      }

      // Staggered reveal for role items
      setTimeout(() => {
        document.querySelectorAll('.role-item').forEach(item => {
          item.classList.add('revealed');
        });
      }, 400);

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
  const MAX = 8;

  document.querySelectorAll('[data-tilt]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x    = (e.clientX - rect.left) / rect.width;
      const y    = (e.clientY - rect.top)  / rect.height;
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
   TYPEWRITER — HERO EYEBROW
══════════════════ */
(function initTypewriter() {
  const el   = document.getElementById('heroEyebrow');
  if (!el) return;

  const text = el.textContent.trim();
  el.textContent = '';

  let i = 0;
  const delay = 1200; // ms before starting

  setTimeout(() => {
    const interval = setInterval(() => {
      el.textContent = text.slice(0, i + 1);
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 55);
  }, delay);
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

function openLightbox(src, alt) {
  const overlay = document.getElementById('lightbox');
  const img     = document.getElementById('lightbox-img');
  img.src = src;
  img.alt = alt || '';
  showImg();
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function openLightboxVideo(cell) {
  const thumbVid = cell.querySelector('video');
  if (!thumbVid) return;

  const sourceEl = thumbVid.querySelector('source');
  const src      = sourceEl ? sourceEl.src : thumbVid.src;

  const overlay = document.getElementById('lightbox');
  const lbVideo = document.getElementById('lightbox-video');

  thumbVid.pause();

  lbVideo.muted = true;
  lbVideo.src   = src;
  lbVideo.load();
  lbVideo.play().catch(() => {
    lbVideo.muted = true;
    lbVideo.play();
  });

  showVideo();
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(e) {
  const img   = document.getElementById('lightbox-img');
  const video = document.getElementById('lightbox-video');

  if (e && (e.target === img || e.target === video)) return;

  const overlay = document.getElementById('lightbox');
  overlay.classList.remove('active');
  document.body.style.overflow = '';

  video.pause();
  video.src = '';

  document.querySelectorAll('.gallery-ph video').forEach(v => {
    v.play().catch(() => {});
  });
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});