/* eslint-disable */

function drawScaleScala() {
  const steps = 50;
  const width = Math.floor(canvas.width / steps) * steps;
  const scaleLength = width + 25;

  drawLine({ x: scaleLength - 10, y: 45 }, { x: scaleLength, y: 50 }, "yellow");
  drawLine({ x: scaleLength - 10, y: 55 }, { x: scaleLength, y: 50 }, "yellow");
  for (let i = 50; i <= width; i += 50) {
    if (((i - 50) / 50) % 5 === 0) {
      ctx.fillStyle = "yellow";
      ctx.fillText(`${(i - 50) / 50}`, i + 5, 70);
      drawLine({ x: i, y: 0 }, { x: i, y: canvas.height }, "#626262ff");
    }
    drawLine(
      { x: i, y: ((i - 50) / 50) % 5 === 0 ? 40 : 45 },
      { x: i, y: ((i - 50) / 50) % 5 === 0 ? 60 : 55 },
      "yellow"
    );
  }

  drawLine({ x: 50, y: 50 }, { x: 50, y: 1075 }, "yellow");
  drawLine({ x: 45, y: 1065 }, { x: 50, y: 1075 }, "yellow");
  drawLine({ x: 55, y: 1065 }, { x: 50, y: 1075 }, "yellow");
  for (let i = 50; i <= 1050; i += 50) {
    if (((i - 50) / 50) % 5 === 0) {
      ctx.fillStyle = "yellow";
      ctx.fillText(`${(i - 50) / 50}`, 55, i + 20);
      drawLine({ y: i, x: 0 }, { y: i, x: canvas.width }, "#626262ff");
    }
    drawLine(
      { y: i, x: ((i - 50) / 50) % 5 === 0 ? 40 : 45 },
      { y: i, x: ((i - 50) / 50) % 5 === 0 ? 60 : 55 },
      "yellow"
    );
  }
  drawLine({ x: 50, y: 50 }, { x: scaleLength, y: 50 }, "yellow");
}
