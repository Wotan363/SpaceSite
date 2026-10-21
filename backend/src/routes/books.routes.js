const express = require('express');
const booksController = require('../controllers/books.controller');

const router = express.Router();

router.get('/', booksController.getAllBooks);
router.get('/genres', booksController.getAllGenres);
router.get('/series', booksController.getAllSeries);
router.get('/search', booksController.searchBooks);
router.use('/:id/reviews', require('./reviews.routes'));
router.get('/:id', booksController.getBook);

module.exports = router;
