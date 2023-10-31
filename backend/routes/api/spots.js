const express = require('express');
const { User, Spot, SpotImage, Review, ReviewImage, Booking } = require('../../db/models');
const { Op } = require("sequelize");
const { check } = require('express-validator');
const { handleValidationErrors, handleBookingConflicts } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const booking = require('../../db/models/booking');

const router = express.Router();

const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Country is required'),
    check('lat')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isDecimal({ min: -90, max: 90 })
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isDecimal({ min: -180, max: 180 })
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isLength({ max: 49 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isNumeric()
        .withMessage('Price per day is required'),

    handleValidationErrors
];

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
];

const validateQueries = [
    check('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be greater than or equal to 1'),
    check('size')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Size must be greater than or equal to 1'),
    check('maxLat')
        .optional()
        .isFloat({ min: -90, max: 90 })
        .withMessage('Maximum latitude is invalid'),
    check('minLat')
        .optional()
        .isFloat({ min: -90, max: 90 })
        .withMessage('Minimum latitude is invalid'),
    check('minLng')
        .optional()
        .isFloat({ min: -180, max: 180 })
        .withMessage('Minimum longitude is invalid'),
    check('maxLng')
        .optional()
        .isFloat({ min: -180, max: 180 })
        .withMessage('Maximum longitude is invalid'),
    check('minPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Minimum price must be greater than or equal to 0'),
    check('maxPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Maximum price must be greater than or equal to 0'),
    handleValidationErrors
]

const validateBookingConflicts = [
    check('endDate')
        .custom(async (value, { req }) => {
            const date1 = Date.parse(value);
            const date2 = Date.parse(req.body.startDate);
            if (date1 <= date2) {
                throw new Error('endDate cannot be on or before startDate')
            } else {
                return true
            }
        }),
    handleValidationErrors,
    check('startDate')
        .custom(async (value, { req }) => {
            const startDate = Date.parse(req.body.startDate);
            const endDate = Date.parse(req.body.endDate)
            const bookings = await Booking.findAll({ where: { spotId: req.params.spotId } });
            for (const booking of bookings) {
                let foundStartDate = Date.parse(booking.startDate);
                let foundEndDate = Date.parse(booking.endDate);
                if (startDate === foundStartDate ||
                    startDate === foundEndDate ||
                    endDate === foundStartDate ||
                    endDate === foundEndDate ||
                    (startDate < foundStartDate && endDate > foundEndDate) ||
                    (startDate <= foundEndDate && endDate <= foundEndDate && startDate > foundStartDate) ||
                    (startDate >= foundStartDate && endDate >= foundStartDate && startDate < foundEndDate) ||
                    (startDate < foundStartDate && endDate < foundEndDate && endDate >= foundStartDate)
                ) {
                    throw new Error('Start date conflicts with an existing booking')
                }

            }
            return value
        }),
    check('endDate')
        .custom(async (value, { req }) => {
            const startDate = Date.parse(req.body.startDate);
            const endDate = Date.parse(req.body.endDate)
            const bookings = await Booking.findAll({ where: { spotId: req.params.spotId } });
            for (const booking of bookings) {
                let foundStartDate = Date.parse(booking.startDate);
                let foundEndDate = Date.parse(booking.endDate);
                if (startDate === foundStartDate ||
                    startDate === foundEndDate ||
                    endDate === foundStartDate ||
                    endDate === foundEndDate ||
                    (startDate < foundStartDate && endDate > foundEndDate) ||
                    (startDate <= foundEndDate && endDate <= foundEndDate && startDate > foundStartDate) ||
                    (startDate >= foundStartDate && endDate >= foundStartDate && startDate < foundEndDate) ||
                    (startDate < foundStartDate && endDate < foundEndDate && endDate >= foundStartDate)
                ) {
                    throw new Error('End date conflicts with an existing booking')
                }

            }
            return value
        }),
    handleBookingConflicts,
]

const requireProperAuth = (user, id) => {
    return user.id === id;
}

// Add an image to spot by ID
router.post('/:spotId/images', requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
        res.status(404);
        return res.json({
            message: "Spot couldn't be found"
        });
    };
    if (!requireProperAuth(req.user, spot.ownerId)) {
        res.status(403);
        return res.json({
            message: "Forbidden"
        });
    };
    const spotImage = await SpotImage.create(req.body);
    await spotImage.setSpot(spot);
    // await spot.addSpotImage(spotImage);
    return res.json(spotImage);
});

