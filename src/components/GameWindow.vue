<script setup lang="ts">
import { ref, onMounted } from "vue";
import gsap from "gsap";

interface Square {
  x: number;
  y: number;
  size: number;
  letter: string;
  rotationY: number;
}

const handleMouseMove = (): void => {
  // console.log('handleMouseMove');
};

const canvas = ref<HTMLCanvasElement | null>(null);
const context = ref<CanvasRenderingContext2D | null>(null);
const squares: Square[] = [
  { x: 50, y: 50, size: 50, letter: 'K', rotationY: 0 },
  { x: 110, y: 50, size: 50, letter: 'E', rotationY: 0 },
  { x: 170, y: 50, size: 50, letter: 'N', rotationY: 0 },
  { x: 230, y: 50, size: 50, letter: 'O', rotationY: 0 },
  { x: 290, y: 50, size: 50, letter: '', rotationY: 0 },
];

const draw = (): void => {
  const ctx = context.value;
  const cvs = canvas.value;

  if (!ctx || !cvs) return;

  ctx.clearRect(0, 0, cvs.width, cvs.height);
  squares.forEach(({ x, y, size, letter, rotationY }) => {
    ctx.save();

    // эффект вращения
    ctx.translate(x, y);
    let scaleX = Math.cos(rotationY * Math.PI / 180);

    // при повороте отображать букву так же (не наоборот)
    if (scaleX < 0) {
      scaleX = -scaleX;
    }

    ctx.transform(scaleX, 0, 0, 1, 0, 0);

    if (letter) {
      // квадрат
      ctx.fillStyle = '#000';
      ctx.fillRect(-size / 2, -size / 2, size, size);

      // буква внутри квадрата
      ctx.fillStyle = '#fff';
      ctx.font = `${size * 0.8}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(letter, 0, 0);
    } else {
      // круг
      ctx.beginPath();
      ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
      ctx.fillStyle = '#000';
      ctx.fill();

      // текст внутри круга
      ctx.fillStyle = '#fff';
      ctx.font = `${size * 0.3}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('4', 0, -size * 0.2);
      ctx.fillText('min', 0, size * 0.2);
    }

    ctx.restore();
  });
};

onMounted((): void => {
  if (!canvas.value) return;

  context.value = canvas.value.getContext('2d');

  if (!context.value) return;

  gsap.to(squares, {
    duration: 2,
    rotationY: 180,
    repeat: -1,
    ease: "power2.inOut",
    onUpdate: draw,
  });

  draw();
});
</script>

<template>
  <header>header</header>
  <canvas ref="canvas" width="1000" height="600" @mousemove="handleMouseMove"></canvas>
  <footer>footer</footer>
</template>

<style scoped>
header {
  width: 100%;
  height: 20px;
  border: 1px solid black;
}

canvas {
  border: 1px solid black;
}

footer {
  width: 100%;
  height: 20px;
  border: 1px solid black;
}
</style>