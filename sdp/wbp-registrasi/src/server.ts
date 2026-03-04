import express from 'express';
import dotenv from 'dotenv';
import { createRegistrasiRouter } from './http/registrasi.routes';
import { localWbpRegistrasiService } from './index';

dotenv.config();

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'wbp-registrasi' });
  });

  // Wire the router with the service instance
  app.use('/api/registrasi', createRegistrasiRouter(localWbpRegistrasiService));

  return app;
}

export function startServer(port: number = 3001) {
  const app = createApp();
  return app.listen(port, () => {
    console.log(`WBP Registrasi service running on port ${port}`);
  });
}

// Start if run directly
const isMain = import.meta.url.endsWith(process.argv[1]);
if (isMain) {
  const port = parseInt(process.env.PORT || '3001', 10);
  startServer(port);
}
