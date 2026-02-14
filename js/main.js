/* ============================================
   MAIN.JS — App init, navigation, particles, music
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  initHero();
  initParticles();
  initNavigation();
  initMusic();
  initGame();
  initGallery();
  initReasons();
  initTimeline();
});

/* --- Hero --- */
function initHero() {
  const enterBtn = document.getElementById("enterBtn");
  const heroSection = document.getElementById("hero");
  const nav = document.getElementById("mainNav");

  // Hide nav initially on hero
  nav.classList.add("nav-hidden");

  enterBtn.addEventListener("click", () => {
    const gameSection = document.getElementById("game");
    gameSection.scrollIntoView({ behavior: "smooth" });

    // Show nav after leaving hero
    setTimeout(() => {
      nav.classList.remove("nav-hidden");
    }, 600);
  });
}

/* --- Floating Hearts --- */
function initParticles() {
  const container = document.getElementById("heartsContainer");
  const { colors } = config.particles;
  // Halve particles on mobile for performance
  const heartCount = window.innerWidth < 768
    ? Math.ceil(config.particles.heartCount / 2)
    : config.particles.heartCount;
  const hearts = ["\u2665", "\u2764\ufe0f", "\ud83d\udc95", "\ud83d\udc96", "\u2661"];

  for (let i = 0; i < heartCount; i++) {
    const heart = document.createElement("div");
    heart.className = "heart-particle";
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

    const size = (Math.random() * 1.5 + 0.8).toFixed(2);
    const left = (Math.random() * 100).toFixed(1);
    const duration = (Math.random() * 12 + 8).toFixed(1);
    const delay = (Math.random() * 10).toFixed(1);
    const drift = (Math.random() * 80 - 40).toFixed(0);
    const spin = (Math.random() * 360).toFixed(0);
    const color = colors[Math.floor(Math.random() * colors.length)];

    heart.style.cssText = `
      left: ${left}%;
      --size: ${size}rem;
      --duration: ${duration}s;
      --delay: ${delay}s;
      --drift: ${drift}px;
      --spin: ${spin}deg;
      --color: ${color};
      font-size: ${size}rem;
      color: ${color};
    `;

    container.appendChild(heart);
  }
}

/* --- Navigation --- */
function initNavigation() {
  const nav = document.getElementById("mainNav");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".section");

  // Click to scroll
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("data-section");
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Track active section on scroll
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("data-section") === id
            );
          });

          // Show/hide nav based on hero visibility
          if (id === "hero") {
            nav.classList.add("nav-hidden");
          } else {
            nav.classList.remove("nav-hidden");
          }
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* --- Reasons I Love You --- */
function initReasons() {
  const grid = document.getElementById("reasonsGrid");
  const reasons = config.reasons;

  reasons.forEach((reason, index) => {
    const card = document.createElement("div");
    card.className = "reason-card";

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">
          <div class="envelope-icon">\ud83d\udc8c</div>
          <div class="reason-number">Reason #${index + 1}</div>
        </div>
        <div class="card-back">
          <p class="reason-text">${reason}</p>
        </div>
      </div>
    `;

    card.addEventListener("click", () => {
      card.classList.toggle("flipped");
    });

    grid.appendChild(card);
  });

  // "& a million more..." closing card
  const moreCard = document.createElement("div");
  moreCard.className = "reason-card reason-card-more";
  moreCard.innerHTML = `
    <div class="card-inner">
      <div class="card-front">
        <div class="envelope-icon">&#x221E;</div>
        <div class="reason-number">& a million more...</div>
      </div>
    </div>
  `;
  grid.appendChild(moreCard);
}

/* --- Music --- */
let bgAudio = null;
let bgPlaying = false;

function initMusic() {
  const toggle = document.getElementById("musicToggle");
  const enterBtn = document.getElementById("enterBtn");

  if (!config.music.enabled) {
    toggle.style.display = "none";
    return;
  }

  bgAudio = new Audio(config.music.src);
  bgAudio.volume = config.music.volume;
  bgAudio.loop = true;

  // Auto-start music when she clicks "Click to Enter"
  // (browsers require a user gesture before playing audio)
  enterBtn.addEventListener("click", () => {
    if (!bgPlaying) {
      bgAudio.play().catch(() => {});
      bgPlaying = true;
      toggle.classList.add("playing");
    }
  }, { once: true });

  // Toggle button to pause/resume
  toggle.addEventListener("click", () => {
    if (bgPlaying) {
      bgAudio.pause();
      toggle.classList.remove("playing");
    } else {
      bgAudio.play().catch(() => {});
      toggle.classList.add("playing");
    }
    bgPlaying = !bgPlaying;
  });

  // If audio file doesn't exist, hide the button
  bgAudio.addEventListener("error", () => {
    toggle.style.display = "none";
  });
}
