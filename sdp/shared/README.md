# @sdp/shared

Shared utilities for SDP packages.

## Context Module

Provides request-scoped context using Node.js AsyncLocalStorage.

### Why AsyncLocalStorage?

Without AsyncLocalStorage, you'd need to pass context through every function:

```typescript
// Without context - verbose
function getData(ctx: Context) {
  return service.getData(ctx);  // must pass ctx everywhere
}
```

With AsyncLocalStorage, context is automatic:

```typescript
// With context - clean
function getData() {
  const ctx = requestContext.get();  // magically available
  return service.getData();
}
```

### Usage

```typescript
import { requestContext, type RequestContext } from "@sdp/shared/context";

// Create context
const ctx: RequestContext = {
  userId: "user-123",
  userRoles: ["admin"],
  permissions: ["read", "write"],
  requestId: "req-456",
  startedAt: new Date(),
};

// Run with context
const result = requestContext.run(ctx, () => {
  // Inside here, we can get the context
  const current = requestContext.get();
  console.log(current?.userId); // "user-123"
  
  return doSomething();
});

// Outside context, get() returns undefined
console.log(requestContext.get()); // undefined
```

### API

| Method | Description |
|--------|-------------|
| `run(context, fn)` | Run function with context |
| `get()` | Get current context (undefined if not in run()) |
| `getOrThrow()` | Get context or throw if not available |
| `isActive()` | Check if inside a run() call |

### TypeScript

```typescript
import type { RequestContext } from "@sdp/shared";

// The context interface
interface RequestContext {
  userId?: string;
  userRoles: string[];
  permissions: string[];
  requestId: string;
  startedAt: Date;
  ip?: string;
  userAgent?: string;
}
```

### Best Practices

1. **Always wrap with run()** - Never assume context is available
2. **Use getOrThrow() in services** - Fail fast if context required
3. **Use get() in optional contexts** - Handle missing context gracefully
4. **Log with context** - Include requestId for tracing

```typescript
// Good: Explicit context requirement
const ctx = requestContext.getOrThrow();
if (!ctx.permissions.includes('read')) throw new Error('Forbidden');

// Good: Optional context handling
const ctx = requestContext.get();
if (ctx) {
  console.log(`Request ${ctx.requestId} by ${ctx.userId}`);
}
```

### Limitations

- **Node.js only** - Not available in browser
- **Async only** - Context doesn't propagate to sync callbacks
- **Single context** - Nested `run()` calls replace the context
