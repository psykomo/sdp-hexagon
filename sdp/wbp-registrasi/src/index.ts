// Core Ports & Types
export type { RegistrasiServicePort } from './core/ports/registrasi-service-port';
export type {
  RegistrasiDTO,
  CreateRegistrasiDTO,
  UpdateRegistrasiDTO,
  RegistrasiListParams,
  RegistrasiListResponse,
} from './core/types/registrasi';

// Core Service
export { RegistrasiService } from './core/service/registrasi-service';

// Infra - DB
export { RegistrasiRepository, registrasiRepository } from './infra/db/registrasi-repo';

// Infra - HTTP
export { createRegistrasiRouter } from './infra/http/registrasi-routes';

// Infra - Client
export { RegistrasiHttpClient, createRegistrasiClient } from './infra/client/registrasi-client';

// --- Singleton / Default Instances ---
import { RegistrasiService } from './core/service/registrasi-service';
import { registrasiRepository } from './infra/db/registrasi-repo';

/**
 * Default singleton instance for local/library usage.
 * Injected with the real repository.
 */
export const registrasiService = new RegistrasiService(registrasiRepository);
