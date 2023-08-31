export const randomNumber = (min: number, max: number) => {
  return Math.round(Math.random() * (max - min) + min);
};

export const randomGrade = () => {
  const arr = ["A", "B+", "B", "C+", "C", "D+", "D"];

  return arr[randomNumber(0, arr.length - 1)];
};
