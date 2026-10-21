
const db = require('../src/config/database');

const insertBook = db.prepare(`
    INSERT INTO books (title, author, genre)
    VALUES (?, ?, ?)
`);

const result = insertBook.run(
    'Deployable AI SAAS From Backend in Python to Stripe Integration',
    'Zenva Academy',
    'Computer Science & Technology'
);

console.log('Book added with ID:', result.lastInsertRowid);
