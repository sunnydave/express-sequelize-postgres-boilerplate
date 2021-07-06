'use strict';
const {
  Model
} = require('sequelize');
const { tokenTypes } = require('../config/tokens');
module.exports = (sequelize, DataTypes) => {
  class Token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Token.belongsTo(models.User,{
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });
    }
  };
  Token.init({
    token: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: DataTypes.INTEGER,
    type: DataTypes.ENUM({
      values: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL]
    }),
    expires: DataTypes.DATE,
    blacklisted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Token',
    paranoid: true
  });
  return Token;
};
