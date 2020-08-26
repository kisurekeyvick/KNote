/**
 * new Vue做了什么?
 * 
 * new Vue的时候，会执行this._init()函数，即运行了Vue.prototype._init,如图 【newVue_init_one.jpg】
 * 初始化生命周期，声明data，props等，也是在这里面执行,如图 【newVue_init_two.jpg】
 */

/**
 * 在使用组件化的项目中使用的是如下形式
 */
export default{
    data(){
        return {
            showLogin:true,
            msg: 'hello vue',
            user:'',
            homeContent: false,
        }
    },
    methods:{}
}
/**
 * 为何在大型项目中data需要使用return返回数据呢?
 * 
 * (1) 不使用return包裹的数据会在项目的全局可见，会造成变量污染
 * (2) 使用return包裹后数据中变量只在当前组件中生效，不会影响其他组件(
 * 如果不是返回新的对象的话,这个组件如果被复用,引用的是同一个data，就会有问题)
 */

/**
 * data的初始化
 * https://github.com/vuejs/vue/blob/dev/src/core/instance/state.js
 * 
 * initData方法中做的处理：
 * (1) 将data的值赋值给vm._data，而这个vm代表的就是组件的实例
 * (2) 检测props和methods的属性是否和data上的存在重名
 * (3) 通过proxy函数，去把值挂载到vm上，也就是说vm[key]代理到了vm['_data'][key]
 */
function initData (vm: Component) {
    let data = vm.$options.data
    data = vm._data = typeof data === 'function'
      ? getData(data, vm)
      : data || {}
    if (!isPlainObject(data)) {
      data = {}
        //   process.env.NODE_ENV !== 'production' && warn(
        //     'data functions should return an object:\n' +
        //     'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
        //     vm
        //   )
    }

    const keys = Object.keys(data)
    const props = vm.$options.props
    const methods = vm.$options.methods
    let i = keys.length
    while (i--) {
      const key = keys[i]
      if (process.env.NODE_ENV !== 'production') {
        if (methods && hasOwn(methods, key)) {
        //   warn(
        //     `Method "${key}" has already been defined as a data property.`,
        //     vm
        //   )
        }
      }
      if (props && hasOwn(props, key)) {
        // process.env.NODE_ENV !== 'production' && warn(
        //   `The data property "${key}" is already declared as a prop. ` +
        //   `Use prop default value instead.`,
        //   vm
        // )
      } else if (!isReserved(key)) {
        proxy(vm, `_data`, key)
      }
    }
    // observe data
    observe(data, true /* asRootData */)
}

export function getData (data: Function, vm: Component): any {
    // #7573 disable dep collection when invoking data getters
        pushTarget()
    try {
      return data.call(vm, vm)
    } catch (e) {
      handleError(e, vm, `data()`)
      return {}
    } finally {
      popTarget()
    }
}

export function proxy (target: Object, sourceKey: string, key: string) {
    sharedPropertyDefinition.get = function proxyGetter () {
      return this[sourceKey][key]
    }
    sharedPropertyDefinition.set = function proxySetter (val) {
      this[sourceKey][key] = val
    }
    Object.defineProperty(target, key, sharedPropertyDefinition)
}

/**
 * 注意点：data中不要使用$和_开头
 * https://github.com/vuejs/vue/blob/dev/src/core/instance/proxy.js
 * 
 * data中不要使用$和_开头，因为在Vue内部也使用$和_作为方法或属性，这是为了防止冲突
 * 在源码层面上因为vue做了一个检测，检测你的变量的开头是否为_或$，如果使用了那么就不会使用代理了， 
 */
/** hasHandler 用于检测“_”属性 */
const hasHandler = {
    has (target, key) {
      const has = key in target
      const isAllowed = allowedGlobals(key) ||
        (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data))
      if (!has && !isAllowed) {
        if (key in target.$data) warnReservedPrefix(target, key)
        else warnNonPresent(target, key)
      }
      return has || !isAllowed
    }
}

/** getHandler */
const getHandler = {
    get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) warnReservedPrefix(target, key)
        else warnNonPresent(target, key)
      }
      return target[key]
    }
}

/*
 * 当然如果非要使用使用$和_的话
 */
/** 
    <template>
        <div class="hello">
            {{test}}
            {{_data._tttttttttt}}
            {{_data.$tttttt}}
            {{$data._tttttttttt}}
            {{$data.$tttttt}}
        </div>
    </template>
    <script>
    import h222 from './h2'
    export default {
        name: 'HelloWorld',
        data () {
            return {
                _tttttttttt: '__',
                $tttttt: '$$',
                test: 'test'
            }
        },
        mounted () {
            console.log(this.$data._tttttttttt)
            console.log(this.$data.$tttttt)
            console.log(this._data._tttttttttt)
            console.log(this._data.$tttttt)
        }
    }
    </script>
 */


