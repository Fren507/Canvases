const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const ratio = window.devicePixelRatio;
canvas.width = window.innerWidth * ratio;
canvas.height = window.innerHeight * ratio;
canvas.style.cursor = "none";
ctx.scale(ratio, ratio);

interface mouse {
  x: number;
  y: number;
  click: boolean;
}
interface Pos {
  x: number;
  y: number;
}
interface castedRays {
  x: number;
  y: number;
  dist: number;
}
interface RaycastObstacle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  radius?: number;
  color?: string;
}

const maxCastingLength = 1000;
const rayAmmount = 360 * 2;
let obstacles: Array<RaycastObstacle> = [];
let mouse: mouse = { x: -10, y: -10, click: false };

canvas.addEventListener("mousemove", (e) => {
  mouse = { x: e.clientX, y: e.clientY, click: false };
});
canvas.addEventListener("click", (e) => {
  mouse = { x: e.clientX, y: e.clientY, click: true };
});

function getRandomColor() {
  let color = `oklch(0.6425 0.1443 ${Math.random() * 360})`;
  return color;
}

function createObstacle(): RaycastObstacle {
  let raycastObstacle: RaycastObstacle = {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: 0,
    vy: 0,
    width: Math.random() * 30 + 50,
    height: Math.random() * 30 + 50,
    color: getRandomColor(),
  };
  // if (Math.random() > 0.5) {
  if (false) {
    raycastObstacle.radius = Math.random() * 30 + 50 / 2;
  }
  return raycastObstacle;
}

function castRays(p1: Pos): Array<castedRays> {
  let rays: Array<castedRays> = [];
  for (let i = 0; i < rayAmmount; i++) {
    const angle = (i * 360) / rayAmmount;
    for (let j = 0; j < maxCastingLength / 3; j++) {
      const p2: Pos = {
        x: p1.x + Math.cos(angle) * j * 3,
        y: p1.y + Math.sin(angle) * j * 3,
      };
      const dist = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
    }
  }
  return rays;
}

function drawCircle(pos: Pos, radius: number, color = "black", stroke = false) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, radius, 0, 360);
  if (stroke) {
    ctx.strokeStyle = color;
    ctx.stroke();
  } else {
    ctx.fill();
  }
  ctx.closePath();
}

function drawRelativeRect(p1: Pos, dx: number, dy: number, color = "black") {
  ctx.fillStyle = color;
  ctx.fillRect(p1.x, p1.y, dx, dy);
}

function drawRect(p1: Pos, p2: Pos, color = "black") {
  ctx.fillStyle = color;
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  ctx.fillRect(p1.x, p1.y, dx, dy);
}

function drawMousePointer() {
  ctx.filter = "blur(.5px)";
  ctx.shadowColor = "rgba(0, 0, 0, 1)";
  drawCircle(mouse, 3, `#fff`, true);
  drawCircle(mouse, 4, `#000`, true);
  drawCircle(mouse, 5, `#fff`, true);
  ctx.filter = "none";
}

function drawBackground() {
  ctx.fillStyle = "#dae1e8aa";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function toPos(x: number, y: number): Pos {
  return { x, y };
}

function drawObstacles() {
  obstacles.forEach((o) => {
    const color = o.color ? o.color : "black";
    if (o.radius) {
      drawCircle(toPos(o.x, o.y), o.radius, color);
    } else {
      drawRelativeRect(toPos(o.x, o.y), o.width, o.height, color);
    }
  });
}

function animate() {
  drawBackground();
  drawObstacles();
  drawMousePointer();

  requestAnimationFrame(animate);
}

for (let i = 0; i < 50; i++) {
  obstacles.push(createObstacle());
}

animate();
