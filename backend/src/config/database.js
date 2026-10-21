
const Database = require('better-sqlite3');
const path = require('node:path');

// Open the database file.
// SQLite creates it if it doesn't exist.
const db = new Database(
    path.join(__dirname, '../../db/library.db')
);

// Enable foreign key constraints
db.pragma('foreign_keys = ON');

module.exports = db;
