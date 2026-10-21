function getAllBooks(db, filters = {}) {
    const conditions = [];
    const values = [];
    for (const field of ['genre', 'series']) {
        if (filters[field] !== undefined) {
            conditions.push(`${field} = ?`);
            values.push(filters[field]);
        }
    }
    const where = conditions.length ? ' WHERE ' + conditions.join(' AND ') : '';
    return db.prepare('SELECT * FROM books' + where + ' ORDER BY id').all(...values);
}

function getAllGenres(db) {
    return db.prepare('SELECT genre FROM books GROUP BY genre').all();
}
function getBook(db, id) {
    return db.prepare('SELECT * FROM books WHERE id = ?').get(id);
}

function getAllSeries(db) {
    return db.prepare("SELECT DISTINCT series FROM books WHERE series IS NOT NULL AND TRIM(series) != '' ORDER BY series").all();
}

function searchBooks(db, query) {
    // Treat SQL LIKE wildcards as literal characters in user input.
    const pattern = '%' + query.replace(/[\\%_]/g, '\\$&') + '%';
    return db.prepare(`
        SELECT * FROM books
        WHERE title LIKE ? ESCAPE '\\'
           OR author LIKE ? ESCAPE '\\'
           OR series LIKE ? ESCAPE '\\'
           OR isbn LIKE ? ESCAPE '\\'
        ORDER BY id
    `).all(pattern, pattern, pattern, pattern);
}

module.exports = { getAllBooks, getAllGenres, getBook, getAllSeries, searchBooks };
