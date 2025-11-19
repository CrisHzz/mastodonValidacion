import { describe, it, expect } from 'vitest';
import { formatDate, formatTime, addDays, isToday, daysBetween } from '../utils/date_helpers';

describe('Date Helpers', () => {
  describe('formatDate', () => {
    it('formats date', () => {
      const date = new Date('2024-01-01');
      expect(formatDate(date)).toBeTruthy();
    });
  });

  describe('formatTime', () => {
    it('formats time', () => {
      const date = new Date();
      expect(formatTime(date)).toBeTruthy();
    });
  });

  describe('addDays', () => {
    it('adds days to date', () => {
      const date = new Date('2024-01-01');
      const result = addDays(date, 5);
      expect(result.getDate()).toBeGreaterThan(date.getDate());
    });
  });

  describe('isToday', () => {
    it('checks if date is today', () => {
      const today = new Date();
      expect(isToday(today)).toBe(true);
    });
  });

  describe('daysBetween', () => {
    it('calculates days between dates', () => {
      const date1 = new Date('2024-01-01');
      const date2 = new Date('2024-01-10');
      expect(daysBetween(date1, date2)).toBe(9);
    });
  });
});

