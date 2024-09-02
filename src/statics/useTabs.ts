import { useImages } from '../composables/useImages';

export function useTabs() {
  const { images } = useImages();
  const texts = ['ИГРА', 'ВИДЕО', 'ИСТОРИЯ', 'СТАТИСТ'];

  const drawTabs = (cvs: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const tabWidth = 80;
    const tabHeight = 166;
    const verticalGap = 7;
    const paddingTop = 186;
    const paddingLeft = 224;

    texts.forEach((text, index) => {
      const x = paddingLeft + (cvs.width - tabWidth) / 2;
      const y = paddingTop + index * (tabHeight + verticalGap);

      ctx.save();

      // Перемещаем контекст к месту, где будет нарисован текущий блок
      ctx.translate(x + tabWidth / 2, y + tabHeight / 2);

      // Поворачиваем изображение на 90 градусов
      ctx.rotate(-Math.PI / 2);

      ctx.drawImage(images['tab'], -tabHeight / 2, -tabWidth / 2, tabHeight, tabWidth);

      ctx.restore();

      // Поворачиваем текст на 90 градусов
      ctx.save();
      ctx.translate(x + tabWidth / 2, y + tabHeight / 2);
      ctx.rotate(-Math.PI / 2);

      // Добавляем текст поверх изображения
      ctx.font = '26px Arial';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.scale(1, 1.2); // вытягивание текста по высоте
      ctx.fillText(text, 0, 0);

      ctx.restore();
    });
  };

  return {
    drawTabs,
  }
}
