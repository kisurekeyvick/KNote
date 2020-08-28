/**
 *  Vue.nextTick 的原理和用途
 * https://juejin.im/post/6844903909853511694
 */

/**
 * nextTick的使用：
 * 
 * vue中dom的更像并不是实时的，当数据改变后，vue会把渲染watcher添加到异步队列，异步执行，同步代码执行完成后再统一修改dom
 */ 
<template>
  <div class="box">{{msg}}</div>
</template>

export default {
  name: 'index',
  data () {
    return {
      msg: 'hello'
    }
  },
  mounted () {
    this.msg = 'world'
    let box = document.getElementsByClassName('box')[0]
    console.log(box.innerHTML) // hello
    this.$nextTick(() => {
        console.log(box.innerHTML) // world
    });
  }
}
/** 
 * 可以看到，修改数据后并不会立即更新dom ，dom的更新是异步的，无法通过同步代码获取，需要使用nextTick，在下一次事件循环中获取。
 */

/**
 * 数据变化dom更新与nextTick的原理分析
 * 
 * 数据变化：
 * vue双向数据绑定依赖于ES5的Object.defineProperty，在数据初始化的时候，通过Object.defineProperty为每一个属性创建getter与setter，
 * 把数据变成响应式数据。对属性值进行修改操作时，如this.msg = world，实际上会触发setter
 */ 

// 数据改变触发set函数
Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    // 数据修改后触发set函数 经过一系列操作 完成dom更新
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      if (getter && !setter) return
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      dep.notify() // 执行dep notify方法
    }
})

// 执行dep.notify方法
export default class Dep {
    constructor () {
      this.id = uid++
      this.subs = []
    }
    notify () {
      const subs = this.subs.slice()
      for (let i = 0, l = subs.length; i < l; i++) {
        // 实际上遍历执行了subs数组中元素的update方法
        subs[i].update()
      }
    }
}

// 当数据被引用时，如<div>{{msg}}</div> ，会执行get方法，并向subs数组中添加渲染Watcher，当数据被改变时执行Watcher的update方法执行数据更新
update () {
    /* istanbul ignore else */
    if (this.lazy) {
      this.dirty = true
    } else if (this.sync) {
      this.run()
    } else {
      queueWatcher(this) //执行queueWatcher
    }
}

// update 方法最终执行queueWatcher
function queueWatcher (watcher: Watcher) {
    const id = watcher.id
    if (has[id] == null) {
      has[id] = true
      if (!flushing) {
        queue.push(watcher)
      } else {
        // 如果已经刷新，则根据其id拼接监视器
        // 如果已经超过它的id，它将立即运行下一个。
        let i = queue.length - 1
        while (i > index && queue[i].id > watcher.id) {
          i--
        }
        queue.splice(i + 1, 0, watcher)
      }
      // queue the flush
      if (!waiting) {
        // 通过waiting 保证nextTick只执行一次
        waiting = true
        // 最终queueWatcher 方法会把flushSchedulerQueue 传入到nextTick中执行
        nextTick(flushSchedulerQueue)
      }
    }
}

// 执行flushSchedulerQueue方法
function flushSchedulerQueue () {
    currentFlushTimestamp = getNow()
    flushing = true
    let watcher, id
    // ...
    for (index = 0; index < queue.length; index++) {
      watcher = queue[index]
      if (watcher.before) {
        watcher.before()
      }
      id = watcher.id
      has[id] = null
      // 遍历执行渲染watcher的run方法 完成视图更新
      watcher.run()
    }
    // 重置waiting变量 
    resetSchedulerState()
    // ...
}
/** 也就是说当数据变化最终会把flushSchedulerQueue传入到nextTick中执行flushSchedulerQueue函数会遍历执行watcher.run()方法，watcher.run()方法最终会完成视图更新 */


/** 
 * 数据变化的总结：
 * 
 * (1) vue双向数据绑定依赖于ES5的Object.defineProperty，在数据初始化的时候，通过Object.defineProperty为每一个属性创建getter与setter，
 * (2) 把数据变成响应式数据，对属性修改就会触发setter
 * (3) 而setter的作用就是执行dep.notify来完成dom的更新
 * (4) 而dep这个class中存在一个notify方法，notify的作用就是遍历执行了subs数组中元素的update方法
 * (5) 而这个更新数据来源于最初，当template中使用类似于<div>{{msg}}</div>，那就回执行get方法，想数组subs中添加watcher
 *     一旦数据被改变以后，就会执行watcher的update方法执行数据更新
 * (6) 而watcher中的update方法最终会执行queueWatcher，queueWatcher主要就是将更新队列传入到nextTick方法中：nextTick(flushSchedulerQueue)
 * (7) flushSchedulerQueue的功能就是遍历执行watcher.run()方法，而watcher.run()方法最终会完成视图的更新
 */

/** 
 * nextTick
 * 
 * nextTick方法会被传进来的回调push进callbacks数组，然后执行timerFunc方法
 */
