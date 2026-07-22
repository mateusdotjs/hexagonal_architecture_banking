import BigNumber from 'bignumber.js';

export class Money {
  constructor(private value: BigNumber) {}

  static of(value: string): Money {
    const amount = BigNumber(value);
    if (amount.isNegative()) {
      throw new Error('Money cannot be negative');
    }

    return new Money(amount);
  }

  add(amount: Money): Money {
    return new Money(this.value.plus(amount.value));
  }

  subtract(amount: Money): Money {
    return new Money(this.value.minus(amount.value));
  }

  isGreaterThan(amount: Money): boolean {
    return this.value.isGreaterThan(amount.value);
  }

  isZero(): boolean {
    return this.value.isZero();
  }

  isPositive(): boolean {
    return this.value.isGreaterThan(BigNumber(0));
  }

  isNegative(): boolean {
    return this.value.isNegative();
  }

  toString(): string {
    return this.value.toString();
  }
}
