import { ref } from 'vue';
import { useImages } from '../composables/useImages';

export function useTabs() {
  const { images } = useImages();
  const texts = ['ИГРА', 'ВИДЕО', 'ИСТОРИЯ', 'СТАТИСТ'];
  const hoverIndex = ref<number | null>(null);
  const selectedIndex = ref<number | null>(null); // Состояние для хранения выбранного таба

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

      // Используем другое изображение, если индекс совпадает с hoverIndex или selectedIndex
      let img = images['tab'];
      if (selectedIndex.value === index) {
        img = images['tabPressed']; // Изображение для выбранного таба
      } else if (hoverIndex.value === index) {
        img = images['tabHovered']; // Изображение для таба при наведении
      }
      ctx.drawImage(img, -tabHeight / 2, -tabWidth / 2, tabHeight, tabWidth);

      ctx.restore();

      // Поворачиваем текст на 90 градусов
      ctx.save();
      ctx.translate(x + tabWidth / 2, y + tabHeight / 2);
      ctx.rotate(-Math.PI / 2);

      // Добавляем текст поверх изображения
      ctx.font = '26px Arial';
      ctx.fillStyle = selectedIndex.value === index ? '#fff' : '#000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.scale(1, 1.2); // вытягивание текста по высоте
      ctx.fillText(text, 0, 0);

      ctx.restore();
    });
  };

  const handleMouseMove = (cvs: HTMLCanvasElement, event: MouseEvent) => {
    const tabWidth = 80;
    const tabHeight = 166;
    const verticalGap = 7;
    const paddingTop = 186;
    const paddingLeft = 224;
  
    const rect = cvs.getBoundingClientRect();
    const scaleX = cvs.width / rect.width;    // масштаб по ширине
    const scaleY = cvs.height / rect.height;  // масштаб по высоте
    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;
  
    let foundIndex: number | null = null;
  
    texts.forEach((_, index) => {
      const x = paddingLeft + (cvs.width - tabWidth) / 2;
      const y = paddingTop + index * (tabHeight + verticalGap);
      
      if (
        mouseX >= x &&
        mouseX <= x + tabWidth &&
        mouseY >= y &&
        mouseY <= y + tabHeight
      ) {
        foundIndex = index;
      }
    });
  
    if (hoverIndex.value !== foundIndex) {
      hoverIndex.value = foundIndex;
      drawTabs(cvs, cvs.getContext('2d')!);
  
      // Смена курсора на pointer при ховере на таб
      if (foundIndex !== null) {
        cvs.style.cursor = 'pointer';
      } else {
        cvs.style.cursor = 'default';
      }
    }
  };  

  const handleClick = (cvs: HTMLCanvasElement, event: MouseEvent) => {
    const tabWidth = 80;
    const tabHeight = 166;
    const verticalGap = 7;
    const paddingTop = 186;
    const paddingLeft = 224;
  
    const rect = cvs.getBoundingClientRect();
    const scaleX = cvs.width / rect.width;
    const scaleY = cvs.height / rect.height;
    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;
  
    texts.forEach((_, index) => {
      const x = paddingLeft + (cvs.width - tabWidth) / 2;
      const y = paddingTop + index * (tabHeight + verticalGap);
      
      if (
        mouseX >= x &&
        mouseX <= x + tabWidth &&
        mouseY >= y &&
        mouseY <= y + tabHeight
      ) {
        selectedIndex.value = index;
        drawTabs(cvs, cvs.getContext('2d')!);
      }
    });
  };

  return {
    drawTabs,
    handleMouseMove,
    handleClick,
  };
}
