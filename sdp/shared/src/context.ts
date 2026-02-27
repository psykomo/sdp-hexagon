import { AsyncLocalStorage } from 'node:async_hooks';

export interface RequestContext {
  userId?: string;
  userRoles: string[];
  permissions: string[];
  requestId: string;
  startedAt: Date;
  ip?: string;
  userAgent?: string;
}

const contextStorage = new AsyncLocalStorage<RequestContext>();

export const requestContext = {
  /**
   * Run a function with the given context
   * The context is available via get() or getOrThrow() inside the function
   */
  run<T>(context: RequestContext, fn: () => T): T {
    return contextStorage.run(context, fn);
  },

  /**
   * Get current request context (if any)
   * Returns undefined if not inside a withContext() call
   */
  get(): RequestContext | undefined {
    return contextStorage.getStore();
  },

  /**
   * Get current request context or throw if not available
   */
  getOrThrow(): RequestContext {
    const ctx = contextStorage.getStore();
    if (!ctx) {
      throw new Error('No request context - wrap with requestContext.run()');
    }
    return ctx;
  },

  /**
   * Check if we're inside a context
   */
  isActive(): boolean {
    return contextStorage.getStore() !== undefined;
  },
};
