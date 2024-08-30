<script setup lang="ts">
import { ref, onMounted } from "vue";
import gsap from "gsap";
import KImage from '../assets/K.png';
import EImage from '../assets/E.png';
import NImage from '../assets/N.png';
import OImage from '../assets/O.png';
import FourMinImage from '../assets/4min.png';

interface ImagesData {
  x: number;
  y: number;
  size: number;
  img: HTMLImageElement;
  rotationY: number;
}

interface Ball {
  x: number;
  y: number;
  radius: number;
  color: string;
  rotation: number;
  number: number;
}

const canvas = ref<HTMLCanvasElement | null>(null);
const context = ref<CanvasRenderingContext2D | null>(null);

const images: { [key: string]: HTMLImageElement } = {
  'K': new Image(),
  'E': new Image(),
  'N': new Image(),
  'O': new Image(),
  '4 min': new Image(),
};

images['K'].src = KImage;
images['E'].src = EImage;
images['N'].src = NImage;
images['O'].src = OImage;
images['4 min'].src = FourMinImage;

const imagesData: ImagesData[] = [
  { x: 50, y: 50, size: 50, img: images['K'], rotationY: 0 },
  { x: 110, y: 50, size: 50, img: images['E'], rotationY: 0 },
  { x: 170, y: 50, size: 50, img: images['N'], rotationY: 0 },
  { x: 230, y: 50, size: 50, img: images['O'], rotationY: 0 },
  { x: 290, y: 50, size: 50, img: images['4 min'], rotationY: 0 },
];

const spacing = 30; // Настраиваемое значение для расстояния между изображениями
imagesData.forEach((image, index) => {
  image.x = 50 + index * spacing;
});

const balls: Ball[] = Array.from({ length: 10 }, (_, index) => ({
  x: 400 + index * 60,
  y: 50,
  radius: 25,
  color: '#3498db',
  rotation: 0,
  number: index + 1,
}));

const gridSquares = Array.from({ length: 80 }, (_, index) => ({
  x: 0,
  y: 0,
  size: 0,
  number: index + 1,
  hovered: false,
}));

let progressWidth = 0; // Начальная ширина полоски
let remainingTime = 20; // Оставшееся время в секундах

const loadImages = (): Promise<void> => {
  return new Promise((resolve) => {
    let imagesLoaded = 0;
    const totalImages = Object.keys(images).length;

    Object.values(images).forEach(img => {
      img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === totalImages) {
          resolve();
        }
      };
      img.onerror = () => {
        console.error(`Failed to load image: ${img.src}`);
      };
    });
  });
};

const draw = (): void => {
  const ctx = context.value;
  const cvs = canvas.value;

  if (!ctx || !cvs) return;

  ctx.clearRect(0, 0, cvs.width, cvs.height);

  // Отрисовка изображений
  imagesData.forEach(({ x, y, size, img, rotationY }) => {
    ctx.save();

    // Эффект вращения
    ctx.translate(x, y);
    let scaleX = Math.cos(rotationY * Math.PI / 180);

    // При повороте отображать изображение так же (не наоборот)
    if (scaleX < 0) {
      scaleX = -scaleX;
    }

    // Применение трансформации
    ctx.transform(scaleX, 0, 0, 1, 0, 0);

    // Отрисовка изображения
    ctx.drawImage(img, -size / 4.2, -size / 4.2, size / 2.2, size / 2.2);

    ctx.restore();
  });

  // Отрисовка шаров
  balls.forEach((ball) => {
    ctx.save();
    ctx.translate(ball.x, ball.y);
    ctx.rotate((ball.rotation * Math.PI) / 180);

    ctx.beginPath();
    ctx.arc(0, 0, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();

    ctx.fillStyle = '#fff';
    ctx.font = `${ball.radius}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(ball.number.toString(), 0, 0);

    ctx.restore();
  });

  // Отрисовка полоски с заливкой и таймером
  ctx.fillStyle = '#00ff00';
  ctx.fillRect(0, 85, progressWidth, 10);

  ctx.fillStyle = '#000';
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Делайте ваши ставки', cvs.width / 2, 90);

  ctx.textAlign = 'right';
  ctx.fillText(`${remainingTime}`, cvs.width - 10, 90);

  // Отрисовка сетки из квадратов
  const gridWidth = cvs.width * 0.6; // 60% от ширины canvas
  const squareSize = gridWidth / 10;
  const horizontalOffset = 25; // Горизонтальный отступ
  const verticalOffset = 105; // Вертикальный отступ

  gridSquares.forEach((square, index) => {
    const col = index % 10;
    const row = Math.floor(index / 10);

    square.x = col * squareSize + horizontalOffset;
    square.y = row * squareSize + verticalOffset;
    square.size = squareSize;

    ctx.fillStyle = square.hovered ? 'orange' : '#000';
    ctx.fillRect(square.x, square.y, square.size, square.size);

    ctx.fillStyle = '#fff';
    ctx.font = `${square.size * 0.4}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(square.number.toString(), square.x + square.size / 2, square.y + square.size / 2);
  });
};

const checkHover = (event: MouseEvent): void => {
  const cvs = canvas.value;
  if (!cvs) return;

  const rect = cvs.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  gridSquares.forEach(square => {
    square.hovered =
      mouseX >= square.x &&
      mouseX <= square.x + square.size &&
      mouseY >= square.y &&
      mouseY <= square.y + square.size;
  });

  draw();
};

onMounted(async (): Promise<void> => {
  if (!canvas.value) return;

  context.value = canvas.value.getContext('2d');

  if (!context.value) return;

  canvas.value.addEventListener('mousemove', checkHover);

  await loadImages();

  gsap.to(imagesData, {
    duration: 1.0,
    rotationY: 180,
    repeat: -1,
    ease: "power2.inOut",
    stagger: 0.2,
    onUpdate: draw,
  });

  gsap.to(balls, {
    duration: 1,
    x: (i) => 350 + i * 60,
    rotation: -360,
    ease: "power1.out",
    stagger: 0.5,
    onUpdate: draw,
    onComplete: () => {
      balls.forEach((ball) => (ball.rotation = 0));
      draw();
    },
  });

  gsap.to({ progress: 0 }, {
    duration: 20,
    progress: 1,
    onUpdate: function () {
      const cvs = canvas.value;
      if (cvs) {
        progressWidth = cvs.width * (this.targets()[0].progress as number);
        remainingTime = Math.ceil(20 - 20 * (this.targets()[0].progress as number));
        draw();
      }
    },
    onComplete: () => {
      remainingTime = 0;
      draw();
    },
  });

  draw();
});
</script>

<template>
  <canvas ref="canvas" width="1000" height="600"></canvas>
</template>

<style scoped>
canvas {
  border: 1px solid black;
}
</style>
