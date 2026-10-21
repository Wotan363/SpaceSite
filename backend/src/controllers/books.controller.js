const booksRepository = require('../repositories/books.repository');

function getAllBooks(request, response, next) {
    const filters = {};
    for (const field of ['genre', 'series']) {
        const value = request.query[field];
        if (value !== undefined) {
            if (typeof value !== 'string' || !value.trim()) {
                return response.status(400).json({ fehler: true, nachricht: `Invalid ${field} filter` });
            }
            filters[field] = value.trim();
        }
    }
    try {
        const books = booksRepository.getAllBooks(request.app.locals.dbConnection, filters);
        response.json(books);
    } catch (error) {
        next(error);
    }
}

function getAllGenres(request, response, next) {
    try {
        const genre = booksRepository.getAllGenres(request.app.locals.dbConnection);
        response.json(genre);
    } catch (error) {
        next(error);
    }
}

function getBook(request, response, next) {
    const id = Number(request.params.id);
    if (!Number.isSafeInteger(id) || id <= 0) {
        return response.status(400).json({ fehler: true, nachricht: 'Invalid book ID' });
    }

    try {
        const book = booksRepository.getBook(request.app.locals.dbConnection, id);
        if (!book) {
            return response.status(404).json({ fehler: true, nachricht: 'Book not found' });
        }
        response.json(book);
    } catch (error) {
        next(error);
    }
}

function getAllSeries(request, response, next) {
    try {
        response.json(booksRepository.getAllSeries(request.app.locals.dbConnection));
    } catch (error) {
        next(error);
    }
}

function searchBooks(request, response, next) {
    const query = request.query.q;
    if (typeof query !== 'string' || !query.trim()) {
        return response.status(400).json({ fehler: true, nachricht: 'Search query q is required' });
    }
    try {
        response.json(booksRepository.searchBooks(request.app.locals.dbConnection, query.trim()));
    } catch (error) {
        next(error);
    }
}

module.exports = { getAllBooks, getAllGenres, getBook, getAllSeries, searchBooks };
