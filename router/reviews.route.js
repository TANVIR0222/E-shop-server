const express = require('express');
const { review, getReviews, getReviewsById } = require('../controllers/review.controller');
const router = express.Router();

router.post('/post-reviews', review )
router.get('/total-reviews', getReviews )
router.get('/:userId', getReviewsById )

module.exports = router;