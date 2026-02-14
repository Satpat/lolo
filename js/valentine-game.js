/* ============================================
   VALENTINE GAME — Dodging "No" button
   ============================================ */

function initGame() {
  const gameContainer = document.getElementById("gameContainer");
  const celebration = document.getElementById("celebration");
  const character = document.getElementById("gameCharacter");
  const question = document.getElementById("gameQuestion");
  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");
  const celebrationText = document.getElementById("celebrationText");
  const celebrationSubtext = document.getElementById("celebrationSubtext");
  const confettiContainer = document.getElementById("confettiContainer");

  const { game } = config;
  let noClickCount = 0;
  let yesBtnScale = 1;

  // Set content from config
  character.textContent = game.characterEmoji;
  question.textContent = game.question;

  // --- "Yes" button: celebrate! ---
  yesBtn.addEventListener("click", () => {
    gameContainer.classList.add("hidden");
    celebration.classList.remove("hidden");
    celebrationText.textContent = game.celebrationMessage;
    celebrationSubtext.textContent = game.celebrationSubtext;
    const confettiCount = window.innerWidth < 768 ? 40 : 80;
    createConfetti(confettiContainer, confettiCount);

    // Stop background music, play celebration song
    if (bgAudio && bgPlaying) {
      bgAudio.pause();
      bgPlaying = false;
      const toggle = document.getElementById("musicToggle");
      toggle.classList.remove("playing");
    }
    if (config.music.celebrationSrc) {
      const celebrationAudio = new Audio(config.music.celebrationSrc);
      celebrationAudio.volume = config.music.volume;
      celebrationAudio.play().catch(() => {});
    }
  });

  // --- "No" button: dodge on hover (desktop) ---
  noBtn.addEventListener("mouseenter", () => {
    dodgeNoButton(noBtn);
    updateNoButton(noBtn);
    growYesButton(yesBtn);
  });

  // --- "No" button: dodge on touch (mobile) ---
  noBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    dodgeNoButton(noBtn);
    updateNoButton(noBtn);
    growYesButton(yesBtn);
  });

  // --- "No" button: if somehow clicked, still dodge ---
  noBtn.addEventListener("click", (e) => {
    e.preventDefault();
    dodgeNoButton(noBtn);
    updateNoButton(noBtn);
    growYesButton(yesBtn);
  });

  function dodgeNoButton(btn) {
    const section = document.getElementById("game");
    const btnW = btn.offsetWidth;
    const btnH = btn.offsetHeight;

    // Use absolute positioning relative to game section (works on mobile scroll)
    const pad = 20;
    const sectionW = section.offsetWidth;
    const sectionH = section.offsetHeight;
    const maxX = sectionW - btnW - pad;
    const maxY = sectionH - btnH - pad * 2;

    const newX = Math.random() * Math.max(maxX, 50) + pad;
    const newY = Math.random() * Math.max(maxY, 50) + pad;

    btn.style.position = "absolute";
    btn.style.left = newX + "px";
    btn.style.top = newY + "px";
    btn.style.transition = "none";
    btn.style.zIndex = "5";
  }

  function updateNoButton(btn) {
    noClickCount++;
    const texts = game.noButtonTexts;
    if (noClickCount < texts.length) {
      btn.textContent = texts[noClickCount];
    }

    // Shrink the no button progressively
    const scale = Math.max(0.5, 1 - noClickCount * 0.06);
    btn.style.transform = `scale(${scale})`;
  }

  function growYesButton(btn) {
    yesBtnScale += 0.08;
    btn.style.transform = `scale(${yesBtnScale})`;
    btn.style.animation = "none"; // Stop heartbeat, scale takes over
  }
}

/* --- Confetti Explosion --- */
function createConfetti(container, count) {
  const colors = [
    "#ff6b9d",
    "#ffc7de",
    "#ffd700",
    "#ff9ebb",
    "#ffffff",
    "#ffb6c1",
    "#ff69b4",
  ];
  const shapes = ["square", "rect", "circle"];

  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti";

    const color = colors[Math.floor(Math.random() * colors.length)];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const size = Math.random() * 10 + 5;
    const left = Math.random() * 100;
    const duration = (Math.random() * 3 + 2).toFixed(2);
    const delay = (Math.random() * 0.8).toFixed(2);
    const drift = (Math.random() * 200 - 100).toFixed(0);
    const spin = (Math.random() * 1080).toFixed(0);

    let w = size;
    let h = size;
    let radius = "2px";

    if (shape === "rect") {
      w = size * 0.5;
      h = size * 1.5;
    } else if (shape === "circle") {
      radius = "50%";
    }

    piece.style.cssText = `
      left: ${left}%;
      width: ${w}px;
      height: ${h}px;
      background: ${color};
      border-radius: ${radius};
      --confetti-duration: ${duration}s;
      --confetti-delay: ${delay}s;
      --confetti-drift: ${drift}px;
      --confetti-spin: ${spin}deg;
    `;

    container.appendChild(piece);

    // Clean up after animation
    const totalTime = (parseFloat(duration) + parseFloat(delay)) * 1000 + 200;
    setTimeout(() => piece.remove(), totalTime);
  }
}
