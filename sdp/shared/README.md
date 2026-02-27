# @sdp/shared

Shared types and utilities for SDP packages.

## RequestContext

The `RequestContext` interface defines request-scoped information:

```typescript
interface RequestContext {
  userId?: string;           // Logged in user ID
  userRoles: string[];      // User roles (e.g., ["admin", "user"])
  permissions: string[];     // User permissions (e.g., ["identitas:read"])
  requestId: string;        // Unique request ID for tracing
  startedAt: Date;         // Request start time
  ip?: string;              // Client IP
  userAgent?: string;       // Client user agent
}
```

### Why Explicit Context?

We pass context explicitly to each function call rather than using AsyncLocalStorage:

```typescript
// Explicit context - clear and testable
async function getIdentitas(ctx: RequestContext, nomorInduk: string) {
  if (!ctx.permissions.includes('identitas:read')) {
    throw new Error('Forbidden');
  }
  return repository.findById(nomorInduk);
}

// Usage
const ctx = { userId: 'user-1', permissions: ['identitas:read'], ... };
const result = await getIdentitas(ctx, '12345');
```

### Benefits

1. **Explicit dependencies** - Functions clearly declare they need context
2. **No hidden state** - Context is always visible in function signatures
3. **Works with any async pattern** - No AsyncLocalStorage compatibility issues
4. **Easier to test** - Just pass a mock context object
5. **Framework agnostic** - Works in Node.js, Edge, browser (with polyfills)

### Best Practices

1. **Always require context** - Don't make context optional unless truly needed
2. **Check permissions early** - Validate at the start of operations
3. **Log with context** - Include requestId for tracing

```typescript
// Good: Explicit context requirement
async function createIdentitas(ctx: RequestContext, data: CreateDTO) {
  // Check permission first
  if (!ctx.permissions.includes('identitas:write')) {
    throw new Error('Forbidden: missing identitas:write');
  }
  
  console.log(JSON.stringify({
    message: 'Creating identitas',
    requestId: ctx.requestId,
    userId: ctx.userId,
  }));
  
  return repository.create(data);
}
```

### Building Context from HTTP Request

In your HTTP routes, build context from request:

```typescript
import type { RequestContext } from '@sdp/shared';

function buildContext(req: Request): RequestContext {
  return {
    userId: req.headers['x-user-id'] as string | undefined,
    userRoles: (req.headers['x-user-roles'] as string)?.split(',') ?? [],
    permissions: (req.headers['x-user-permissions'] as string)?.split(',') ?? [],
    requestId: (req.headers['x-request-id'] as string) ?? crypto.randomUUID(),
    startedAt: new Date(),
    ip: req.ip ?? req.socket.remoteAddress,
    userAgent: req.headers['user-agent'] as string | undefined,
  };
}

// In route handler
router.get('/identitas', (req, res) => {
  const ctx = buildContext(req);
  const result = await service.getAll(ctx, 10, 0);
  res.json(result);
});
```
