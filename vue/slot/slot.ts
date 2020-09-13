/**
 * https://www.zhihu.com/question/37548226
 * vue中的slot
 * 
 * 在 Vue 中我们习惯把虚拟DOM称为 VNode，它既可以代表一个 VNode 节点，也可以代表一颗 VNode 树
 */

/** 
 * 结论1：插槽就是一个返回VNode的函数而已
 * 结论2：普通插槽和作用域插槽根本就没有区别，因为普通插槽就是作用域插槽的子集，这也是 Vue 为什么将二者合并的原因。
 */ 

/** 
    <!-- 父组件模板 并提供一个普通插槽(div) -->
    <MyComponent>
        <div></div>
    </MyComponent>

    这是一个默认插槽，因为它没有名字。这时父组件编译后的渲染函数可以表示为:
    render() {
        return h('MyComponent', {
            slots: {
                default: h('div')
            }
        })
    }


    <!-- 子组件模板 -->
    <section>
        <slot/>
    </section>

    子组件的模板经过编译后，其渲染函数可以表示为:
    render() {
        return h('section', this.$slot.default)
    }

    this.$slot.default就是从父组件传递过来的数据，也就是：
    render() {
        return h('section', h('div'))
    }


    <!-- 有名字的slot -->
    编译器是知道插槽的名称的，因为你都写在模板里了：
    <section>
        <slot name="xxoo">
    </section>
    编译成的就是：
    render() {
        return h('section', this.$slot.xxoo)
    }
 */ 

/** 
 * 知识点1：作用域插槽，与普通插槽唯一的区别
 *          编译器会把作用域插槽编译成函数，一个返回 VNode 的函数，而非像普通插槽一样直接编译成 VNode
 * 
    <!-- 父组件模板 -->
    <MyComponent>
        <div slot="xxoo" slot-scope="scopeData">
            {{ scopeData.a }}
        </div>
    </MyComponent>

    它编译成：
    render() {
        return h('MyComponent', {
            scopedSlots: {
                xxoo: function(scopeData) {
                    return h('div', scopeData.a)
                }
            }
        })
    }

    <!-- 子组件的渲染 -->
    render() {
        return h('section', this.$scopedSlots.xxoo())
    }

    因为 `this.$scopedSlots.xxoo` 是一个函数，所以我们需要执行它，而因为它是函数所以才给了我们为它传递参数的机会，例如：
    // 子组件的渲染函数
    render() {
        return h('section', this.$scopedSlots.xxoo({
            a: this.a,
            b: this.b
        }))
    }


    再回过头来看一下 xxoo 函数：
    xxoo: function(scopeData) {
        return h('div', scopeData.a)
    }
    这里的 scopeData 就是我们从子组件传递过来的对象，而 `scopeData.a` 就是子组件的数据，这就是作用域插槽的原理。


    总结：普通插槽和作用域插槽的区别
    // 普通插槽
    slots: {
        xxoo: h('div')
    }
    
    // 作用域插槽
    scopedSlots: {
        xxoo: (scopedData) => h('div', scopedData.a)
    }
 */ 