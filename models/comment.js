
const Sequelize = require('sequelize');

  class Comment extends Sequelize.Model {
    static initiate(sequelize){
      Comment.init({
        commentId:{
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        userId: Sequelize.INTEGER,
        comment: Sequelize.STRING,
        postId: Sequelize.INTEGER
      }, {
        sequelize,
        modelName: 'Comment',
        tableName: 'Comments'
      });
    }





    static associate(db) {
      db.Comment.belongsTo(db.User,{ foreignKey:"userId", targetKey:"userId"});
      db.Comment.belongsTo(db.Posts,{ foreignKey:"postId", targetKey:"postId"});
    }
  }
 
module.exports = Comment