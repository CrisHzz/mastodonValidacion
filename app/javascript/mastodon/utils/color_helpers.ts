/**
 * Color Helper Utilities
 */

export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

export const isDark = (hex: string): boolean => {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness < 128;
};

export const lighten = (hex: string, percent: number): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const factor = 1 + percent / 100;
  const r = Math.min(255, Math.round(rgb.r * factor));
  const g = Math.min(255, Math.round(rgb.g * factor));
  const b = Math.min(255, Math.round(rgb.b * factor));
  
  return rgbToHex(r, g, b);
};

export const darken = (hex: string, percent: number): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const factor = 1 - percent / 100;
  const r = Math.max(0, Math.round(rgb.r * factor));
  const g = Math.max(0, Math.round(rgb.g * factor));
  const b = Math.max(0, Math.round(rgb.b * factor));
  
  return rgbToHex(r, g, b);
};

export const randomColor = (): string => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
};

export const isValidHex = (hex: string): boolean => {
  return /^#?([a-f\d]{6})$/i.test(hex);
};

