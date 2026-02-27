# @sdp/wbp-identitas

Identity management package for WBP (Warga Binaan Pemasyarakatan - Prison Inmates).

This package can be used as:
1. **Library** - Direct function calls (embedded in your app)
2. **Microservice** - HTTP API server

---

## Architecture

```
                        ┌─────────────────────┐
                        │   IdentitasPort    │  ← Interface
                        │     (interface)    │
                        └──────────┬──────────┘
                                   │
              ┌────────────────────┴────────────────────┐
              │                                         │
              ▼                                         ▼
┌─────────────────────────┐           ┌─────────────────────────┐
│   IdentitasService      │           │   IdentitasHttpClient  │
│   (local/immediate)     │           │   (remote/HTTP)        │
├─────────────────────────┤           ├─────────────────────────┤
│ • Direct function call  │           │ • HTTP requests         │
│ • No network overhead   │           │ • For microservices     │
│ • Context passed explicitly│        │ • Context forwarded     │
└─────────────────────────┘           │   via headers            │
                                     └─────────────────────────┘
```

---

## Installation

```bash
pnpm add @sdp/wbp-identitas
```

---

## Usage

### As Library (Direct Function Calls)

Use this when embedding the package in your application (monolith):

```typescript
import { IdentitasService, identitasService } from '@sdp/wbp-identitas';
import type { RequestContext } from '@sdp/shared';

// Build context (from auth, session, etc.)
const ctx: RequestContext = {
  userId: 'user-123',
  userRoles: ['admin'],
  permissions: ['identitas:read', 'identitas:write', 'identitas:delete'],
  requestId: crypto.randomUUID(),
  startedAt: new Date(),
};

// Pass context explicitly to each call
const identitas = await identitasService.getById(ctx, '12345');
const all = await identitasService.getAll(ctx, 10, 0);
const created = await identitasService.create(ctx, { 
  nomorInduk: '123', 
  namaLengkap: 'John Doe',
  idJenisKelamin: 'L',
  tanggalLahir: '1990-01-01',
  alamat: 'Jakarta',
});
await identitasService.update(ctx, '123', { namaLengkap: 'Jane Doe' });
await identitasService.delete(ctx, '123');
```

---

## Using @sdp/runtime

The [@sdp/runtime](../runtime/README.md) package provides a unified orchestrator to access all services. It supports both local (library) and remote (microservice) modes.

### Option 1: Local Mode (Library)

Use this when the service runs in the same process (monolith/embedded):

```typescript
import { createRuntime, type Runtime } from '@sdp/runtime';
import type { RequestContext } from '@sdp/shared';

// Create runtime singleton (call once at app startup)
const runtime: Runtime = createRuntime();

// Build context per request (from auth/session)
function getContext(req: Request): RequestContext {
  const session = getSession(req); // your auth logic
  return {
    userId: session?.userId,
    userRoles: session?.roles ?? [],
    permissions: session?.permissions ?? [],
    requestId: crypto.randomUUID(),
    startedAt: new Date(),
    ip: req.ip,
    userAgent: req.headers.get('user-agent') ?? undefined,
  };
}

// In your route handler
app.get('/identitas', async (req, res) => {
  const ctx = getContext(req);
  
  // Use runtime - service runs locally (same process)
  const all = await runtime.identitasService.getAll(ctx, 10, 0);
  const count = await runtime.identitasService.count(ctx);
  
  res.json({ data: all.data, total: all.total });
});
```

### Option 2: Remote Mode (Microservice)

Use this when the service runs as a separate process/container:

