const Sequelize = require('sequelize');

const User = require('./user.js');
const Posts = require('./posts.js');
const refToken = require('./refToken.js');


const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize
db.User = User;
db.Posts = Posts;
db.refToken = refToken;

User.initiate(sequelize);
Posts.initiate(sequelize);
refToken.initiate(sequelize);


User.associate(db);
Posts.associate(db);
refToken.associate(db);


module.exports = db;