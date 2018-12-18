var express = require('express');
var middleware = require('./middleware');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
const PORT = 3000;
// My fantastic todo collection (all of my todos!)
var todos = [];
var todoNextId = 1;

/* app.use, make whole app use middleware */
app.use(bodyParser.json());

/* assign directory as base/root directory for web server*/
app.use(express.static(__dirname + "/public"));

/* adding middleware to specific route (/about)
just use a comma (,) and point to the middlware */
app.get('/about', middleware.requireAuthentication, function (req, res) {
    res.send('About me baby xxoo xooxox!!!');
});

// REST API
// GET all todos
app.get('/todos', function(req, res) {
    res.json(todos);
});

// GET /todos/:id
app.get('/todos/:id', function (req, res) {
    let todoId = parseInt(req.params.id);
    var matchedTodo;

    matchedTodo = _.findWhere(todos, {id: todoId});

    if(matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send();
    }
});

// POST /todos
app.post('/todos', function(req, res) {
    var body = _.pick(req.body, 'description', 'completed');

    if(_.isString(body.description) && _.isBoolean(body.completed)) {
        body.id = todoNextId++;
        todos.push(body);
        res.json(body);
    } else {
        return res.status(422).send();
    }
});

// DELETE /todos/:id
app.delete('/todos/:id', function (req, res) {
    if(_.isEmpty(todos)) { return res.status(400).json({"error": "cannot delete from empty list"})}

    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoId});

    if (!matchedTodo) {
        res.status(404).json({"error": "no todo found with that id"});
    } else {
        res.send(_.without(todos, matchedTodo));
    }
});

// PUT /todos/:id
app.put('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoId});
    var body = _.pick(req.body, 'description', 'completed');
    var validAttributes = {};

    if (!matchedTodo) {
        return res.status(404).json({"error": "no todo found with that id"});
    }

    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributes.completed = body.completed;
    } else if (body.hasOwnProperty('completed')) {
        return res.status(400).send();
    } else {
        // No attributes provided
    }

    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
        validAttributes.description = body.description;
    } else if (body.hasOwnProperty('description')) {
        return res.status(400).send();
    } else {
        // No attributes provided
    }

    _.extend(matchedTodo, validAttributes);
    res.json(matchedTodo);

});


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
