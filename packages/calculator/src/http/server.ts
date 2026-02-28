import express, { Request, Response } from "express";
import { LocalCalculator } from "../core/local-calculator.js";
import { ICalculator } from "../core/calculator.js";

export class CalculatorServer {
  private app = express();
  private calculator: ICalculator = new LocalCalculator();

  constructor(private readonly port: number = 3000) {
    this.app.use(express.json());
    this.setupRoutes();
  }

  private setupRoutes() {
    this.app.post("/add", async (req: Request, res: Response) => {
      const { a, b } = req.body;
      const result = await this.calculator.add(a, b);
      res.json({ result });
    });

    this.app.post("/subtract", async (req: Request, res: Response) => {
      const { a, b } = req.body;
      const result = await this.calculator.subtract(a, b);
      res.json({ result });
    });

    this.app.post("/multiply", async (req: Request, res: Response) => {
      const { a, b } = req.body;
      const result = await this.calculator.multiply(a, b);
      res.json({ result });
    });

    this.app.post("/divide", async (req: Request, res: Response) => {
      const { a, b } = req.body;
      try {
        const result = await this.calculator.divide(a, b);
        res.json({ result });
      } catch (error) {
        res.status(400).json({ error: (error as Error).message });
      }
    });
  }

  private serverInstance?: any;

  start() {
    this.serverInstance = this.app.listen(this.port, () => {
      console.log(`Calculator service listening on port ${this.port}`);
    });
    return this.serverInstance;
  }

  stop() {
    if (this.serverInstance) {
      this.serverInstance.close();
    }
  }
}

// Optional: Start the server if this file is run directly
if (import.meta.url.endsWith("server.ts") || import.meta.url.endsWith("server.js")) {
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  new CalculatorServer(port).start();
}
