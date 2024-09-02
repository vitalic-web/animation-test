import { Ref } from 'vue';
import gsap from 'gsap';
import { IBall } from '../types';
import { generateUniqueRandomNumbers } from '../utils';
import { useImages } from '../composables/useImages';

export function useBalls() {
  const { images } = useImages();
  const balls: IBall[] = [];

  const createBalls = (canvas: Ref<HTMLCanvasElement | null>) => {
    const randomNumbers = generateUniqueRandomNumbers(20, 80);
    const startX = canvas.value!.width - 50;
    const startY = 22;
    const ballSize = 80;
  
    balls.length = 0;
  
    randomNumbers.forEach((number, index) => {
      balls.push({
        x: startX + index * (ballSize + 3), // Отступ между шариками
        y: startY,
        size: ballSize,
        number,
        rotation: 0, // Изначальное вращение
      });
    });
  };

  const drawBalls = (context: Ref<CanvasRenderingContext2D | null>) => {
    const ctx = context.value!;
    balls.forEach(ball => {
      ctx.save();
  
      // Перемещение к центру шарика для вращения
      ctx.translate(ball.x + ball.size / 2, ball.y + ball.size / 2);
  
      // Применение вращения против часовой стрелки
      ctx.rotate((ball.rotation * Math.PI) / 180);
  
      // Отрисовка шарика с учетом вращения
      ctx.drawImage(images['ball'], -ball.size / 2, -ball.size / 2, ball.size, ball.size);
  
      // Отрисовка текста поверх шарика
      ctx.fillStyle = 'black';
      ctx.font = 'bold 30px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(ball.number.toString(), 0, 0);
  
      ctx.restore();
    });
  };

  const animateBalls = (draw: () => void) => {
    const timeline = gsap.timeline();

    balls.forEach((ball) => {
      timeline.to(ball, {
        duration: 1.2,
        x: '-=1620', // Расположение первого шарика
        rotation: -360,
        ease: "power2.inOut",
        onUpdate: draw,
      });
    });
  };

  return {
    createBalls,
    drawBalls,
    animateBalls,
  }
}