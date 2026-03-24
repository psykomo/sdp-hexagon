import type { WbpRegistrasiService } from "./contracts/wbp-registrasi-service";
import { drizzleRegistrasiRepository } from "./persistence/drizzle-wbp-registrasi-repo";
import { InternalWbpRegistrasiService } from "./services/internal-wbp-registrasi-service";
import { RemoteWbpRegistrasiService } from "./services/remote-wbp-registrasi-service";
import type { ClientConfig } from "./services/remote-wbp-registrasi-service";


export function createWbpRegistrasiService(isRemote: boolean, config?: ClientConfig): WbpRegistrasiService {
  return isRemote ? new RemoteWbpRegistrasiService(config ?? { baseUrl: "" }) : new InternalWbpRegistrasiService(drizzleRegistrasiRepository);
}

export type { WbpRegistrasiService, ClientConfig }
export { InternalWbpRegistrasiService, RemoteWbpRegistrasiService }
