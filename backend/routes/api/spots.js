const express = require('express');
const { Spot } = require('../../db/models');

const router = express.Router();

router.get('/', async (req, res) => {
    const spots = await Spot.findAll();
    res.json(spots);
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const spot = await Spot.findByPk(id);
    res.json(spot);
})

module.exports = router;
