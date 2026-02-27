# Hexagon - SDP (Sistem Database Permasyarakten)

Monorepo for Sistem Database Permasyarakten - Indonesian correctional management system (WBP - Warga Binaan Permasyarakten).

## Tech Stack

| Layer | Technology |
|-------|------------|
| Build | Turborepo, pnpm 9.0 |
| Frontend | Next.js 15, React, TypeScript, Tailwind CSS |
| Backend | Express.js, Drizzle ORM |
| Database | PostgreSQL 16 |
| Testing | Vitest |

## Project Structure

```
hexagon/
├── apps/
│   ├── web/           # Main Next.js application
│   └── docs/          # Documentation site
├── sdp/
│   ├── database/      # Drizzle schema & migrations
│   ├── runtime/       # Runtime utilities
│   ├── shared/        # Shared types & config
│   └── wbp-identitas/ # WBP identity API server
└── packages/          # Shared packages (reserved)
```

## Getting Started

### Prerequisites

- Node.js >= 20.9.0
- pnpm 9.0+
- Docker & Docker Compose

### Setup Database

```bash
# Start PostgreSQL container
docker-compose up -d
```

### Install Dependencies

```bash
pnpm install
```

### Development

```bash
# Run all apps
pnpm dev

# Run specific app
pnpm dev --filter=web
pnpm dev --filter=wbp-identitas
```

### Build

```bash
pnpm build
```

### Type Check

```bash
pnpm check-types
```

## Database

### Schemas

- `identitas` - WBP identity data
- `perkara` - Case/violation records
- `mutasi` - Inter-prison transfers
- `lembaga` - Correctional institutions
- `tahapan_perkara` - Case stages

### Migration

```bash
cd sdp/database
pnpm migrate
```

## Architecture

Using Clean Architecture with the following pattern:

```
src/
├── port/      # Interface/contract
├── repository/ # Data access implementation
├── service/  # Business logic
├── routes/   # HTTP handlers
└── types/    # Type definitions
```

## Environment

Copy `.env.example` to `.env` and adjust the values.

```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/sdp
```
