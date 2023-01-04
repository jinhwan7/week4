'use strict';
const Sequelize = require('sequelize');

class User extends Sequelize.Model {

  static initiate(sequelize) {
    User.init({

      userId: {
        allowNull:false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      nickname: { type: Sequelize.STRING, },
                        
      password: { type: Sequelize.STRING }
    }, {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
    });
  }


  static associate(db) {
    // define association here
    db.User.hasMany(db.Posts, { foreignKey: 'userId', sourceKey: 'userId' })
  }
};

module.exports = User;