const express = require('express');
const { Spot, SpotImage, Review, Booking } = require('../../db/models');
const { Op } = require("sequelize");

const router = express.Router();

// Add an image to spot by ID
router.post('/:spotId/images', async (req, res) => {
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId);
    const spotImage = await SpotImage.create(req.body);
    await spotImage.setSpot(spot);
    await spot.addSpotImage(spotImage);
    res.json(spotImage);
});



// Add a review to spot by ID
router.post('/:spotId/reviews', async (req, res) => {
    const { spotId } = req.params;
    const { user } = req;
    const spot = await Spot.findByPk(spotId);
    const review = await Review.create(req.body);
    await review.setSpot(spot);
    await review.setUser(user);
    await spot.addReview(review);
    res.json(review);
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
    res.json(reviews);
});

//Get all bookings by spotId
router.get('/:spotId/bookings', async (req, res) => {
    const { spotId } = req.params;
    const bookings = await Booking.findAll({
        include: 'Spot',
        where: {
            spotId: spotId
        }
    });
    res.json(bookings);
});

// Add a booking to spot by ID
router.post('/:spotId/bookings', async (req, res) => {
    const { spotId } = req.params;
    const { user } = req;
    const spot = await Spot.findByPk(spotId);
    const booking = await Booking.create(req.body);
    await booking.setSpot(spot);
    await booking.setUser(user);
    await spot.addBooking(booking);
    res.json(booking);
});

//Create spot
router.post('/', async (req, res) => {
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
    res.json(spot);
});

//Edit a spot
router.put('/:spotId', async (req, res) => {
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId);
    const updatedSpot = await spot.update(req.body);
    res.json(updatedSpot);
});

//Delete a spot
router.delete('/:spotId', async (req, res) => {
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId);
    await spot.destroy();
    res.json({
        message: "Successfully deleted spot"
    });
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
        // const { Op } = require("sequelize");
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
        // const { Op } = require("sequelize");
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
        // const { Op } = require("sequelize");
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
        // const { Op } = require("sequelize");
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
        // const { Op } = require("sequelize");
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
