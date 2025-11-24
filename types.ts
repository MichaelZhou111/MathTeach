export enum MathOperation {
  ADD = '+',
  SUBTRACT = '-',
  MULTIPLY = '×',
  DIVIDE = '÷'
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface MathProblem {
  id: string;
  num1: number;
  num2: number;
  operation: MathOperation;
  answer: number;
  options: number[]; // Multiple choice options
}

export interface GameState {
  score: number;
  streak: number;
  level: number;
  stars: number;
}

export type VisualTheme = 'city' | 'track' | 'garage';