import { IImages } from '../types';
import KImage from '../assets/K.png';
import EImage from '../assets/E.png';
import NImage from '../assets/N.png';
import OImage from '../assets/O.png';
import FourMinImage from '../assets/4min.png';
import BackgroundHeader from '../assets/header.png';
import BallImage from '../assets/ball.png';
import BackgroundMain from '../assets/bg-green.jpg';
import CardImage from '../assets/zone.png';
import TabImage from '../assets/tab.png';
import TabPressed from '../assets/tab-pressed.png';
import TabHovered from '../assets/tab-hovered.png';

export function useImages() {
  const images: IImages = {
    'K': new Image(),
    'E': new Image(),
    'N': new Image(),
    'O': new Image(),
    '4 min': new Image(),
    'backgroundHeader': new Image(),
    'ball': new Image(),
    'backgroundMain': new Image(),
    'card': new Image(),
    'tab': new Image(),
    'tabPressed': new Image(),
    'tabHovered': new Image(),
  };

  images['K'].src = KImage;
  images['E'].src = EImage;
  images['N'].src = NImage;
  images['O'].src = OImage;
  images['4 min'].src = FourMinImage;
  images['backgroundHeader'].src = BackgroundHeader;
  images['ball'].src = BallImage;
  images['backgroundMain'].src = BackgroundMain;
  images['card'].src = CardImage;
  images['tab'].src = TabImage;
  images['tabPressed'].src = TabPressed;
  images['tabHovered'].src = TabHovered;

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

  return {
    images,
    loadImages,
  };
}
