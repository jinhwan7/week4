
const Sequelize = require('sequelize');



class Like extends Sequelize.Model {
  static initiate(sequelize) {
    Like.init({
      likeId:{
        allowNull:false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: Sequelize.INTEGER,
      postId: Sequelize.INTEGER
    }, {
      sequelize,
      modelName: 'Like',
      tableName: 'Likes'
    });
  }

  static associate(db) {
    db.Like.belongsTo(db.Posts, { foreignKey:'postId', targetKey:'postId' });
    db.Like.belongsTo(db.User, { foreignKey:'userId', targetKey:'userId' });

  }
}

module.exports = Like;
