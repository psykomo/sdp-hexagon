# Database Package

This package manages the database schema and migrations using [Drizzle ORM](https://orm.drizzle.team/).

## Setup

1.  Copy the example environment file (if available) or create a `.env` file in the root of the **workspace** (not in this package).
2.  Set the `DATABASE_URL` variable in the root `.env`:
    ```bash
    DATABASE_URL=postgres://user:password@host:port/database_name
    ```

## Managing Migrations

### 1. Generate Migrations

When you modify the schema in `src/schema`, you need to generate a new migration file.

```bash
pnpm run generate
```

This command will:
-   Inspect your schema changes.
-   Create a new SQL migration file in the `drizzle` directory.

### 2. Apply Migrations

You have two ways to apply migrations to your database:

#### Option A: Development (Using Drizzle Kit)
This is the quick way to apply changes during local development.

```bash
pnpm run migrate
```

#### Option B: Production / Programmatic (Using Script)
This uses the custom migration script (`src/migrate.ts`), which is useful for CI/CD pipelines or production environments where you might want more control or logging.

```bash
pnpm run migrate:run
```

## Schema Development

-   Define your tables in `src/schema/`.
-   Export new tables in `src/schema/index.ts`.
-   Run `pnpm run generate` to create the migration.
