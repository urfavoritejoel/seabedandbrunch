const express = require('express');
const { Booking } = require('../../db/models');
const { Op } = require("sequelize");
const { check } = require('express-validator');
const { handleValidationErrors, handleBookingConflicts } = require('../../utils/validation');
const spot = require('../../db/models/spot');

const router = express.Router();

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
            const startDate = Date.parse(req.body.startDate);
            const endDate = Date.parse(req.body.endDate);
            const booking = await Booking.findByPk(req.params.bookingId);
            const spotId = (booking.spotId);
            const bookings = await Booking.findAll({ where: { spotId: spotId } });
            for (const booking of bookings) {
                let foundStartDate = Date.parse(booking.startDate);
                let foundEndDate = Date.parse(booking.endDate);
                if (booking.id !== Number(req.params.bookingId)) {
                    if (startDate === foundStartDate ||
                        startDate === foundEndDate ||
                        endDate === foundStartDate ||
                        endDate === foundEndDate ||
                        (startDate <= foundEndDate && endDate <= foundEndDate && startDate > foundStartDate) ||
                        (startDate >= foundStartDate && endDate >= foundStartDate && startDate < foundEndDate)
                    ) {
                        throw new Error('Start date conflicts with an existing booking')
                    }
                }

            }
            return value
        }),
    check('endDate')
        .custom(async (value, { req }) => {
            const startDate = Date.parse(req.body.startDate);
            const endDate = Date.parse(req.body.endDate);
            const booking = await Booking.findByPk(req.params.bookingId);
            const spotId = (booking.spotId);
            const bookings = await Booking.findAll({ where: { spotId: spotId } });
            for (const booking of bookings) {
                let foundStartDate = Date.parse(booking.startDate);
                let foundEndDate = Date.parse(booking.endDate);
                if (booking.id !== Number(req.params.bookingId)) {
                    if (startDate === foundStartDate ||
                        startDate === foundEndDate ||
                        endDate === foundStartDate ||
                        endDate === foundEndDate ||
                        (startDate <= foundEndDate && endDate <= foundEndDate && startDate > foundStartDate) ||
                        (startDate >= foundStartDate && endDate >= foundStartDate && startDate < foundEndDate)
                    ) {
                        throw new Error('End date conflicts with an existing booking')
                    }
                }

            }
            return value
        }),
    handleBookingConflicts,
]

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
router.put('/:bookingId', validateBookingConflicts, async (req, res) => {
    const { bookingId } = req.params;
    const { user } = req
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
        res.status(404);
        return res.json({
            message: "Booking couldn't be found"
        });
    };

    if (Date.now() > Date.parse(booking.endDate)) {
        res.status(403);
        return res.json({
            message: "Past bookings can't be modified"
        });
    }
    const updatedBooking = await booking.update(req.body);
    await updatedBooking.setUser(user);
    res.json(updatedBooking);
});

//Delete a booking
router.delete('/:bookingId', async (req, res) => {
    const { bookingId } = req.params;
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
        res.status(404);
        return res.json({
            message: "Booking couldn't be found"
        });
    };
    if (Date.now() > Date.parse(booking.startDate)) {
        res.status(403);
        return res.json({
            message: "Bookings that have been started can't be deleted"
        });
    }
    await booking.destroy();
    res.json({ message: "Successfully deleted booking" });
});


module.exports = router;
