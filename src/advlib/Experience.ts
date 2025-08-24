export default class Experience {
  name: string;
  value: number;
  constructor(name: string, value: number) {
    this.name = name;
    this.value = value;
  }

  toString() {
    if (this.value < 0) {
      return this.name + " " + this.value.toString();
    } else {
      return this.name + " +" + this.value.toString();
    }
  }
}
