/**
 * https://juejin.im/post/6844903599764406286
 */
import { mapState } from 'vuex'

export default {
    computed: mapState([
        // 映射 this.count 为 store.state.count
        'count'
    ])
}

// mapState 返回一个对象，如上的代码变成这样：
export default {
    computed: {
      count () {
        return this.$store.state.count
      }
    }
}

/**
 * 知识点1：normalizeMap
 * normalizeMap是mapState的主要实现方法
 * @param map 
 */
function normalizeMap (map) {
    return Array.isArray(map)
      ? map.map(key => ({ key, val: key }))
      : Object.keys(map).map(key => ({ key, val: map[key] }))
}

/** 
 * 这个方法主要是格式化 mapState 传进来的 states 参数。
 * 我们会知道 states 参数会是两种形式，一种是以数组的方式传入，另一种则是以对象的方法传入
 */

// 以数组方式传入
mapState([
    'count',
    'add'
  ])
  
// 以对象的方法传入
mapState({
    count: state => state.count,
    countAlias: 'count'
})

// 经过 normalizeMap 方法处理后会变成这样
// 以数组的方式传入
[
    {
      key: 'count',
      val: 'count'
    },
    {
      key: 'add',
      val: 'add'
    }
]
  
// 以对象的方法传入
[
    {
        key: count,
        val: state => state.count
    },
    {
        key: countAlias,
        val: 'count'
    }
]
  
/** 
 * 知识点2：mapState的具体实现方式
 */
export function mapState (states) {
    const res = {}
    normalizeMap(states).forEach(({ key, val }) => {
      res[key] = function mappedState () {
        return typeof val === 'function'
          ? val.call(this, this.$store.state, this.$store.getters)
          : this.$store.state[val]
      }
    })
    return res
}

/** 
 * 对 normalizeMap 返回数组的对象里的 val 有两个判断。
 * 如果不是函数，直接查找 this.$store.state[val] 返回 state。
 * 如果是函数，则需要使用 call 将 val 这个函数的 this 指向 vue 实例，
 * 然后将 state 和 getters 传入，最后执行 val 函数。
 */
