import gsap from 'gsap';
import { IKenoLetters } from '../types';
import { useAnimationImages } from '../composables/useAnimationImages';

export function useKenoLetters() {
  const { images } = useAnimationImages();

  const kenoLetters: IKenoLetters[] = [
    { x: 15, y: 22, size: 40, img: images['K'], rotationY: 0 },
    { x: 55, y: 22, size: 40, img: images['E'], rotationY: 0 },
    { x: 95, y: 22, size: 40, img: images['N'], rotationY: 0 },
    { x: 135, y: 22, size: 40, img: images['O'], rotationY: 0 },
    { x: 185, y: 18, size: 50, img: images['4 min'], rotationY: 0 },
  ];

  const drawKenoLetters = (ctx: CanvasRenderingContext2D) => {
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
  };

  const animateKenoLetters = (draw: () => void) => {
    gsap.to(kenoLetters, {
      duration: 1.0,
      rotationY: 180,
      repeat: -1,
      ease: "power2.inOut",
      stagger: 0.2,
      onUpdate: draw,
    });
  };

  return {
    drawKenoLetters,
    animateKenoLetters,
  }
}