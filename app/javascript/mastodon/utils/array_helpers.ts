/**
 * Array Helper Utilities
 * Funciones auxiliares para manejo de arrays
 */

export const chunk = <T>(array: T[], size: number): T[][] => {
  if (!array || size <= 0) return [];
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export const unique = <T>(array: T[]): T[] => {
  if (!array) return [];
  return Array.from(new Set(array));
};

export const shuffle = <T>(array: T[]): T[] => {
  if (!array) return [];
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  if (!array) return {};
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
};

export const sortBy = <T>(array: T[], key: keyof T): T[] => {
  if (!array) return [];
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (aVal < bVal) return -1;
    if (aVal > bVal) return 1;
    return 0;
  });
};

export const intersection = <T>(arr1: T[], arr2: T[]): T[] => {
  if (!arr1 || !arr2) return [];
  return arr1.filter(item => arr2.includes(item));
};

export const difference = <T>(arr1: T[], arr2: T[]): T[] => {
  if (!arr1 || !arr2) return arr1 || [];
  return arr1.filter(item => !arr2.includes(item));
};

export const flatten = <T>(array: (T | T[])[]): T[] => {
  if (!array) return [];
  return array.reduce<T[]>((acc, val) => 
    Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), []
  );
};

