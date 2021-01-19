/**
 * https://mp.weixin.qq.com/s/Hf3SFMrAEZyL-KsJhuxuDw
 * 
 * import 被 webpack 编译成了什么
 */

/** 
 * 提问：import moduleName from 'xxModule' 和 import('xxModule') 经过webpack编译打包后最终变成了什么？在浏览器中是怎么运行的？
 * 
 * 第一个import在项目中随处可见
 * 第二个import可以在需要懒加载的地方看到，比如vue-router的懒加载配置
 */ 

/** 
 * 需要了解的一些前提：
 * 
 * import是es module提供的一个加载模块的方法，目前主流的浏览器也都支持，
 * 像现在比较火的vite就是利用了浏览器原生支持import的能力来实现的，当然它还有一个server端使用koa实现的。
 */

/**
 * (1) webpack的打包过程大概流程
 * 
 * 合并webpack.config.js和命令行传递的参数，形成最终的配置
 * 解析配置，得到entry入口
 * 读取入口文件内容，通过@babel/parse将入口内容（code）转换成ast
 * 通过@babel/traverse遍历ast得到模块的各个依赖
 * 通过@babel/core（实际的转换工作是由@babel/preset-env来完成的）将ast转换成es5 code
 * 通过循环伪递归的方式拿到所有模块的所有依赖并都转换成es5
 */

// 从以上内容可以看出来，最终的代码中肯定是没有import语句的，因为es5就没有import；那么我们从哪去找答案呢？
// 有两个地方，一是webpack源码，二是打包后的文件 

/** 
 * main.js   是项目的入口文件(是我们在webpack.config.js中配置的输出的文件名)
 * 0.main.js 是对应懒加载需需要的js文件 (import('xxModule)，它提供了一种懒加载的机制，动态往html中添加script`标签，然后加载资源并执行)
 */


/**
 * (2) 源码分析
 */
(function (modules) {
  // xxxx
})({
  // xxx
});
// 如上代码，可以看到，这是一个自执行函数

(function (modules) {
  // xxxx
})({
  // src/index.js 模块
  './src/index.js': (
    function (module, __webpack_exports__, __webpack_require__) {
      "use strict";
      __webpack_require__.r(__webpack_exports__);
      var _num_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/num.js");
      Object(_num_js__WEBPACK_IMPORTED_MODULE_0__["print"])()
      function button() {
        const button = document.createElement('button')
        const text = document.createTextNode('click me')
        button.appendChild(text)
        button.onclick = e => __webpack_require__.e(0)
          .then(__webpack_require__.bind(null, "./src/info.js"))
          .then(res => {
            console.log(res.log)
          })
        return button
      }
      document.body.appendChild(button())
      //# sourceURL=webpack:///./src/index.js?");
    }
  ),

  // ./src/num.js 模块
  './src/num.js': (
    function (module, __webpack_exports__, __webpack_require__) {
      "use strict";
      __webpack_require__.r(__webpack_exports__);
      __webpack_require__.d(__webpack_exports__, "print", function () { return print; });
      var _tmp_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/tmp.js");
      function print() {
        Object(_tmp_js__WEBPACK_IMPORTED_MODULE_0__["tmpPrint"])()
        console.log('我是 num.js 的 print 方法')
      }
      //# sourceURL=webpack:///./src/num.js?");
    }
  )
});
/**
 * 如上代码：
 * 如下解释对应开头的提问：
 * 
 * webpack将所有的import moduleName from 'xxModule'都变成了一个Map对象，key为文件路径，value为一个可执行的函数，
 * 而函数内容其实就是模块中导出的内容，当然，模块自己也被webpack做了一些处理，接着往下进行。
 * 
 * 而以 __webpack_require__ 开头的函数，负责实际的模块加载并执行这些模块内容，返回执行结果，其实就是读取Map对象，然后执行相应的函数
 * 
 * 当然其中的异步方法（import('xxModule')）比较特殊一些，它会单独打成一个包，采用动态加载的方式，具体过程：当用户触发其加载的动作时，
 * 会动态的在head标签中创建一个script标签，然后发送一个http请求，加载模块，模块加载完成以后自动执行其中的代码，
 * 主要的工作有两个，更改缓存中模块的状态，另一个就是执行模块代码。
 */

