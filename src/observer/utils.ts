export function def(obj: Object, key: string, val: any, enumerable?: boolean) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

export function isObject(obj: any) {
  return (obj !== null) && typeof obj === 'object';
}

export function hasOwn (obj: any, key: any) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}