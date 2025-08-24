export default class Thresholds {
  private readonly major: number;
  private readonly severe: number;

  constructor(major?: number, severe?: number) {
    if (major === undefined) {
      major = -1;
    }
    if (severe === undefined) {
      severe = -1;
    }
    this.major = major;
    this.severe = severe;
  }

  hasMajor(): boolean {
    return this.major >= 0;
  }

  hasSevere(): boolean {
    return this.severe >= 0;
  }

  getMajor(): number {
    return this.major;
  }

  getSevere(): number {
    return this.severe;
  }

  toString(): string {
    let val = "";
    if (this.hasMajor()) {
      val = val + this.major;
    } else {
      val = val + "None";
    }
    val = val + "/";
    if (this.hasSevere()) {
      val = val + this.severe;
    } else {
      val = val + "None";
    }
    return val;
  }
}
