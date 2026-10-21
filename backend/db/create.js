
const db = require('../src/config/database');

db.exec(`
    CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        isbn TEXT UNIQUE,
        genre TEXT,
        cover_path TEXT,
        series TEXT
    );

    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reviews (
        book_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        rating INTEGER NOT NULL
            CHECK (rating BETWEEN 1 AND 5),
        comment TEXT,

        PRIMARY KEY (book_id, user_id),

        FOREIGN KEY (book_id)
            REFERENCES books(id),

        FOREIGN KEY (user_id)
            REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS user_booklist (
        user_id INTEGER NOT NULL,
        book_id INTEGER NOT NULL,
        is_read INTEGER NOT NULL DEFAULT 0
            CHECK (is_read IN (0, 1)),

        PRIMARY KEY (user_id, book_id),
        FOREIGN KEY (user_id)
            REFERENCES users(id)
        FOREIGN KEY (book_id)
            REFERENCES books(id)
    );
`);

console.log('Database tables created.');
