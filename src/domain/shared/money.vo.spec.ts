import { Money } from './money.vo';

describe('Money', () => {
  describe('of', () => {
    it('should create money from a valid string', () => {
      const money = Money.of('100.50');

      expect(money.toString()).toBe('100.5');
    });

    it('should throw when value is negative', () => {
      expect(() => Money.of('-10')).toThrow('Money cannot be negative');
    });
  });

  describe('add', () => {
    it('should add two money values', () => {
      const result = Money.of('100').add(Money.of('50'));

      expect(result.toString()).toBe('150');
    });
  });

  describe('subtract', () => {
    it('should subtract one money value from another', () => {
      const result = Money.of('100').subtract(Money.of('30'));

      expect(result.toString()).toBe('70');
    });
  });

  describe('isGreaterThan', () => {
    it('should return true when value is greater', () => {
      expect(Money.of('100').isGreaterThan(Money.of('50'))).toBe(true);
    });

    it('should return false when value is equal', () => {
      expect(Money.of('100').isGreaterThan(Money.of('100'))).toBe(false);
    });

    it('should return false when value is less', () => {
      expect(Money.of('50').isGreaterThan(Money.of('100'))).toBe(false);
    });
  });

  describe('isZero', () => {
    it('should return true for zero', () => {
      expect(Money.of('0').isZero()).toBe(true);
    });

    it('should return false for non-zero values', () => {
      expect(Money.of('1').isZero()).toBe(false);
    });
  });

  describe('isPositive', () => {
    it('should return true for positive values', () => {
      expect(Money.of('1').isPositive()).toBe(true);
    });

    it('should return false for zero', () => {
      expect(Money.of('0').isPositive()).toBe(false);
    });
  });

  describe('isNegative', () => {
    it('should return false for non-negative values created via of', () => {
      expect(Money.of('0').isNegative()).toBe(false);

      expect(Money.of('10').isNegative()).toBe(false);
    });

    it('should return true after subtraction results in negative value', () => {
      const result = Money.of('10').subtract(Money.of('20'));

      expect(result.isNegative()).toBe(true);
    });
  });

  describe('toString', () => {
    it('should return the numeric value as string', () => {
      expect(Money.of('42').toString()).toBe('42');
    });
  });
});
