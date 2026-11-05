import { describe, it, expect } from 'vitest';
import {
  convertSolarToLunarVN,
  convertLunarToSolarVN,
  jdFromDate,
  jdToDate,
} from '../ho-ngoc-duc-lunar';

describe('ho-ngoc-duc-lunar', () => {
  describe('jdFromDate / jdToDate', () => {
    it('round-trips known dates', () => {
      const dates = [
        { day: 1, month: 1, year: 2000 },
        { day: 29, month: 2, year: 2000 },
        { day: 15, month: 8, year: 2024 },
        { day: 1, month: 1, year: 1900 },
      ];

      for (const date of dates) {
        const jd = jdFromDate(date.day, date.month, date.year);
        expect(jdToDate(jd)).toEqual(date);
      }
    });
  });

  describe('convertSolarToLunarVN', () => {
    it('converts Tết 1985 correctly', () => {
      // Tết Âm lịch 1985 (Ất Sửu) là 21/01/1985 (xem docs/DECISIONS.md)
      const result = convertSolarToLunarVN(21, 1, 1985);
      expect(result.day).toBe(1);
      expect(result.month).toBe(1);
      expect(result.year).toBe(1985);
      expect(result.isLeapMonth).toBe(false);
    });

    it('detects leap month 2 in 1985', () => {
      // 21/03/1985 thuộc tháng 2 nhuận
      const result = convertSolarToLunarVN(21, 3, 1985);
      expect(result.month).toBe(2);
      expect(result.isLeapMonth).toBe(true);
    });

    it('converts Tết 2007 correctly', () => {
      // Tết Âm lịch 2007 (Đinh Hợi) là 17/02/2007 (xem docs/DECISIONS.md)
      const result = convertSolarToLunarVN(17, 2, 2007);
      expect(result.day).toBe(1);
      expect(result.month).toBe(1);
      expect(result.year).toBe(2007);
      expect(result.isLeapMonth).toBe(false);
    });

    it('converts leap month 2004 correctly', () => {
      // 21/03/2004 là tháng 2 nhuận Giáp Thân
      const result = convertSolarToLunarVN(21, 3, 2004);
      expect(result.month).toBe(2);
      expect(result.isLeapMonth).toBe(true);
    });

    it('converts a date in 2033', () => {
      // 2033 là năm có tháng nhuận 11 (trường hợp đặc biệt)
      const result = convertSolarToLunarVN(1, 2, 2033);
      expect(result.year).toBeGreaterThan(0);
      expect(result.month).toBeGreaterThanOrEqual(1);
      expect(result.month).toBeLessThanOrEqual(12);
      expect(result.day).toBeGreaterThanOrEqual(1);
      expect(result.day).toBeLessThanOrEqual(30);
    });
  });

  describe('convertLunarToSolarVN', () => {
    it('round-trips Tết 1985', () => {
      const solar = convertLunarToSolarVN(1, 1, 1985, false);
      expect(solar).toEqual({ day: 21, month: 1, year: 1985 });
    });

    it('round-trips leap month 2 in 1985', () => {
      // Ngày 1 tháng 2 nhuận 1985 = 21/03/1985
      const firstDay = convertLunarToSolarVN(1, 2, 1985, true);
      expect(firstDay).toEqual({ day: 21, month: 3, year: 1985 });

      // Ngày 21 tháng 2 nhuận 1985 = 10/04/1985
      const twentyFirstDay = convertLunarToSolarVN(21, 2, 1985, true);
      expect(twentyFirstDay).toEqual({ day: 10, month: 4, year: 1985 });
    });

    it('round-trips Tết 2007', () => {
      const solar = convertLunarToSolarVN(1, 1, 2007, false);
      expect(solar).toEqual({ day: 17, month: 2, year: 2007 });
    });

    it('round-trips leap month 2 in 2004', () => {
      const solar = convertLunarToSolarVN(1, 2, 2004, true);
      expect(solar).toEqual({ day: 21, month: 3, year: 2004 });
    });
  });
});
