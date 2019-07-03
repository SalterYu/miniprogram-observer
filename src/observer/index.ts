import { def, isObject, hasOwn } from './utils';
import { arrayMethods, methodsToPatch } from './array';

export const hasProto = '__proto__' in {};

const arrayKeys = Object.getOwnPropertyNames(arrayMethods);


export class Observer {
  value: any;
  callback?: Function;
  vmCount: number;
  constructor(value: any, callback?: Function) {
    this.callback = callback
    this.value = value;
    this.vmCount = 0;
    def(value, '__ob__', this);
    if (Array.isArray(value)) {
      if (hasProto) {
        protoAugment(value, arrayMethods);
      } else {
        copyAugment(value, arrayMethods, arrayKeys);
      }
      this.observeArray(value, this.callback);
    } else {
      this.walk(value);
    }
  }

  walk(obj: Object) {
    const keys = Object.keys(obj);
    try {
      for (let i = 0; i < keys.length; i++) {
        defineReactive(obj, keys[i], () => {
          this.callback && this.callback()
        });
      }
    } catch (e) {
      console.error(e)
    }

  }

  /**
   * Observe a list of Array items.
   */
  observeArray(items: any[], callback?: Function) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i], false, () => {callback && callback()});
    }
  }
}

export function defineReactive(
  obj: any,
  key: string,
  callback: any,
  val?: any,
  shallow?: boolean
) {
  const property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return;
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get;
  const setter = property && property.set;
  if ((!getter || setter) && arguments.length === 3) {
    val = obj[key];
  }

  let childOb = !shallow && observe(val, false, () => {callback && callback()});
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val;
      if (childOb) {
        if (Array.isArray(value)) {
          dependArray(value);
        }
      }
      return value;
    },
    set: function reactiveSetter(newVal) {
      const value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return;
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) return;
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal, false, () => {callback && callback()});
      callback && callback()
    }
  });
}

export function observe(value: any, asRootData?: boolean, callback?: Function): Observer | void {
  if (!isObject(value)) {
    return;
  }
  let ob: Observer | void;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else {
    ob = new Observer(value, callback);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob;
}

function protoAugment(target: any, src: any) {
  /* eslint-disable no-proto */

  methodsToPatch.forEach((key) => {
    Object.defineProperty(target, key, {
      get() {
        return src[key]
      },
      enumerable: false,
    })
  })

  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */

/* istanbul ignore next */
function copyAugment(target: any, src: any, keys: string[]) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i];
    def(target, key, src[key]);
  }
}

function dependArray(value: any[]) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i];
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}