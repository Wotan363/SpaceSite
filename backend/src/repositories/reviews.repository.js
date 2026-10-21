function getBookReviews(db, bookId) {
    return db.prepare(`
        SELECT users.username, reviews.rating, reviews.comment
        FROM reviews
        JOIN users ON users.id = reviews.user_id
        WHERE reviews.book_id = ?
        ORDER BY reviews.user_id
    `).all(bookId);
}

module.exports = { getBookReviews };
