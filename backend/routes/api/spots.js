const express = require('express');
const { User, Spot, SpotImage, Review, Booking } = require('../../db/models');
const { Op } = require("sequelize");
const { check } = require('express-validator');
const { handleValidationErrors, handleBookingConflicts } = require('../../utils/validation');

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

const validateBookingConflicts = [
    check('endDate')
        .custom(async (value, { req }) => {
            const date1 = new Date(value);
            const date2 = new Date(req.body.startDate);
            if (date1 <= date2) {
                throw new Error('endDate cannot be on or before startDate')
            } else {
                return true
            }
        }),
    handleValidationErrors,
    check('startDate')
        .custom(async (value, { req }) => {
            const startDate = new Date(value);
            const endDate = new Date(req.body.endDate)
            const bookings = await Booking.findAll({ where: { spotId: req.params.spotId } });
            for (const booking of bookings) {
                let foundStartDate = new Date(booking.startDate);
                let foundEndDate = new Date(booking.endDate);
                if (startDate === foundStartDate ||
                    startDate === foundEndDate ||
                    (startDate <= foundEndDate && endDate <= foundEndDate && startDate > foundStartDate) ||
                    (startDate >= foundStartDate && endDate >= foundStartDate && startDate < foundEndDate)
                ) {
                    throw new Error('Start date conflicts with an existing booking')
                }

            }
            return value
        }),
    check('endDate')
        .custom(async (value, { req }) => {
            const startDate = new Date(req.body.startDate);
            const endDate = new Date(value)
            const bookings = await Booking.findAll({ where: { spotId: req.params.spotId } });
            for (const booking of bookings) {
                let foundStartDate = new Date(booking.startDate);
                let foundEndDate = new Date(booking.endDate);
                if (startDate === foundStartDate ||
                    startDate === foundEndDate ||
                    (startDate <= foundEndDate && endDate <= foundEndDate && startDate > foundStartDate) ||
                    (startDate >= foundStartDate && endDate >= foundStartDate && startDate < foundEndDate)
                ) {
                    throw new Error('End date conflicts with an existing booking')
                }

            }
            return value
        }),
    handleBookingConflicts,
]

// Add an image to spot by ID
router.post('/:spotId/images', async (req, res) => {
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId);
    if (spot) {
        const spotImage = await SpotImage.create(req.body);
        await spotImage.setSpot(spot);
        await spot.addSpotImage(spotImage);
        return res.json(spotImage);
    } else {
        res.status(404);
        return res.json({
            message: "Spot couldn't be found"
        })
    }
});

// Add a review to spot by ID
router.post('/:spotId/reviews', validateReview, async (req, res) => {
    const { spotId } = req.params;
    const { user } = req;
    let { review, stars } = req.body
    stars = parseInt(stars);
    const spot = await Spot.findByPk(spotId);

    //If spotId does not exist
    if (!spot) {
        res.status(404);
        return res.json({
            message: "Spot couldn't be found"
        })
    };
    //If current user already has review for spot
    const userReview = Review.findAll({
        where: {
            userId: user.id,
            spotId: spot.id
        }
    });
    if (userReview) {
        res.status(500);
        return res.json({
            message: "User already has a review for this spot"
        })
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
    const reviews = await Review.findAll({
        include: 'Spot',
        where: {
            spotId: spotId
        }
    });
    if (reviews.length > 0) {
        res.json(reviews);
    } else {
        res.status(404);
        return res.json({
            message: "Spot couldn't be found"
        })
    }
});

//Get all bookings by spotId
router.get('/:spotId/bookings', async (req, res) => {
    const { spotId } = req.params;
    const { user } = req;
    const spot = await Spot.findByPk(spotId);
    let bookings = {};
    if (!spot) {
        res.status(404);
        return res.json({
            message: "Spot couldn't be found"
        })
    };
    //If user is the owner of the spot
    if (spot.ownerId === user.id) {
        bookings = await spot.getBookings({
            include: [
                {
                    model: User,
                    attributes: {
                        exclude: ['username', 'email', 'hashedPassword', 'createdAt', 'updatedAt']
                    }
                }
            ]
        });
    } else {
        bookings = await spot.getBookings();
    }

    return res.json(bookings);
});

// Add a booking to spot by ID
router.post('/:spotId/bookings', validateBookingConflicts, async (req, res) => {
    const { spotId } = req.params;
    const { user } = req;
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
        res.status(404);
        return res.json({
            message: "Spot couldn't be found"
        })
    };
    const booking = await Booking.create(req.body);
    await booking.setSpot(spot);
    await booking.setUser(user);
    await spot.addBooking(booking);
    res.json(booking);
});

