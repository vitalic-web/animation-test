<script setup lang="ts">
import { ref, onMounted } from "vue";
import gsap from "gsap";
import KImage from '../assets/K.png';
import EImage from '../assets/E.png';
import NImage from '../assets/N.png';
import OImage from '../assets/O.png';
import FourMinImage from '../assets/4min.png';
import BackgroundHeader from '../assets/header.png';

type IImages = Record<string, HTMLImageElement>;

interface IKenoLetters {
  x: number;
  y: number;
  size: number;
  img: HTMLImageElement;
  rotationY: number;
}

const canvas = ref<HTMLCanvasElement | null>(null);
const context = ref<CanvasRenderingContext2D | null>(null);

const images: IImages = {
  'K': new Image(),
  'E': new Image(),
  'N': new Image(),
  'O': new Image(),
  '4 min': new Image(),
  'backgroundHeader': new Image(),
};

images['K'].src = KImage;
images['E'].src = EImage;
images['N'].src = NImage;
images['O'].src = OImage;
images['4 min'].src = FourMinImage;
images['backgroundHeader'].src = BackgroundHeader;

const kenoLetters: IKenoLetters[] = [
  { x: 15, y: 22, size: 40, img: images['K'], rotationY: 0 },
  { x: 55, y: 22, size: 40, img: images['E'], rotationY: 0 },
  { x: 95, y: 22, size: 40, img: images['N'], rotationY: 0 },
  { x: 135, y: 22, size: 40, img: images['O'], rotationY: 0 },
  { x: 185, y: 18, size: 50, img: images['4 min'], rotationY: 0 },
];

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

  // Отрисовка фона хэдера
  const bgImage = images['backgroundHeader'];
  if (bgImage.complete) {
    const bgWidth = cvs.width; // Ширина на весь canvas
    ctx.drawImage(bgImage, 0, 0, bgWidth, 190);
  }

  // Отрисовка изображений
  kenoLetters.forEach(({ x, y, size, img, rotationY }) => {
    ctx.save();

    // Перемещение к центру буквы
    ctx.translate(x + size / 2, y + size / 2);
    
    // Применение вращения по вертикальной оси
    let scaleX = Math.cos(rotationY * Math.PI / 180);

    // При повороте отображать изображение так же (не наоборот)
    if (scaleX < 0) {
      scaleX = -scaleX;
    }

    // Применение трансформации
    ctx.transform(scaleX, 0, 0, 1, 0, 0);

    // Отрисовка изображения с центром в середине буквы
    ctx.drawImage(img, -size / 2, -size / 2, size, size);

    ctx.restore();
  });

  // Отрисовка текста
  ctx.fillStyle = 'orange';
  ctx.font = '30px Arial';
  ctx.fillText('#799813', 56, 100);
};

onMounted(async (): Promise<void> => {
  if (!canvas.value) return;

  context.value = canvas.value.getContext('2d');

  if (!context.value) return;

  await loadImages();

  gsap.to(kenoLetters, {
    duration: 1.0,
    rotationY: 180,
    repeat: -1,
    ease: "power2.inOut",
    stagger: 0.2,
    onUpdate: draw,
  });

  draw();
});
</script>

<template>
  <canvas ref="canvas" width="1920" height="1080" />
</template>

<style scoped>
canvas {
  border: 1px solid black;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001;
  width: 890px;
  height: 501px;
  cursor: inherit;
}
</style>
