import { Ref } from 'vue';
import { useImages } from '../composables/useImages';

export function useCards() {
  const { images } = useImages();

  const cardsCount = 80;
  const cardWidth = 108;
  const cardHeight = 86;
  const cardsPerRow = 10;
  
  // Отступы всего блока сверху и слева
  const offsetX = 52;
  const offsetY = 182;

  const drawCards = (context: Ref<CanvasRenderingContext2D | null>) => {
    const ctx = context.value!;
    
    ctx.save();

    for (let i = 0; i < cardsCount; i++) {
      const x = (i % cardsPerRow) * cardWidth + offsetX;
      const y = Math.floor(i / cardsPerRow) * cardHeight + offsetY;

      // Фон карточки
      ctx.drawImage(images['cardImage'], x, y, cardWidth, cardHeight);

      // Номера внутри карточек
      ctx.fillStyle = '#fff';
      ctx.font = '45px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      ctx.save();
      ctx.translate(x + cardWidth / 2, y + cardHeight / 2 + 5); // Перемещаем точку начала текста в центр карточки
      ctx.scale(0.84, 1.0); // Сжимаем по горизонтали до 84% и растягиваем по вертикали до 100%
      ctx.fillText((i + 1).toString(), 0, 0);
      ctx.restore();
    }

    ctx.restore();
  };
  
  return {
    drawCards,
  }
}
