/** 
 * 参考资源：https://www.bilibili.com/video/BV1h7411N7bg?p=11
 */

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.store({
    state: {
        count: 0
    },
    mutation: {

    },
    actions: {

    }
});

/** 
 * 知识点1：
 * 
 * 访问store的方式1：
 * <h3>{{ $store.state.count }}</h3>
 * 
 * 访问store的方式2：
 * import { mapState } from 'vuex';
 * 然后映射到vue组件的computed计算属性
 *      computed: {
 *          ...mapState(['count'])
 *      }
 */
import { mapState } from 'vuex';

export default {
    data() {
        return {
            
        }
    },
    computed: {
        ...mapState(['count'])
    },
}

export default {
    // ...
    computed: mapState({
      // 箭头函数可使代码更简练
      count: state => state.count,
  
      // 传字符串参数 'count' 等同于 `state => state.count`
      countAlias: 'count',
  
      // 为了能够使用 `this` 获取局部状态，必须使用常规函数
      countPlusLocalState (state) {
        return state.count + this.localCount
      }
    })
}

/** 
 * 知识点2：mapState
 * 作用：mapState 辅助函数帮助我们生成计算属性
 *      mapState 函数返回的是一个对象
 */ 

/** 
 * 知识点3：mutation
 * vuex不允许直接在组件中直接修改store中的数据，所以提供mutation用于修改store
 */
export default new Vuex.store({
    state: {
        count: 0
    },
    mutation: {
        /** 
         * 这边需要注意，第一个参数永远是state，也就是Vuex中的state
         */
        add(state, step) {
            state.count += step;
        }
    },
    actions: {

    }
});

// 触发mutation的第一种方式:在vue组件中，调用：this.$store.commit('add')
export default {
    data() {
        return {
            
        }
    },
    methods: {
        handleVount() {
            this.$store.commit('add', 5);
        }
    }
}

/**
 * 触发mutation的第二种方式
 * 通过导入vuex的mapMutations方法，然后映射到vue组件的methods方法中
 */
import { mapMutations } from 'vuex';

export default {
    data() {
        return {
            
        }
    },
    methods: {
        ...mapMutations(['add']),
        handleCount() {
            this.add(5)
        }
    }
}

/** 
 * 知识点4：action
 * 触发异步任务，携带参数
 */
// 触发action的第一种第一种方式
export default new Vuex.store({
    state: {
        count: 0
    },
    mutation: {
        /** 
         * 这边需要注意，第一个参数永远是state，也就是Vuex中的state
         */
        add(state, step) {
            state.count += step;
        }
    },
    actions: {
        /**
         * 我们在写action的时候，第一个参数默认就是姚秀娥context的
         * 第二个参数就是dispatch时候，传递到action时候的参数
         * @param context 
         * @param step 
         */
        addAsync(context, step) {
            setTimeout(() => {
                context.commit('add', 5);
            }, 1000);
        }
    }
});

// vue组件中使用
export default {
    data() {
        return {
            
        }
    },
    methods: {
        handle() {
            // 调用dispatch
            // 触发actions时携带参数
            // 第一个参数addAsync代表的是action中的属性
            this.$store.dispatch('addAsync', 5);
        }
    }
}

/**
 * 触发action的第二种方式
 * 通过使用mapActions的方式在vue组件中，将对应的action映射到methods中
 */
import { mapActions } from 'vuex';

export default {
    data() {
        return {
            
        }
    },
    methods: {
        ...mapActions(['addAsync']),
        handle() {
            this.addAsync(5);
        }
    }
}

