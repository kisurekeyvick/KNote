/**
 * 生命周期钩子示意图：【life-cycle.jpg】
 */

/**
 * beforeCreate(vue创建前)
 * 
 * 在 Vue 实例初始化后立即被调用
 * 此阶段尚未设置计算属性、观察者、事件、数据属性和操作等内容。
 * （说白了，vues实例刚初始化，数据观测和初始化事件还未开始）
 */

/**
 * created(vue创建后)
 * 
 * 此阶段，Vue 实例已经初始化，并且已经激活了计算属性、观察者、事件、数据属性和随之而来的操作。
 * 此时可以显示数据类型，但是无法操作DOM，元素属性尚不可用
 * （说白了，完成数据观测，属性和方法的运算，初始化事件，$el属性还没有显示出来）
 */

/**
 * beforeMount(dom载入前)
 * 
 * 这是在 DOM 上挂载实例之前的那一刻，模板和作用域样式都在这里编译，但是你仍然无法操作DOM、元素属性仍然不可用
 * （说白了，实例已完成以下的配置：编译模板，把data里面的数据和模板生成html。但此时还没有挂载html到页面上。）
 */ 

/**
 * mounted(dom载入后)
 * 
 * (1) 此过程中进行ajax交互
 * (2) mounted 不会保证所有的子组件也都一起被挂载。如果你希望等到整个视图都渲染完毕，可以在 mounted 内部使用 vm.$nextTick
 * (3) 实例已完成以下的配置：用上面编译好的html内容替换el属性指向的DOM对象。完成模板中的html渲染到html页面中。
 */
{
    mounted: function () {
        this.$nextTick(function () {
          // Code that will run only after the
          // entire view has been rendered
        })
    }
}

/**
 * beforeUpdate(更新前)
 * 
 * 在数据更新之前调用，发生在虚拟DOM重新渲染和打补丁之前。可以在该钩子中进一步地更改状态，不会触发附加的重渲染过程。
 * （说白了，在这里对需要更新 DOM 的数据进行更改，在进行删除事件侦听器之类的更改之前，此阶段适合任何逻辑。）
 */

/**
 * updated(更新后)
 * 
 * 于数据更改导致的虚拟DOM重新渲染和打补丁之后调用。调用时，组件DOM已经更新，所以可以执行依赖于DOM的操作。
 * 然而在大多数情况下，应该避免在此期间更改状态，因为这可能会导致更新无限循环。该钩子在服务器端渲染期间不被调用。
 * （说白了，对 DOM 更新之后立即调用此生命周期钩子，不建议在此钩子中更改状态）
 */ 

/**
 * beforeDestroy(销毁前)
 * 
 * 在实例销毁之前调用。实例仍然完全可用
 */

/**
 * destroyed(销毁后)
 * 
 * 在实例销毁之后调用。调用后，所有的事件监听器会被移除，所有的子实例也会被销毁。该钩子在服务器端渲染期间不被调用
 */ 

/**
 * 生命钩子触发顺序：
 * 
 * 第一次页面加载会触发beforeCreate、created、beforeMount、mounted, mounted说明dom渲染完毕
 */ 

/** 
 * 生命周期业务场景：
 * 
 * created:进行ajax请求异步数据的获取、初始化数据
 * mounted:挂载元素dom节点的获取
 * nextTick:针对单一事件更新数据后立即操作dom
 * updated:任何数据的更新，如果要做统一的业务逻辑处理
 * watch:监听数据变化，并做相应的处理
 */

/**
 * 关于生命钩子需要注意的地方:
 * 
 * 不要在选项 property 或回调上使用箭头函数，比如 created: () => console.log(this.a) 或 vm.$watch('a', newValue => this.myMethod())。
 * 因为箭头函数并没有 this，this 会作为变量一直向上级词法作用域查找，直至找到为止，
 * 经常导致 Uncaught TypeError: Cannot read property of undefined 或 Uncaught TypeError: this.myMethod is not a function 之类的错误。
 */ 
