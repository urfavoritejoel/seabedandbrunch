const express = require('express');
const { Booking, SpotImage } = require('../../db/models');
const { Op } = require("sequelize");
const { check } = require('express-validator');
const { handleValidationErrors, handleBookingConflicts } = require('../../utils/validation');
const { Spot } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

const validateBookingConflicts = [
    check('endDate')
        .custom(async (value, { req }) => {
            const date1 = Date.parse(value);
            const date2 = Date.parse(req.body.startDate);
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
            const endDate = Date.parse(req.body.endDate)
            const booking = await Booking.findByPk(req.params.bookingId);
            if (booking) {
                const spotId = (booking.spotId);
                const bookings = await Booking.findAll({ where: { spotId: spotId } });
                for (const booking of bookings) {
                    if (booking.id !== parseInt(req.params.bookingId)) {
                        let foundStartDate = Date.parse(booking.startDate);
                        let foundEndDate = Date.parse(booking.endDate);
                        if (startDate === foundStartDate ||
                            startDate === foundEndDate ||
                            endDate === foundStartDate ||
                            endDate === foundEndDate ||
                            (startDate < foundStartDate && endDate > foundEndDate) ||
                            (startDate <= foundEndDate && endDate <= foundEndDate && startDate > foundStartDate) ||
                            (startDate >= foundStartDate && endDate >= foundStartDate && startDate < foundEndDate) ||
                            (startDate < foundStartDate && endDate < foundEndDate && endDate >= foundStartDate)
                        ) {
                            throw new Error('Start date conflicts with an existing booking')
                        }
                    }

                }
                return value
            }
        }),
    check('endDate')
        .custom(async (value, { req }) => {
            const startDate = Date.parse(req.body.startDate);
            const endDate = Date.parse(req.body.endDate)
            const booking = await Booking.findByPk(req.params.bookingId);
            if (booking) {
                const spotId = (booking.spotId);
                const bookings = await Booking.findAll({ where: { spotId: spotId } });
                for (const booking of bookings) {
                    if (booking.id !== parseInt(req.params.bookingId)) {
                        let foundStartDate = Date.parse(booking.startDate);
                        let foundEndDate = Date.parse(booking.endDate);
                        if (startDate === foundStartDate ||
                            startDate === foundEndDate ||
                            endDate === foundStartDate ||
                            endDate === foundEndDate ||
                            (startDate < foundStartDate && endDate > foundEndDate) ||
                            (startDate <= foundEndDate && endDate <= foundEndDate && startDate > foundStartDate) ||
                            (startDate >= foundStartDate && endDate >= foundStartDate && startDate < foundEndDate) ||
                            (startDate < foundStartDate && endDate < foundEndDate && endDate >= foundStartDate)
                        ) {
                            throw new Error('End date conflicts with an existing booking')
                        }
                    }

                }
                return value
            }
        }),
    handleBookingConflicts,
]

const requireProperAuth = (user, id) => {
    return user.id === id;
}

//Get all bookings of the current user
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;
    const bookings = await Booking.findAll({
        where: {
            userId: user.id
        },
        include: [
            {
                model: Spot,
                include: {
                    model: SpotImage
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            },
        ]
    })

    const Bookings = [];
    bookings.forEach(booking => {
        Bookings.push(booking.toJSON());
    });
    Bookings.forEach(booking => {
        booking.Spot.SpotImages.forEach(image => {
            if (image.preview === true) {
                booking.Spot.previewImage = image.url;
            }
        })
        if (!booking.Spot.previewImage) {
            booking.Spot.previewImage = "No preview image found"
        }
        delete booking.Spot.SpotImages;
    });
    res.json({ Bookings })
});

//Edit a booking
router.put('/:bookingId', requireAuth, validateBookingConflicts, async (req, res) => {
    const { bookingId } = req.params;
    const { user } = req
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
        res.status(404);
        return res.json({
            message: "Booking couldn't be found"
        });
    };
    if (!requireProperAuth(req.user, booking.userId)) {
        res.status(403);
        return res.json({
            message: "Forbidden"
        });
    };
    if (Date.now() > Date.parse(booking.endDate)) {
        res.status(403);
        return res.json({
            message: "Past bookings can't be modified"
        });
    };
    let startDate = Date.parse(req.body.startDate);
    let endDate = Date.parse(req.body.endDate);
    if (Date.now() > startDate || Date.now() > endDate) {
        res.status(403);
        return res.json({
            message: "Dates in the past"
        })
    }
    const updatedBooking = await booking.update(req.body);
    await updatedBooking.setUser(user);
    res.json(updatedBooking);
});

//Delete a booking
router.delete('/:bookingId', requireAuth, async (req, res) => {
    const { bookingId } = req.params;
    const booking = await Booking.findOne({
        where: {
            id: bookingId
        },
        include: [
            {
                model: Spot
            }
        ]
    });
    if (!booking) {
        res.status(404);
        return res.json({
            message: "Booking couldn't be found"
        });
    };
    console.log(booking.Spot.ownerId);
    if (!requireProperAuth(req.user, booking.userId) && !requireProperAuth(req.user, booking.Spot.ownerId)) {
        res.status(403);
        return res.json({
            message: "Forbidden"
        });
    };
    if (Date.now() > Date.parse(booking.startDate)) {
        res.status(403);
        return res.json({
            message: "Bookings that have been started can't be deleted"
        });
    }
    await booking.destroy();
    res.json({ message: "Successfully deleted" });
});


module.exports = router;
