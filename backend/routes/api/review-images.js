const express = require('express');
const { Review, ReviewImage } = require('../../db/models');

const router = express.Router();

router.delete('/:imageId', async (req, res) => {
    const { imageId } = req.params;
    const image = await ReviewImage.findByPk(imageId);
    await image.destroy();
    res.json({ message: "Successfully deleted spot image" })
});

module.exports = router;
