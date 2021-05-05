/**
 * https://mp.weixin.qq.com/s/G7tRRGqez7vdXWbDwo5-Yg
 * 
 * 
 */

/**
 * (1) 什么是 CommonJS?
 * 
 * 每一个文件就是一个模块，拥有自己独立的作用域，变量，以及方法等，对其他的模块都不可见。
 * 
 * CommonJS 规范规定，每个模块内部，module 变量代表当前模块。
 * 这个变量是一个对象，它的exports属性（即module.exports）是对外的接口。
 */


/**
 * (2) 模块分类
 * 
 * 1.原生(核心)模块 (Node 提供的模块我们都称之为原生模块)
 *    - 内建模块:Node.js 原生提供的模块中，由纯 C/C++ 编写的称为内建模块
 *    - 全局模块：Node.js在启动时，会生成一个全局量 process
 *    - 除了上面两种可以直接 require 的所有原生模块
 * 
 * 
 * 2.文件模块：(用户编写的模块)
 *    - 普通文件模块：node_modules 下面的模块，或者我们自己开发时候写的每个文件内容。
 *    - C++ 扩展模块：用户自己编写的 C++ 扩展模块或者第三方 C++ 扩展模块
 */

/**
 * require 原理理解后的思考
 * 
 * 1.require加载是同步还是异步?
 *    代码中所有文件相关操作都是使用的同步
 * 例如：
    fs.existsSync(currentPath)
    fs.readFileSync(filename, 'utf8');
 * 
 * 
 * 2.exports和module.exports的区别究竟是什么?
    compiledWrapper.call(this.exports, this.exports, this.require, this, filename, dirname);   
 * require在执行文件时候，传递的两个参数 
 *  参数一 :this.exports = {}
 *  参数二：this
 *  而this就是 module 所以 module.exports = {}
 * 
 * 
 * 3.
 * 
 */ 

