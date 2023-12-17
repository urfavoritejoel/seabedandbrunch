'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        email: 'demo@user.io',
        username: 'demoUser',
        firstName: 'Demo',
        lastName: 'User',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'a@a.com',
        username: 'demoUser2',
        firstName: 'Demo2',
        lastName: 'User2',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'b@b.com',
        username: 'demoUser3',
        firstName: 'Demo3',
        lastName: 'User3',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'c@c.com',
        username: 'demoUser4',
        firstName: 'Demo4',
        lastName: 'User4',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'd@d.com',
        username: 'demoUser5',
        firstName: 'Demo5',
        lastName: 'User5',
        hashedPassword: bcrypt.hashSync('password')
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['demoUser', 'demoUser2', 'demoUser3', 'demoUser4', 'demoUser5',] }
    }, {});
  }
};
