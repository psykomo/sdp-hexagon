import { type IdentitasPort, IdentitasService, createIdentitasClient } from '@sdp/wbp-identitas';
import type { RequestContext } from '@sdp/shared/context';
import { createWbpRegistrasiService, WbpRegistrasiService } from '@sdp/wbp-registrasi';

export const name = "@sdp/runtime";

// Re-export types
export type { IdentitasPort } from '@sdp/wbp-identitas';
export type { RequestContext } from '@sdp/shared/context';

/**
 * Runtime - Orchestrator for all SDP services
 * 
 * This is a singleton that provides access to all services.
 * Services are created once and shared across requests.
 * 
 * Context is passed explicitly to each service call.
 */
export interface Runtime {
  /** Identity/Person management service */
  identitasService: IdentitasPort;
  wbpRegistrasiService: WbpRegistrasiService;
}

// Singleton instance
let runtimeInstance: Runtime | null = null;

/**
 * Create or get the singleton runtime instance
 * 
 * Call this once at app startup to initialize all services.
 * Subsequent calls return the same instance.
 */
export function createRuntime(): Runtime {
  if (runtimeInstance) {
    return runtimeInstance;
  }

  runtimeInstance = {
    // All services share the same singleton instances
    identitasService: new IdentitasService(),
    // use this to use identitas microservice
    // identitasService: createIdentitasClient(),

    wbpRegistrasiService: createWbpRegistrasiService(false),
    // use this to use registrasi microservice
    // wbpRegistrasiService: createWbpRegistrasiService(true, {
    //   baseUrl: 'http://localhost:3000',
    //   timeout: 10000,
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // }),
  };

  return runtimeInstance;
}

/**
 * Reset the singleton instance (mainly for testing)
 */
export function resetRuntime(): void {
  runtimeInstance = null;
}
