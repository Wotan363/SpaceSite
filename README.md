# SpaceSite

University web applications project: a shared book catalogue with planned personal reading lists.

The current backend uses Node.js, Express, and SQLite with separate routes, controllers, repositories, and database configuration. Catalogue browsing, genre and series filters, search, selected books, and review reads are implemented. Authentication and personal-list endpoints are planned.

## Backend setup

Use Node.js 20 or later:

```bash
cd backend
npm ci
npm run db:setup
npm test
npm run dev
```

The API starts at `http://localhost:8000/api/books`.
No environment variables are currently required by the backend.

SQLite database files, dependencies, secrets, and local backups are excluded from Git. Setup creates the database from the schema and imports `backend/db/books1.csv`. The additional `backend/db/books.csv` source uses semicolon delimiters and is not imported by this command. Existing local database contents may differ from a fresh import.

## Documentation

- [Backend commands and setup](backend/README.md)
- [Initial implementation report](backend/IMPLEMENTATION_REPORT.md)
- [Importable Postman collection](backend/postman/SpaceSite.postman_collection.json)

The backend regression tests use an in-memory database and temporary local HTTP ports. They do not modify the development database.
