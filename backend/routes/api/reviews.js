const express = require('express');
const { Review, ReviewImage, Spot, User, SpotImage } = require('../../db/models');
const { Op } = require("sequelize");
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const review = require('../../db/models/review');

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

const requireProperAuth = (user, id) => {
    return user.id === id;
}

//Edit a review
router.put('/:reviewId', requireAuth, validateReview, async (req, res) => {
    const { reviewId } = req.params;
    const { user } = req
    const review = await Review.findByPk(reviewId);
    if (!review) {
        res.status(404);
        return res.json({
            message: "Review couldn't be found"
        })
    };
    if (!requireProperAuth(req.user, review.userId)) {
        res.status(403);
        return res.json({
            message: "Forbidden"
        });
    };
    const updatedReview = await review.update(req.body);
    await updatedReview.setUser(user);
    res.json(updatedReview);
});

//Delete a review
router.delete('/:reviewId', requireAuth, async (req, res) => {
    const { reviewId } = req.params;
    const review = await Review.findByPk(reviewId);
    if (!review) {
        res.status(404);
        return res.json({
            message: "Review couldn't be found"
        })
    };
    if (!requireProperAuth(req.user, review.userId)) {
        res.status(403);
        return res.json({
            message: "Forbidden"
        });
    };
    await review.destroy();
    res.json({ message: "Successfully deleted" });
});

//Get all reviews of the current user
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;
    const reviews = await Review.findAll({
        where: {
            userId: user.id
        },
        include: [
            {
                model: User,
                attributes: {
                    exclude: ['username', 'email', 'hashedPassword', 'createdAt', 'updatedAt']
                }
            },
            {
                model: Spot,
                include: {
                    model: SpotImage
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            },
            {
                model: ReviewImage,
                attributes: {
                    exclude: ['reviewId', 'createdAt', 'updatedAt']
                }
            },
        ]
    })

    const Reviews = [];
    reviews.forEach(review => {
        Reviews.push(review.toJSON());
    });
    Reviews.forEach(review => {
        review.Spot.SpotImages.forEach(image => {
            if (image.preview === true) {
                review.Spot.previewImage = image.url;
            }
        })
        if (!review.Spot.previewImage) {
            review.Spot.previewImage = "No preview image found"
        }
        delete review.Spot.SpotImages;
    });
    res.json({ Reviews })
});

// Add an image to review by ID
router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const { reviewId } = req.params;
    const review = await Review.findByPk(reviewId);
    //ReviewId doesn't exist
    if (!review) {
        res.status(404);
        return res.json({
            message: "Review couldn't be found"
        })
    };
    if (!requireProperAuth(req.user, review.userId)) {
        res.status(403);
        return res.json({
            message: "Forbidden"
        });
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
    let result = { id: reviewImage.id, url: reviewImage.url };
    res.json(result);
});

module.exports = router;
