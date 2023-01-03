'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.posts.belongsTo(models.posts, { foreignkey:'userId',targetKey:'userId' });
    }
  }

  posts.init({
    postId:{
      primaryKey:true,
      type: DataTypes.INTEGER,  
    },
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    
    content: DataTypes.STRING,
    
  }, {
    sequelize,
    modelName: 'posts',
  });

  return posts;
};