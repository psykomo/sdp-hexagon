import { WbpRegistrasiService } from "./contracts/wbp-registrasi-service";
import { DrizzleWbpRegistrasiRepository } from "./persistence/drizzle-wbp-registrasi-repo";
import { LocalWbpRegistrasiService } from "./services/local-wbp-registrasi-service";
import { ClientConfig, RemoteWbpRegistrasiService } from "./services/remote-wbp-registrasi-service";

const wbpRegistrasiRepo = new DrizzleWbpRegistrasiRepository();

export function createWbpRegistrasiService(isRemote: boolean, config?: ClientConfig): WbpRegistrasiService {
  return isRemote ? new RemoteWbpRegistrasiService(config ?? { baseUrl: "" }) : new LocalWbpRegistrasiService(wbpRegistrasiRepo);
}

export { WbpRegistrasiService }