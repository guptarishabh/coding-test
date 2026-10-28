## Prerequisites

- JDK 17 or newer
- Maven 3.9+
- Node 18+ and npm
- Docker (for Postgres via docker-compose)

## Database setup

```bash
docker compose up -d db
```

This starts Postgres 16 on `localhost:5432` (db `productsdb`, user/password `products`).
The `products` table is created automatically on backend start by the Flyway migration
`backend/src/main/resources/db/migration/V1__create_products.sql`:

```sql
CREATE TABLE products (
    id   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);
```

## Start backend

```bash
cd backend
mvn spring-boot:run
```

Runs on http://localhost:8080. Run the tests with `mvn test`.

API:

- `GET  /api/products` -> `200` list of `{ "id", "name" }`, ordered by id
- `POST /api/products` with `{ "name": "P1" }` -> `201` and the created product;
  `400` with `{ "message": "..." }` for a blank, missing or malformed name

## Start frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on http://localhost:3000. The dev server proxies `/api` to the backend on port 8080.

## Verify

Open http://localhost:3000, create a product named `Bosch Drill Set`, and confirm it appears in the list.

## Notes

- Stack is the preferred one: React (Vite) + Java Spring Boot + Postgres. No deviations.
- Schema is managed by Flyway; Hibernate is set to `ddl-auto: validate` so the entity must match the migration.
- Names are trimmed and limited to 255 characters. Blank names return 400.
