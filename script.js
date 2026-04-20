/* ===================================================
   script.js — JoJo's Bizarre Birthday Interactive JS
   =================================================== */

"use strict";

// ─── PARTICLES CANVAS ──────────────────────────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['#f59e0b', '#7c3aed', '#a78bfa', '#fde68a', '#ec4899'];
  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.5 - 0.1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.5 + 0.1,
      shape: Math.random() > 0.6 ? 'star' : 'circle',
    };
  }

  for (let i = 0; i < 120; i++) particles.push(createParticle());

  function drawStar(ctx, cx, cy, r, color, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -10) {
        particles[i] = createParticle();
        particles[i].y = H + 10;
      }
      if (p.shape === 'star') {
        drawStar(ctx, p.x, p.y, p.r * 2, p.color, p.alpha);
      } else {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });
    requestAnimationFrame(loop);
  }
  loop();
})();

// ─── SPEED LINES ───────────────────────────────────────────────────────────────
(function createSpeedLines() {
  const container = document.getElementById('speed-lines');
  for (let i = 0; i < 30; i++) {
    const line = document.createElement('div');
    line.className = 'speed-line';
    const angle = (i / 30) * 360;
    line.style.cssText = `
      transform: rotate(${angle}deg);
      opacity: ${Math.random() * 0.6 + 0.1};
    `;
    container.appendChild(line);
  }
})();

// ─── FLOATING ROSES ────────────────────────────────────────────────────────────
(function spawnRoses() {
  const container = document.getElementById('floating-roses');
  const emojis = ['🌹', '⭐', '✨', '💜', '💛', '🌟', '◆'];
  for (let i = 0; i < 18; i++) {
    const rose = document.createElement('span');
    rose.className = 'rose';
    rose.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    rose.style.cssText = `
      left: ${Math.random() * 100}%;
      --dur: ${Math.random() * 5 + 5}s;
      --delay: ${Math.random() * 8}s;
      font-size: ${Math.random() * 1.5 + 0.8}rem;
    `;
    container.appendChild(rose);
  }
})();

