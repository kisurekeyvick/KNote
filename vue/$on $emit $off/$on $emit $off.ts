/** 
 * $on $emit $off
 */
/** 
 * 知识点1：父组件template中使用的@其实就是v-on的简写
 * 
 * 父组件
    <template>
        <ratingselect @select-type="onSelectType"></ratingselect>
    </template>
    <script>
        export default {
            data () {
                return {
                    selectType: 0,
                }
            }
            methods: {
                onSelectType (type) {
                    this.selectType = type
                }
            }
        }
    </script>
*/
/** 
 * 需要注意的是：父组件使用@select-type="onSelectType"@就是v-on的简写，
 *              监听由子组件vm.$emit触发的事件，通过onSelectType()接受从子组件传递过来的数据，通知父组件数据改变了。
 */


/** 
 * 知识点2：$on的使用场景,兄弟组件之间相互传递数据
 * 
 * 其实就是创建一个Vue的实例，它用于兄弟组件之间通讯的桥梁
 * 
    // vue实例 eventBus
    import Vue from 'vue';
    export default new Vue();

    // 子组件A:发送放使用$emit自定义事件把数据带过去
    <template>
        <div>
            <span>A组件-{{msg}}</span>
            <input type="button" value="把A组件数据传递给B" @click="send">
        </div>
    </template>
    <script>
        import eventBus from './eventBus';
        export default{
            data(){
                return{
                    msg:{
                        a:'111',
                        b:'222'
                    }
                }
            },
            methods:{
                send(){
                    eventBus.$emit('aevent',this.msg)
                }
            }
        }
    </script>

    // 子组件B:接收方通过$on监听自定义事件的callback接收数据
    <template>
        <div>
            <span>B组件，A传的数据为--{{msg}}</span>
        </div>
    </template>
    <script>
        import eventBus from './eventBus.vue'
        export default {
            data(){
                return{
                    msg:''
                }
            },
            mounted(){
                eventBus.$on('aevent',(val)=>{//监听事件aevent，回调函数要使用箭头函数。
                    console.log(val);//打印结果；我是a组件的数据。
                })
            }
        }
    </script>
 * 
 */

/**
 * 知识点3： 关于$on $emit $off $once的源码解析
 */
Vue.prototype.$on = function (event, fn) {
    const vm = this
    
    // 我们传入的要监听的事件可能为数组，这时候对数组里的每个事件再递归调用$on方法
    if (Array.isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn)
      }
    } else {
      // 之前已经有监听event事件，则将此次监听的回调函数添加到其数组中，否则创建一个新数组并添加fn
      (vm._events[event] || (vm._events[event] = [])).push(fn)
    }
    return vm
}

Vue.prototype.$off = function (event, fn) {
    const vm = this
    // all
    if (!arguments.length) {
    // 如果没有传参数，则清空所有事件的监听函数
      vm._events = Object.create(null)
      return vm
    }
    
    // 如果传的event是数组，则对该数组里的每个事件再递归调用$off方法
    if (Array.isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        vm.$off(event[i], fn)
      }
      return vm
    }
    
    // 获取当前event里所有的回调函数
    const cbs = vm._events[event]
    
    // 如果不存在回调函数，则直接返回，因为没有可以移除监听的内容
    if (!cbs) {
      return vm
    }
    
    // 如果没有指定要移除的回调函数，则移除该事件下所有的回调函数
    if (!fn) {
      vm._events[event] = null
      return vm
    }
    
    // 指定了要移除的回调函数
    let cb
    let i = cbs.length
    while (i--) {
      cb = cbs[i]
      // 在事件对应的回调函数数组里面找出要移除的回调函数，并从数组里移除
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1)
        break
      }
    }
    return vm
}

Vue.prototype.$emit = function (event) {
    const vm = this
    
    // 拿出触发事件对应的回调函数列表
    let cbs = vm._events[event]
    
    if (cbs) {
      
      // $emit方法可以传参，这些参数会在调用回调函数的时候传进去
      const args = toArray(arguments, 1)
      
      // 遍历回调函数列表，调用每个回调函数
      for (let i = 0, l = cbs.length; i < l; i++) {
        cbs[i].apply(vm, args)
      }
    }
    return vm
  }
}

Vue.prototype.$once = function (event, fn) {
    const vm = this
    
    // 封装一个高阶函数on，在on里面调用fn
    function on () {
      // 每当执行了一次on，移除event里的on事件，后面再触发event事件就不会再执行on事件了，也就不会执行on里面的fn事件
      vm.$off(event, on)
      
      // 执行on的时候，执行fn函数
      fn.apply(vm, arguments)
    }
    
    // 这个赋值是在$off方法里会用到的
    // 比如我们调用了vm.$off(fn)来移除fn回调函数，然而我们在调用$once的时候，实际执行的是vm.$on(event, on)
    // 所以在event的回调函数数组里添加的是on函数，这个时候要移除fn，我们无法在回调函数数组里面找到fn函数移除，只能找到on函数
    // 我们可以通过on.fn === fn来判断这种情况，并在回调函数数组里移除on函数
    on.fn = fn
    
    // $once最终调用的是$on，并且回调函数是on
    vm.$on(event, on)
    return vm
}




