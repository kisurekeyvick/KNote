/** 
 * vue-property-decorator使用手册
 * https://segmentfault.com/a/1190000019906321
 */

/** 
 * (1) @Component的定义
 * @Component(options:ComponentOptions = {})
 * 
 * @Component 装饰器可以接收一个对象作为参数，可以在对象中声明 components ，filters，directives等未提供装饰器的选项，
 * 也可以声明computed，watch
 */
import { Vue, Component } from 'vue-property-decorator'

@Component({
    name:'',    // vue组件的名字
    components: {
        // vue中的可复用的组件
    },

})
export default class MyComponent extends Vue {

}

/**
 * (2) @Props的定义
 * @Prop(options: (PropOptions | Constructor[] | Constructor) = {})
 * 
 * @Prop装饰器接收一个参数，这个参数可以有三种写法：
    Constructor，例如String，Number，Boolean等，指定 prop 的类型；
    Constructor[]，指定 prop 的可选类型；
    PropOptions，可以使用以下选项：type，default，required，validator。
 */
import { Vue, Component, Prop } from 'vue-property-decorator'

@Componentexport default class MyComponent extends Vue {
    @Prop(String) public propA: string | undefined
    @Prop([String, Number]) public propB!: string | number
    @Prop({
        type: String,
        default: 'abc'
    })
    public propC!: string
}

// 等同于：
export default {
    props: {
      propA: {
        type: Number
      },
      propB: {
        default: 'default value'
      },
      propC: {
        type: [String, Boolean]
      }
    }
}

/** 
 * (3) @Watch的定义
 * @Watch(path: string, options: WatchOptions = {})
 * 
 * @Watch 装饰器接收两个参数：
    参数1： 被侦听的属性名
    参数2： options?: WatchOptions={} options可以包含两个属性 ：
                immediate?:boolean 侦听开始之后是否立即调用该回调函数，默认为false；
                deep?:boolean 被侦听的对象的属性被改变时，是否调用该回调函数
 */
import { Vue, Component, Watch } from 'vue-property-decorator'

@Component
export default class MyInput extends Vue {
  @Watch('msg')
  public onMsgChanged(newValue: string, oldValue: string) {}

  @Watch('arr', { immediate: true, deep: true })
  public onArrChanged1(newValue: number[], oldValue: number[]) {}

  @Watch('arr')
  public onArrChanged2(newValue: number[], oldValue: number[]) {}
}

// 等同于：
export default {
    watch: {
      msg: [
        {
          handler: 'onMsgChanged',
          immediate: false,
          deep: false
        }
      ],
      arr: [
        {
          handler: 'onArrChanged1',
          immediate: true,
          deep: true
        },
        {
          handler: 'onArrChanged2',
          immediate: false,
          deep: false
        }
      ]
    },
    methods: {
      onMsgVhanged(newValue, oldValue) {},
      onArrChange1(newValue, oldValue) {},
      onArrChange2(newValue, oldValue) {}
    }
}   

/** 
 * (4) @Emit的定义
 * @Emit(event?: string)
 * 
 * 注意点1：@Emit 装饰器接收一个可选参数，充当事件名。
 * 如果没有提供这个参数，$Emit会将回调函数名的camelCase转为kebab-case，并将其作为事件名
 * 
 * 注意点2：@Emit 会将回调函数的返回值作为第二个参数，如果返回值是一个Promise对象，
 * $emit会在Promise对象被标记为resolved之后触发
 * 
 * 注意点3：@Emit 的回调函数的参数，会放在其返回值之后，一起被$emit当做参数使用
 */
import { Vue, Component, Emit } from 'vue-property-decorator'

@Component
export default class MyComponent extends Vue {
  count = 0
  @Emit()
  public addToCount(n: number) {
    this.count += n
  }

  @Emit('reset')
  public resetCount() {
    this.count = 0
  }

  @Emit()
  public returnValue() {
    return 10
  }

  @Emit()
  public promise() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(20)
      }, 0)
    })
  }
}

// js写法
export default {
    data() {
      return {
        count: 0
      }
    },
    methods: {
      addToCount(n) {
        this.count += n
        this.$emit('add-to-count', n)
      },
      resetCount() {
        this.count = 0
        this.$emit('reset')
      },
      returnValue() {
        this.$emit('return-value', 10)
      },
      promise() {
        const promise = new Promise(resolve => {
          setTimeout(() => {
            resolve(20)
          }, 0)
        })
        promise.then(value => {
          this.$emit('promise', value)
        })
      }
    }
}
  
  
/** 
 * (5) @Ref
 * @Ref(refKey?: string)
 * 
 * @Ref 装饰器接收一个可选参数，用来指向元素或子组件的引用信息。如果没有提供这个参数，会使用装饰器后面的属性名充当参数
 */
<template>
    <form ref="changePasswordForm"></form>
</template>

import { Vue, Component, Ref } from 'vue-property-decorator'
import { Form } from 'element-ui'

@Component
export default class MyComponent extends Vue {
  @Ref() readonly loginForm!: Form
  @Ref('changePasswordForm') readonly passwordForm!: Form

  public handleLogin() {
    this.loginForm.validate(valide => {
      if (valide) {
        // login...
      } else {
        // error tips
      }
    })
  }
}

// 等同于js
export default {
    computed: {
      loginForm: {
        cache: false,
        get() {
          return this.$refs.loginForm
        }
      },
      passwordForm: {
        cache: false,
        get() {
          return this.$refs.changePasswordForm
        }
      }
    }
}
 