var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', { // ID is created automatically, PRIMARY_KEY(?)
    description: {
        type: Sequelize.STRING, // has to be a string..
        allowNull: false, // must exist, every todo must have description..
        validate: {
            len: [1, 250] // description is only valid if 1 < length < 250 characters..
        }
    },
    completed: {
        type: Sequelize.BOOLEAN, // has to be a boolean (T/F)
        allowNull: false, // cannot be null, must exist..
        defaultValue: false // default value is TRUE
    }
});

sequelize.sync({
    // force: true // clears all tables in the database upon run CAREFUL!! :O:O:O
}).then(function () {
    console.log('Everything is synced');

    Todo.findById(1).then(function (todo) {
        if (todo) {
            console.log(todo.toJSON());
        } else {
            console.log('Todo not found!');
        }
    });

    // Todo.create({
    //     description: 'Dance the dance'
    // }).then(function (todo) {
    //     return Todo.create({
    //         description: 'Clean office'
    //     }).then(function () {
    //         // return Todo.findById(1);
    //         return Todo.findAll({
    //             where: {
    //                 description: {
    //                     $like: '%Dance%'
    //                 }
    //             }
    //         });
    //     }).then(function (todos) {
    //         if (todos) {
    //             todos.forEach(function (todo) {
    //                 console.log(todo.toJSON());
    //             });
    //         } else {
    //             console.log('no todo found!');
    //         }
    //     });
    // }).catch(function (e) {
    //     console.log(e);
    // });

});