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
