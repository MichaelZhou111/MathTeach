import { MathOperation, MathProblem, Difficulty } from "../types";

export const generateProblem = (operation: MathOperation, difficulty: Difficulty): MathProblem => {
  let num1 = 0;
  let num2 = 0;
  let answer = 0;

  const getRandomInt = (min: number, max: number) => 
    Math.floor(Math.random() * (max - min + 1)) + min;

  switch (operation) {
    case MathOperation.ADD:
      if (difficulty === 'easy') {
        // Sums up to 10
        num1 = getRandomInt(1, 5);
        num2 = getRandomInt(1, 5);
      } else if (difficulty === 'medium') {
        // Sums up to 20
        num1 = getRandomInt(2, 10);
        num2 = getRandomInt(2, 10);
      } else {
        // Sums up to 50
        num1 = getRandomInt(10, 30);
        num2 = getRandomInt(5, 20);
      }
      answer = num1 + num2;
      break;

    case MathOperation.SUBTRACT:
      if (difficulty === 'easy') {
        // Up to 10
        num1 = getRandomInt(2, 10);
        num2 = getRandomInt(1, num1 - 1);
      } else if (difficulty === 'medium') {
        // Up to 20
        num1 = getRandomInt(5, 20);
        num2 = getRandomInt(2, num1 - 2);
      } else {
        // Up to 50
        num1 = getRandomInt(15, 50);
        num2 = getRandomInt(5, num1 - 5);
      }
      answer = num1 - num2;
      break;

    case MathOperation.MULTIPLY:
      if (difficulty === 'easy') {
        // 1, 2, 5 tables
        const factors = [1, 2, 5];
        num1 = factors[Math.floor(Math.random() * factors.length)];
        num2 = getRandomInt(1, 5);
      } else if (difficulty === 'medium') {
        // 1-5, 10 tables
        const factors = [1, 2, 3, 4, 5, 10];
        num1 = factors[Math.floor(Math.random() * factors.length)];
        num2 = getRandomInt(1, 10);
      } else {
        // 2-9 tables
        num1 = getRandomInt(2, 9);
        num2 = getRandomInt(2, 9);
      }
      answer = num1 * num2;
      break;

    case MathOperation.DIVIDE:
      // Generate based on multiplication logic then swap
      let dNum1, dNum2;
      if (difficulty === 'easy') {
        dNum2 = [2, 5][Math.floor(Math.random() * 2)]; // Divide by 2 or 5
        answer = getRandomInt(1, 5);
      } else if (difficulty === 'medium') {
        dNum2 = getRandomInt(2, 5);
        answer = getRandomInt(1, 10);
      } else {
        dNum2 = getRandomInt(2, 9);
        answer = getRandomInt(2, 9);
      }
      num1 = dNum2 * answer;
      num2 = dNum2;
      break;
  }

  // Generate distinct options
  const options = new Set<number>();
  options.add(answer);
  while (options.size < 3) {
    let range = difficulty === 'easy' ? 3 : (difficulty === 'medium' ? 5 : 10);
    let fake = answer + getRandomInt(-range, range);
    if (fake < 0) fake = 0; // No negative options for 6yo
    if (fake !== answer) options.add(fake);
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    num1,
    num2,
    operation,
    answer,
    options: Array.from(options).sort(() => Math.random() - 0.5),
  };
};