// ─── ZA WARUDO TIME STOP ───────────────────────────────────────────────────────
(function initZaWarudo() {
  const btn = document.getElementById('za-warudo-btn');
  const screen = document.getElementById('time-stop-screen');
  const resumeBtn = document.getElementById('ts-resume');
  const clockEl = document.getElementById('ts-clock');
  const tsParticles = document.getElementById('ts-particles');
  let clockInterval = null;

  // Spawn frozen particles
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'ts-particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${Math.random() * 6 + 2}px;
      height: ${Math.random() * 6 + 2}px;
      --dur: ${Math.random() * 4 + 3}s;
      --delay: ${Math.random() * 4}s;
      background: ${Math.random() > 0.5 ? '#a78bfa' : '#f59e0b'};
    `;
    tsParticles.appendChild(p);
  }

  function startClock() {
    let t = 0;
    clockEl.textContent = '00:00:00';
    clockInterval = setInterval(() => {
      t += 100;
      const ms = t % 1000;
      const s  = Math.floor(t / 1000) % 60;
      const m  = Math.floor(t / 60000);
      clockEl.textContent =
        String(m).padStart(2, '0') + ':' +
        String(s).padStart(2, '0') + ':' +
        String(Math.floor(ms / 10)).padStart(2, '0');
    }, 100);
  }

  btn.addEventListener('click', () => {
    screen.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    startClock();
    // shake effect
    document.body.style.animation = 'none';
  });

  resumeBtn.addEventListener('click', () => {
    screen.classList.add('hidden');
    document.body.style.overflow = '';
    clearInterval(clockInterval);
    showStandCry('TOKI WO UGOKIDASU!', 1800);
  });
})();

// ─── STAND CRY ─────────────────────────────────────────────────────────────────
function showStandCry(text, duration = 1200) {
  const overlay = document.getElementById('stand-cry-overlay');
  const cry = document.getElementById('cry-text');
  cry.textContent = text;
  overlay.classList.remove('hidden');
  // re-trigger animation
  cry.style.animation = 'none';
  void cry.offsetWidth;
  cry.style.animation = 'crySplash 0.8s ease-out forwards';
  setTimeout(() => overlay.classList.add('hidden'), duration);
}

// Stand card buttons
document.querySelectorAll('.stand-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const cry = btn.dataset.cry || 'ORA ORA ORA!';
    showStandCry(cry, 1400);
  });
});

// ─── CONFETTI BURST ────────────────────────────────────────────────────────────
function launchConfetti(count = 120) {
  const colors = ['#f59e0b', '#7c3aed', '#ec4899', '#10b981', '#fde68a', '#a78bfa', '#fff'];
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    const w = Math.random() * 10 + 6;
    const h = Math.random() * 14 + 6;
    const x = Math.random() * window.innerWidth;
    const tx = (Math.random() - 0.5) * 300;
    const dur = Math.random() * 2 + 2;
    const delay = Math.random() * 0.8;
    piece.style.cssText = `
      left: ${x}px;
      top: -20px;
      width: ${w}px;
      height: ${h}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      --dur: ${dur}s;
      --delay: ${delay}s;
      --tx: ${tx}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
    `;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), (dur + delay) * 1000 + 200);
  }
}

// MUDA MUDA typing effect
const mudaWords = ['MUDA ', 'MUDA ', 'MUDA ', 'MUDA ', 'MUDA!'];
let mudaInterval = null;

function startMudaEffect() {
  const display = document.getElementById('muda-display');
  let idx = 0;
  let text = '';
  clearInterval(mudaInterval);
  display.textContent = '';
  mudaInterval = setInterval(() => {
    if (idx < mudaWords.length) {
      text += mudaWords[idx];
      display.textContent = text;
      idx++;
    } else {
      clearInterval(mudaInterval);
      setTimeout(() => {
        display.textContent = '';
      }, 2000);
    }
  }, 180);
}

document.getElementById('confetti-btn').addEventListener('click', () => {
  launchConfetti(160);
  startMudaEffect();
  showStandCry('MUDA MUDA MUDA!', 1600);
});

// ─── SCROLL REVEAL ─────────────────────────────────────────────────────────────
(function initScrollReveal() {
  // Add class to target elements
  const targets = document.querySelectorAll(
    '.stand-card, .timeline-content, .message-container, .birthday-quote, .cta-title'
  );
  targets.forEach(el => el.classList.add('scroll-reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach(el => observer.observe(el));
})();

// ─── CURSOR SPARKLE ────────────────────────────────────────────────────────────
(function initCursorSparkle() {
  const emojis = ['✨', '⭐', '🌟', '💜', '🌹'];
  let lastTime = 0;
  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastTime < 80) return;
    lastTime = now;
    if (Math.random() > 0.4) return; // sparse

    const spark = document.createElement('span');
    spark.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    spark.style.cssText = `
      position: fixed;
      left: ${e.clientX - 10}px;
      top: ${e.clientY - 10}px;
      pointer-events: none;
      font-size: ${Math.random() * 0.8 + 0.6}rem;
      z-index: 9500;
      animation: sparkFade 0.8s ease forwards;
      user-select: none;
    `;
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 800);
  });

  // inject keyframes
  if (!document.getElementById('spark-style')) {
    const style = document.createElement('style');
    style.id = 'spark-style';
    style.textContent = `
      @keyframes sparkFade {
        0%   { opacity: 1; transform: translateY(0) scale(1); }
        100% { opacity: 0; transform: translateY(-30px) scale(0.3); }
      }
    `;
    document.head.appendChild(style);
  }
})();

// ─── HERO EASTER EGG — Konami Code ─────────────────────────────────────────────
(function initKonami() {
  const code = [38,38,40,40,37,39,37,39,66,65]; // ↑↑↓↓←→←→BA
  let seq = [];
  document.addEventListener('keydown', (e) => {
    seq.push(e.keyCode);
    if (seq.length > code.length) seq.shift();
    if (seq.join(',') === code.join(',')) {
      launchConfetti(300);
      showStandCry('REQUIEM!', 2500);
      seq = [];
    }
  });
})();

// ─── STAND CARD CLICK (whole card) ─────────────────────────────────────────────
document.querySelectorAll('.stand-card').forEach(card => {
  card.addEventListener('click', (e) => {
    if (e.target.classList.contains('stand-btn')) return;
    const cry = card.dataset.cry || 'ORA!';
    showStandCry(cry, 1200);
  });
});

// ─── PAGE LOAD ENTRANCE ────────────────────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => showStandCry('HAPPY BIRTHDAY!', 2200), 600);
  setTimeout(() => launchConfetti(80), 800);
});
