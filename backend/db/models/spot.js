'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'ownerId', as: 'Owner' });
      this.hasMany(models.SpotImage, { foreignKey: 'spotId', onDelete: 'cascade', hooks: true });
      this.hasMany(models.Review, { foreignKey: 'spotId', onDelete: 'cascade', hooks: true });
      this.hasMany(models.Booking, { foreignKey: 'spotId', onDelete: 'cascade', hooks: true });
    }
  }
  Spot.init({
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    lat: DataTypes.DECIMAL,
    lng: DataTypes.DECIMAL,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
