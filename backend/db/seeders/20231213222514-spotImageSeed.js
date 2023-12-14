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
  'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/90eef834-92d7-4fb8-a62b-b5534e411ee6/dg57ym8-ea0cda02-2106-42b7-ad99-b23fce8418b6.png/v1/fill/w_768,h_768,q_80,strp/underwater_house_by_mikemorris1988_dg57ym8-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NzY4IiwicGF0aCI6IlwvZlwvOTBlZWY4MzQtOTJkNy00ZmI4LWE2MmItYjU1MzRlNDExZWU2XC9kZzU3eW04LWVhMGNkYTAyLTIxMDYtNDJiNy1hZDk5LWIyM2ZjZTg0MThiNi5wbmciLCJ3aWR0aCI6Ijw9NzY4In1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.krJc9j3b9AKAFA_Dt8pyMMNaukoHHevoOxscbVu--UE',
  'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/97cea878-3503-432f-8b36-0d72db08b37d/dg0wstd-25da281a-5a96-4cc2-8319-6f210537e0bd.png/v1/fill/w_894,h_894,q_70,strp/a_luxurious_underwater_home_by_futurerender_dg0wstd-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzk3Y2VhODc4LTM1MDMtNDMyZi04YjM2LTBkNzJkYjA4YjM3ZFwvZGcwd3N0ZC0yNWRhMjgxYS01YTk2LTRjYzItODMxOS02ZjIxMDUzN2UwYmQucG5nIiwiaGVpZ2h0IjoiPD05MDAiLCJ3aWR0aCI6Ijw9OTAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLndhdGVybWFyayJdLCJ3bWsiOnsicGF0aCI6Ilwvd21cLzk3Y2VhODc4LTM1MDMtNDMyZi04YjM2LTBkNzJkYjA4YjM3ZFwvZnV0dXJlcmVuZGVyLTQucG5nIiwib3BhY2l0eSI6OTUsInByb3BvcnRpb25zIjowLjQ1LCJncmF2aXR5IjoiY2VudGVyIn19.UrnJBV7m12UbDs3tsnkKT_wRrvTp9FYbtvLduMDz2TU',
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
