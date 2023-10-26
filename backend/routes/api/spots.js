const express = require('express');
const { Spot, SpotImage, Review, Booking } = require('../../db/models');

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
    const spots = await Spot.findAll();
    res.json(spots);
});


module.exports = router;