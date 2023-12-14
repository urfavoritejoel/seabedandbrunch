'use strict';

const { Spot } = require('../models');

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
      },
      {
        ownerId: 2,
        address: '125 Easy St',
        city: 'Dallas',
        state: 'Texas',
        country: 'U.S.',
        lat: 32.779167,
        lng: -96.808891,
        name: 'Nice Place',
        description: 'See name',
        price: 200
      },
      {
        ownerId: 3,
        address: '127 Easy St',
        city: 'Dallas',
        state: 'Texas',
        country: 'U.S.',
        lat: 32.779167,
        lng: -96.808891,
        name: 'Nice Place',
        description: 'See name',
        price: 200
      },
      {
        ownerId: 4,
        address: '129 Easy St',
        city: 'Dallas',
        state: 'Texas',
        country: 'U.S.',
        lat: 32.779167,
        lng: -96.808891,
        name: 'Nice Place',
        description: 'See name',
        price: 200
      },
      {
        ownerId: 5,
        address: '131 Easy St',
        city: 'Dallas',
        state: 'Texas',
        country: 'U.S.',
        lat: 32.779167,
        lng: -96.808891,
        name: 'Nice Place',
        description: 'See name',
        price: 200
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: {
        [Op.in]: ['123 Easy St', '125 Easy St', '127 Easy St', '129 Easy St', '131 Easy St',]
      }
    }, {});
  }
};
