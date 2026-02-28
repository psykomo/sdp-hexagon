import axios from "axios";
import { ICalculator } from "../core/calculator.js";

export class RemoteCalculatorClient implements ICalculator {
  constructor(private readonly baseUrl: string) {}

  async add(a: number, b: number): Promise<number> {
    const response = await axios.post(`${this.baseUrl}/add`, { a, b });
    return response.data.result;
  }

  async subtract(a: number, b: number): Promise<number> {
    const response = await axios.post(`${this.baseUrl}/subtract`, { a, b });
    return response.data.result;
  }

  async multiply(a: number, b: number): Promise<number> {
    const response = await axios.post(`${this.baseUrl}/multiply`, { a, b });
    return response.data.result;
  }

  async divide(a: number, b: number): Promise<number> {
    const response = await axios.post(`${this.baseUrl}/divide`, { a, b });
    return response.data.result;
  }
}
