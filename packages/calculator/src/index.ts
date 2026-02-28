import { ICalculator } from "./core/calculator.js";
import { LocalCalculator } from "./core/local-calculator.js";
import { RemoteCalculatorClient } from "./http/remote-calculator.js";

export * from "./core/calculator.js";
export * from "./core/local-calculator.js";
export * from "./http/remote-calculator.js";
export * from "./http/server.js";

export enum CalculatorMode {
  LOCAL = "LOCAL",
  REMOTE = "REMOTE",
}

export interface CalculatorConfig {
  mode: CalculatorMode;
  remoteUrl?: string;
}

export class CalculatorFactory {
  static create(config: CalculatorConfig): ICalculator {
    if (config.mode === CalculatorMode.REMOTE) {
      if (!config.remoteUrl) {
        throw new Error("remoteUrl is required for REMOTE mode");
      }
      return new RemoteCalculatorClient(config.remoteUrl);
    }
    return new LocalCalculator();
  }
}
