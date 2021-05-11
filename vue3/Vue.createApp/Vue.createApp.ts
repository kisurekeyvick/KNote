/**
 * 为何要以 createApp(App).mount('#app') 的形式创建
 * 
 * https://www.bilibili.com/read/cv10133036/
 */

/** ------- vue2 版本 ------- */
new Vue({
    render: h => h(App)
}).$mount('#app')

/** ------- vue3 版本 ------- */
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')

/**
 * (1) createApp的好处
 * 
 * 想象一个场景：我们需要开发一个比较大的vue应用，
 * 团队A需要一个vueA实例对象，它拥有全局组件ShowDialog，
 * 团队B需要一个vueB实例对象，它不需要全局组件showDialog，
 * 
 * 要求俩个vue实例的功能要完全独立，相互隔离，该如何实现？
 */
/** ------- vue2 的实现 ------- */
<div id='foo'></div>
<div id='bar'></div>

Vue.component('show-dialog', {
    template: '<h1>show dialog</h1>'
})

// 实例化A
const vueA = new Vue({
    template: `
        <div>
            vueA
            <show-dialog></show-dialog>
        </div>
    `
})

vueA.$mount('#foo')

// 实例化B
const vueB = new Vue({
    template: `
        <div>
            vueB
            <show-dialog></show-dialog>
        </div>
    `
})

vueB.$mount('#bar')
/** 
 * 以上，我们通过new操作符，连续实例化了俩个vue实例A和B，并且注册好了一个全局组件，
 * 我们期待全局组件只能在实例A控制的视图区域中使用，然而这是行不通的，
 * 因为vue2的组件系统设计中，所有的vue实例是共享一个Vue构造函数对象的（包括全局指令/全局组件等），无法做到完全隔离
 */



/** ------- vue3 的实现 ------- */
// 实例化A
const vueA = Vue.createApp({
    template:`
        <div>
            vueA
            <show-dialog></show-dialog>
        </div>
    `
})

vueA.component('show-dialog', {
    template: '<h1>show-dialog</h1>'
})

vueA.mount('#foo')

const vueB = Vue.createApp({
    template:`
        <div>
            vueB
        </div>
    `
})

vueB.mount('#bar')

// 实例化B

/**
 * - createApp方法可以返回一个提供应用上下文的应用实例，应用实例挂载的整个组件树共享同一个上下文。
 * 
 * 以上，我们使用vue3中的createApp方法进行实例创建，这一次创建出来的实例A和B拥有完全隔离的环境，
 * 这一次我们的show-dialog组件，在vueA实例控制的视图中是完全全局可用的，
 * 而在vueB控制的视图区域是不可用的（如果你想在A和B环境中共享，把show-dialog组件配置项抽离出来，各自注册一下即可）
 * 
 * - 大家可以把案例中的vueA 和 vueB想象成俩个完全不同的应用实例，它们各自为营，互不影响，完全隔离，同样也可以自由的选择要共享哪些东西
 */


/**
 * 场景应用
 * 
 * 我们可能会奇怪，做了蛮多的vue项目，貌似很少见到有多次new Vue的情景，事实上随着项目规模的扩大，
 * 由独立团队共同协作开发项目以及前端微服务的普及，你可能会在某个时候发现自己也需要这样做，
 * 说的简单一点，如果多个单页应用由多个团队一起开发，并且共享一套js运行环境的时候，隔离就显得格外的重要了
 */