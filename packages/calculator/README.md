# @hexagon/calculator

A calculator package that can be used as an in-process library or as a REST service.

## Usage

### 1. Define the interface and use it in your code

```typescript
import { ICalculator, CalculatorFactory, CalculatorMode } from "@hexagon/calculator";

// This is the only place you change to switch between modes
const config = {
  mode: process.env.CALCULATOR_MODE === "REMOTE" ? CalculatorMode.REMOTE : CalculatorMode.LOCAL,
  remoteUrl: "http://localhost:3000",
};

const calculator: ICalculator = CalculatorFactory.create(config);

// The rest of the code remains exactly the same
async function run() {
  const result = await calculator.add(10, 5);
  console.log(`Result: ${result}`);
}
```

### 2. Switch to REST service

Simply set the environment variable:
`CALCULATOR_MODE=REMOTE`

And ensure the REST server is running:
`pnpm start` in `@hexagon/calculator` package.
