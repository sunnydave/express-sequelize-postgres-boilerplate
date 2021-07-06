'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs');
const PROTECTED_ATTRIBUTES = ['password']
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    isPasswordMatch(password){
      return bcrypt.compareSync(password, this.password);
    }

    static async isEmailTaken(email){
      const userCount = await User.count({
        where: {
          email: email
        }
      });
      return userCount > 0;
    }

    toJSON() {
      let attributes = Object.assign({}, this.get());
      for (let a of PROTECTED_ATTRIBUTES){
        delete attributes[a];
      }
      return attributes;
    }
  };
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      set(value) {
        this.setDataValue('password', bcrypt.hashSync(value, 8))
      }
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'User',
    paranoid: true
  });
  return User;
};
