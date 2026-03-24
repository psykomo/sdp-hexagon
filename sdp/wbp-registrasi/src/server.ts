import express from 'express';
import dotenv from 'dotenv';
import type { Server } from 'node:http';
import { createRegistrasiRouter } from './http/registrasi.routes';
import { InternalWbpRegistrasiService } from './index';
import { drizzleRegistrasiRepository } from './persistence/drizzle-wbp-registrasi-repo';

dotenv.config();

const internalWbpRegistrasiService = new InternalWbpRegistrasiService(drizzleRegistrasiRepository);

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'wbp-registrasi' });
  });

  // Wire the router with the service instance
  app.use('/api/registrasi', createRegistrasiRouter(internalWbpRegistrasiService));

  return app;
}

export function startServer(port: number = 3001) {
  const app = createApp();
  return app.listen(port, () => {
    console.log(`WBP Registrasi service running on port ${port}`);
  });
}

function registerGracefulShutdown(server: Server) {
  let isShuttingDown = false;

  const shutdown = (signal: NodeJS.Signals) => {
    if (isShuttingDown) {
      return;
    }
    isShuttingDown = true;

    console.log(`Received ${signal}, shutting down WBP Registrasi service...`);
    server.close((error?: Error) => {
      if (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
      }
      process.exit(0);
    });
  };

  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));
}

// Start if run directly
const isMain = import.meta.url.endsWith(process.argv[1]);
if (isMain) {
  const port = parseInt(process.env.PORT || '3001', 10);
  const server = startServer(port);
  registerGracefulShutdown(server);
}
