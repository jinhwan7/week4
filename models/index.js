const Sequelize = require('sequelize');

const User = require('./user.js');
const Posts = require('./posts.js');
const refToken = require('./refToken.js');
const Like = require('./like.js');
const Comment = require('./comment.js');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize
db.User = User;
db.Posts = Posts;
db.refToken = refToken;
db.Like = Like;
db.Comment = Comment;

User.initiate(sequelize);
Posts.initiate(sequelize);
refToken.initiate(sequelize);
Like.initiate(sequelize);
Comment.initiate(sequelize);


User.associate(db);
Posts.associate(db);
refToken.associate(db);
Like.associate(db);
Comment.associate(db);

module.exports = db;