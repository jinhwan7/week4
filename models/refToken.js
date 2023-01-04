'use strict';
const Sequelize = require('sequelize');

class refToken extends Sequelize.Model {
  static initiate(sequelize) {
    
    refToken.init({
      refreshToken: { type: Sequelize.STRING },
      userId: { type: Sequelize.INTEGER }
    }, {
      sequelize,
      modelName: 'refToken',
      tableName: 'refTokens',
    });
  }

  static associate(models) {
    // define association here
  }

}

module.exports = refToken;