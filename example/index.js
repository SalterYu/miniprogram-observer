const {observe} = require('../dist')

const data = {
  a: 1,
  arr: [{b: 1}]
}

observe(data, true, () => {
  console.log('change')
  // 做一些回调
})

data.a = 2
data.arr[0].b = 2
data.arr.push({a: 1})
