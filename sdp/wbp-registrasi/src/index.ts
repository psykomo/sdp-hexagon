// // Core Ports & Types
// export type {
//   RegistrasiDTO,
//   CreateRegistrasiDTO,
//   UpdateRegistrasiDTO,
//   RegistrasiListParams,
//   RegistrasiListResponse,
// } from './registrasi.types';

// // Core Service
// export { RegistrasiService } from './registrasi.service';

// // Infra - DB
// export { RegistrasiRepository, registrasiRepository } from './registrasi.repo';

// // Infra - HTTP
// export { createRegistrasiRouter } from './http/registrasi.routes';

// // Infra - Client

// // --- Singleton / Default Instances ---
// import { RegistrasiService } from './registrasi.service';
// import { registrasiRepository } from './registrasi.repo';

// /**
//  * Default singleton instance for local/library usage.
//  * Injected with the real repository.
//  */
// export const registrasiService = new RegistrasiService(registrasiRepository);

import { WbpRegistrasiService } from "./contracts/wbp-registrasi-service";
import { DrizzleWbpRegistrasiRepository } from "./persistence/drizzle-wbp-registrasi-repo";
import { LocalWbpRegistrasiService } from "./services/local-wbp-registrasi-service";
import { RemoteWbpRegistrasiService } from "./services/remote-wbp-registrasi-service";

const wbpRegistrasiRepo = new DrizzleWbpRegistrasiRepository();

export const localWbpRegistrasiService = new LocalWbpRegistrasiService(wbpRegistrasiRepo);
export { RemoteWbpRegistrasiService, WbpRegistrasiService }