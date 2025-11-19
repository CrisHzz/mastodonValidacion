/**
 * String Helper Utilities
 * Funciones auxiliares para manejo de strings
 */

export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncate = (str: string, maxLength: number): string => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
};

export const slugify = (str: string): string => {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const countWords = (str: string): number => {
  if (!str) return 0;
  return str.trim().split(/\s+/).filter(Boolean).length;
};

export const reverseString = (str: string): string => {
  if (!str) return '';
  return str.split('').reverse().join('');
};

export const isPalindrome = (str: string): boolean => {
  if (!str) return false;
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
};

export const camelToSnake = (str: string): string => {
  if (!str) return '';
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

export const snakeToCamel = (str: string): string => {
  if (!str) return '';
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

export const escapeHtml = (str: string): string => {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

export const unescapeHtml = (str: string): string => {
  if (!str) return '';
  const div = document.createElement('div');
  div.innerHTML = str;
  return div.textContent || '';
};

