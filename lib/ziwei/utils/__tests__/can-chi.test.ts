import { describe, it, expect } from 'vitest';
import {
  getYearCanChi,
  getMonthCanChi,
  getDayCanChi,
  getHourCanChi,
  getFourPillars,
} from '../can-chi';
import { jdFromDate } from '../ho-ngoc-duc-lunar';

describe('can-chi', () => {
  describe('getYearCanChi', () => {
    it('calculates 1985 as Ất Sửu', () => {
      const result = getYearCanChi(1985);
      expect(result.stem).toBe('at');
      expect(result.branch).toBe('suu');
    });

    it('calculates 2007 as Đinh Hợi', () => {
      const result = getYearCanChi(2007);
      expect(result.stem).toBe('dinh');
      expect(result.branch).toBe('hoi');
    });

    it('calculates 2024 as Giáp Thìn', () => {
      const result = getYearCanChi(2024);
      expect(result.stem).toBe('giap');
      expect(result.branch).toBe('thin');
    });
  });

  describe('getMonthCanChi', () => {
    it('calculates month 3 of 2004 as Mậu Thìn', () => {
      // Giáp Thân 2004, tháng 3 âm lịch = Thìn
      const result = getMonthCanChi(2004, 3);
      expect(result.stem).toBe('mau');
      expect(result.branch).toBe('thin');
    });

    it('maps month 11 to Tý', () => {
      const result = getMonthCanChi(2024, 11);
      expect(result.branch).toBe('ty');
    });

    it('maps month 12 to Sửu', () => {
      const result = getMonthCanChi(2024, 12);
      expect(result.branch).toBe('suu');
    });

    it('maps month 1 to Dần', () => {
      const result = getMonthCanChi(2024, 1);
      expect(result.branch).toBe('dan');
    });
  });

  describe('getDayCanChi', () => {
    it('calculates 2024-02-10 as Giáp Thìn', () => {
      const jd = jdFromDate(10, 2, 2024);
      const result = getDayCanChi(jd);
      expect(result.stem).toBe('giap');
      expect(result.branch).toBe('thin');
    });
  });

  describe('getHourCanChi', () => {
    it('calculates Giáp Tý at 23:00 on Giáp day', () => {
      const result = getHourCanChi('giap', 23);
      expect(result.stem).toBe('giap');
      expect(result.branch).toBe('ty');
    });

    it('calculates Giáp Tý at 00:00 on Giáp day', () => {
      const result = getHourCanChi('giap', 0);
      expect(result.stem).toBe('giap');
      expect(result.branch).toBe('ty');
    });

    it('calculates Bính Tý at 23:00 on Ất day', () => {
      const result = getHourCanChi('at', 23);
      expect(result.stem).toBe('binh');
      expect(result.branch).toBe('ty');
    });

    it('calculates Ngọ at 12:00', () => {
      const result = getHourCanChi('giap', 12);
      expect(result.branch).toBe('ngo');
    });
  });

  describe('getFourPillars', () => {
    it('returns all four pillars', () => {
      const result = getFourPillars(2024, 1, 2460343, 10);
      expect(result.year).toBeDefined();
      expect(result.month).toBeDefined();
      expect(result.day).toBeDefined();
      expect(result.hour).toBeDefined();
    });
  });
});
