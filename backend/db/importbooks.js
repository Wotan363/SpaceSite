
const fs = require('node:fs');
const path = require('node:path');
const { parse } = require('csv-parse/sync');
const db = require('../src/config/database');

const csvPath = path.join(__dirname, 'books1.csv');
const csv = fs.readFileSync(csvPath, 'utf8');

const books = parse(csv, {
    columns: true,
    delimiter: ',',
    skip_empty_lines: true,
    bom: true,
    trim: true
});

const insertBook = db.prepare(`
    INSERT INTO books (title, author, genre, isbn, series)
    VALUES (?, ?, ?, ?, ?)
`);

const findBook = db.prepare(`
    SELECT id FROM books
    WHERE title = ? AND author = ?
`);

const importBooks = db.transaction((books) => {
    let imported = 0;
    let skipped = 0;

    for (const book of books) {
        if (!book.title || !book.author) {
            console.warn('Invalid book:', book);
            skipped++;
            continue;
        }

        const existing = findBook.get(
            book.title,
            book.author
        );

        if (existing) {
            console.log(`Skipping duplicate: ${book.title}`);
            skipped++;
            continue;
        }

        insertBook.run(
            book.title,
            book.author,
            book.genre || null,
            book.isbn || null,
            book.series || null
        );

        imported++;
    }

    return { imported, skipped };
});

const result = importBooks(books);

console.log('\nImport completed!');
console.log(`Total rows: ${books.length}`);
console.log(`Imported: ${result.imported}`);
console.log(`Skipped: ${result.skipped}`);
