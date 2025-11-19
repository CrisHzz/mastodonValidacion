/**
 * Validation Helper Utilities
 */

export const isEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isEmpty = (value: string | null | undefined): boolean => {
  return !value || value.trim().length === 0;
};

export const isNumeric = (value: string): boolean => {
  return !isNaN(Number(value));
};

export const hasMinLength = (value: string, min: number): boolean => {
  return value.length >= min;
};

