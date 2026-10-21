# Backend

Use Node.js 20 or later. From this directory:

```bash
npm install
npm run db:setup
npm run dev
```

The API runs at `http://localhost:8000/api/books`.

`db:setup` creates missing tables in `db/library.db` and imports `db/books1.csv`.
It preserves existing tables and skips imported books with the same title and author.
It does not migrate existing table definitions.

Available commands:

| Command | Purpose |
| --- | --- |
| `npm start` | Start the server; restart manually after changes. |
| `npm run dev` | Start with automatic restarts. |
| `npm run db:create` | Create missing database tables. |
| `npm run db:import` | Import catalogue books from `db/books1.csv`. |
| `npm run db:setup` | Create tables, then import books. |
| `npm test` | Run read API regression tests with an in-memory database. |

Tests use temporary local HTTP ports and do not modify `db/library.db`.
They cover catalogue filters, search, selected books, validation, reviews, and database errors.
Personal-list and authentication endpoints remain to be implemented.

Import `postman/SpaceSite.postman_collection.json` for manual API requests.
See `IMPLEMENTATION_REPORT.md` for the original read API implementation report.
