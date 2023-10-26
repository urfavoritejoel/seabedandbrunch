const express = require('express');
const { Spot, Review } = require('../../db/models');

const router = express.Router();

//Edit a review
router.put('/:reviewId', async (req, res) => {
    const { reviewId } = req.params;
    const { user } = req
    const review = await Review.findByPk(reviewId);
    const updatedReview = await review.update(req.body);
    updatedReview.userId = user.id
    res.json(updatedReview);
});

//Delete a review
router.delete('/:reviewId', async (req, res) => {
    const { reviewId } = req.params;
    const review = await Review.findByPk(reviewId);
    await review.destroy();
    res.json({ message: "Successfully deleted review" });
});

//Get all reviews of the current user
router.get('/current', async (req, res) => {
    const { user } = req;
    console.log(user);
    let reviews = {};
    if (user) {
        reviews = await Review.findAll({
            include: 'User',
            where: {
                userId: user.id
            }
        })
        return res.json(reviews)
    } else {
        throw new Error('error')
    }
});

module.exports = router;
