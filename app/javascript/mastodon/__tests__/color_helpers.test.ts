import { describe, it, expect } from 'vitest';
import {
  hexToRgb,
  rgbToHex,
  isDark,
  lighten,
  darken,
  randomColor,
  isValidHex,
} from '../utils/color_helpers';

describe('Color Helpers', () => {
  describe('hexToRgb', () => {
    it('converts hex to rgb', () => {
      const result = hexToRgb('#ffffff');
      expect(result).toEqual({ r: 255, g: 255, b: 255 });
    });

    it('handles hex without #', () => {
      const result = hexToRgb('000000');
      expect(result).toEqual({ r: 0, g: 0, b: 0 });
    });

    it('returns null for invalid hex', () => {
      expect(hexToRgb('invalid')).toBeNull();
    });

    it('handles red color', () => {
      const result = hexToRgb('#ff0000');
      expect(result).toEqual({ r: 255, g: 0, b: 0 });
    });
  });

  describe('rgbToHex', () => {
    it('converts rgb to hex', () => {
      expect(rgbToHex(255, 255, 255)).toBe('#ffffff');
    });

    it('converts black to hex', () => {
      expect(rgbToHex(0, 0, 0)).toBe('#000000');
    });

    it('converts red to hex', () => {
      expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
    });
  });

  describe('isDark', () => {
    it('detects dark colors', () => {
      expect(isDark('#000000')).toBe(true);
      expect(isDark('#111111')).toBe(true);
    });

    it('detects light colors', () => {
      expect(isDark('#ffffff')).toBe(false);
      expect(isDark('#eeeeee')).toBe(false);
    });

    it('handles invalid hex', () => {
      expect(isDark('invalid')).toBe(false);
    });
  });

  describe('lighten', () => {
    it('lightens a color', () => {
      const result = lighten('#808080', 20);
      expect(result).toBeTruthy();
      expect(result.length).toBe(7);
    });

    it('handles invalid hex', () => {
      expect(lighten('invalid', 20)).toBe('invalid');
    });

    it('lightens dark color', () => {
      const result = lighten('#000000', 50);
      expect(result).not.toBe('#000000');
    });
  });

  describe('darken', () => {
    it('darkens a color', () => {
      const result = darken('#808080', 20);
      expect(result).toBeTruthy();
      expect(result.length).toBe(7);
    });

    it('handles invalid hex', () => {
      expect(darken('invalid', 20)).toBe('invalid');
    });

    it('darkens light color', () => {
      const result = darken('#ffffff', 50);
      expect(result).not.toBe('#ffffff');
    });
  });

  describe('randomColor', () => {
    it('generates random color', () => {
      const color = randomColor();
      expect(color).toMatch(/^#[a-f0-9]{6}$/i);
    });

    it('generates different colors', () => {
      const color1 = randomColor();
      const color2 = randomColor();
      expect(color1).toMatch(/^#[a-f0-9]{6}$/i);
      expect(color2).toMatch(/^#[a-f0-9]{6}$/i);
    });

    it('generates valid hex', () => {
      const color = randomColor();
      expect(isValidHex(color)).toBe(true);
    });
  });

  describe('isValidHex', () => {
    it('validates correct hex', () => {
      expect(isValidHex('#ffffff')).toBe(true);
      expect(isValidHex('ffffff')).toBe(true);
    });

    it('rejects invalid hex', () => {
      expect(isValidHex('invalid')).toBe(false);
      expect(isValidHex('#zzz')).toBe(false);
    });

    it('validates color codes', () => {
      expect(isValidHex('#abc123')).toBe(true);
      expect(isValidHex('#123456')).toBe(true);
    });
  });
});

