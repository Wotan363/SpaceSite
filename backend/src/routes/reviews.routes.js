const express = require('express');
const reviewsController = require('../controllers/reviews.controller');

const router = express.Router({ mergeParams: true });

router.get('/', reviewsController.getBookReviews);

module.exports = router;
