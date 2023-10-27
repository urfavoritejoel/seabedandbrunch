const express = require('express');
const { Review, ReviewImage } = require('../../db/models');
const { Op } = require("sequelize");
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateReview = [
    check('review')
        .exists()
        .notEmpty()
        .withMessage('Review text is required'),
    check('stars')
        .exists()
        .notEmpty()
        .isInt({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
]

//Edit a review
router.put('/:reviewId', validateReview, async (req, res) => {
    const { reviewId } = req.params;
    const { user } = req
    const review = await Review.findByPk(reviewId);
    if (!review) {
        res.status(404);
        return res.json({
            message: "Review couldn't be found"
        })
    };
    const updatedReview = await review.update(req.body);
    await updatedReview.setUser(user);
    res.json(updatedReview);
});

//Delete a review
router.delete('/:reviewId', async (req, res) => {
    const { reviewId } = req.params;
    const review = await Review.findByPk(reviewId);
    if (!review) {
        res.status(404);
        return res.json({
            message: "Review couldn't be found"
        })
    };
    await review.destroy();
    res.json({ message: "Successfully deleted review" });
});

//Get all reviews of the current user
router.get('/current', async (req, res) => {
    const { user } = req;
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

// Add an image to review by ID
router.post('/:reviewId/images', async (req, res) => {
    const { reviewId } = req.params;
    const review = await Review.findByPk(req.params.reviewId);
    //ReviewId doesn't exist
    if (!review) {
        res.status(404);
        return res.json({
            message: "Review couldn't be found"
        })
    };
    //Maximum number of images reached
    const images = await review.getReviewImages();
    if (images.length >= 10) {
        res.status(403);
        return res.json({
            message: "Maximum number of images for this resource was reached"
        })
    };

    const reviewImage = await ReviewImage.create(req.body);
    await reviewImage.setReview(review);
    await review.addReviewImage(reviewImage);
    res.json(reviewImage);
});

module.exports = router;
