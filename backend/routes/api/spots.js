const express = require('express');
const { Spot } = require('../../db/models');

const router = express.Router();

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
})

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const spot = await Spot.findByPk(id);
    res.json(spot);
});

router.get('/', async (req, res) => {
    const spots = await Spot.findAll();
    res.json(spots);
});

router.post('/', async (req, res) => {
    const spot = await Spot.create(req.body)
    res.json(spot);
})

module.exports = router;
