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

//Edit a booking
router.put('/:bookingId', async (req, res) => {
    const { bookingId } = req.params;
    const { user } = req
    const booking = await Booking.findByPk(bookingId);
    const updatedBooking = await booking.update(req.body);
    await updatedBooking.setUser(user);
    res.json(updatedBooking);
});

//Delete a booking
router.delete('/:bookingId', async (req, res) => {
    const { bookingId } = req.params;
    const booking = await Booking.findByPk(bookingId);
    await booking.destroy();
    res.json({ message: "Successfully deleted booking" });
});


module.exports = router;
