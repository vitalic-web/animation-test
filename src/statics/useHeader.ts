import { useImages } from '../composables/useImages';

export function useHeader() {
  const { images } = useImages();
  const bgImage = images['backgroundHeader'];

  const drawBackgroundHeader = (cvs: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    if (bgImage.complete) {
      const bgWidth = cvs.width; // Ширина на весь canvas
      ctx.drawImage(bgImage, 0, 0, bgWidth, 190);
    }
  };

  const drawHeaderText = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = 'orange';
    ctx.font = '30px Arial';
    ctx.fillText('#799813', 56, 100);
  };

  return {
    drawBackgroundHeader,
    drawHeaderText,
  }
}