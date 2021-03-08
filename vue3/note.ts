/**
 * 关于vue3的亮点
 * 
 * (1) performance：比vue2快1.2-2倍
 * (2) Tree shaking：按需编译，比vue2体积小
 * (3) 组合API，类似React Hooks
 * (4) 更好的支持TS
 * (5) custom renderer：暴露自定义渲染API
 * (6) 更先进的组件
 * 
 * 
 * https://vue-next-template-explorer.netlify.app/#%7B%22src%22%3A%22%3Cdiv%3E%5Cr%5Cn%20%20%20%20%20%20%20%20%3Cp%3Eone%3C%2Fp%3E%5Cr%5Cn%20%20%20%20%20%20%20%20%3Cp%3Etwo%3C%2Fp%3E%5Cr%5Cn%20%20%20%20%20%20%20%20%3Cp%3E%7B%7B%20value%20%7D%7D%3C%2Fp%3E%5Cr%5Cn%20%20%20%20%20%20%3C%2Fdiv%3E%22%2C%22options%22%3A%7B%22mode%22%3A%22module%22%2C%22prefixIdentifiers%22%3Afalse%2C%22optimizeImports%22%3Afalse%2C%22hoistStatic%22%3Afalse%2C%22cacheHandlers%22%3Afalse%2C%22scopeId%22%3Anull%2C%22inline%22%3Afalse%2C%22ssrCssVars%22%3A%22%7B%20color%20%7D%22%2C%22bindingMetadata%22%3A%7B%22TestComponent%22%3A%22setup-const%22%2C%22setupRef%22%3A%22setup-ref%22%2C%22setupConst%22%3A%22setup-const%22%2C%22setupLet%22%3A%22setup-let%22%2C%22setupMaybeRef%22%3A%22setup-maybe-ref%22%2C%22setupProp%22%3A%22props%22%2C%22vMySetupDir%22%3A%22setup-const%22%7D%7D%7D
 */

/**
 * vue3是如何变快的?
 * 
 * - diff方法优化
 *    vue2中的虚拟dom是进行全量对比
 *    vue3新增了静态标记(PatchFlag)
 *        在与上次虚拟节点进行对比的时候，只对比带有patch flag的节点
 *        并且可以通过flag的信息得知当前节点要对比的具体内容
 * 
 *    也就是说，在vue3中，创建虚拟DOM时候，会更具DOM中的内容会不会发生变化，添加静态标记。
 *    如图：【v2和v3虚拟dom比对的区别.jpg】
 *    flag:1 就是一个静态的标记
 * 
      <div>
        <p>one</p>
        <p>two</p>
        <p>{{ value }}</p>
      </div>

      // 转换为render函数

      import { createVNode as _createVNode, toDisplayString as _toDisplayString, openBlock as _openBlock, createBlock as _createBlock } from "vue"

      export function render(_ctx, _cache, $props, $setup, $data, $options) {
        return (_openBlock(), _createBlock("div", null, [
          _createVNode("p", null, "one"),
          _createVNode("p", null, "two"),
          _createVNode("p", null, _toDisplayString(_ctx.value), 1 /TEXT/)
        ]))
      }
 * 
 *
 * - 静态提升
 *    vue2中无论元素是否参与更新，每次都会重新创建
 *    vue3中对于不参加更新的元素，只会被创建一次，之后会在每次渲染的时候被不停的复用
 * 
      vue3是如何静态提升的：
      <div>
        <p>one</p>
        <p>two</p>
        <p>{{ value }}</p>
      </div>

      const _hoisted_1 = _createVNode("p", null, "one", -1 / HOISTED /)
      const _hoisted_2 = _createVNode("p", null, "two", -1 / HOISTED /)

      export function render(_ctx, _cache, $props, $setup, $data, $options) {
        return (_openBlock(), _createBlock("div", null, [
          _hoisted_1,
          _hoisted_2,
          _createVNode("p", null, _toDisplayString(_ctx.value), 1 /TEXT/)
        ]))
      }

      所以那些不会变化的，都会被赋值给对应的变量，每次更新的时候，只需要挪用对应的变量即可
 *
 *    
 * - 事件侦听器缓存
 *    默认情况下onClick会被动态绑定，所以每次都会去追踪它的变化
 *    但是因为是同一个函数，所以没有追踪变化，直接缓存起来直接复用即可
 * 

      // 未开启事件侦听器缓存
      <button @click="onClick">点击</button>

      export function render(_ctx, _cache, $props, $setup, $data, $options) {
        return (_openBlock(), _createBlock("button", { onClick: _ctx.onClick }, "点击", 8 / PROPS/, ["onClick"]))
      }
        其中 8 代表动态属性(不包含类名和样式)

      // 开启事件侦听器缓存
      export function render(_ctx, _cache, $props, $setup, $data, $options) {
        return (_openBlock(), _createBlock("button", {
          onClick: _cache[1] || (_cache[1] = (...args) => (_ctx.onClick && _ctx.onClick(...args)))
        }, "点击"))
      }
        可以看到8没有了，所以就不会每次去对比了
 * 
 * - ssr渲染
 *    
 */ 

/**
 * 总结：
 *    vue3中的diff对比，只有静态标记的才会进行比较，才会进行追踪，所以性能才会提高。
 */
