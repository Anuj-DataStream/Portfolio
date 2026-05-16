/* ===================== SCRIPTS ===================== */
/* Premium Portfolio — Anuj Kumar */

/* ---- Scroll Progress Bar ---- */
const prog = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  prog.style.width = Math.min(pct, 100) + '%';
}, { passive: true });

/* ---- Navbar Scroll Behavior ---- */
const header = document.getElementById('main-header');
let lastY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  lastY = y;
}, { passive: true });

/* ---- Active Nav Section Indicator ---- */
const navLinks = document.querySelectorAll('nav [data-section]');
const sections = document.querySelectorAll('section[id]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`nav [data-section="${e.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => sectionObserver.observe(s));

/* ---- Mobile Nav ---- */
const ham = document.getElementById('hamburger');
const mNav = document.getElementById('mobile-nav');

// Create backdrop
const backdrop = document.createElement('div');
backdrop.className = 'mobile-nav-backdrop';
document.body.appendChild(backdrop);

ham.addEventListener('click', () => {
  const isOpen = ham.classList.toggle('open');
  mNav.classList.toggle('open');
  backdrop.classList.toggle('open');
  ham.setAttribute('aria-expanded', isOpen.toString());
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

backdrop.addEventListener('click', closeMobileNav);

function closeMobileNav() {
  ham.classList.remove('open');
  mNav.classList.remove('open');
  backdrop.classList.remove('open');
  ham.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

/* ---- Reveal on Scroll ---- */
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

reveals.forEach(el => io.observe(el));

/* ---- Skill Bar Animation ---- */
const barObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const bar = e.target.querySelector('.skill-bar');
      if (bar) {
        // Small delay for visual delight
        setTimeout(() => {
          bar.style.width = bar.dataset.width + '%';
        }, 120);
      }
      barObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-card').forEach(c => barObs.observe(c));

/* ---- Typewriter Effect ---- */
const phrases = [
  'Building Real-World Systems ⚙️',
  'IoT & Automation Explorer 📡',
  'Engineering Problem Solver 🧠',
  'Turning Ideas into Working Systems 🔧',
];
let pi = 0, ci = 0, deleting = false;
const tw = document.getElementById('typewriter-text');

function typeLoop() {
  const phrase = phrases[pi % phrases.length];
  if (!deleting) {
    tw.textContent = phrase.slice(0, ++ci);
    if (ci === phrase.length) {
      deleting = true;
      setTimeout(typeLoop, 1800);
      return;
    }
  } else {
    tw.textContent = phrase.slice(0, --ci);
    if (ci === 0) {
      deleting = false;
      pi++;
      setTimeout(typeLoop, 500);
      return;
    }
  }
  setTimeout(typeLoop, deleting ? 44 : 76);
}
typeLoop();

/* ---- Advanced Particle Canvas ---- */
(function () {
  const c = document.getElementById('bg-canvas');
  const ctx = c.getContext('2d');
  let W, H, pts;
  let mouseX = -9999, mouseY = -9999;

  function resize() {
    W = c.width = window.innerWidth;
    H = c.height = window.innerHeight;
  }

  function initPts() {
    pts = Array.from({ length: 90 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
    }));
  }

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    pts.forEach(p => {
      // Slight mouse repulsion
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const force = (100 - dist) / 100;
        p.vx += (dx / dist) * force * 0.04;
        p.vy += (dy / dist) * force * 0.04;
      }

      // Speed cap
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 0.9) { p.vx = (p.vx / speed) * 0.9; p.vy = (p.vy / speed) * 0.9; }

      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,240,200,${p.opacity})`;
      ctx.fill();
    });

    // Connection lines
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d = dx * dx + dy * dy;
        if (d < 130 * 130) {
          const dist = Math.sqrt(d);
          const alpha = 0.1 * (1 - dist / 130);
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(0,240,200,${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  resize(); initPts(); draw();
  window.addEventListener('resize', () => { resize(); initPts(); }, { passive: true });
})();

/* ---- Custom Cursor Glow ---- */
const cursorGlow = document.getElementById('cursor-glow');
let cursorX = -9999, cursorY = -9999;
let targetX = -9999, targetY = -9999;

window.addEventListener('mousemove', e => {
  targetX = e.clientX;
  targetY = e.clientY;
}, { passive: true });

function animateCursor() {
  cursorX += (targetX - cursorX) * 0.1;
  cursorY += (targetY - cursorY) * 0.1;
  cursorGlow.style.left = cursorX + 'px';
  cursorGlow.style.top = cursorY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

/* ---- Project Card Spotlight Effect ---- */
document.querySelectorAll('.project-card').forEach(card => {
  const spotlight = card.querySelector('.project-spotlight');
  if (!spotlight) return;

  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    spotlight.style.setProperty('--x', x + '%');
    spotlight.style.setProperty('--y', y + '%');
  });
});

/* ---- Project Card Subtle 3D Tilt ---- */
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `translateY(-8px) rotateX(${-dy * 3}deg) rotateY(${dx * 3}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s, box-shadow 0.35s';
    setTimeout(() => { card.style.transition = ''; }, 500);
  });
});

/* ---- Contact Form Glow on Focus ---- */
const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
const contactGlow = document.querySelector('.contact-glow');

formInputs.forEach(input => {
  input.addEventListener('focus', () => {
    if (contactGlow) {
      contactGlow.style.opacity = '1';
      contactGlow.style.transform = 'translateX(-50%) scale(1.2)';
    }
  });
  input.addEventListener('blur', () => {
    if (contactGlow) {
      contactGlow.style.opacity = '';
      contactGlow.style.transform = '';
    }
  });
});

/* ---- EmailJS Contact Form ---- */
(function () { emailjs.init("xlFs-dv2_g9a_6nuk"); })();

const form = document.getElementById('contact-form');
const btn = document.getElementById('submit-btn');
const formMsg = document.getElementById('form-msg');
const btnText = btn ? btn.querySelector('.btn-text') : null;

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    btn.disabled = true;
    if (btnText) btnText.textContent = 'Sending…';
    formMsg.textContent = '';
    formMsg.className = '';

    emailjs.sendForm("service_cx6hdbp", "template_eak1ulp", this)
      .then(() => {
        formMsg.textContent = '✓ Message sent! I\'ll get back to you soon.';
        formMsg.className = 'success';
        form.reset();
      }, err => {
        formMsg.textContent = '✗ Something went wrong. Please try again.';
        formMsg.className = 'error';
        console.error(err);
      })
      .finally(() => {
        btn.disabled = false;
        if (btnText) btnText.textContent = 'Send Message';
      });
  });
}