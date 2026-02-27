# @sdp/runtime

Runtime orchestrator for SDP packages. Provides a unified API to access all services with singleton performance.

## Concept

The runtime follows the **Singleton + Explicit Context** pattern:

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
│  │  Per-request: create context and pass explicitly       │   │
│  │  - userId, roles, permissions, requestId               │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Services receive context explicitly in each method call       │
│  context is passed through all function calls                   │
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
    ip: request-ip,
    userAgent: request.headers.get('user-agent') ?? undefined,
  };
}
```

### 3. Pass Context to Service Calls

```typescript
import { runtime } from "@/lib/runtime";

export default async function Page() {
  const context = getRequestContext();
  
  // Pass context explicitly to each service call
  const identities = await runtime.identitasService.getAll(context, 10);
  const count = await runtime.identitasService.count(context);
  const exists = await runtime.identitasService.exists(context, '12345');
  
  return { identities, count, exists };
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

Services enforce permissions automatically when you pass context:

```typescript
const context = {
  userId: 'user-1',
  permissions: ['identitas:read'], // Missing write permission
  ...
};

// These will throw "Forbidden" if missing required permission
await runtime.identitasService.create(context, data);   // requires identitas:write
await runtime.identitasService.update(context, '123', {}); // requires identitas:write
await runtime.identitasService.delete(context, '123');   // requires identitas:delete

// These are fine
await runtime.identitasService.getById(context, '123');  // no permission needed (or identitas:read)
await runtime.identitasService.getAll(context, 10);      // no permission needed
```

## API

### `createRuntime(): Runtime`
Creates or returns the singleton runtime instance. Call once at app startup.

### `resetRuntime(): void`
Resets the singleton instance (mainly for testing).

### Runtime Interface
```typescript
interface Runtime {
  identitasService: IdentitasPort;
}
```

## Services

### identitasService
Access to identity/person management. See [@sdp/wbp-identitas](./wbp-identitas/README.md)

---

## Related

- [@sdp/shared](./shared/README.md) - Context type definition
- [@sdp/wbp-identitas](./wbp-identitas/README.md) - Identity service
