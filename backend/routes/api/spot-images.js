const express = require('express');
const { Spot, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

const requireProperAuth = (user, id) => {
    return user.id === id;
}

//Delete a spot image
router.delete('/:imageId', requireAuth, async (req, res) => {
    const { imageId } = req.params;
    const image = await SpotImage.findOne({
        where: {
            id: imageId
        },
        include: [
            {
                model: Spot
            }
        ]
    });
    if (!image) {
        res.status(404);
        return res.json({
            message: "Spot Image couldn't be found"
        });
    };
    if (!requireProperAuth(req.user, image.Spot.ownerId)) {
        res.status(403);
        return res.json({
            message: "Forbidden"
        });
    };
    await image.destroy();
    res.json({ message: "Successfully deleted" })
});

module.exports = router;