```typescript
import { createRuntime, type Runtime } from '@sdp/runtime';
import { IdentitasHttpClient } from '@sdp/wbp-identitas';
import type { RequestContext } from '@sdp/shared';

// Create runtime with HTTP client (remote)
const runtime: Runtime = createRuntime();
runtime.identitasService = new IdentitasHttpClient({
  baseUrl: process.env.IDENTITAS_SERVICE_URL || 'http://localhost:3001',
});

// Build context per request
function getContext(req: Request): RequestContext {
  const session = getSession(req);
  return {
    userId: session?.userId,
    userRoles: session?.roles ?? [],
    permissions: session?.permissions ?? [],
    requestId: crypto.randomUUID(),
    startedAt: new Date(),
    ip: req.ip,
    userAgent: req.headers.get('user-agent') ?? undefined,
  };
}

// In your route handler
app.get('/identitas', async (req, res) => {
  const ctx = getContext(req);
  
  // Use runtime - calls microservice over HTTP
  // Context is forwarded via headers automatically
  const all = await runtime.identitasService.getAll(ctx, 10, 0);
  const count = await runtime.identitasService.count(ctx);
  
  res.json({ data: all.data, total: all.total });
});
```

### Switching Between Modes

The beauty of using `@sdp/runtime` is you can switch modes without changing your application code:

```typescript
import { createRuntime, type Runtime } from '@sdp/runtime';
import { IdentitasService } from '@sdp/wbp-identitas';
import { IdentitasHttpClient } from '@sdp/wbp-identitas';

// Environment determines which implementation to use
const isLocal = process.env.USE_LOCAL_IDENTITAS === 'true';

const runtime: Runtime = createRuntime();

// Swap implementation without changing application code
if (isLocal) {
  runtime.identitasService = new IdentitasService();  // Local
} else {
  runtime.identitasService = new IdentitasHttpClient({  // Remote
    baseUrl: process.env.IDENTITAS_SERVICE_URL || 'http://localhost:3001',
  });
}

// Your app code stays the same!
async function handler(req, res) {
  const ctx = buildContext(req);
  const result = await runtime.identitasService.getAll(ctx, 10, 0);
  // ...
}
```

### Runtime Summary

| Mode | Implementation | Use Case |
|------|---------------|----------|
| Local | `new IdentitasService()` | Monolith, embedded, low latency |
| Remote | `new IdentitasHttpClient({ baseUrl })` | Microservices, scaling, isolation |

See [@sdp/runtime](../runtime/README.md) for full documentation.

---

### As Microservice (HTTP API)

Run the server:

```bash
# Development
pnpm dev

# Production
pnpm start
```

Server runs on `http://localhost:3001` (or `PORT` env var).

#### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/identitas` | List all (paginated) |
| GET | `/api/identitas/:nomorInduk` | Get by ID |
| GET | `/api/identitas/search?q=...` | Search |
| GET | `/api/identitas/count` | Get count |
| GET | `/api/identitas/:nomorInduk/exists` | Check exists |
| POST | `/api/identitas` | Create |
| PATCH | `/api/identitas/:nomorInduk` | Update |
| DELETE | `/api/identitas/:nomorInduk` | Delete |

#### Passing Context via Headers

When calling the microservice, pass context via HTTP headers:

```typescript
const response = await fetch('http://localhost:3001/api/identitas', {
  headers: {
    'x-request-id': crypto.randomUUID(),
    'x-user-id': 'user-123',
    'x-user-roles': 'admin,user',
    'x-user-permissions': 'identitas:read,identitas:write,identitas:delete',
    'x-forwarded-for': '127.0.0.1',
    'user-agent': 'Mozilla/5.0',
  },
});
```

The service extracts these headers and uses them for authorization and logging.

### As HTTP Client

Use `IdentitasHttpClient` to call the microservice from other packages:

```typescript
import { IdentitasHttpClient } from '@sdp/wbp-identitas';
import type { RequestContext } from '@sdp/shared';

const client = new IdentitasHttpClient({
  baseUrl: process.env.IDENTITAS_SERVICE_URL || 'http://localhost:3001',
});

// Pass context - it's forwarded via HTTP headers
const ctx: RequestContext = {
  userId: 'user-123',
  permissions: ['identitas:read'],
  requestId: crypto.randomUUID(),
  userRoles: [],
  startedAt: new Date(),
};

const identitas = await client.getById(ctx, '12345');
```

