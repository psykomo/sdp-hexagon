import express, { Request, Response, NextFunction } from 'express';
import identitasRoutes from './routes/identitas';

export interface ServerConfig {
  port?: number;
  host?: string;
}

/**
 * Create Express application for Identitas microservice
 */
export function createApp(config?: ServerConfig): express.Application {
  const app = express();
  
  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Request logging
  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
    });
    next();
  });
  
  // Health check
  app.get('/health', (req: Request, res: Response) => {
    res.json({ 
      status: 'ok', 
      service: 'identitas',
      timestamp: new Date().toISOString(),
    });
  });
  
  // API Routes
  app.use('/api/identitas', identitasRoutes);
  
  // Error handling middleware
  app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
    console.error('Error:', err.message);
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  });
  
  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Not found' });
  });
  
  return app;
}

/**
 * Start the microservice server
 */
export function startServer(config: ServerConfig = {}): void {
  const port = config.port ?? parseInt(process.env.PORT ?? '3001', 10);
  const host = config.host ?? process.env.HOST ?? '0.0.0.0';
  
  const app = createApp(config);
  
  app.listen(port, host, () => {
    console.log(`🚀 Identitas microservice running on http://${host}:${port}`);
    console.log(`   Health: http://${host}:${port}/health`);
    console.log(`   API:    http://${host}:${port}/api/identitas`);
  });
}

// Auto-start if running directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  startServer();
}
