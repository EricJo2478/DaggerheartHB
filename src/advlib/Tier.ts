
export default class Tier {

  static tierFromNumber(value: number): Tier {
    return TIERS[value-1];
  }

  private readonly value: number;

  constructor(value: number) {
    this.value = value;
  }

  toString(): string {
    return "Tier " + this.value;
  }
  
  toNumber(): number {
    return this.value;
  }
}

const TIERS: Tier[] = [new Tier(1), new Tier(2), new Tier(3), new Tier(4)];
