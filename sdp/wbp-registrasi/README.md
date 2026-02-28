# @sdp/wbp-registrasi

Domain package for WBP Registration (Registrasi), following **Clean Architecture** (Hexagonal) principles.

This package can be used as an in-process library or run as a standalone HTTP microservice.

---

## 1) Architecture

The package is divided into two main layers to ensure business logic remains isolated from infrastructure details.

### Core (Domain Layer)
Contains the pure business logic and definitions. It has **zero dependencies** on frameworks or databases.
- `src/core/types/`: Data models and DTOs.
- `src/core/ports/`: The `RegistrasiServicePort` interface (Primary Port).
- `src/core/service/`: The `RegistrasiService` implementation. Uses **Dependency Injection** for its repository.

### Infra (Infrastructure Layer)
Contains implementation details that talk to the outside world.
- `src/infra/db/`: Drizzle ORM repository implementation (Secondary Adapter).
- `src/infra/http/`: Express routes and controllers (Primary Adapter).
- `src/infra/client/`: HTTP client for remote usage (Secondary Adapter).

---

## 2) Usage Modes

### Library Mode (Local)
Use this when embedding the service directly into your application (monolith style).

```typescript
import { registrasiService } from '@sdp/wbp-registrasi';

const result = await registrasiService.getRegistrasiList(ctx);
```

### Microservice Mode (Remote)
Run the package as a separate process:

```bash
# Start the server
pnpm dev
```

Then use the `RegistrasiHttpClient` in your client app:

```typescript
import { RegistrasiHttpClient } from '@sdp/wbp-registrasi';

const client = new RegistrasiHttpClient('http://localhost:3001');
const result = await client.getRegistrasiList(ctx);
```

---

## 3) Dependency Injection
If you need to use a custom repository or mock, you can instantiate the service manually:

```typescript
import { RegistrasiService } from '@sdp/wbp-registrasi';

const myMockRepo = { /* ... */ };
const customService = new RegistrasiService(myMockRepo);
```

---

## 4) Scripts

- `pnpm check-types`: Run TypeScript compiler check
- `pnpm dev`: Start the microservice in watch mode
- `pnpm build`: Compile the package
- `pnpm test`: Run vitest suites