export function nextTick (cb?: Function, ctx?: Object) {
    let _resolve
    // push进callbacks数组
    callbacks.push(() => {
       cb.call(ctx)
    })
    if (!pending) {
      pending = true
      // 执行timerFunc方法
      timerFunc()
    }
}

/**
 * timerFunc
 */
let timerFunc
// 判断是否原生支持Promise
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  timerFunc = () => {
    // 如果原生支持Promise 用Promise执行flushCallbacks
    p.then(flushCallbacks)
    if (isIOS) setTimeout(noop)
  }
  isUsingMicroTask = true
// 判断是否原生支持MutationObserver
}

// flushCallbacks 最终执行nextTick 方法传进来的回调函数
function flushCallbacks () {
    pending = false
    const copies = callbacks.slice(0)   
    callbacks.length = 0
    for (let i = 0; i < copies.length; i++) {
      copies[i]()
    }
}
/** 
 * nextTick中的任务，实际上会异步执行，nextTick(callback)类似于 Promise.resolve().then(callback)，或者setTimeout(callback, 0)。
 * 也就是说vue的视图更新 nextTick(flushSchedulerQueue)等同于setTimeout(flushSchedulerQueue, 0)，会异步执行flushSchedulerQueue函数，
 * 所以我们在this.msg = hello 并不会立即更新dom。
 */

/**
 * 总结：
 * 
 * vue为了保证性能，会把dom修改添加到异步任务，所有同步代码执行完成后再统一修改dom
 * 一次事件循环中的多次数据修改只会触发一次watcher.run()
 * 也就是通过nextTick，nextTick会优先使用microTask创建异步任务
 * vue项目中如果需要获取修改后的dom信息，需要通过nextTick在dom更新任务之后创建一个异步任务
 * 
 * 如官网所说，nextTick会在下次 DOM 更新循环结束之后执行延迟回调。
 */


/**
 * Vue nextTick 机制
 * https://juejin.im/post/6844903599655370765
 */
// 效果：实际效果中，只会输出一次：3
export default {
    data () {
      return {
        msg: 0
      }
    },
    mounted () {
      this.msg = 1
      this.msg = 2
      this.msg = 3
    },
    watch: {
      msg () {
        console.log(this.msg)
      }
    }
}

/** 
 * queueWatcher
 * 
 * 我们定义watch监听msg，实际上会被Vue这样调用vm.$watch(keyOrFn, handler, options)。$watch是我们初始化的时候，为vm绑定的一个函数，用于创建Watcher对象
 */

/** 
 * Vue通过callback数组来模拟事件队列，事件队里的事件，通过nextTickHandler方法来执行调用，而何事进行执行，是由timerFunc来决定的
 */ 
export const nextTick = (function () {
    const callbacks = []
    let pending = false
    let timerFunc
  
    function nextTickHandler () {
      pending = false
      const copies = callbacks.slice(0)
      callbacks.length = 0
      for (let i = 0; i < copies.length; i++) {
        copies[i]()
      }
    }
  
    if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
      timerFunc = () => {
        setImmediate(nextTickHandler)
      }
    } else if (typeof MessageChannel !== 'undefined' && (
      isNative(MessageChannel) ||
      // PhantomJS
      MessageChannel.toString() === '[object MessageChannelConstructor]'
    )) {
      const channel = new MessageChannel()
      const port = channel.port2
      channel.port1.onmessage = nextTickHandler
      timerFunc = () => {
        port.postMessage(1)
      }
    } else
    /* istanbul ignore next */
    if (typeof Promise !== 'undefined' && isNative(Promise)) {
      // use microtask in non-DOM environments, e.g. Weex
      const p = Promise.resolve()
      timerFunc = () => {
        p.then(nextTickHandler)
      }
    } else {
      // fallback to setTimeout
      timerFunc = () => {
        setTimeout(nextTickHandler, 0)
      }
    }
  
    return function queueNextTick (cb?: Function, ctx?: Object) {
      let _resolve
      callbacks.push(() => {
        if (cb) {
          try {
            cb.call(ctx)
          } catch (e) {
            handleError(e, ctx, 'nextTick')
          }
        } else if (_resolve) {
          _resolve(ctx)
        }
      })
      if (!pending) {
        pending = true
        timerFunc()
      }
      // $flow-disable-line
      if (!cb && typeof Promise !== 'undefined') {
        return new Promise((resolve, reject) => {
          _resolve = resolve
        })
      }
    }
})()

/** 
 * setImmediate、MessageChannel VS setTimeout
 * 
 * 优先定义setImmediate、MessageChannel为什么要优先用他们创建macroTask而不是setTimeout？
 * 
 * HTML5中规定setTimeout的最小时间延迟是4ms，也就是说理想环境下异步回调最快也是4ms才能触发。
 * Vue使用这么多函数来模拟异步任务，其目的只有一个，就是让回调异步且尽早调用。而MessageChannel 和 setImmediate 的延迟明显是小于setTimeout的。
 * 
 */