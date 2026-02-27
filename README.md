# Hexagon Monorepo

Monorepo for an SDP (Sistem Database Pemasyarakatan) prototype, built with **pnpm workspaces + Turborepo**.

This repo combines:
- 2 Next.js apps (`web`, `docs`)
- Shared domain packages under `sdp/*`
- PostgreSQL + Drizzle ORM schema/migrations
- A WBP Identitas service that can run as **library (in-process)** or **microservice (HTTP)**

---

## 1) Workspace overview

```text
.
├─ apps/
│  ├─ web/                # Main Next.js app (UI playground + runtime example)
│  └─ docs/               # Secondary Next.js docs app
├─ sdp/
│  ├─ shared/             # Shared types (RequestContext)
│  ├─ runtime/            # Service orchestrator (singleton runtime)
│  ├─ database/           # Drizzle schema + migrations + DB client
│  └─ wbp-identitas/      # Identitas domain (service, repository, HTTP routes/client)
├─ docker-compose.yml     # Local PostgreSQL
└─ turbo.json             # Task pipeline
```

### Package roles

| Package | Purpose |
|---|---|
| `@sdp/shared` | Defines `RequestContext` (explicit context passed through calls) |
| `@sdp/runtime` | Singleton runtime that exposes domain services (currently `identitasService`) |
| `@sdp/database` | PostgreSQL connection, Drizzle schema, migration tooling |
| `@sdp/wbp-identitas` | Identitas port/service/repository + Express server + HTTP client |
| `apps/web` | Main app; includes `/runtime-example` showing runtime usage |
| `apps/docs` | Docs-style Next.js app |

---

## 2) Architecture in one minute

### Local/library mode (current default in runtime)

`apps/web` → `@sdp/runtime` → `IdentitasService` → `@sdp/database` → PostgreSQL

### Remote/microservice mode (optional)

`apps/web` → `@sdp/runtime` → `IdentitasHttpClient` → `@sdp/wbp-identitas` HTTP API → PostgreSQL

Core pattern used across packages: **Singleton runtime + explicit request context**.

---

## 3) Prerequisites

- Node.js **>= 20.9.0**
- pnpm **9.x**
- Docker (for local PostgreSQL)

---

## 4) Quick start (new developer)

### A. Install deps

```bash
pnpm install
```

### B. Configure env

```bash
cp .env.example .env
```

Default value expected:

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/sdp
```

### C. Start PostgreSQL

```bash
docker compose up -d postgres
```

### D. Run DB migrations

```bash
pnpm --filter @sdp/database migrate
```

### E. Start apps/services

Recommended combinations:

#### Option 1 — Frontend only (web + docs)

```bash
pnpm dev --filter=web --filter=docs
```

- Web: http://localhost:3000
- Docs: http://localhost:3001

#### Option 2 — Web + Identitas API

Run in separate terminals:

```bash
pnpm --filter web dev
```

```bash
pnpm --filter @sdp/wbp-identitas dev
```

- Web: http://localhost:3000
- Identitas API: http://localhost:3001

#### Option 3 — Run all three (web + docs + API)

Because `docs` and `wbp-identitas` both default to `3001`, run API on another port:

```bash
PORT=3002 pnpm --filter @sdp/wbp-identitas dev
```

---

## 5) Important routes

### Web app
- `/` → UI component example page
- `/runtime-example` → Demonstrates `createRuntime()` + explicit `RequestContext`

### Identitas microservice
- `GET /health`
- `GET /api/identitas`
- `GET /api/identitas/count`
- `GET /api/identitas/search?q=...`
- `GET /api/identitas/:nomorInduk`
- `GET /api/identitas/:nomorInduk/exists`
- `POST /api/identitas`
- `PATCH /api/identitas/:nomorInduk`
- `DELETE /api/identitas/:nomorInduk`

---

## 6) Common commands

### From repo root

```bash
pnpm build
pnpm dev
pnpm lint
pnpm check-types
pnpm format
```

### Targeted package commands

```bash
# Database migrations
pnpm --filter @sdp/database migrate
pnpm --filter @sdp/database generate

# Identitas service
pnpm --filter @sdp/wbp-identitas dev
pnpm --filter @sdp/wbp-identitas test

# Apps
pnpm --filter web dev
pnpm --filter docs dev
```

---

## 7) Development notes / gotchas

1. **Port collision by default**
   - `apps/docs` uses port `3001`
   - `@sdp/wbp-identitas` also defaults to `3001`

2. **Database is required** for runtime flows that touch Identitas data (for example `/runtime-example`).

3. `packages/` folder exists in workspace config but is currently empty (reserved for future shared packages).

---

## 8) Where to read next

- `sdp/runtime/README.md`
- `sdp/wbp-identitas/README.md`
- `sdp/database/README.md`
- `sdp/shared/README.md`
- `sdp/database/plan.md` (domain/data model notes)

---

## 9) Current status

This repository is an active foundation/prototype:
- Runtime/context and Identitas flows are implemented
- DB schema + migrations exist
- UI apps are still partly scaffold/template-oriented

If you are onboarding, start with **Quick start**, then open **`/runtime-example`** to understand the service orchestration pattern.
