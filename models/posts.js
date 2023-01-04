'use strict';
const Sequelize = require('sequelize');

class Posts extends Sequelize.Model {

  static initiate(sequelize) {
      Posts.init({
        postId: {
          allowNull:false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        userId:{
          allowNull:false,
          type: Sequelize.INTEGER,
        },
        title: {type: Sequelize.STRING,},
        
        content: {type: Sequelize.STRING,}
        
      }, {
        sequelize,
        modelName: 'Posts',
        tableName: 'Posts',
      })
    }


  static associate(db) {
    // define association here
    db.Posts.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'userId' })
    
    db.Posts.hasMany(db.Like, { foreignKey: 'postId', sourceKey: 'postId' })
  }
};

module.exports = Posts;