---

## Using the Interface (Recommended)

For maximum flexibility, code against the interface. This allows switching between library and microservice modes without changing consumer code:

```typescript
import type { IdentitasPort } from '@sdp/wbp-identitas';
import { IdentitasService } from '@sdp/wbp-identitas';
import type { RequestContext } from '@sdp/shared';

const service: IdentitasPort = new IdentitasService();
// Later, switch to:
// import { IdentitasHttpClient } from '@sdp/wbp-identitas';
// const service: IdentitasPort = new IdentitasHttpClient({ baseUrl: '...' });

// Same code works for both - just pass context
const ctx: RequestContext = { ... };
const identitas = await service.getById(ctx, '123');
const all = await service.getAll(ctx);
```

---

## Authorization & Context

The service enforces permissions when you pass context:

```typescript
import { createRuntime } from '@sdp/runtime';
import type { RequestContext } from '@sdp/shared';

// Create runtime (singleton)
const runtime = createRuntime();

// Create context per request
const context: RequestContext = {
  userId: 'user-123',
  userRoles: ['admin'],
  permissions: ['identitas:read', 'identitas:write', 'identitas:delete'],
  requestId: crypto.randomUUID(),
  startedAt: new Date(),
};

// Pass context to each service call
await runtime.identitasService.getAll(context, 10);    // requires identitas:read (optional)
await runtime.identitasService.create(context, data);  // requires identitas:write
await runtime.identitasService.delete(context, '123'); // requires identitas:delete

// Without required permission - throws "Forbidden"
const noWriteContext = { ...permissions: ['identitas:read'] };
await runtime.identitasService.create(noWriteContext, data); 
// throws: "Forbidden: missing permissions: identitas:write"
```

### Required Permissions

| Operation | Required Permission |
|-----------|---------------------|
| `getById`, `getAll`, `search`, `count`, `exists` | (none required, but can add `identitas:read`) |
| `create`, `update` | `identitas:write` |
| `delete` | `identitas:delete` |

The service logs all operations with `requestId` and `userId` for auditing.

---

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `HOST` | Server host | `0.0.0.0` |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `NODE_ENV` | Environment | `development` |

---

## File Structure

```
src/
├── index.ts              # Main exports
├── port/
│   └── identitas-port.ts # Interface definition
├── types/
│   └── identitas.ts      # DTOs
├── repository/
│   └── identitas-repo.ts # Database operations
├── service/
│   └── identitas-service.ts # Business logic (implements port)
├── client.ts             # HTTP client (implements port)
├── routes/
│   └── identitas.ts      # Express routes
└── server.ts             # Express server entrypoint
```

---

## Migration Guide

### From AsyncLocalStorage to Explicit Context

If you were using the old AsyncLocalStorage approach, here's how to migrate:

**Before:**
```typescript
import { withContext } from '@sdp/runtime';

const result = withContext(context, () => {
  return identitasService.getAll(10);
});
```

**After:**
```typescript
// Just pass context directly
const result = await identitasService.getAll(context, 10);
```

### Phase 1: Use as Library (Current)

```typescript
import { identitasService } from '@sdp/wbp-identitas';
import type { RequestContext } from '@sdp/shared';

const ctx: RequestContext = { userId: '...', permissions: [...], ... };
const identitas = await identitasService.getById(ctx, '123');
```

### Phase 2: Run Microservice (Optional)

Start the microservice:
```bash
pnpm dev
```

Update consumer to use HTTP client:
```typescript
import { IdentitasHttpClient } from '@sdp/wbp-identitas';
const client = new IdentitasHttpClient({ baseUrl: 'http://localhost:3001' });
const identitas = await client.getById(ctx, '123');
```

### Phase 3: Remove Library Usage

Remove `identitasService` import and use only HTTP client.

---

## License

MIT
