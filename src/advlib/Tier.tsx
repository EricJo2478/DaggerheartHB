import Thresholds from "./Thresholds";
import type { Category, Die } from "./Types";

export default class Tier {
  static tierFromNumber(value: number): Tier {
    return TIERS[value - 1];
  }

  static categoryToDice(category: Category): Die[] {
    if (category === "Bruiser" || category === "Solo") {
      return [10, 12];
    }
    if (
      category === "Horde" ||
      category === "Leader" ||
      category === "Ranged"
    ) {
      return [8, 10];
    }
    if (category === "Skulk" || category === "Standard") {
      return [6, 8];
    }
    if (category === "Social" || category === "Support") {
      return [4, 6];
    }
    return [];
  }

  private readonly value: number;
  private readonly damageMin: number;
  private readonly damageMax: number;
  private readonly minDie: Die;
  private readonly difficulty: number;
  private readonly major: number;
  private readonly severe: number;

  constructor(
    value: number,
    minDie: Die,
    damageMin: number,
    damageMax: number,
    difficulty: number,
    major: number,
    severe: number
  ) {
    this.value = value;
    this.minDie = minDie;
    this.damageMin = damageMin;
    this.damageMax = damageMax;
    this.difficulty = difficulty;
    this.major = major;
    this.severe = severe;
  }

  toString(): string {
    return "Tier " + this.value;
  }

  toNumber(): number {
    return this.value;
  }

  getTooltip(key: string, category: Category) {
    if (key === "difficulty") {
      return (
        "Recommended to be around " +
        this.getDifficulty() +
        " at tier " +
        this.toNumber()
      );
    }
    if (key === "thresholds") {
      return (
        "Recommended to be around " +
        this.getThresholds().toString() +
        " at tier " +
        this.toNumber()
      );
    }
    if (key === "attack") {
      return (
        "Recommended to be around " +
        this.getAttack() +
        " at tier " +
        this.toNumber()
      );
    }
    if (key === "damage") {
      return (
        "Recommended to be from " +
        this.getDamageRange(category) +
        " at tier " +
        this.toNumber()
      );
    }
    return "Tier " + this.toNumber() + " " + category + " (" + key + ")";
  }

  getAttack() {
    return this.value;
  }

  getDamageRange(category?: Category) {
    let minDie = this.minDie;
    let maxDie = 12;
    if (category) {
      [minDie, maxDie] = Tier.categoryToDice(category);
    }

    if (category === "Minion") {
      return this.damageMin + " to " + this.damageMax;
    }

    return (
      this.value +
      "d" +
      minDie +
      "+" +
      this.damageMin +
      " to " +
      this.value +
      "d" +
      maxDie +
      "+" +
      this.damageMax
    );
  }

  getDifficulty() {
    return this.difficulty;
  }

  getThresholds() {
    return new Thresholds(this.major, this.severe);
  }
}

const TIERS: Tier[] = [
  new Tier(1, 6, 2, 4, 11, 7, 12),
  new Tier(2, 6, 3, 4, 14, 10, 20),
  new Tier(3, 8, 3, 5, 17, 20, 32),
  new Tier(4, 8, 10, 15, 20, 25, 45),
];
