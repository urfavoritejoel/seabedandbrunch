const express = require('express');
const { Spot, SpotImage } = require('../../db/models');

const router = express.Router();

router.post('/:spotId/images', async (req, res) => {
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId);
    const spotImage = await SpotImage.create(req.body);
    spotImage.spotId = spotId
    await spot.addSpotImage(spotImage);
    res.json(spotImage);
});

router.post('/', async (req, res) => {
    const spot = await Spot.create(req.body)
    res.json(spot);
});

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

router.get('/:spotId', async (req, res) => {
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId);
    res.json(spot);
});

router.put('/:spotId', async (req, res) => {
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId);
    const updatedSpot = await spot.update(req.body);
    res.json(updatedSpot);
});

router.delete('/:spotId', async (req, res) => {
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId);
    await spot.destroy();
    res.json({
        message: "Successfully deleted spot"
    });
});



router.get('/', async (req, res) => {
    const spots = await Spot.findAll();
    res.json(spots);
});


module.exports = router;