// Add a review to spot by ID
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res) => {
    const { spotId } = req.params;
    const { user } = req;
    let { review, stars } = req.body
    stars = parseInt(stars);
    // const spot = await Spot.findByPk(spotId);
    const spot = await Spot.findOne({
        where: {
            id: spotId
        },
        include: [
            {
                model: Review,
            }
        ]
    })
    //If spotId does not exist
    if (!spot) {
        res.status(404);
        return res.json({
            message: "Spot couldn't be found"
        })
    };
    //If current user already has review for spot
    if (spot.Reviews.length > 0) {
        for (let i = 0; i < spot.Reviews.length; i++) {
            let review = spot.Reviews[i];
            if (review.userId === user.id) {
                res.status(500);
                return res.json({
                    message: "User already has a review for this spot"
                })
            }
        }
    }
    //Success
    const newReview = await Review.create(req.body);
    await newReview.setSpot(spot);
    await newReview.setUser(user);
    await spot.addReview(newReview);
    res.json(newReview);
});

//Get all reviews by spotId
router.get('/:spotId/reviews', async (req, res) => {
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId)
    if (!spot) {
        res.status(404);
        return res.json({
            message: "Spot couldn't be found"
        })
    };
    const Reviews = await Review.findAll({
        where: {
            spotId: spotId
        },
        include: [{
            model: User,
            attributes: {
                exclude: ['username', 'email', 'hashedPassword', 'createdAt', 'updatedAt']
            }
        },
        {
            model: ReviewImage,
            attributes: {
                exclude: ['reviewId', 'createdAt', 'updatedAt']
            }
        }]
    });
    return res.json({ Reviews });
});

//Get all bookings by spotId
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const { user } = req;
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
        res.status(404);
        return res.json({
            message: "Spot couldn't be found"
        })
    };
    const bookings = await Booking.findAll({
        where: {
            spotId: spotId
        },
        include: [
            {
                model: User,
                attributes: {
                    exclude: ['username', 'email', 'hashedPassword', 'createdAt', 'updatedAt']
                }
            },
            {
                model: Spot
            }
        ]
    })

    const Bookings = [];
    bookings.forEach(booking => {
        Bookings.push(booking.toJSON());
    })
    Bookings.forEach(booking => {
        console.log(user.id, "***", booking.Spot.ownerId);
        if (user.id !== booking.Spot.ownerId) {
            delete booking.User;
            delete booking.id;
            delete booking.userId;
            delete booking.createdAt;
            delete booking.updatedAt;
        }
        delete booking.Spot
    })
    return res.json({ Bookings });
});

// Create a booking to spot by ID
router.post('/:spotId/bookings', requireAuth, validateBookingConflicts, async (req, res) => {
    const { spotId } = req.params;
    const { user } = req;
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
        res.status(404);
        return res.json({
            message: "Spot couldn't be found"
        })
    };
    //Check if current user owns spot, owner cannot create booking
    if (requireProperAuth(req.user, spot.ownerId)) {
        res.status(403);
        return res.json({
            message: "Forbidden"
        });
    };
    let startDate = Date.parse(req.body.startDate);
    let endDate = Date.parse(req.body.endDate);
    if (Date.now() > startDate || Date.now() > endDate) {
        res.status(403);
        return res.json({
            message: "Dates in the past"
        })
    }
    const booking = await Booking.create(req.body);
    await booking.setSpot(spot);
    await booking.setUser(user);
    await spot.addBooking(booking);
    res.json(booking);
});

//Create spot
router.post('/', requireAuth, validateSpot, async (req, res) => {
    const { user } = req;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const spot = await Spot.create({
        ownerId: user.id,
        address: address,
        city: city,
        state: state,
        country: country,
        lat: lat,
        lng: lng,
        name: name,
        description: description,
        price: price
    })
    res.json(spot);
});

