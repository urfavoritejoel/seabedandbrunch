const express = require('express');
const { Review, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

const requireProperAuth = (user, id) => {
    return user.id === id;
}

router.delete('/:imageId', requireAuth, async (req, res) => {
    const { imageId } = req.params;
    const image = await ReviewImage.findOne({
        where: {
            id: imageId
        },
        include: [
            {
                model: Review
            }
        ]
    });
    if (!image) {
        res.status(404);
        return res.json({
            message: "Review Image couldn't be found"
        });
    };
    if (!requireProperAuth(req.user, image.Review.userId)) {
        res.status(403);
        return res.json({
            message: "Forbidden"
        });
    };
    await image.destroy();
    res.json({ message: "Successfully deleted" })
});

module.exports = router;
