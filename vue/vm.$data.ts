/**
 * this.$data.xxx、this._data.xxx、this.xxx 都能获取数据,为什么？
 */

// https://github.com/vuejs/vue/blob/dev/src/core/instance/state.js

// 以下代码实现了 this.$data.xxx 和 this._data 是两份一模一样的值:
function initData (vm: Component) {
    let data = vm.$options.data // vm.$options 是访问自定属性，此处就是vue实例中的 this.$data
    data = vm._data = typeof data === 'function' // 先执行三元表达式，然后赋值给 vm._data 和 data，这样子这两个值都是同时变化的，就是 this.$data.xxx 和 this._data 同时变化
      ? getData(data, vm)
      : data || {}
    /** ... */
}  

/**
 * return data.call(vm, vm)
 * 
 * data 函数执行的时候 用 call 方法，让 vm 继承了 data 的属性和方法，也就是 this 继承了 this.$option.data 的属性和方法， 所以我们可以使用 this.xxx
 */
export function getData (data: Function, vm: Component): any {
    // #7573 disable dep collection when invoking data getters
    pushTarget()
    try {
      return data.call(vm, vm)
    } catch (e) {
      handleError(e, vm, `data()`)
      return {}
    } finally {
      popTarget()
    }
}

/**
 * 总结：
 * (1) this.$data.xxx、this._data.xxx、this.xxx 都能获取数据，先让 this.$data.xxx = this._data.xxx，
 * 然后用 call 让当前组件实例 this 继承了 this.$data 的值，也就是 getData 方法 return 出了一份用 call 改变指向将 $data 指向 this 的数据。
 * 
 * (2) data 定义成一个函数，确保了各个组件实例能拥有一份只属于自己的唯一数据
 */
