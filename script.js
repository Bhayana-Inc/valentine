(() => {
  // --- Personalization ---
  // You can set the name directly here OR pass ?name=someone in the URL.
  const params = new URLSearchParams(window.location.search);
  const name = (params.get("name") || "beans").trim();

  const question = document.getElementById("question");
  question.textContent = `${name} will you be my valentine?`;

  // --- Elements ---
  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");
  const noZone = document.getElementById("noZone");
  const controls = document.getElementById("controls");
  const yay = document.getElementById("yay");

  // --- Make "No" button dodge the cursor / finger ---
  // It repositions randomly within the noZone bounds.
  function moveNoButton() {
    const zoneRect = noZone.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    const pad = 10;
    const maxX = Math.max(pad, zoneRect.width - btnRect.width - pad);
    const maxY = Math.max(pad, zoneRect.height - btnRect.height - pad);

    const x = pad + Math.random() * maxX;
    const y = pad + Math.random() * maxY;

    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
  }

  // Start in a pleasant spot
  requestAnimationFrame(moveNoButton);

  // Desktop
  noBtn.addEventListener("mouseenter", moveNoButton);
  // Mobile (touch)
  noBtn.addEventListener("touchstart", (e) => { e.preventDefault(); moveNoButton(); }, { passive: false });
  // If someone manages to click it anyway
  noBtn.addEventListener("click", moveNoButton);

  // --- Confetti (lightweight canvas confetti) ---
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  let particles = [];
  let anim = null;

  function burstConfetti() {
    resizeCanvas();
    const rect = canvas.getBoundingClientRect();
    const originX = rect.width / 2;
    const originY = rect.height / 3;

    const colors = ["#ff3d8d", "#ffbf5f", "#7cd8ff", "#b6ff8b", "#ffffff", "#ffd3e5"];

    const count = 170;
    particles = Array.from({ length: count }, () => ({
      x: originX,
      y: originY,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 1.3) * 12,
      g: 0.35 + Math.random() * 0.22,
      r: 3 + Math.random() * 5,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.25,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 240 + Math.random() * 90,
    }));

    if (anim) cancelAnimationFrame(anim);
    tick();
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life -= 1;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 2);
      ctx.restore();
    });

    particles = particles.filter(p => p.life > 0 && p.y < canvas.getBoundingClientRect().height + 40);

    if (particles.length) {
      anim = requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      anim = null;
    }
  }

  // --- Yes click: switch to yay state ---
  yesBtn.addEventListener("click", () => {
    controls.hidden = true;
    yay.hidden = false;
    burstConfetti();
  });
})();
