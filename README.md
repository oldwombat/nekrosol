# Payload CMS with Expo Frontend

## Collections

See the [Collections](https://payloadcms.com/docs/configuration/collections) docs for details on how to extend this functionality.

- #### Users (Authentication)
  Users are auth-enabled collections that have access to the admin panel.

- #### Players (Authentication)
  Players are auth-enabled collections that have access to the game.

- #### Media
  This is the uploads enabled collection. It features pre-configured sizes, focal point and manual resizing to help you manage your pictures.

### Docker

Alternatively, you can use [Docker](https://www.docker.com) to spin up this template locally. To do so, follow these steps:

1. Follow [steps 1 and 2 from above](#development), the docker-compose file will automatically use the `.env` file in your project root
1. Next run `docker-compose up`
1. Follow [steps 4 and 5 from above](#development) to login and create your first admin user

## Payload CLI
- Create new Types in `src/types/` for your collections and globals.
- `npx payload generate:types` to generate TypeScript types for your collections and globals. This is useful for type safety in your custom code and API routes.
- `npx payload migrate:create` to create a new database migration file based on changes to your collections or globals. This helps you manage schema changes in your database over time.
- `npx payload migrate` to apply any pending migrations to your database.
- `sqlite3 ./nekrosol.db "INSERT INTO payload_migrations (name, batch, created_at, updated_at) VALUES ('20260218_095609_init', (SELECT COALESCE(MAX(batch), 0) + 1 FROM payload_migrations), strftime('%Y-%m-%dT%H:%M:%fZ','now'), strftime('%Y-%m-%dT%H:%M:%fZ','now'));"` to manually insert a migration record if you need to mark a migration as applied without running it.
