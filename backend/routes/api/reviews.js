const express = require('express');
const { Spot, Review } = require('../../db/models');

const router = express.Router();

router.put('/:reviewId', async (req, res) => {
    const { reviewId } = req.params;
    const { user } = req
    const review = await Review.findByPk(reviewId);
    const updatedReview = await review.update(req.body);
    updatedReview.userId = user.id
    res.json(updatedReview);
});

router.delete('/:reviewId', async (req, res) => {
    const { reviewId } = req.params;
    const review = await Review.findByPk(reviewId);
    await review.destroy();
    res.json({ message: "Successfully deleted review" });
});

module.exports = router;
