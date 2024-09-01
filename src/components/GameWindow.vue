<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAnimationImages } from '../composables/useAnimationImages';
import { useKenoLetters } from '../animations/useKenoLetters';
import { useBalls } from '../animations/useBalls';
import { useHeader } from '../statics/useHeader';
import { useProgressLine } from '../animations/useProgressLine';

const canvas = ref<HTMLCanvasElement | null>(null);
const context = ref<CanvasRenderingContext2D | null>(null);

const { loadImages } = useAnimationImages();
const { drawKenoLetters, animateKenoLetters } = useKenoLetters();
const { createBalls, drawBalls, animateBalls } = useBalls();
const { drawBackgroundHeader, drawHeaderText } = useHeader();
const { drawProgressLine, animateProgressLine } = useProgressLine();

const draw = (): void => {
  const ctx = context.value;
  const cvs = canvas.value;

  if (!ctx || !cvs) return;

  ctx.clearRect(0, 0, cvs.width, cvs.height);

  drawBackgroundHeader(cvs, ctx);
  drawHeaderText(ctx);
  drawKenoLetters(ctx);
  drawBalls(context);
  drawProgressLine(cvs, ctx);
};

onMounted(async (): Promise<void> => {
  if (!canvas.value) return;
  context.value = canvas.value.getContext('2d');
  if (!context.value) return;

  await loadImages();

  createBalls(canvas);
  animateBalls(draw);

  animateKenoLetters(draw);

  animateProgressLine(canvas, draw);

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
  width: 910px;
  height: 501px;
  cursor: inherit;
}
</style>
