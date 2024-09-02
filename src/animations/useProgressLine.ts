import { Ref } from 'vue';
import gsap from 'gsap';
import { formatTime } from '../utils';

export function useProgressLine() {
  let progressWidth = 0; // Начальная ширина полоски
  let initialTime = 60; // Начальное время в секундах
  let remainingTime = initialTime; // Оставшееся время в секундах

  const drawTextWithGradient = (
    ctx: CanvasRenderingContext2D, 
    text: string, 
    startX: number, 
    y: number, 
    progressWidth: number
  ) => {
    let currentX = startX;
    const chars = text.split('');

    for (const char of chars) {
      const charWidth = ctx.measureText(char).width;

      if (currentX + charWidth <= progressWidth) {
        ctx.fillStyle = '#000';
      } else if (currentX <= progressWidth) {
        const gradient = ctx.createLinearGradient(currentX, 0, currentX + charWidth, 0);
        gradient.addColorStop(0, '#000');
        gradient.addColorStop((progressWidth - currentX) / charWidth, '#000');
        gradient.addColorStop((progressWidth - currentX) / charWidth, '#fff');
        gradient.addColorStop(1, '#fff');
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = '#fff';
      }

      ctx.fillText(char, currentX + charWidth / 2, y);
      currentX += charWidth;
    }
  };

  const drawProgressLine = (cvs: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    ctx.save(); // чтобы данные стили текста не перезаписывали текст в хэдере
    
    // Отрисовываем черный фон прогресс-бара
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 118, cvs.width, 29);
    
    // Отрисовываем зеленую полоску на черном фоне
    ctx.fillStyle = '#02a651';
    ctx.fillRect(0, 121, progressWidth, 23);

    // Позиция текста
    const text = 'ДEЛАЙТЕ ВАШИ СТАВКИ';
    const textX = cvs.width / 2;
    const textY = 140;
    
    // Определяем начальную позицию текста
    ctx.font = '20px Arial';
    const textWidth = ctx.measureText(text).width;
    const textStartX = textX - textWidth / 2;

    drawTextWithGradient(ctx, text, textStartX, textY, progressWidth);

    const timeText = formatTime(remainingTime);
    const timeWidth = ctx.measureText(timeText).width;
    const timeStartX = cvs.width - 60 - timeWidth;

    drawTextWithGradient(ctx, timeText, timeStartX, textY, progressWidth);
    
    ctx.restore(); // чтобы данные стили текста не перезаписывали текст в хэдере
  };

  const animateProgressLine = (canvas: Ref<HTMLCanvasElement | null>, draw: () => void) => {
    gsap.to({ progress: 0 }, {
      duration: initialTime,
      progress: 1,
      onUpdate: function () {
        const cvs = canvas.value;
        if (cvs) {
          progressWidth = cvs.width * (this.targets()[0].progress as number);
          remainingTime = Math.ceil(initialTime - initialTime * (this.targets()[0].progress as number));
          draw();
        }
      },
      onComplete: () => {
        remainingTime = 0;
        draw();
      },
    });
  }

  return {
    drawProgressLine,
    animateProgressLine,
  }
}
