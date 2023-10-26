const express = require('express');
const { Spot, SpotImage, Review } = require('../../db/models');

const router = express.Router();

// Add an image to spot by ID
router.post('/:spotId/images', async (req, res) => {
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId);
    const spotImage = await SpotImage.create(req.body);
    spotImage.spotId = spot.id
    await spot.addSpotImage(spotImage);
    res.json(spotImage);
});

// Add a review to spot by ID
router.post('/:spotId/reviews', async (req, res) => {
    const { spotId } = req.params;
    const { user } = req;
    const spot = await Spot.findByPk(spotId);
    const review = await Review.create(req.body);
    review.spotId = spot.id;
    review.userId = user.id;
    await spot.addReview(review);
    res.json(review);
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
