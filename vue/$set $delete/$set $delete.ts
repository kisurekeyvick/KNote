/** 
 * https://juejin.im/post/6844904190918000654
 * 
 * 知识点1：对象和数组不会响应式更新的情况
 * 
 * (1) 对象不响应式更新
 *      data对象的响应式是通过 Object.defineProperty 的 getter/setter来实现的
 *      只能响应对象已有属性的 ( 修改 )，不能响应对象属性的 ( 添加 ) 和 ( 删除 )
 * 
 *      解决办法: 添加属性 Vue.set() , vm.$set()，用 Object.assign({}, this.object, 添加新的属性的对象) 返回一个新的对象
 *               删除属性 Vue.delete(), vm.$delete()
 * 
 * (2) 数组不响应式更新
 *      不更新的情况：直接修改数组成员的值 arr[0] = 1000
 *                   直接修改数组的长度 arr.length = 1000
 *      
 *      解决办法：利用重写的数组的7种方法：push pop unshift shift splice sort reverse
 *               添加，修改：Vue.set() , vm.$set(), splice
 *               删除：Vue.delete(), vm.$delete(), splice
 *  
 *      注意点：当数组中成员是对象时，修改数组成员成的对象的属性，是会响应式更新的
 */

/** 
 * 知识点2：vue响应式原理
 * 
 * 把一个普通的js对象传入 Vue 实例作为 data 选项，Vue 将遍历此对象所有的 property，
 * 并使用 Object.defineProperty 把这些 property 全部转为 getter/setter。
 * 内部的getter/setter让 Vue 能够追踪依赖，在 property 被访问和修改时通知变更。
 * 
 * 每个组件实例都对应一个 watcher 实例，它会在组件渲染的过程中把“接触”过的数据 property 记录为依赖。
 * 之后当依赖项的 setter 触发时，会通知 watcher，从而使它关联的组件重新渲染。
 * 
 * 可以查看图片【依赖收集 watcher.jpg】
 */

/** 
 * 知识点3：vue无法检测属性的添加或者删除
 * 
 * ----------------- 针对object -----------------
 * 由于 Vue 会在初始化实例时对 property 执行 getter/setter 转化，所以 property 必须在 data 对象上存在才能让 Vue 将它转换为响应式的
    var vm = new Vue({
        data:{
            a:1
        }
    })              // `vm.a` 是响应式的

    vm.b = 2        // `vm.b` 是非响应式的

 * (1) 对于已经创建的实例，Vue 不允许动态添加根级别的响应式 property。
 *      但是，可以使用 Vue.set(object, propertyName, value) 方法向嵌套对象添加响应式 property，
 *      例如：Vue.set(vm.someObject, 'b', 2)
 *           this.$set(this.someObject,'b',2)
 * 
 * (2) 如果是对已有的对象添加多个属性可以这样：this.someObject = Object.assign({}, this.someObject, { a: 1, b: 2 })
 *     注意不要使用：Object.assign(this.someObject, { a: 1, b: 2 })
 * 
 * ----------------- 针对array -----------------
 * vue是不会检测如下情况的：当你利用索引直接设置一个数组项时，例如：vm.items[indexOfItem] = newValue
 *                        当你修改数组的长度时，例如：vm.items.length = newLength
 * 
    var vm = new Vue({
        data: {
            items: ['a', 'b', 'c']
        }
    })
    vm.items[1] = 'x' // 不是响应性的
    vm.items.length = 2 // 不是响应性的
 * 
 * 为了能够实现vm.items[indexOfItem] = newValue，可以使用如下方式：
 *      (1) Vue.set/vm.$set(vm.items, indexOfItem, newValue)
 *      (2) vm.items.splice(indexOfItem, 1, newValue)
 * 
 * 为了实现vm.items.length = newLength，可以使用如下方式：
 *      (1) vm.items.splice(newLength)
 */ 

