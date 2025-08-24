import type { DamageType, Die, Distance } from "./Types";

export default class Attack {
  private readonly modifier: number;
  private readonly name: string;
  private readonly range: Distance;
  private readonly damageType: DamageType;
  private readonly dice: number;
  private readonly die: Die;
  private readonly damage: number;

  constructor(
    atk: number,
    attack: string,
    rng: Distance,
    dice: number,
    die: Die,
    damage: number,
    damageType: DamageType
  ) {
    this.modifier = atk;
    this.name = attack;
    this.range = rng;
    this.dice = dice;
    this.die = die;
    this.damage = damage;
    this.damageType = damageType;
  }

  getModifier(): number {
    return this.modifier;
  }

  getModifierAsString(): string {
    if (this.modifier < 0) {
      return this.modifier.toString();
    } else {
      return "+" + this.modifier;
    }
  }

  getName(): string {
    return this.name;
  }

  getRange(): Distance {
    return this.range;
  }

  getDamage(): number {
    return 0;
  }

  getDamageModifier(): number {
    return this.damage;
  }

  getDamageModifierAsString(): string {
    if (this.damage < 0) {
      return this.damage.toString();
    } else {
      return "+" + this.damage;
    }
  }

  getDie(): Die {
    return this.die;
  }

  getDieCount(): number {
    return this.dice;
  }

  getDamageType(): DamageType {
    return this.damageType;
  }

  getDamageString(withType?: boolean): string {
    let str = "";
    if (this.die > 0) {
      str = str + this.dice + "d" + this.die;
    }
    str = str + this.getDamageModifierAsString();
    if (withType) {
      str = str + " " + this.damageType;
    }
    return str;
  }

  toString(): string {
    return (
      "ATK: " +
      this.getModifierAsString() +
      " | " +
      this.name +
      ": " +
      this.range +
      " | " +
      this.getDamageString()
    );
  }
}
