import type Feature from "./Feature";

function numberToLongName(num: number): string {
  if (num < 0) {
    return "negative " + numberToLongName(Math.abs(num));
  }

  const units = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];
  const teens = [
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const tens = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  if (num < 10) {
    return units[num];
  } else if (num < 20) {
    return teens[num - 10];
  } else if (num < 100) {
    const tenDigit = Math.floor(num / 10);
    const unitDigit = num % 10;
    return tens[tenDigit] + (unitDigit !== 0 ? "-" + units[unitDigit] : "");
  } else if (num < 1000) {
    const hundredDigit = Math.floor(num / 100);
    const remainder = num % 100;
    return (
      units[hundredDigit] +
      " hundred" +
      (remainder !== 0 ? " " + numberToLongName(remainder) : "")
    );
  }
  // For larger numbers, you would extend this logic to handle thousands, millions, etc.

  return "Number out of handled range";
}

export default class FeatureVariable {
  static universals: string[] = ["abv", "abvp", "name", "namep"];
  private readonly key: string;
  private readonly value: string;
  private readonly isNumber: boolean;

  constructor(name: string, value: string) {
    this.key = name;
    this.value = value;
    this.isNumber = isNaN(Number(value));
  }

  apply(str: string) {
    if (FeatureVariable.universals.includes(this.key)) {
      return str.replaceAll("{{" + this.key + "}}", this.value);
    }
    if (this.isNumber) {
      return str
        .replaceAll("{{X}}", numberToLongName(Number(this.value)))
        .replaceAll("{{#}}", this.value);
    } else {
      return str
        .replaceAll("{{X}}", this.value)
        .replaceAll("{{#}}", this.value);
    }
  }

  exists(feature: Feature) {
    return (
      feature.getId() === this.key ||
      FeatureVariable.universals.includes(this.key)
    );
  }

  get(): string {
    return this.value;
  }

  getKey(): string {
    return this.key;
  }
}
