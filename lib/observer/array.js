"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arrayMethods = exports.methodsToPatch = void 0;

var _utils = require("./utils");

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);
exports.arrayMethods = arrayMethods;
var methodsToPatch = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
/**
 * Intercept mutating methods and emit events
 */

exports.methodsToPatch = methodsToPatch;
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  (0, _utils.def)(arrayMethods, method, function mutator() {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;

    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;

      case 'splice':
        inserted = args.slice(2);
        break;
    }

    if (inserted) {
      ob.observeArray(inserted, function () {
        ob.callback && ob.callback();
      });
    } // notify change


    ob.callback();
    return result;
  });
});