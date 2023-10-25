'use strict';

const { Spot } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: '123 Easy St',
        city: 'Dallas',
        state: 'Texas',
        country: 'U.S.',
        lat: 32.779167,
        lng: -96.808891,
        name: 'Nice Place',
        description: 'See name',
        price: 200
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Nice Place'] }
    }, {});
  }
};
