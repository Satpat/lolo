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
    noBtn.classList.add("hidden"); // Hide No button (it may be absolutely positioned outside gameContainer)
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

  // Debounce to prevent double-firing on mobile (touchstart + click)
  let lastDodgeTime = 0;
  function handleNoDodge(e) {
    e.preventDefault();
    const now = Date.now();
    if (now - lastDodgeTime < 300) return; // Ignore if fired within 300ms
    lastDodgeTime = now;
    dodgeNoButton(noBtn);
    updateNoButton(noBtn);
    growYesButton(yesBtn);
  }

  // --- "No" button: dodge on hover (desktop) ---
  noBtn.addEventListener("mouseenter", handleNoDodge);

  // --- "No" button: dodge on touch (mobile) ---
  noBtn.addEventListener("touchstart", handleNoDodge, { passive: false });

  // --- "No" button: if somehow clicked, still dodge ---
  noBtn.addEventListener("click", handleNoDodge);

  function dodgeNoButton(btn) {
    const section = document.getElementById("game");
    const btnW = btn.offsetWidth;
    const btnH = btn.offsetHeight;

    // Use the visible viewport height rather than the section's full CSS height.
    // On mobile, window.innerHeight accounts for browser chrome (address bar, etc.)
    // which makes it more reliable than section.clientHeight.
    const sectionW = section.clientWidth;
    const sectionH = Math.min(section.clientHeight, window.innerHeight);

    // Keep the button away from the nav bar at the top and edges
    const navHeight = 70; // nav bar + safe margin
    const pad = 20;
    const topPad = navHeight;

    // Ensure the button stays well within visible, tappable bounds
    const maxX = Math.max(sectionW - btnW - pad, pad);
    const maxY = Math.max(sectionH - btnH - pad, topPad);

    const newX = Math.random() * (maxX - pad) + pad;
    const newY = Math.random() * (maxY - topPad) + topPad;

    // Position absolute relative to the game section (which has position: relative)
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