//Create spot
router.post('/', validateSpot, async (req, res) => {
    const spot = await Spot.create(req.body)
    res.json(spot);
});

//Get all spots owned by current user
router.get('/current', async (req, res) => {
    const { user } = req;
    let spots = {};
    if (user) {
        spots = await Spot.findAll({
            include: 'User',
            where: {
                ownerId: user.id
            }
        })
        return res.json(spots)
    } else {
        throw new Error('error')
    }
});

//Get spot by ID
router.get('/:spotId', async (req, res) => {
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId);
    if (spot) {
        return res.json(spot);
    } else {
        res.status(404);
        res.json({
            message: "Spot couldn't be found"
        })
    }
});

//Edit a spot
router.put('/:spotId', validateSpot, async (req, res) => {
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
        res.status(404);
        return res.json({
            message: "Spot couldn't be found"
        })
    };
    const updatedSpot = await spot.update(req.body);
    res.json(updatedSpot);
});

//Delete a spot
router.delete('/:spotId', async (req, res) => {
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId);
    if (spot) {
        await spot.destroy();
        return res.json({
            message: "Successfully deleted"
        });
    } else {
        res.status(404);
        res.json({
            message: "Spot couldn't be found"
        })
    }
});

//Get all spots
router.get('/', async (req, res) => {
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

    page = parseInt(page);
    size = parseInt(size);

    if (Number.isNaN(page)) page = 1;
    if (page < 1) {
        res.status(400);
        return res.json({
            errors: [
                { message: "Page must be greater than or equal to 1", }
            ]
        })
    };
    if (page > 10) page = 10;
    if (Number.isNaN(size) || size > 20) size = 20;
    if (size < 1) {
        res.status(400);
        return res.json({
            errors: [
                { message: "Size must be greater than or equal to 1", }
            ]
        })
    };

    const where = {};

    if (minLat && !Number.isNaN(minLat)) {
        where.lat = { [Op.gte]: minLat };
    } else if (Number.isNaN(minLat)) {
        res.status(400);
        return res.json({
            errors: [
                { message: "Minimum latitude is invalid", }
            ]
        })
    };

    if (maxLat && !Number.isNaN(maxLat)) {
        where.lat = { [Op.lte]: maxLat };
    } else if (Number.isNaN(maxLat)) {
        res.status(400);
        return res.json({
            errors: [
                { message: "Maximum latitude is invalid", }
            ]
        })
    };

    if (minLng && !Number.isNaN(minLng)) {
        where.lng = { [Op.gte]: minLng };
    } else if (Number.isNaN(minLng)) {
        res.status(400);
        return res.json({
            errors: [
                { message: "Minimum longitude is invalid", }
            ]
        })
    };

    if (maxLng && !Number.isNaN(maxLng)) {
        where.lng = { [Op.lte]: maxLng };
    } else if (Number.isNaN(maxLng)) {
        res.status(400);
        return res.json({
            errors: [
                { message: "Maximum longitude is invalid", }
            ]
        })
    };

    if (minPrice && !Number.isNaN(minPrice) && minPrice >= 0) {
        where.price = { [Op.gte]: minPrice };
    } else if (Number.isNaN(minPrice) || minPrice < 0) {
        res.status(400);
        return res.json({
            errors: [
                { message: "Minimum price must be greater than or equal to 0", }
            ]
        })
    };

    if (maxPrice && !Number.isNaN(maxPrice) && maxPrice >= 0) {
        where.price = { [Op.lte]: maxPrice };
    } else if (Number.isNaN(maxPrice) || maxPrice < 0) {
        res.status(400);
        return res.json({
            errors: [
                { message: "Maximum price must be greater than or equal to 0", }
            ]
        })
    };

    const spots = await Spot.findAll({
        where,
        limit: size,
        offset: (page - 1) * size
    });
    console.log(where, "*****")
    res.json({
        spots,
        page, size
    });
});


module.exports = router;
