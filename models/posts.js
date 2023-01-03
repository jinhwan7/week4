'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Posts.belongsTo(models.User, { foreignkey:'userId',targetKey:'userId' });
    }
  }

  Posts.init({
    postId: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },

    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    
    content: DataTypes.STRING,
    
  }, {
    sequelize,
    modelName: 'Posts',
  });

  return Posts;
};