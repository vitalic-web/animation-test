import { useImages } from '../composables/useImages';

export function useMain() {
  const { images } = useImages();
  const bgMainImage = images['backgroundMain'];

  const drawBackgroundMain = (cvs: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    if (bgMainImage.complete) {
      const bgMainWidth = cvs.width; // Ширина на весь canvas
      const bgMainHeight = cvs.height; // Высота на весь canvas
      ctx.drawImage(bgMainImage, 0, 0, bgMainWidth, bgMainHeight);
    }
  };

  return {
    drawBackgroundMain,
  }
}