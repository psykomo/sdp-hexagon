import { ICalculator } from "./calculator.js";

export class LocalCalculator implements ICalculator {
  async add(a: number, b: number): Promise<number> {
    return a + b;
  }

  async subtract(a: number, b: number): Promise<number> {
    return a - b;
  }

  async multiply(a: number, b: number): Promise<number> {
    return a * b;
  }

  async divide(a: number, b: number): Promise<number> {
    if (b === 0) {
      throw new Error("Division by zero");
    }
    return a / b;
  }
}
