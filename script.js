/*  SPARKLE MOUSE TRAIL */
const sparkleCanvas = document.createElement('canvas');
sparkleCanvas.id = 'sparkleCanvas';
document.body.appendChild(sparkleCanvas);

const sctx = sparkleCanvas.getContext('2d');
let sW, sH;
let sparks = [];

function resizeSparkle() {
  sW = sparkleCanvas.width = window.innerWidth;
  sH = sparkleCanvas.height = window.innerHeight;
}
resizeSparkle();
window.addEventListener('resize', resizeSparkle);

/* CREATE SPARK */
function createSpark(x, y) {
  for (let i = 0; i < 6; i++) {
    sparks.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      life: 1,
      size: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? '0,245,212' : '180,0,255'
    });
  }
}

/* MOUSE MOVE */
document.addEventListener('mousemove', e => {
  createSpark(e.clientX, e.clientY);
});

/* ANIMATION */
function animateSpark() {
  sctx.clearRect(0, 0, sW, sH);

  sparks.forEach((s, i) => {
    s.x += s.vx;
    s.y += s.vy;
    s.life -= 0.02;

    if (s.life <= 0) {
      sparks.splice(i, 1);
      return;
    }

    sctx.beginPath();
    sctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    sctx.fillStyle = `rgba(${s.color}, ${s.life})`;
    sctx.shadowBlur = 10;
    sctx.shadowColor = `rgba(${s.color}, ${s.life})`;
    sctx.fill();
  });
/* i villan 7667@ */
  requestAnimationFrame(animateSpark);
}
animateSpark();
/*  TYPED TEXT */
const phrases = [
  'Java Full-Stack Developer',
  'Problem Solver',
  'Open Source Enthusiast',
  'CS Engineer',
];
let pIdx = 0, cIdx = 0, deleting = false;
const typedEl = document.querySelector('.typed-text');
function type() {
  const phrase = phrases[pIdx];
  if (!deleting) {
    typedEl.textContent = phrase.slice(0, ++cIdx);
    if (cIdx === phrase.length) { deleting = true; setTimeout(type, 1800); return; }
  } else {
    typedEl.textContent = phrase.slice(0, --cIdx);
    if (cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; }
  }
  setTimeout(type, deleting ? 60 : 90);
}
setTimeout(type, 1200);

/*  SCROLL REVEAL */
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(r => obs.observe(r));

/*  PARTICLES */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let W, H, dots = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
/* i villan 7667@ */
resize();
window.addEventListener('resize', resize);

for (let i = 0; i < 80; i++) {
  dots.push({
    x: Math.random() * W, 
    y: Math.random() * H,
    // SPEED Increased
    vx: (Math.random() - 0.5) * 0.5, 
    vy: (Math.random() - 0.5) * 0.5,
    // SIZE Increased 
    r: Math.random() * 3.0 + 1.5, 
    c: Math.random() > 0.5 ? '0,245,212' : '180,0,255'
  });
}

(function animDots() {
  ctx.clearRect(0, 0, W, H);
  dots.forEach(d => {
    d.x += d.vx; 
    d.y += d.vy;
    
    if (d.x < 0) d.x = W; 
    if (d.x > W) d.x = 0;
    if (d.y < 0) d.y = H; 
    if (d.y > H) d.y = 0;
    
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${d.c},0.4)`; 
    ctx.fill();
  });
  requestAnimationFrame(animDots);
})();

// ================= MUSIC WITH PERSISTENCE =================
const music = document.getElementById("bg-music");
music.volume = 0.3;

const MUSIC_TIME_KEY = "bgMusicTime";
const MUSIC_PLAYING_KEY = "bgMusicPlaying";

// Restore saved playback position
const savedTime = localStorage.getItem(MUSIC_TIME_KEY);
if (savedTime !== null) {
  music.currentTime = parseFloat(savedTime);
}

// Figure out if it *should* be playing (default: yes, on first ever visit)
const wasPlaying = localStorage.getItem(MUSIC_PLAYING_KEY);
const shouldPlay = wasPlaying === null ? true : wasPlaying === "true";

function tryPlayMusic() {
  music.play()
    .then(() => {
      localStorage.setItem(MUSIC_PLAYING_KEY, "true");
    })
    .catch(() => {
      // Autoplay blocked — wait for first user interaction, then resume
      localStorage.setItem(MUSIC_PLAYING_KEY, "false");
      const resumeOnInteraction = () => {
        music.play().then(() => {
          localStorage.setItem(MUSIC_PLAYING_KEY, "true");
        }).catch(() => {});
        document.removeEventListener("click", resumeOnInteraction);
        document.removeEventListener("keydown", resumeOnInteraction);
        document.removeEventListener("touchstart", resumeOnInteraction);
      };
      document.addEventListener("click", resumeOnInteraction, { once: true });
      document.addEventListener("keydown", resumeOnInteraction, { once: true });
      document.addEventListener("touchstart", resumeOnInteraction, { once: true });
    });
}

document.addEventListener("DOMContentLoaded", () => {
  if (shouldPlay) tryPlayMusic();
});

// Save current time continuously while playing (every ~2s, cheap on perf)
setInterval(() => {
  if (!music.paused) {
    localStorage.setItem(MUSIC_TIME_KEY, music.currentTime);
  }
}, 2000);

// Save final state right before the page unloads/reloads
window.addEventListener("beforeunload", () => {
  localStorage.setItem(MUSIC_TIME_KEY, music.currentTime);
  localStorage.setItem(MUSIC_PLAYING_KEY, (!music.paused).toString());
});

// Keep saved state in sync if the user pauses/plays manually (e.g. via devtools or future controls)
music.addEventListener("pause", () => localStorage.setItem(MUSIC_PLAYING_KEY, "false"));
music.addEventListener("play", () => localStorage.setItem(MUSIC_PLAYING_KEY, "true"));

/*  DYNAMIC GREETING */

const updateGreeting = () => {
  const hour = new Date().getHours();
  const greetingElement = document.getElementById('time-greeting');
  
  let greeting = 'Welcome';
  if (hour >= 5 && hour < 12) greeting = 'Good Morning';
  else if (hour >= 12 && hour < 17) greeting = 'Good Afternoon';
  else if (hour >= 17 && hour < 21) greeting = 'Good Evening';
  else greeting = 'Good Night';
  
  greetingElement.textContent = greeting;
};

// Call immediately and update every minute
updateGreeting();
setInterval(updateGreeting, 60000);



