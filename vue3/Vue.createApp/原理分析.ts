/**
 * https://www.jianshu.com/p/d2fa67f42b3c
 * 
 * vue3-创建应用createApp
 * 
 * 每个 Vue 应用都是通过用 createApp 函数创建一个新的应用实例开始的
 * 一个应用需要被挂载到一个 DOM 元素中。例如，如果我们想把一个 Vue 应用挂载到<div id="app"></div>，我们应该传递 #app
 */


/**
 * 我们将分为两部分进行渲染过程的理解：
 * (1) 创建应用实例，函数createApp的剖析
 * (2) 应用实例挂载， 函数mount方法挂载过程
 */

/**
 * 1. 创建应用实例 createApp
 * 
    <div id="app">
        <input v-model="value"/>
        <p>双向绑定：{{value}}</p>
        <hello-comp person-name="zhangsan"/>
    </div>
 * 
 */
const { createApp } = Vue
const helloComp = {
    name: 'hello-comp',
    props: {
        personName: {
            type: String,
            default: 'wangcong'
        }
    },
    template: '<p>hello {{personName}}!</p>'
}
const app = {
    data() {
        return {
            value: '',
            info: {
                name: 'tom',
                age: 18
            }
        }
    },
    components: {
        'hello-comp': helloComp
    },
    mounted() {
        console.log(this.value, this.info)
    },
}
createApp(app).mount('#app')

// 查看官方文档和上面的例子我们可以知道，createApp方法接收的是根组件对象作为参数，并返回了一个有mount方法的应用实例对象。
// 按照依赖关系可以找到createApp方法出自packages/runtime-dom/src/index.ts
export const createApp = ((...args) => {
    const app = ensureRenderer().createApp(...args)
  
    if (__DEV__) {
      injectNativeTagCheck(app)
    }
  
    const { mount } = app
    app.mount = (containerOrSelector: Element | string): any => {
      const container = normalizeContainer(containerOrSelector)
      if (!container) return
      const component = app._component
      if (!isFunction(component) && !component.render && !component.template) {
        component.template = container.innerHTML
      }
      // clear content before mounting
      container.innerHTML = ''
      const proxy = mount(container)
      container.removeAttribute('v-cloak')
      container.setAttribute('data-v-app', '')
      return proxy
    }
  
    return app
}) as CreateAppFunction<Element>
/**
 * 这里做了两件事情
 * 1. 创建app应用实例: ensureRenderer().createApp(...args)
 * 2. 重写了app.mount方法。document.querySelector方法获取HTMLElement对象作为参数传入原mount方法。
 */

