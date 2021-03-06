var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize;

if (env === 'production') {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres'
    });
} else {
    sequelize = new Sequelize(undefined, undefined, undefined, { // create new sqlite database!
        'dialect': 'sqlite',
        'storage': __dirname + '/data/dev-todo-api.sqlite'
    });
}

var db = {};

db.todo = sequelize.import(__dirname + '/models/todo.js'); // import model
db.user = sequelize.import(__dirname + '/models/user.js');
db.sequelize = sequelize; // sequelize instance
db.Sequelize = Sequelize; // ...        library

module.exports = db;