/** 如下是一个demo案例 */
/** 
    <template>
        <div id="root">
            <div>{{this.obj}}</div>
            <div>{{this.arr}}</div>
            <button @click="change">change - 不会响应</button>
            <button @click="change2">change2 - 响应</button>
        </div>
    </template>
    <script>
        new Vue({
            el: '#root',
            data: {
                obj: {
                    number1: 1,
                    number2: 2,
                    number3: {
                        number4: 4
                    }
                },
                arr: [1, 2, {
                    number5: 5
                }]
            },
            methods: {
                change() {
                    this.obj.count = 1; // 对象添加属性，不会从新渲染
                    Reflect.deleteProperty(this.obj, this.number2); // 对象删除已有属性，不会从新渲染
                    this.arr[0] = 0; // 直接修改数组的值，不会从新渲染
                    this.arr.length = 100; // 修改数组的长度，不会从新渲染
                },
                change2() {
                    // 对象
                    Vue.delete(this.obj, 'number2') // 删除对象属性
                    Vue.set(this.obj, 'count', 1) // 给对象添加属性
                    // 数组
                    this.arr[2].number5 = 555; // 数组中有对象，是可以直接响应式更新的
                    Vue.set(this.arr, 3, 300); // 添加数组成员
                    Vue.set(this.arr, 0, 0) // 修改数组成员
                    this.$set(this.arr, 0, 0) // 修改数组的某个成员的值 vm.$set 方法， vm.$set 实例方法是全局方法 Vue.set 的一个别名
                    this.arr.splice(0, 1, 0) // 修改数组的某个成员的值 Array.prototype.splice 方法
                    this.arr.splice(100) // 修改数组长度
                }
            },
        })
    </script>
 */

/** 
 * 知识点4：vue.set() 源码分析
 */
function set (target: Array<any> | Object, key: any, val: any): any {
    /** 
     * target   数组或者对象
     * key      对象的属性或者数组的下标，any类型
     * val      any类型
     */
    /** ----------------- 针对array ----------------- */
    if (Array.isArray(target)) {
        // 如果target是数组类型，并且key是合法的下标类型及范围
        target.length = Math.max(target.length, key)
        target.splice(key, 1, val)
        return val  // Vue.set() 的返回值
    }
    /** ----------------- 针对object ----------------- */
    if (key in target && !(key in Object.prototype)) {
        // 修改对象已有属性，就直接修改返回
        target[key] = val
        return val
    }

    const ob: any = target

    if (!ob.__ob__) {
        // 如果ob不存在，即target.__ob__不存在，说明不是响应式数据，即普通对象的修改，直接赋值返回
        // 非响应式数据，也能使用Vue.set()
        target[key] = val;
        return val;
    }

    // ob存在
    defineReactive(ob.value, key, val)
    /** 
     * defineReactive作用就是给 value 对象的 key 属性添加响应式，访问get依赖收集，修改set派发更新
     *                 并且val还是一个对象，就会对val对象属性进行依赖收集就会继续观察变成响应式
     */

    ob.dep.notify()
    /** 
     * 手动派发更新
     * 因为上面 defineReactive(ob.value, key, val) 更新是要值被修改后才会更新，而这里没有修改值，即 Vue.set()后手动更新
     * 
     * target.__ob__ = new Observer(target) 
     * ob.dep.notify() = target.__ob__.dep.notify() 后续就会走派发更新的流程
     */

    return val
}

function Dep() {}

function defineReactive(
    obj: Object,
    key: string,
    val: any,
    customSetter?: Function,
    shallow?: boolean
) {
    const dep = new Dep()
    // Object.getOwnPropertyDescriptor 用于copy存在get、set属性的对象
    const property = Object.getOwnPropertyDescriptor(obj, key)

    if (property && property.configurable === false) {
        return
    }

    const getter = property && property.get
    const setter = property && property.set

    if ((!getter || setter) && arguments.length === 2) {
        // 如果 ( getter 不存在 或者 setter存在 ) 并且 ( 实参个数是2 )
        // 1. 初始化时 defineReactive(obj, keys[i]) 满树实参长度是 2
        // 2. 初始化时 getter 和 setter 都是 false
          //  初始化时因为12都满足，执行 val = obj[key]
        val = obj[key]
    }

    let childOb = !shallow && observe(val)
    // observe(val) => 继续观察 data 的属性

    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            const value = getter ? getter.call(obj) : val

            if (Dep.target) {
              dep.depend()
              if (childOb) {
                // 如果data的属性还是一个对象，childOb就存在
                childOb.dep.depend()
                // childOb.dep.depend()
                // 就是给所有嵌套的对象的每一个属性都去收集依赖，当嵌套对象对应的属性被访问时，也能够派发更新
                if (Array.isArray(value)) {
                  // 如果data的属性是一个数组
                  dependArray(value)
                }
              }
            }

            return value
        },
        set: function reactiveSetter (newVal) {
            // const value = getter ? getter.call(obj) : val

            // /* eslint-disable no-self-compare */
            // if (newVal === value || (newVal !== newVal && value !== value)) {
            //     return
            // }

            // // #7981: for accessor properties without setter
            // if (getter && !setter) return
            // if (setter) {
            //     setter.call(obj, newVal)
            // } else {
            //     val = newVal
            // }
            childOb = !shallow && observe(newVal)
            dep.notify()
        }
    })
}

