var QUnit = require("steal-qunit");
var fixture = require("can-fixture");
var DefineMap = require("can-define/map/map");
var DefineList = require("can-define/list/list");
var restModel = require("./can-rest-model");
var canReflect = require("can-reflect");

QUnit.module("can-realtime-rest-model");


QUnit.test("CRUD basics", 10, function(assert){

    var Status = canReflect.assignSymbols({},{
        "can.new": function(val){

            return val.toLowerCase();
        },
        "can.getSchema": function(){
            return {
                type: "Or",
                values: ["new","assigned","complete"]
            };
        }
    });

    var Todo = DefineMap.extend("Todo",{
        _id: {identity: true, type: "number"},
        name: "string",
        complete: "boolean",
        dueDate: "date",
        points: "number",
        status: Status
    });
    var TodoList = DefineList.extend({
        "#": Todo
    });

    restModel({
        Map: Todo,
        List: TodoList,
        url: "/api/todos/{_id}"
    });


    fixture("GET /api/todos", (function(){
        var count = 0;
        return function(req) {

            if(count++ === 0) {
                QUnit.deepEqual(req.data, {foo:"bar", filter: "zed"});
                return {
                    data: [{_id: 1,name: "zed"}]
                };
            } else {

            }
        };
    })());

    fixture("POST /api/todos", function(){
        return {
            _id: 1,
            name: "lawn care",
            status: "new",
            dueDate: new Date(2017,3,30).toString()
        };
    });

    fixture("GET /api/todos/{_id}", function(){
        return {
            _id: 2,
            name: "lawn care",
            status: "new",
            dueDate: new Date(2017,3,30).toString()
        };
    });

    fixture("PUT /api/todos/{_id}", function(req){
        QUnit.equal(req.data._id, "2");
        return {
            _id: 2,
            name: "do lawn care",
            status: "assigned",
            dueDate: new Date(2017,3,30).toString()
        };
    });

    fixture("DELETE /api/todos/{_id}", function(req){
        QUnit.equal(req.data._id, "2", "deleted");
        return {};
    });

    QUnit.stop();





    var createdTodo,
        listHandler = function(){};

    Todo.getList({foo:"bar", filter: "zed"}).then(function(list){
        assert.deepEqual(list.serialize(),[{_id: 1,name: "zed"}], "got items");

        list.on("length", listHandler);

        createdTodo = new Todo({
            name: "lawn",
            status: "NEW",
            dueDate: new Date(2017,3,30).toString()
        });
        return createdTodo.save();
    })
    // Test create
    .then(function(todo){
        assert.equal(createdTodo, todo, "same todo after create");
        assert.equal(todo.status, "new", "converted through status");
        assert.equal(todo.name, "lawn care", "converted through response");

        return todo._id;
    })
    // Test get
    .then(function(){
        return Todo.get({_id: 2}).then(function(todo){
            QUnit.deepEqual(todo.serialize(), {
                _id: 2,
                name: "lawn care",
                status: "new",
                dueDate: new Date(2017,3,30)
            }, "due date is right");
            return todo;
        });
    })
    // update
    .then(function(todo){
        QUnit.notOk(todo.isNew(), "is saved");
        todo.status = "ASSIGNED";
        return todo.save().then(function(saved){
            QUnit.deepEqual(saved.serialize(), {
                _id: 2,
                name: "do lawn care",
                status: "assigned",
                dueDate: new Date(2017,3,30)
            }, "updated");
            return saved;
        });
    })
    // destroy
    .then(function(todo){
        return todo.destroy();
    })
    .then(function(){
        QUnit.start();
    },function(err){
        QUnit.ok(false,err);
        QUnit.start();
    });

});
