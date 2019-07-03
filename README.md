# 小程序数据响应

给小程序增加数据响应式功能。劫持一个对象，当对象中的某个属性改变或者更新了则执行回调。一般用于组件化后，数据被多个组件传递的时候，当组件内部需要改变数据的属性的时候
可以劫持到数据变化，自动更新数据。
一般在回调中使用this.setData({data}), 并对setData做一个在多次setData的时候只处理最终的一次setData。类似防抖功能, 提升小程序性能。
例如：
```js
function _$setData(obj) {
  let cache = this.cache || {};
  cache = Object.assign({}, cache, obj);
  this.cache = cache;
  if (this.timer) clearTimeout(this.timer);
  this.timer = setTimeout(() => {
    this.setData({...cache});
    console.log(obj);
  });
}
```

## 使用方法

拷贝目录下的lib文件夹至小程序开发目录，如果是typescript项目，则可直接使用src。

```js
const {observe} = require('lib/index.js')

const data = {a: 1, arr: [{a: 2}]}

observe(data, true, () => {
  console.log('change')
  // 使用_$setData
  this._$setData({
     list: data.arr
  })
})

// 改变数据
data.a = 2
// 或者
data.arr.push({b: 3})
```

输出
```js
change
```

## Roadmap

- [ ] 增加diff功能。