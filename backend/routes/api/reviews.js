const express = require('express');
const { Spot, Review } = require('../../db/models');

const router = express.Router();

router.put('/:reviewId', async (req, res) => {
    const { reviewId } = req.params;
    const review = await Review.findByPk(reviewId);
    const updatedReview = await review.update(req.body);
    res.json(updatedReview);
})


module.exports = router;
