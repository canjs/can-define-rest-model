/*can-rest-model@1.0.0#can-rest-model*/
define([
    'require',
    'exports',
    'module',
    'can-connect/constructor',
    'can-connect/can/map',
    'can-connect/data/parse',
    'can-connect/data/url',
    'can-namespace',
    'can-connect/base'
], function (require, exports, module) {
    var constructor = require('can-connect/constructor');
    var canMap = require('can-connect/can/map');
    var dataParse = require('can-connect/data/parse');
    var dataUrl = require('can-connect/data/url');
    var namespace = require('can-namespace');
    var base = require('can-connect/base');
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
});