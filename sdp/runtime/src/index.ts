import { type IdentitasPort, IdentitasService } from '@sdp/wbp-identitas';
import { requestContext, type RequestContext } from '@sdp/shared/context';

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
 * Context (user, roles, permissions) is passed per-request
 * via withContext() or getContext().
 */
export interface Runtime {
  /** Identity/Person management service */
  identitasService: IdentitasPort;
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
    // They access request context via AsyncLocalStorage internally
    identitasService: new IdentitasService(),
  };

  return runtimeInstance;
}

/**
 * Reset the singleton instance (mainly for testing)
 */
export function resetRuntime(): void {
  runtimeInstance = null;
}

/**
 * Execute a function with request context
 * 
 * The context is automatically available via requestContext.get()
 * inside any service calls made within the function.
 * 
 * @example
 * const result = withContext(context, () => {
 *   return runtime.identitasService.getAll();
 * });
 */
export function withContext<T>(context: RequestContext, fn: () => T): T {
  return requestContext.run(context, fn);
}

/**
 * Execute an async function with request context
 */
export async function withContextAsync<T>(
  context: RequestContext, 
  fn: () => Promise<T>
): Promise<T> {
  return requestContext.run(context, fn);
}

/**
 * Get current request context (if any)
 * 
 * Returns undefined if not inside a withContext() call.
 * Use this in services to access the current request context.
 */
export function getContext(): RequestContext | undefined {
  return requestContext.get();
}

/**
 * Get current request context or throw
 * 
 * Throws if not inside a withContext() call.
 */
export function getContextOrThrow(): RequestContext {
  return requestContext.getOrThrow();
}

/**
 * Check if we're currently in a request context
 */
export function hasContext(): boolean {
  return requestContext.isActive();
}
