"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineReactive = defineReactive;
exports.observe = observe;
exports.Observer = exports.hasProto = void 0;

var _utils = require("./utils");

var _array = require("./array");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var hasProto = '__proto__' in {};
exports.hasProto = hasProto;
var arrayKeys = Object.getOwnPropertyNames(_array.arrayMethods);

var Observer =
/*#__PURE__*/
function () {
  function Observer(value, callback) {
    _classCallCheck(this, Observer);

    _defineProperty(this, "value", void 0);

    _defineProperty(this, "callback", void 0);

    _defineProperty(this, "vmCount", void 0);

    this.callback = callback;
    this.value = value;
    this.vmCount = 0;
    (0, _utils.def)(value, '__ob__', this);

    if (Array.isArray(value)) {
      if (hasProto) {
        protoAugment(value, _array.arrayMethods);
      } else {
        copyAugment(value, _array.arrayMethods, arrayKeys);
      }

      this.observeArray(value, this.callback);
    } else {
      this.walk(value);
    }
  }

  _createClass(Observer, [{
    key: "walk",
    value: function walk(obj) {
      var _this = this;

      var keys = Object.keys(obj);

      try {
        for (var i = 0; i < keys.length; i++) {
          defineReactive(obj, keys[i], function () {
            _this.callback && _this.callback();
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    /**
     * Observe a list of Array items.
     */

  }, {
    key: "observeArray",
    value: function observeArray(items, callback) {
      for (var i = 0, l = items.length; i < l; i++) {
        observe(items[i], false, function () {
          callback && callback();
        });
      }
    }
  }]);

  return Observer;
}();

exports.Observer = Observer;

function defineReactive(obj, key, callback, val, shallow) {
  var property = Object.getOwnPropertyDescriptor(obj, key);

  if (property && property.configurable === false) {
    return;
  } // cater for pre-defined getter/setters


  var getter = property && property.get;
  var setter = property && property.set;

  if ((!getter || setter) && arguments.length === 3) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val, false, function () {
    callback && callback();
  });
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      var value = getter ? getter.call(obj) : val;

      if (childOb) {
        if (Array.isArray(value)) {
          dependArray(value);
        }
      }

      return value;
    },
    set: function reactiveSetter(newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */

      if (newVal === value || newVal !== newVal && value !== value) {
        return;
      } // #7981: for accessor properties without setter


      if (getter && !setter) return;

      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }

      childOb = !shallow && observe(newVal, false, function () {
        callback && callback();
      });
      callback && callback();
    }
  });
}

function observe(value, asRootData, callback) {
  if (!(0, _utils.isObject)(value)) {
    return;
  }

  var ob;

  if ((0, _utils.hasOwn)(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else {
    ob = new Observer(value, callback);
  }

  if (asRootData && ob) {
    ob.vmCount++;
  }

  return ob;
}

function protoAugment(target, src) {
  /* eslint-disable no-proto */
  _array.methodsToPatch.forEach(function (key) {
    Object.defineProperty(target, key, {
      get: function get() {
        return src[key];
      },
      enumerable: false
    });
  });
  /* eslint-enable no-proto */

}
/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */

/* istanbul ignore next */


function copyAugment(target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    (0, _utils.def)(target, key, src[key]);
  }
}

function dependArray(value) {
  for (var e, i = 0, l = value.length; i < l; i++) {
    e = value[i];

    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}