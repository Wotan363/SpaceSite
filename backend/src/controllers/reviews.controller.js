const booksRepository = require('../repositories/books.repository');
const reviewsRepository = require('../repositories/reviews.repository');

function getBookReviews(request, response, next) {
    const id = Number(request.params.id);
    if (!Number.isSafeInteger(id) || id <= 0) {
        return response.status(400).json({ fehler: true, nachricht: 'Invalid book ID' });
    }

    try {
        const db = request.app.locals.dbConnection;
        if (!booksRepository.getBook(db, id)) {
            return response.status(404).json({ fehler: true, nachricht: 'Book not found' });
        }
        response.json(reviewsRepository.getBookReviews(db, id));
    } catch (error) {
        next(error);
    }
}

module.exports = { getBookReviews };
