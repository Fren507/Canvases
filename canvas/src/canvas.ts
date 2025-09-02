const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const maxRecursionLevel = 0;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

interface Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
}

interface ParticleConnection {
  x: number;
  y: number;
  length: number;
}

const particles: Particle[] = [];

const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  keydown: false,
};

canvas.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

canvas.addEventListener("mousedown", () => {
  mouse.keydown = true;
});

canvas.addEventListener("mouseup", () => {
  mouse.keydown = false;
});

function randomElement(list: Array<any>): any {
  return list[Math.floor(Math.random() * list.length)];
}

// Zufällige Farbe
function randomColor(): string {
  let colors = [
    "#ff006e", // knalliges Pink
    "#3a86ff", // elektrisches Blau
    "#ffbe0b", // leuchtendes Gelb
    "#8338ec", // kräftiges Violett
    "#06d6a0", // frisches Türkis
  ];

  return colors[Math.floor(Math.random() * colors.length)];
}

// Partikel erstellen
for (let i = 0; i < 1000; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: 3 + Math.random() * 3,
    color: randomColor(),
    vx: 0,
    vy: 0,
  });
}

// Partikel zeichnen
function drawParticle(p: Particle) {
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
  ctx.fillStyle = p.color;
  ctx.fill();
}

function findNearestParticles(
  p: Particle,
  range: number
): Array<ParticleConnection> {
  let nearest: Array<ParticleConnection> = [];

  for (const other of particles) {
    if (other === p) continue;

    const dx = other.x - p.x;
    const dy = other.y - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < range) {
      nearest.push({
        x: other.x,
        y: other.y,
        length: dist,
      });
    }
  }

  return nearest;
}

function drawLineBetweenParticles(
  p: Particle,
  connections: Array<ParticleConnection>
) {
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
  ctx.strokeStyle = p.color;
  for (const conn of connections) {
    ctx.lineWidth = 3 - conn.length / 60;
    ctx.lineTo(conn.x, conn.y);
  }
  ctx.stroke();
}

// Animation
function animate() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.10"; // leicht transparent für coolen Effekt
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const p of particles) {
    drawLineBetweenParticles(p, findNearestParticles(p, 60));
  }

  for (const p of particles) {
    const dx = mouse.x - p.x;
    const dy = mouse.y - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    let force = Math.min(100 / dist, 5); // je näher, desto mehr Kraft
    force *= 2;
    if (mouse.keydown) {
      force = -force;
    }

    p.vx += Math.cos(angle) * force * 0.05;
    p.vy += Math.sin(angle) * force * 0.05;

    // Reibung
    p.vx *= 0.9;
    p.vy *= 0.9;

    p.x += p.vx;
    p.y += p.vy;

    drawParticle(p);
  }

  requestAnimationFrame(animate);
}

animate();
