export type IImages = Record<string, HTMLImageElement>;

export interface IKenoLetters {
  x: number;
  y: number;
  size: number;
  img: HTMLImageElement;
  rotationY: number;
}

export interface IBall {
  x: number;
  y: number;
  size: number;
  number: number;
  rotation: number;
}