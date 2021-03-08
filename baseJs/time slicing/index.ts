/**
 * https://mp.weixin.qq.com/s/Zbe0EaSvkXjGqP6A_3pHow
 * 
 * 时间切片
 * 
 * 根据图【延迟与用户反应.webp】我们可以知道，当延迟超过100ms，用户就会察觉到轻微的延迟。
 * 所以为了避免这种情况，我们可以使用两种方案，一种是Web Worker，另一种是时间切片
 */

/**
 * (1) web worker
 */
// 使用了Web Worker之后的优化效果，如图【使用worker以后的效果.png】
const testWorker = new Worker('./worker.js')
setTimeout(_ => {
  testWorker.postMessage({})
  testWorker.onmessage = function (ev) {
    console.log(ev.data)
  }
}, 5000)


// worker.js
self.onmessage = function () {
    const start = performance.now()
    while (performance.now() - start < 1000) {}
    postMessage('done!')
}


/**
 * (2) 时间切片 Time Slicing
 * 
 * 时间切片的本质就是将长任务分割为一个个执行时间很短的任务，然后再一个个地执行。
 * 
 * 使用场景：例如当我们需要在页面中一次性插入一个长列表时（当然，通常这种情况，我们会使用分页去做）
 * 
 * 如果利用时间分片的概念来实现这个功能，我们可以使用requestAnimationFrame+DocumentFragment
 */
const list = document.querySelector('.list')
const total = 100000
const size = 20
const index = 0

const render = (total, index) => {
    if (total <= 0) {
        return
    }

    let curPage = Math.min(total, size)
    window.requestAnimationFrame(() => {
        let fragment = document.createDocumentFragment()
        for (let i = 0; i < curPage; ++i) {
            let item = document.createElement('li')
            item.innerText = `我是${index + i}`
            fragment.appendChild(item)
        }
        list.appendChild(fragment)

        render(total - curPage, index + curPage)
    })
}

render(total, index)


// 我们同样可以利用Web Api requestIdleCallback 以及ES6 API  Generator 来实现
function gen(task) {
    window.requestIdleCallback(deadline => {
        let next = task.next()
        
        while (!next.done) {
            if (deadline.timeRemaining() <= 0) {
                gen(task)
                return
            }

            next = task.next()
        }
    })
}

let list_1 = document.querySelector('.list')
let total_1 = 100000
function* loop() {
    for (let i = 0; i < total_1; ++i) {
        let item = document.createElement('li')
        item.innerText = `我是${i}`
        list_1.appendChild(item)
        yield
    }
}

gen(loop())



