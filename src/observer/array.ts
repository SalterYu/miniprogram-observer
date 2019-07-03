import {def} from './utils'

const arrayProto: any = Array.prototype
const arrayMethods = Object.create(arrayProto)


export const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach((method) => {
  // cache original method
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator(this: any, ...args: any[]) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) { ob.observeArray(inserted, () => {
      ob.callback && ob.callback()
    })
    }
    // notify change
    ob.callback()
    return result
  })
})

export {arrayMethods}