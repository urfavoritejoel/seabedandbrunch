'use strict';

const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

let imageUrls = [
  'https://i.insider.com/598209e6b50ab183238b55d1?width=1136&format=jpeg',
  'https://loveincorporated.blob.core.windows.net/contentimages/gallery/f783abbb-8840-4f27-bc94-491c630db609-underwater-living.jpg',
  'https://ichef.bbci.co.uk/news/624/mcs/media/images/77335000/jpg/_77335871_living-room.jpg',
  'https://img.money.com/2022/12/News-2023-Homes-Could-Be-Underwater.jpg?crop=0px%2C257px%2C4973px%2C2798px&quality=85',
  'https://superyachttechnologynetwork.com/wp-content/uploads/2017/03/Underwater-homes-1080x675.jpg',
  'https://architizer-prod.imgix.net/legacy_blog/2012/09/1.urban-reef-depth-8m-cancun-mexico.jpeg?fit=max&w=1680&q=60&auto=format&auto=compress&cs=strip',
  'https://preview.redd.it/underwater-houses-and-spaces-which-do-you-prefer-pretend-we-v0-bpgv85rq9oob1.jpg?width=640&crop=smart&auto=webp&s=95c4a1b3826b393cac8899e882ad3c3a6e3b0987',
  'https://img.freepik.com/premium-photo/underwater-house-is-hotel-that-is-located-mediterranean_853177-7671.jpg',
  'https://images.adsttc.com/media/images/5cb9/ad53/284d/d1c1/b000/002e/large_jpg/05_Houses-of-the-future-underwater-house.jpg?1555672398',
  'https://i.dailymail.co.uk/i/pix/2012/10/04/article-0-1557AC9D000005DC-827_634x417.jpg'
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: imageUrls[0],
        preview: true
      },
      {
        spotId: 1,
        url: imageUrls[1],
        preview: false
      },
      {
        spotId: 1,
        url: imageUrls[2],
        preview: false
      },
      {
        spotId: 1,
        url: imageUrls[3],
        preview: false
      },
      {
        spotId: 1,
        url: imageUrls[4],
        preview: false
      },
      {
        spotId: 2,
        url: imageUrls[1],
        preview: true
      },
      {
        spotId: 2,
        url: imageUrls[5],
        preview: false
      },
      {
        spotId: 2,
        url: imageUrls[6],
        preview: false
      },
      {
        spotId: 2,
        url: imageUrls[7],
        preview: false
      },
      {
        spotId: 2,
        url: imageUrls[8],
        preview: false
      },
      {
        spotId: 3,
        url: imageUrls[2],
        preview: true
      },
      {
        spotId: 3,
        url: imageUrls[9],
        preview: false
      },
      {
        spotId: 3,
        url: imageUrls[0],
        preview: false
      },
      {
        spotId: 3,
        url: imageUrls[1],
        preview: false
      },
      {
        spotId: 3,
        url: imageUrls[2],
        preview: false
      },
      {
        spotId: 4,
        url: imageUrls[3],
        preview: true
      },
      {
        spotId: 4,
        url: imageUrls[4],
        preview: false
      },
      {
        spotId: 4,
        url: imageUrls[5],
        preview: false
      },
      {
        spotId: 4,
        url: imageUrls[6],
        preview: false
      },
      {
        spotId: 4,
        url: imageUrls[7],
        preview: false
      },
      {
        spotId: 5,
        url: imageUrls[4],
        preview: true
      },
      {
        spotId: 5,
        url: imageUrls[5],
        preview: false
      },
      {
        spotId: 5,
        url: imageUrls[6],
        preview: false
      },
      {
        spotId: 5,
        url: imageUrls[7],
        preview: false
      },
      {
        spotId: 5,
        url: imageUrls[8],
        preview: false
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: {
        [Op.in]: imageUrls
      }
    }, {});
  }
};
