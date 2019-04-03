var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var db = require('./db.js');
var middleware = require('./middleware');

var bcrypt= require('bcrypt-nodejs');

var app = express();
var PORT = process.env.PORT || 3000;

/* app.use, make whole app use middleware */
app.use(bodyParser.json());
/* assign directory as base/root directory for web server*/
app.use(express.static(__dirname + "/public"));

////////////////////
//////  TODO  //////
////////////////////
/*
    1. Remove all traces of todo array
    2. Delete via q like description
*/

/* adding middleware to specific route (/about)
just use a comma (,) and point to the middlware */
app.get('/about', middleware.requireAuthentication, function (req, res) {
    res.send('About me baby xxoo xooxox!!!');
});

// REST API
// GET /todos?completed=true&q=house
app.get('/todos', function (req, res) {
    var query = req.query; // query is whatever follows the ?
    var where = {}; // search for multiple elements based on properties of this object

    if (query.hasOwnProperty('completed') && query.completed == 'true') {
        where.completed = true;
    } else if (query.hasOwnProperty('completed') && query.completed == 'false') {
        where.completed = false;
    }

    if (query.hasOwnProperty('q') && query.q.length > 0) {
        where.description = {
            $like: '%' + query.q + '%'
        };
    }

    db.todo.findAll({ where: where }).then(function (todos) { // search db based on 'where' object
        res.json(todos);
    }, function (e) {
        res.status(500).send();
    });
});

// GET /todos/:id
app.get('/todos/:id', function (req, res) {
    let todoId = parseInt(req.params.id);

    db.todo.findById(todoId).then(function (todo) {
        if (!!todo) {
            res.json(todo.toJSON());
        } else {
            res.status(404).send();
        }
    }, function (e) {
        res.status(500).send(); // 500 = server error
    });

});

// POST /todos
app.post('/todos', function (req, res) {
    var body = _.pick(req.body, 'description', 'completed');

    db.todo.create(body).then(function (todo) {
        res.json(todo.toJSON());
    }, function (e) {
        res.status(400).json(e);
    });
});

// DELETE /todos/:id
app.delete('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id);

    db.todo.destroy({ // destroy returns number of rows deleted
        where: {
            id: todoId
        }
    }).then(function (rowsDeleted) { // SUCCESS
        if (rowsDeleted === 0) {
            res.status(404).json({
                error: 'No todo with id'
            });
        } else {
            res.status(204).send(); // 204 CODE "Everything went well, nothing to return.."
        }
    }, function () { // FAIL
        res.status(500).send();
    });
});

// PUT /todos/:id
app.put('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);
    var body = _.pick(req.body, 'description', 'completed');
    var attributes = {};

    if (body.hasOwnProperty('completed')) {
        attributes.completed = body.completed;
    }

    if (body.hasOwnProperty('description')) {
        attributes.description = body.description;
    }

    db.todo.findByPk(todoId).then(function (todo) {
        if (todo) {
            todo.update(attributes).then(function (todo) {
                res.json(todo.toJSON());
            }, function (e) {
                res.status(400).json(e);
            });
        } else {
            res.status(404).send();
        }
    }, function () {
        res.status(500).send();
    })

});

// POST /users
app.post('/users', function (req, res) {
    var body = _.pick(req.body, 'email', 'password');

    db.user.create(body).then(function (user) {
        res.json(user.toPublicJSON());
    }, function (e) {
        res.status(400).json(e);
    });
});

// POST /users/login
app.post('/users/login', function (req, res) {
    var body = _.pick(req.body, 'email', 'password');

    db.user.authenticate(body).then(function() {
        res.json(user.toPublicJSON());
    }, function() {
        res.status(401).send();
    });

});

db.sequelize.sync().then(function () {
    app.listen(PORT, function () {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; // January is 0!
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var today = dd + '/' + mm + '/' + yyyy;
        console.log("[" + today + "]" + " Server running at port " + PORT + ". Enjoy!");
    });
});


