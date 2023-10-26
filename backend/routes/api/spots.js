const express = require('express');
const { Spot } = require('../../db/models');

const router = express.Router();

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
    const { id } = req.params;
    const spot = await Spot.findByPk(spotId);
    res.json(spot);
});

router.put('/:spotId', async (req, res) => {
    const { spotId } = req.params;
    // const {ownerId, address, city, state, country, lat, lng, name,
    // description, price} = req.body;
    const spot = await Spot.findByPk(spotId);
    const updatedSpot = await spot.update(req.body);
    res.json(updatedSpot);
})

router.get('/', async (req, res) => {
    const spots = await Spot.findAll();
    res.json(spots);
});


module.exports = router;
