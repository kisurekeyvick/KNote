/** 
 * https://www.jianshu.com/p/1bfd582da93e
 * 
 * mixin
 * Mixin允许你封装一块在应用的其他组件中都可以使用的函数。
 * 当组件使用混入对象时，所有混入对象的选项将被混入该组件本身的选项
 */

// 先自定义一个mixin
export const myMixin = {
    data() {
        return {
            num: 1
        }
    },
    created() {
        this.hello();
    },
    methods: {
        hello() {
            console.log(this, 'hello nice fish');
        }
    },
}; 

/** 
 * mixin的理解：
 * (1) 方法和参数在各组件中不共享,mixin到不同的class中，然后修改其中一个class的num值，但是另一个class中的值没有改变
 * (2) 如methods,components等，选项会被合并到对应的class中
 * (3) 混合对象里的钩子函数在组件里的钩子函数之前调用
 */

/** 
 * 和vuex的区别
 * (1) mixin 可以定义共用的变量，在每个组件中使用，引入组件中之后，各个变量是相互独立的，值的修改在组件中不会相互影响。
 * (2) vuex：用来做状态管理的，里面定义的变量在每个组件中均可以使用和修改，
 *      在任一组件中修改此变量的值之后，其他组件中此变量的值也会随之修改
 * (3) Mixins：则是在引入组件之后与组件中的对象和方法进行合并，相当于扩展了父组件的对象与方法，可以理解为形成了一个新的组件。
 */ 

/** 
 * 知识点1：mixin的数据对象和组件的数据发生冲突时以组件数据优先 
 */
var mixin = {
    data: function () {
        return {
            message: 'hello',
            foo: 'abc'
        }
    }
}
  
new Vue({
    mixins: [mixin],
    data: function () {
        return {
            message: 'goodbye',
            bar: 'def'
        }
    },
    created: function () {
        console.log(this.$data)
        // => { message: "goodbye", foo: "abc", bar: "def" }
    }
})

/** 
 * 知识点2：同名钩子函数将会混合为一个数组，都将被调用到，但是混入对象的钩子将在组件自身钩子之前调用
 */
var mixin = {
    created: function () {
        console.log('混入对象的钩子被调用')
    }
}
  
new Vue({
    mixins: [mixin],
    created: function () {
        console.log('组件钩子被调用')
    }
})
// => "混入对象的钩子被调用"
// => "组件钩子被调用"

/** 
 * 知识点3：值为对象的选项，例如 methods, components 和 directives，将被混合为同一个对象。
 *          两个对象键名冲突时，取组件对象的键值对。
 */
var mixin = {
    methods: {
        foo: function () {
            console.log('foo')
        },
        conflicting: function () {
            console.log('from mixin')
        }
    }
}
  
var vm = new Vue({
    mixins: [mixin],
    methods: {
        bar: function () {
            console.log('bar')
        },
        conflicting: function () {
            console.log('from self')
        }
    }
})
vm.foo() // => "foo"
vm.bar() // => "bar"
vm.conflicting() // => "from self"

/**
 * 总结：
 *         针对于生命周期，如图【mixin-生命周期执行顺序.png】
 *         针对于watch，如图【mixin-watch的执行顺序.png】
 *         原型叠加，如：components，filters，directives，两个对象合并的时候，不会相互覆盖，而是权重小的被放到权重大的原型上
 *                      这样权重大的，访问快些，因为作用域链短了
 *                      A.__proto__ = B  
 *                      B.__proto__ = C  
 *                      C.__proto__ = D
 *         覆盖叠加，如：props，methods，computed，inject
 *                      两个对象合并，如果有重复key，权重大的覆盖权重小的 
 *                      组件的 props：{ name:""}
 *                      组件mixin 的 props：{ name:"", age: "" }
 *                      那么 把两个对象合并，有相同属性，以 权重大的为主，组件的 name 会替换 mixin 的name
 *         直接替换，如：el，template
 *                      两个数据只替换，不合并，权重大的，会一直替换 权重小的，因为这些属于只允许存在一个，所有只使用权重大的选项
 */
// 原型叠加，如图【mixin-原型叠加.png】，代码如下
// 全局 filter
Vue.filter("global_filter",function (params) {})

// mixin 的 mixin
var mixin_mixin={    
    filters:{
        mixin_mixin_filter(){}
    }
}

// mixin filter
var test_mixins={    
    filters:{
        mixin_filter(){}
    }
}

// 组件 filter
var a=new Vue({    
    mixins:[test_mixins],    
    filters:{
        self_filter(){}
    }
})


