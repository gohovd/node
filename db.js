var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, { // create new sqlite database!
    'dialect': 'sqlite',
    'storage': __dirname + '/data/dev-todo-api.sqlite'
});
var db = {};

db.todo = sequelize.import(__dirname + '/models/todo.js'); // import model
db.sequelize = sequelize; // sequelize instance
db.Sequelize = Sequelize; // ...        library

module.exports = db;