//Get all spots owned by current user
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;
    const spots = await Spot.findAll({
        where: {
            ownerId: user.id
        },
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            },
            {
                model: User, as: "Owner"
            }
        ]
    });

    //Set preview image
    let Spots = [];
    spots.forEach(spot => {
        Spots.push(spot.toJSON());
    });
    Spots.forEach(spot => {
        spot.SpotImages.forEach(image => {
            if (image.preview === true) {
                spot.previewImage = image.url;
            }
        })
        if (!spot.previewImage) {
            spot.previewImage = "No preview image found"
        }
        //Set avgRating
        let avgRating = 0;
        spot.Reviews.forEach(review => {
            avgRating += review.stars
        })
        avgRating = avgRating / spot.Reviews.length;
        if (!isNaN(avgRating)) {
            spot.avgRating = avgRating;
        } else {
            spot.avgRating = 0;
        }
        delete spot.SpotImages;
        delete spot.Reviews;
    })



    res.json({
        Spots
    });
    return res.json(spots)
});

//Get spot by ID
router.get('/:spotId', async (req, res) => {
    const { spotId } = req.params;
    // const spot = await Spot.findByPk(spotId);

    const spot = await Spot.findOne({
        where: {
            id: spotId
        },
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            },
            {
                model: User, as: 'Owner'
            }
        ]
    });
    if (!spot) {
        res.status(404);
        res.json({
            message: "Spot couldn't be found"
        })
    }

    let jSpot = spot.toJSON();

    //Set avgRating
    let avgRating = 0;
    jSpot.Reviews.forEach(review => {
        avgRating += review.stars
    })
    //Set
    jSpot.numReviews = jSpot.Reviews.length
    avgRating = avgRating / jSpot.Reviews.length;
    if (!isNaN(avgRating)) {
        jSpot.avgStarRating = avgRating;
    } else {
        jSpot.avgRating = 0;
    }
    delete jSpot.Reviews;

    res.json(jSpot)
});

//Edit a spot
router.put('/:spotId', requireAuth, validateSpot, async (req, res) => {
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
        res.status(404);
        return res.json({
            message: "Spot couldn't be found"
        })
    };
    if (!requireProperAuth(req.user, spot.ownerId)) {
        res.status(403);
        return res.json({
            message: "Forbidden"
        });
    };
    const updatedSpot = await spot.update(req.body);
    res.json(updatedSpot);
});

//Delete a spot
router.delete('/:spotId', requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
        res.status(404);
        return res.json({
            message: "Spot couldn't be found"
        })
    };
    if (!requireProperAuth(req.user, spot.ownerId)) {
        res.status(403);
        return res.json({
            message: "Forbidden"
        });
    };
    await spot.destroy();
    return res.json({
        message: "Successfully deleted"
    });
});

//Get all spots
router.get('/', validateQueries, async (req, res) => {
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

    page = parseInt(page);
    size = parseInt(size);

    if (Number.isNaN(page)) page = 1;
    if (page > 10) page = 10;
    if (Number.isNaN(size) || size > 20) size = 20;

    const where = {};

    if (minLat) {
        where.lat = { [Op.gte]: minLat };
    }

    if (maxLat) where.lat = { [Op.lte]: maxLat };
    if (minLng) where.lng = { [Op.gte]: minLng };
    if (maxLng) where.lng = { [Op.lte]: maxLng };
    if (minPrice) where.price = { [Op.gte]: minPrice };
    if (maxPrice) where.price = { [Op.lte]: maxPrice };

    const spots = await Spot.findAll({
        where,
        limit: size,
        offset: (page - 1) * size,
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            }
        ]
    });

    //Set preview image
    let Spots = [];
    spots.forEach(spot => {
        Spots.push(spot.toJSON());
    });
    Spots.forEach(spot => {
        spot.SpotImages.forEach(image => {
            if (image.preview === true) {
                spot.previewImage = image.url;
            }
        })
        if (!spot.previewImage) {
            spot.previewImage = "No preview image found"
        }
        //Set avgRating
        let avgRating = 0;
        spot.Reviews.forEach(review => {
            avgRating += review.stars
        })
        avgRating = avgRating / spot.Reviews.length;
        if (!isNaN(avgRating)) {
            spot.avgRating = avgRating;
        } else {
            spot.avgRating = 0;
        }
        delete spot.SpotImages;
        delete spot.Reviews;
    })



    res.json({
        Spots,
        page, size
    });
});


module.exports = router;
