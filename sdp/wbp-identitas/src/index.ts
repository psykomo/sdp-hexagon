// Port/Interface
export type { IdentitasPort } from './port/identitas-port';

// Types
export type {
  IdentitasDTO,
  CreateIdentitasDTO,
  UpdateIdentitasDTO,
  IdentitasListParams,
  IdentitasListResponse,
} from './types/identitas';

// Client (HTTP) - implements IdentitasPort
export { IdentitasHttpClient, createIdentitasClient, type ClientConfig } from './client';

// Service (Local) - implements IdentitasPort
export { IdentitasService, identitasService } from './service/identitas-service';

// Server
export { createApp, startServer, type ServerConfig } from './server';

// Internal (for embedding)
export { identitasRepository } from './repository/identitas-repo';
export { default as identitasRoutes } from './routes/identitas';
