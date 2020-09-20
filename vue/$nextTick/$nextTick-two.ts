/**
 * https://mp.weixin.qq.com/s/utc9iE5J0ojj18AKYg_MSQ
 * 
 * 真的理解 $nextTick
 */

/**
 * 知识点1：浏览器
 * 
 * 浏览器（多进程）包含了：Browser进程（浏览器的主进程）、
 *                     第三方插件进程、
 *                     GPU进程（浏览器渲染进程），  其中「GPU进程」（多线程）和Web前端密切相关，包含以下线程：
 *                          GUI渲染线程
 *                          JS引擎线程
 *                          事件触发线程（和EventLoop密切相关）
 *                          定时触发器线程
 *                          异步HTTP请求线程
 * 
 * 需要注意的是，GUI渲染线程 和 JS引擎线程 是互斥的，为了防止DOM渲染的不一致性，其中一个线程执行时另一个线程会被挂起。
 * 
 * 这些线程中，和Vue的nextTick息息相关的是 JS引擎线程 和 事件触发线程。
 */ 

/**
 * 知识点2：JS引擎线程和事件触发线程
 * 
 * 浏览器页面初次渲染完毕后，JS引擎线程 结合 事件触发线程 的工作流程如下：
 * (1) 同步任务在JS引擎线程（主线程）上执行，形成执行栈
 * (2) 主线程之外，「事件触发线程」管理着一个「任务队列」（Task Queue）。只要异步任务有了运行结果，就在「任务队列」之中放置一个事件。
 * (3) 「执行栈」中的同步任务执行完毕，系统就会读取「任务队列」，如果有异步任务需要执行，将其加到主线程的「执行栈」并执行相应的异步任务。
 * 
 * 可以查看图：【主线程的执行流程.png】
 */ 

/**
 * 知识点3：事件循环机制（Event Loop）
 * 
 * 「事件触发线程」管理的「任务队列」是如何产生的呢？
 * 
 * 事实上这些任务就是从「JS引擎线程」本身产生的，主线程在运行时会产生「执行栈」，栈中的代码调用某些异步API时会在「任务队列」中添加事件，
 * 栈中的代码执行完毕后，就会读取「任务队列」中的事件，去执行事件对应的回调函数，如此循环往复，形成事件循环机制
 * 
 * 可以查看图：【事件循环机制.png】
 */ 

/**
 * 知识点4：任务类型
 * 
 * JS中有两种任务类型：「微任务」和「宏任务」
 * 
 * 宏任务：script、setTimeout、setInterval、setImmediate、I/0、UI rendering
 * 微任务：process.nextTick（Nodejs） 、promise.then部分 、Object.observe 、MutationObserver
 * 
 * 区别：
 *  (1) 浏览器为了能够使得「JS引擎线程」与「GUI渲染线程」有序切换，会在当前「宏任务」结束之后，下一个「宏任务」执行开始之前，对页面进行重新渲染（「宏任务」 > 渲染  > 「宏任务」 > ...）
 *  (2)「微任务」是在当前「宏任务」执行结束之后立即执行的任务（在当前 「宏任务」执行之后，UI渲染之前执行的任务）。
 *      「微任务」的响应速度相比setTimeout（下一个「宏任务」）会更快，因为无需等待UI渲染。
 *  (3) 
 * 
 * 事件循环机制流程：
 *  (1) 执行一个「宏任务」（首次执行的主代码块或者「任务队列」中的回调函数）
 *  (2) 执行过程中如果遇到「微任务」，就将它添加到「微任务」的任务队列中
 *  (3) 「宏任务」执行完毕后，立即执行当前「微任务」队列中的所有任务（依次执行）
 *  (4) 「JS引擎线程」挂起，「GUI线程」执行渲染
 *  (5) 「GUI线程」渲染完毕后挂起，「JS引擎线程」执行「任务队列」中的下一个「宏任务」
 */

/**
 * 知识点5：Vue的API命名nextTick
 * 
 * 在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。
 */
// DOM 还没有更新
Vue.nextTick(function () {
    // DOM 更新了
})
  
// 作为一个 Promise 使用 (2.1.0 起新增，详见接下来的提示)
Vue.nextTick().then(function () {
// DOM 更新了
})

/** 
 * 知识点6：nextTick的执行
 * 
 * Vue 异步执行 DOM 更新。只要观察到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据改变。
 * 如果同一个 watcher 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作上非常重要。
 * 然后，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作。
 * Vue 在内部尝试对异步队列使用原生的 Promise.then 和 MessageChannel，如果执行环境不支持，会采用 setTimeout(fn, 0) 代替。
 * 
 * 
 * 例如，当你设置 vm.someData = 'new value' ，该组件不会立即重新渲染。
 * 当刷新队列时，组件会在事件循环队列清空时的下一个“tick”更新。
 * 
 * 可以查看图：【nextTick的执行顺序.png】
 * 
 * 简单捋一下：在data上的属性发生改变以后，因为被观察了，所以会执行setter方法，就会通知所有订阅了该属性的watcher。
 *           watcher收到通知以后将自己放入待更新的数组中，然后会执行nextTick(flushBatcherQueue)，nextTick会把flushBatcherQueue
 *           推入自己内部的cb数组中，之后会去修改MO监听的那个textNode（)
 *           第一个cb添加完成
 *           
 *           第二个cb，用户自己写的：this.$nextTick(function() {...}，然后继续将用户的回调放入cb中
 * 
 *           当task任务执行完成以后，就会执行存储在cb中的回调。(
 *              也就是说，先执行第一个cb flushBatcherQueue，遍历所有的watcher，执行更新，将数据更新到dom上
 *              然后执行第二个cb，也就是con
 *           )
 */

/**
 * 知识点7：nextTick源码
 * 
 * 位置：vue/src/core/util/next-tick.js
 */ 
import { noop } from 'shared/util'
import { handleError } from './error'
import { isIE, isIOS, isNative } from './env'

export let isUsingMicroTask = false

const callbacks = []
let pending = false

function flushCallbacks () {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}

let timerFunc

// task的执行优先级：Promise -> MutationObserver -> setImmediate -> setTimeout

// 判断是否支持promise
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks)
    if (isIOS) setTimeout(noop)
  }
  isUsingMicroTask = true
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  let counter = 1
  const observer = new MutationObserver(flushCallbacks)
  const textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
  }
  isUsingMicroTask = true
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}

export function nextTick (cb?: Function, ctx?: Object) {
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

  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}

/** 
 * 源码分析：nextTick方法接收2个参数，参数1回调函数，参数2执行对象，内部主要就是将cb存储到callbacks中
 *         如果浏览器支持promise，那么就会声明P变量，p = Promise.resolve()，然后在p.then中传入flushCallbacks
 *         flushCallbacks内部就是执行从nextTick传入的cb回调函数，然后timerFunc这个方法中就是执行p.then(flushCallbacks)
 * 
 *         这边注意到pending属性，pending一开始默认为false，当执行flushCallbacks时候，内部会将pending
 *         设置为false，当pending为false时候，就可以执行timerFunc，同时设置pending为true
 */
