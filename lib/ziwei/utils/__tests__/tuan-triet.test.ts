import { describe, it, expect } from 'vitest';
import { calculateTrietBranches, calculateTuanBranches, calculateTuanTriet } from '../tuan-triet';

describe('tuan-triet', () => {
  describe('calculateTrietBranches', () => {
    it('maps Giáp/Kỷ to Thân-Dậu', () => {
      expect(calculateTrietBranches('giap', 'ty')).toEqual(['than', 'dau']);
      expect(calculateTrietBranches('ky', 'suu')).toEqual(['than', 'dau']);
    });

    it('maps Ất/Canh to Ngọ-Mùi', () => {
      expect(calculateTrietBranches('at', 'suu')).toEqual(['ngo', 'mui']);
      expect(calculateTrietBranches('canh', 'ngo')).toEqual(['ngo', 'mui']);
    });

    it('maps Bính/Tân to Thìn-Tỵ', () => {
      expect(calculateTrietBranches('binh', 'dan')).toEqual(['thin', 'ti']);
      expect(calculateTrietBranches('tan', 'mao')).toEqual(['thin', 'ti']);
    });

    it('maps Đinh/Nhâm to Dần-Mão', () => {
      expect(calculateTrietBranches('dinh', 'mao')).toEqual(['dan', 'mao']);
      expect(calculateTrietBranches('nham', 'thin')).toEqual(['dan', 'mao']);
    });

    it('maps Mậu/Quý to Tý-Sửu', () => {
      expect(calculateTrietBranches('mau', 'thin')).toEqual(['ty', 'suu']);
      expect(calculateTrietBranches('quy', 'ti')).toEqual(['ty', 'suu']);
    });
  });

  describe('calculateTuanBranches', () => {
    it('maps Giáp Tý group to Tuất-Hợi', () => {
      expect(calculateTuanBranches('giap', 'ty')).toEqual(['tuat', 'hoi']);
      expect(calculateTuanBranches('at', 'suu')).toEqual(['tuat', 'hoi']);
    });

    it('maps the six Giáp groups correctly', () => {
      expect(calculateTuanBranches('giap', 'tuat')).toEqual(['than', 'dau']);
      expect(calculateTuanBranches('giap', 'than')).toEqual(['ngo', 'mui']);
      expect(calculateTuanBranches('giap', 'ngo')).toEqual(['thin', 'ti']);
      expect(calculateTuanBranches('giap', 'thin')).toEqual(['dan', 'mao']);
      expect(calculateTuanBranches('giap', 'dan')).toEqual(['ty', 'suu']);
    });
  });

  describe('calculateTuanTriet', () => {
    it('returns both Tuần and Triệt', () => {
      expect(calculateTuanTriet('giap', 'ty')).toEqual({
        tuan: ['tuat', 'hoi'],
        triet: ['than', 'dau'],
      });
    });
  });
});
