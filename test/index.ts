const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const ratio = window.devicePixelRatio;

// Skaliere die Canvas-Dimensionen für Retina-Displays
canvas.width = window.innerWidth * ratio;
canvas.height = window.innerHeight * ratio;

// Setze die CSS-Größe des Canvas, damit es in das Fenster passt
canvas.style.width = window.innerWidth + "px";
canvas.style.height = window.innerHeight + "px";

// Skaliere den Kontext, sodass alle Zeichnungsbefehle skaliert werden
ctx.scale(ratio, ratio);

const steps = 50;
const width = Math.floor(canvas.width / steps) * steps;
const height = Math.floor(canvas.height / steps) * steps;

const mouse = { x: canvas.width / 2, y: canvas.height / 2, keydown: false };
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});
canvas.addEventListener("mousedown", () => (mouse.keydown = true));
canvas.addEventListener("mouseup", () => (mouse.keydown = false));

// Touch starten = wie mousedown
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault(); // verhindert Scrollen auf dem Bildschirm
  mouse.keydown = true;

  const rect = canvas.getBoundingClientRect();
  mouse.x = e.touches[0].clientX - rect.left;
  mouse.y = e.touches[0].clientY - rect.top;
});

// Finger bewegen = wie mousemove
canvas.addEventListener("touchmove", (e) => {
  e.preventDefault(); // verhindert Scrollen
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.touches[0].clientX - rect.left;
  mouse.y = e.touches[0].clientY - rect.top;
});

// Finger loslassen = wie mouseup
canvas.addEventListener("touchend", (e) => {
  e.preventDefault();
  mouse.keydown = false;
});

// Partikel
const particleA = { x: 150, y: 150, radius: 10, color: "cyan" };
const particleB = { x: 350, y: 250, radius: 10, color: "magenta" };

let dx = particleB.x - particleA.x;
let dy = particleB.y - particleA.y;
let hyp = Math.hypot(dx, dy);

