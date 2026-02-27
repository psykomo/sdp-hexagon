# @sdp/runtime

Runtime orchestrator for SDP packages. Provides a unified API to access all services with singleton-perfomance and per-request context.

## Concept

The runtime follows the **Singleton + Per-Request Context** pattern:

```
┌─────────────────────────────────────────────────────────────────┐
│                         App (Next.js)                          │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  createRuntime()  ←── called once at app startup        │   │
│  │  Returns singleton with all services                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  withContext(ctx, fn)  ←── wraps per-request logic     │   │
│  │  - userId, roles, permissions, requestId               │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Services access context via AsyncLocalStorage                  │
│  No need to pass context through every function call!          │
└─────────────────────────────────────────────────────────────────┘
```

## Usage

### 1. Create Runtime (Once)

```typescript
// lib/runtime.ts
import { createRuntime } from "@sdp/runtime";

export const runtime = createRuntime();
```

### 2. Create Context (Per Request)

```typescript
import type { RequestContext } from "@sdp/runtime";

function getRequestContext(): RequestContext {
  // Get from your auth/session
  const session = await getSession();
  
  return {
    userId: session?.userId,
    userRoles: session?.roles ?? [],
    permissions: session?.permissions ?? [],
    requestId: crypto.randomUUID(),
    startedAt: new Date(),
  };
}
```

### 3. Use with Context

```typescript
import { withContext } from "@sdp/runtime";
import { runtime } from "@/lib/runtime";

export default async function Page() {
  const context = getRequestContext();
  
  // All service calls here have access to context
  const result = withContext(context, () => {
    const identities = runtime.identitasService.getAll(10);
    const count = runtime.identitasService.count();
    return { identities, count };
  });
}
```

## Context

The `RequestContext` interface:

```typescript
interface RequestContext {
  userId?: string;           // Logged in user ID
  userRoles: string[];      // User roles (e.g., ["admin", "user"])
  permissions: string[];     // User permissions (e.g., ["identitas:read"])
  requestId: string;        // Unique request ID for tracing
  startedAt: Date;          // Request start time
  ip?: string;              // Client IP
  userAgent?: string;       // Client user agent
}
```

## Authorization

Services enforce permissions automatically:

```typescript
// These will throw "Forbidden" if missing required permission
await runtime.identitasService.create(data);    // requires identitas:write
await runtime.identitasService.update(...);      // requires identitas:write
await runtime.identitasService.delete(...);      // requires identitas:delete
```

## API

### `createRuntime(): Runtime`
Creates or returns the singleton runtime instance. Call once at app startup.

### `withContext<T>(context: RequestContext, fn: () => T): T`
Executes a function with the given context. The context is available via `getContext()` inside the function.

### `withContextAsync<T>(context: RequestContext, fn: () => Promise<T>): Promise<T>`
Async version of `withContext`.

### `getContext(): RequestContext | undefined`
Gets the current request context (if any).

### `getContextOrThrow(): RequestContext`
Gets the current context or throws if not inside `withContext()`.

### `hasContext(): boolean`
Check if we're currently inside a context.

## Services

### identitasService
Access to identity/person management. See [@sdp/wbp-identitas](./wbp-identitas/README.md)

---

## Related

- [@sdp/shared](./shared/README.md) - Context implementation
- [@sdp/wbp-identitas](./wbp-identitas/README.md) - Identity service
