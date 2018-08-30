/*can-rest-model@1.0.0#can-rest-model*/
var constructor = require('can-connect/constructor/constructor');
var canMap = require('can-connect/can/map/map');
var dataParse = require('can-connect/data/parse/parse');
var dataUrl = require('can-connect/data/url/url');
var namespace = require('can-namespace');
var base = require('can-connect/base/base');
function restModel(options) {
    var connection = [
        base,
        dataUrl,
        dataParse,
        constructor,
        canMap
    ].reduce(function (prev, behavior) {
        return behavior(prev);
    }, options);
    connection.init();
    return connection;
}
module.exports = namespace.restModel = restModel;