// Abstand berechnen
function distance(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Zeichne Partikel
function drawParticle(p) {
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
  ctx.fillStyle = p.color;
  ctx.fill();
}

// Linie zwischen Partikeln
function drawLine(p1, p2, color = "white", width = 2) {
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

function drawRect(p1, p2, p3, p4, color = "white") {
  drawLine(p1, p2, color);
  drawLine(p2, p3, color);
  drawLine(p3, p4, color);
  drawLine(p4, p1, color);
}

// Karo-Raster
function drawGrid() {
  const step = 50; // Abstand der Linien
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1;

  for (let x = 0; x <= canvas.width; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let y = 0; y <= canvas.height; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function drawAxis(scaleMax, isX = true) {
  for (let i = 50; i <= scaleMax; i += 50) {
    const major = ((i - 50) / 50) % 5 === 0;
    const label = (i - 50) / 50;

    if (major) {
      ctx.fillStyle = "azure";
      if (isX) ctx.fillText(String(label), i + 5, 70);
      else ctx.fillText(String(label), 55, i + 20);
      drawLine(
        isX ? { x: i, y: 0 } : { x: 0, y: i },
        isX ? { x: i, y: canvas.height } : { x: canvas.width, y: i },
        "#626262ff"
      );
    }

    // kleine Striche
    drawLine(
      isX ? { x: i, y: major ? 40 : 45 } : { x: major ? 40 : 45, y: i },
      isX ? { x: i, y: major ? 60 : 55 } : { x: major ? 60 : 55, y: i },
      "azure"
    );
  }
}

function drawScaleScala() {
  const scaleLength = width - 25;
  const scaleHeight = height - 25;

  drawAxis(Math.floor(canvas.width / 50) * 50 - 25, true); // X-Achse
  drawAxis(Math.floor(canvas.height / 50) * 50 - 25, false); // Y-Achse

  drawMeasureMark(scaleLength - 125, 100, scaleLength - 25, 100, "1cm");

  drawLine({ x: 50, y: 50 }, { x: 50, y: scaleHeight }, "azure");
  drawLine({ x: 45, y: scaleHeight - 10 }, { x: 50, y: scaleHeight }, "azure");
  drawLine({ x: 55, y: scaleHeight - 10 }, { x: 50, y: scaleHeight }, "azure");
  drawLine({ x: 50, y: 50 }, { x: scaleLength, y: 50 }, "azure");
  drawLine({ x: scaleLength - 10, y: 45 }, { x: scaleLength, y: 50 }, "azure");
  drawLine({ x: scaleLength - 10, y: 55 }, { x: scaleLength, y: 50 }, "azure");
}

function drawMeasureMark(x1, y1, x2, y2, label) {
  drawLine({ x: x1, y: y1 }, { x: x2, y: y2 }, "gold");
  ctx.fillStyle = "gold";
  ctx.fillText(label, x1 + 5, y2 + 20);
}

// Animation
function animate() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawGrid();

  drawScaleScala();

  if (mouse.keydown) {
    particleB.x = Math.round(mouse.x / 50) * 50;
    particleB.y = Math.round(mouse.y / 50) * 50;
  }

  dx = particleB.x - particleA.x;
  dy = particleB.y - particleA.y;
  hyp = distance(particleA, particleB);

  // Dreiecklinien
  drawLine(particleA, { x: particleB.x, y: particleA.y }, "yellow"); // dx
  drawRect(
    particleA,
    { x: particleB.x, y: particleA.y },
    { x: particleB.x, y: particleA.y - Math.abs(dx) },
    { x: particleA.x, y: particleA.y - Math.abs(dx) },
    "#ffff542d"
  ); // dx
  drawLine({ x: particleB.x, y: particleA.y }, particleB, "green"); // dy
  drawRect(
    { x: particleB.x, y: particleA.y },
    { x: particleB.x + Math.abs(dy), y: particleA.y },
    { x: particleB.x + Math.abs(dy), y: particleB.y },
    particleB,
    "#306c1d2d"
  ); // dx
  drawLine(particleA, particleB, "red", 3); // Hypotenuse
  drawRect(
    { x: particleB.x, y: particleA.y },
    { x: particleB.x + Math.abs(dy), y: particleA.y },
    { x: particleB.x + Math.abs(dy), y: particleB.y },
    particleB,
    "#306c1d2d"
  ); // dx
  // c²-Quadrat auf der Hypotenuse
  const unitX = dx / hyp;
  const unitY = dy / hyp;

  // Senkrechter Vektor im Uhrzeigersinn gedreht
  const perpX = -unitY;
  const perpY = unitX;

  const squareCorner1 = particleA;
  const squareCorner2 = particleB;
  const squareCorner3 = {
    x: particleB.x + perpX * hyp,
    y: particleB.y + perpY * hyp,
  };
  const squareCorner4 = {
    x: particleA.x + perpX * hyp,
    y: particleA.y + perpY * hyp,
  };

  drawRect(
    squareCorner1,
    squareCorner2,
    squareCorner3,
    squareCorner4,
    "#ff000044"
  );

  drawParticle(particleA);
  drawParticle(particleB);

  // Werte anzeigen
  ctx.fillStyle = "white";
  ctx.font = "20px monospace";
  ctx.fillText(`a`, particleA.x + dx / 2, particleA.y - 10);
  ctx.fillText(`b`, particleB.x + 10, particleA.y + dy / 2);
  ctx.fillText(`c`, particleA.x + dx / 2, particleA.y + dy / 2 - 10);

  ctx.fillText(`dx (a): ${(dx / 50).toFixed(0)}cm`, width - 240, height - 90);
  ctx.fillText(`dy (b): ${(dy / 50).toFixed(0)}cm`, width - 240, height - 70);
  ctx.fillText(
    `Hypotenuse (c): ${(hyp / 50).toFixed(1)}cm`,
    width - 240,
    height - 50
  );

  requestAnimationFrame(animate);
}

animate();
