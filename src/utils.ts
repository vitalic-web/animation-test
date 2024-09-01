const generateUniqueRandomNumbers = (count: number, max: number): number[] => {
  const numbers = new Set<number>();
  while (numbers.size < count) {
    const randomNum = Math.floor(Math.random() * max) + 1;
    numbers.add(randomNum);
  }
  return Array.from(numbers);
};


const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toString().padStart(2, '0')} :${seconds.toString().padStart(2, '0')}`;
};

export {
  generateUniqueRandomNumbers,
  formatTime,
}