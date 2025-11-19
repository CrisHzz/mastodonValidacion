/**
 * Number Helper Utilities
 * Funciones auxiliares para manejo de números
 */

export const clamp = (num: number, min: number, max: number): number => {
  return Math.min(Math.max(num, min), max);
};

export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const round = (num: number, decimals: number = 0): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
};

export const percentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

export const average = (numbers: number[]): number => {
  if (!numbers || numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
};

export const sum = (numbers: number[]): number => {
  if (!numbers || numbers.length === 0) return 0;
  return numbers.reduce((total, num) => total + num, 0);
};

export const median = (numbers: number[]): number => {
  if (!numbers || numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 
    ? (sorted[mid - 1] + sorted[mid]) / 2 
    : sorted[mid];
};

export const isEven = (num: number): boolean => {
  return num % 2 === 0;
};

export const isOdd = (num: number): boolean => {
  return num % 2 !== 0;
};

export const isPrime = (num: number): boolean => {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
};