function dependArray (value: Array<any>) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i]
    e && e.__ob__ && e.__ob__.dep.depend()
    // ( value[i].__ob__ ) 存在就 ( 调用 value[i].__ob__.dep.depend() )
    // 注意：
     // __ob__属性只有被观察的 ( 对象或数组 ) 才具有
    if (Array.isArray(e)) {
      dependArray(e)
      // 还是数组，就递归
    }
  }
}

/** 
 * 知识点5： vm.$set()的流程描述
 * 
    <div id="root">
        <div>{{this.obj}}</div>
        <button @click="change">change</button>
    </div>

    new Vue({
      el: '#root',
      data: {
        obj: {
          a: 1
        }
      },
      methods: {
        change() {
          debugger
          Vue.set(this.obj, 'b', 2)
        }
      },
    })
 * 
 * (1) data初始化
 *      首先的data的初始化，因为有嵌套对象，会通过 let childOb = !shallow && observe(val) 继续观测子对象，
 *      最终使得所有的属性都具有响应式
 * 
 * (2) 初始化挂载和渲染
 *      在 template 中访问了 this.obj 所以会访问data,obj,以及obj中的所有属性，并且渲染出来
 *  
 *      我们需要知道如下：
 *      访问rootData时，let childOb = !shallow && observe(val) 返回了 obj 的 observer
 *      所以： childOb.dep.depend() 就可以对 obj对象的 dep 进行依赖收集
 *      更新：Vue.set()的时候，对 obj.b = 2 建立了响应式，以后访问b就是get，修改b就会更新触发渲染
 * 
 * (3) Vue.set(this.obj, 'b', 2)
 *      当obj是undefined,null,基本类型数据时，警告
 *      
 *      - 处理数组
 *          修改，添加，删除都通过重写后的 target.splice(key, 1, val) 来完成，将要处理的目标值构造成数组，
 *          通过ob.observeArray(inserted)继续观察，然后 ob.dep.notify() 手动派发更新，然修改的值反应在DOM上
 * 
 *      - 处理对象
 *          defineReactive(ob.value, key, val) 对添加的对象属性新建立响应式
 *          ob.dep.notify() 手动通知，因为在访问时已经对data的子对象obj做了let childOb = !shallow && observe(val) => childOb.dep.depend() 
 *          所以render watcher 订阅了 obj 的dep，obj变化就能通过到渲染watcher重新渲染
 * 
 *      - 普通的非响应式对象
 *          直接赋值
 */

/** 
 * 知识点6： vm.$delete源码分析
 */
function del(target: Array<any> | Object, key: any) {
    /** 
     * target   数组或者对象
     * key      对象的属性或者数组的下标，any类型
     * val      any类型
     */
    /** ----------------- 针对array ----------------- */
    if (Array.isArray(target) && isValidArrayIndex(key)) {
        // 如果是数组，并且key是有效的数组下标范围

        target.splice(key, 1)
        // 利用重写的splice删除这个数组中的下标对应的成员
        return
    }
    /** ----------------- 针对object ----------------- */
    const ob: any = target

    if (!hasOwn(target, key)) {
        // 不是自身属性
        return
    }

    delete target[key]
    // 删除对象的属性

    if (!ob.__ob__) {
        return
    }

    ob.dep.notify()
    // 手动通知
}

