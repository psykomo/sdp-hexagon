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
│   (local/immediate)     │           │   (remote/HTTP)         │
├─────────────────────────┤           ├─────────────────────────┤
│ • Direct function call  │           │ • HTTP requests         │
│ • No network overhead   │           │ • For microservices     │
└─────────────────────────┘           └─────────────────────────┘
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

// Using the singleton instance
const identitas = await identitasService.getById('12345');
const all = await identitasService.getAll(10, 0);
const created = await identitasService.create({ 
  nomorInduk: '123', 
  namaLengkap: 'John Doe',
  idJenisKelamin: 'L',
  tanggalLahir: '1990-01-01',
  alamat: 'Jakarta',
});
await identitasService.update('123', { namaLengkap: 'Jane Doe' });
await identitasService.delete('123');
```

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

### As HTTP Client

Use `IdentitasHttpClient` to call the microservice from other packages:

```typescript
import { IdentitasHttpClient } from '@sdp/wbp-identitas';

const client = new IdentitasHttpClient({
  baseUrl: process.env.IDENTITAS_SERVICE_URL || 'http://localhost:3001',
});

const identitas = await client.getById('12345');
```

---

## Using the Interface (Recommended)

For maximum flexibility, code against the interface. This allows switching between library and microservice modes without changing consumer code:

```typescript
import type { IdentitasPort } from '@sdp/wbp-identitas';
import { IdentitasService } from '@sdp/wbp-identitas';

// Later, switch to:
// import { IdentitasHttpClient } from '@sdp/wbp-identitas';

const service: IdentitasPort = new IdentitasService();
// const service: IdentitasPort = new IdentitasHttpClient({ baseUrl: '...' });

// Same code works for both
const identitas = await service.getById('123');
const all = await service.getAll();
```

---

## Authorization & Context

The service automatically enforces permissions when used with `@sdp/runtime`:

```typescript
import { createRuntime, withContext } from '@sdp/runtime';
import { identitasService } from '@sdp/wbp-identitas';

// Create runtime (singleton)
const runtime = createRuntime();

// Create context per request
const context = {
  userId: 'user-123',
  userRoles: ['admin'],
  permissions: ['identitas:read', 'identitas:write', 'identitas:delete'],
  requestId: crypto.randomUUID(),
  startedAt: new Date(),
};

// Wrap with context - all service calls here have access to it
const result = withContext(context, () => {
  // These operations check permissions automatically
  await identitasService.getAll();    // requires identitas:read
  await identitasService.create(data); // requires identitas:write
  await identitasService.delete('123'); // requires identitas:delete
});
```

### Required Permissions

| Operation | Required Permission |
|-----------|---------------------|
| `getById`, `getAll`, `search`, `count`, `exists` | `identitas:read` (optional) |
| `create`, `update` | `identitas:write` |
| `delete` | `identitas:delete` |

The service logs all operations with `requestId` and `userId` for auditing.

See [@sdp/runtime](../runtime/README.md) for full context documentation.

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

### Phase 1: Use as Library (Current)

```typescript
import { identitasService } from '@sdp/wbp-identitas';
const identitas = await identitasService.getById('123');
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
const identitas = await client.getById('123');
```

### Phase 3: Remove Library Usage

Remove `identitasService` import and use only HTTP client.

---

## License

MIT
