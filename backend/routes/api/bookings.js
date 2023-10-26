const express = require('express');
const { Booking } = require('../../db/models');

const router = express.Router();

//Get all bookings of the current user
router.get('/current', async (req, res) => {
    const { user } = req;
    let bookings = {};
    if (user) {
        bookings = await Booking.findAll({
            include: 'User',
            where: {
                userId: user.id
            }
        })
        return res.json(bookings)
    } else {
        throw new Error('error')
    }
});


module.exports = router;
