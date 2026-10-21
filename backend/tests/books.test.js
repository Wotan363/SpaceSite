const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const express = require('express');
const Database = require('better-sqlite3');

let db;
let server;
let baseUrl;

before(async () => {
    db = new Database(':memory:');
    db.exec(`
        CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT, author TEXT,
            isbn TEXT, genre TEXT, series TEXT);
        CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password_hash TEXT);
        CREATE TABLE reviews (book_id INTEGER, user_id INTEGER, rating INTEGER, comment TEXT);
        INSERT INTO books VALUES
            (1, 'Dune', 'Frank Herbert', '9780441172719', 'Science Fiction', 'Dune'),
            (2, 'Children', 'Frank Herbert', '9780441104024', 'Science Fiction', 'Dune'),
            (3, '100% Real_Test', 'Someone', NULL, 'Fantasy', NULL),
            (4, 'Other', 'Another', NULL, 'Fantasy', ''),
            (5, 'Last', 'Writer', NULL, 'Fantasy', '   ');
        INSERT INTO users VALUES (1, 'alice', 'secret'), (2, 'bob', 'private');
        INSERT INTO reviews VALUES (1, 1, 5, 'Great'), (1, 2, 4, NULL), (2, 1, 3, 'Other book');
    `);
    const app = express();
    app.locals.dbConnection = db;
    app.use('/api/books', require('../src/routes/books.routes'));
    app.use((error, request, response, next) => {
        response.status(500).json({ fehler: true, nachricht: 'Internal server error' });
    });
    server = app.listen(0, '127.0.0.1');
    await once(server, 'listening');
    baseUrl = `http://127.0.0.1:${server.address().port}/api/books`;
});

after(async () => {
    if (server) await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
    if (db) db.close();
});

async function get(path, status = 200) {
    const response = await fetch(baseUrl + path);
    assert.equal(response.status, status, path);
    return response.json();
}

test('catalogue lists, genre and series filters, and combined filters', async () => {
    assert.equal((await get('')).length, 5);
    assert.deepEqual((await get('?genre=Fantasy')).map(book => book.id), [3, 4, 5]);
    assert.deepEqual((await get('?series=Dune')).map(book => book.id), [1, 2]);
    assert.deepEqual(await get('?genre=Fantasy&series=Dune'), []);
    assert.equal((await get('?genre=Science%20Fiction&series=Dune')).length, 2);
    assert.deepEqual(await get('/genres'), [{ genre: 'Fantasy' }, { genre: 'Science Fiction' }]);
    assert.deepEqual(await get('/series'), [{ series: 'Dune' }]);
    await get('?genre=', 400);
    await get('?series=a&series=b', 400);
});

test('search matches all four fields and treats wildcards and SQL input literally', async () => {
    for (const [query, ids] of [
        ['dune', [1, 2]], ['herbert', [1, 2]], ['Children', [2]],
        ['9780441172719', [1]], ['%', [3]], ['_', [3]],
        ["' OR 1=1 --", []], ['missing', []]
    ]) {
        assert.deepEqual((await get('/search?q=' + encodeURIComponent(query))).map(book => book.id), ids);
    }
    for (const path of ['/search', '/search?q=', '/search?q=%20', '/search?q=a&q=b']) {
        await get(path, 400);
    }
});

test('invalid and missing IDs never reuse the preceding valid book response', async () => {
    for (const id of ['abc', '0', '-1', '1.5', '9007199254740992', '999']) {
        assert.equal((await get('/1')).title, 'Dune');
        assert.deepEqual(await get('/' + id, id === '999' ? 404 : 400), {
            fehler: true,
            nachricht: id === '999' ? 'Book not found' : 'Invalid book ID'
        });
    }
    assert.equal((await get('/1')).title, 'Dune');
});

test('reviews expose only public fields and distinguish empty, missing, and invalid books', async () => {
    assert.deepEqual(await get('/1/reviews'), [
        { username: 'alice', rating: 5, comment: 'Great' },
        { username: 'bob', rating: 4, comment: null }
    ]);
    assert.deepEqual(await get('/3/reviews'), []);
    await get('/999/reviews', 404);
    await get('/abc/reviews', 400);
});

test('database errors reach the error handler', async () => {
    db.exec('ALTER TABLE reviews RENAME TO unavailable_reviews');
    try {
        assert.deepEqual(await get('/1/reviews', 500), {
            fehler: true, nachricht: 'Internal server error'
        });
    } finally {
        db.exec('ALTER TABLE unavailable_reviews RENAME TO reviews');
    }
});
