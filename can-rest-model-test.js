import QUnit from 'steal-qunit';
import plugin from './can-rest-model';

QUnit.module('can-rest-model');

QUnit.test('Initialized the plugin', function(){
  QUnit.equal(typeof plugin, 'function');
  QUnit.equal(plugin(), 'This is the can-rest-model plugin');
});
