# Deployment

## Prerequisites

- Docker Engine with Docker Compose v2
- A public domain and HTTPS reverse proxy for internet deployment
- OpenSSL (to generate deployment secrets)

## Configure

Copy `.env.example` to `.env`. Generate independent secrets and place them in `DB_PASSWORD` and `JWT_SECRET`:

```sh
openssl rand -hex 32
```

`JWT_SECRET` must be at least 32 bytes. Never commit `.env` or reuse the example values.

Set these values before building:

- `NEXT_PUBLIC_API_URL`: browser-reachable API base URL, such as `https://api.example.com` or `https://commuto.example.com` when the reverse proxy routes `/api` and `/ws` to the backend.
- `APP_CORS_ALLOWED_ORIGINS`: comma-separated exact frontend origins, such as `https://commuto.example.com`.
- `FRONTEND_BIND_ADDRESS` and `BACKEND_BIND_ADDRESS`: leave at `127.0.0.1` when a host reverse proxy terminates TLS.

Next.js embeds `NEXT_PUBLIC_API_URL` into the browser bundle during `next build`; changing the runtime container environment alone does not change that URL. Rebuild the frontend image after changing it.

## Start and Operate

```sh
docker compose up --build -d
docker compose ps
docker compose logs -f backend frontend
```

The stack starts PostgreSQL, waits for its health check, runs Flyway migrations, starts the API, then starts the frontend. The database is stored in the `commuto-postgres` named volume. Back it up before deploying schema changes:

```sh
docker compose exec -T database sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' > commuto-backup.sql
```

Do not use `docker compose down -v` unless you intend to delete the database volume. The backend health endpoint is `/actuator/health`; only the health endpoint is exposed by Spring Actuator.

For production, configure the reverse proxy with HTTPS and WebSocket upgrade support for `/ws`. Browsers require HTTPS for geolocation outside localhost. Keep PostgreSQL private and restrict API exposure at the proxy/firewall. Use managed secrets rather than plain `.env` storage on shared hosts.

## Database

Flyway applies `backend/src/main/resources/db/migration` to a new database. Hibernate uses `ddl-auto=validate` in the default configuration, so it will not silently alter a production schema. For an existing Hibernate-created database, take a backup first; Flyway baselines the non-empty schema at version 0 and the idempotent initial migration creates any missing Commuto tables/indexes before Hibernate validates it.

Spring tests use an isolated in-memory H2 database and do not require a running PostgreSQL service.

## Release Checks and Known Limits

Run the frontend checks and backend tests before building images:

```sh
cd frontend
npm ci
npm run lint
npm run build
npx tsc --noEmit

cd ../backend
./mvnw verify
```

Docker Compose was not executable in the development environment used to prepare this package; build and `docker compose config` should be run on a host with Docker before deployment. The repository also contains UI areas whose README descriptions exceed the current backend's persisted API model; verify ratings, verification, safety/SOS, fraud, and analytics workflows before advertising them as production features. Public OpenStreetMap Nominatim/OSRM services are used by the tracking UI and have usage limits; use a provider/service with an appropriate production agreement and quota for public traffic.