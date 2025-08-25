import type { FeatureVariablePair } from "./Types";

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
  private readonly key: string;
  constructor(name: string) {
    this.key = name;
  }

  set(str: string, value: string) {
    return str.replaceAll(this.key, value);
  }

  exists(variables: FeatureVariablePair[]) {
    for (const variable of variables) {
      if (Object.keys(variable)[0] == this.key) {
        return true;
      }
    }
    return false;
  }

  get(str: string, variables: FeatureVariablePair[]) {
    if (this.exists(variables)) {
      for (const variable of variables) {
        const value = variable[this.key];
        if (value) {
          if (isNaN(Number(value))) {
            str = str.replaceAll("{{" + this.key + "}}", value);
          } else {
            str = str.replaceAll(
              "{{" + this.key + "}}",
              "{{" + numberToLongName(Number(value)) + "}}"
            );
          }
        }
      }
    }
    return str;
  }
}
