/**
 * https://mp.weixin.qq.com/s/xT12rUsYOkypXS8YFYQEzQ
 * 
 * Webpack 核心知识点
 */

/**
 * 核心概念
 * 
 * entry：入口。webpack是基于模块的，使用webpack首先需要指定模块解析入口(entry)，
 *      webpack从入口开始根据模块间依赖关系递归解析和处理所有资源文件。
 * 
 * output：输出。源代码经过webpack处理之后的最终产物。
 * 
 * loader：模块转换器。本质就是一个函数，在该函数中对接收到的内容进行转换，返回转换后的结果。
 *        因为 Webpack 只认识 JavaScript，所以 Loader 就成了翻译官，对其他类型的资源进行转译的预处理工作。
 * 
 * plugin：扩展插件。基于事件流框架 Tapable，插件可以扩展 Webpack 的功能，在 Webpack 运行的生命周期中会广播出许多事件，
 *        Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。
 * 
 * module：模块。除了js范畴内的es module、commonJs、AMD等，css @import、url(...)、图片、字体等在webpack中都被视为模块。
 */

/**
 * 打包流程
 * 
 * 初始化参数：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数；
 * 
 * 初始化编译：用上一步得到的参数初始化 Compiler 对象，注册插件并传入 Compiler 实例（挂载了众多webpack事件api供插件调用）；
 * 
 * AST & 依赖图：从入口文件（entry）出发，调用AST引擎(acorn)生成抽象语法树AST，根据AST构建模块的所有依赖；
 * 
 * 递归编译模块：调用所有配置的 Loader 对模块进行编译；
 * 
 * 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，
 *          这步是可以修改输出内容的最后机会；
 * 
 * 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统；
 * 
 * 
 * 在以上过程中，Webpack 会在特定的时间点广播出特定的事件，插件在监听到相关事件后会执行特定的逻辑，并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果
 */

/**
 * Loader
 * 
 * loader就像一个翻译官，将源文件经过转换后生成目标文件并交由下一流程处理
 * 
 * 每个loader职责都是单一的，就像流水线上的工人，顺序很关键（从右往左）
 * 
 * 实现准则：
 * (1) 简单【Simple】loader只做单一任务，多个loader > 一个多功能loader
 * (2) 链式【Chaining】遵循链式调用原则
 * (3) 无状态【Stateless】即函数式里的Pure Function，无副作用
 * (4) 使用工具库【Loader Utilities】充分利用 loader-utils 包
 */

// js实现一个简单的loader，这个loader的作用是：替换console.log、去除换行符、在文件结尾处增加一行自定义内容
const path = require("path");  

module.exports = {  
  entry: {  
    index: path.resolve(__dirname, "src/index.js"),  
  },  
  output: {  
    path: path.resolve(__dirname, "dist"),  
  },  
  module: {  
    rules: [  
      {  
        test: /\.js$/,  
        use: [  
          {  
            loader: path.resolve("lib/loader/loader1.js"),  
            options: {  
              message: "this is a message",  
            }  
          }  
        ],  
      },  
    ],  
  },  
}

// loader1.js
const loaderUtils = require('loader-utils');  
  
/** 过滤console.log和换行符 */  
module.exports = function (source) {  
  
  // 获取loader配置项  
  const options = loaderUtils.getOptions(this);  
  
  console.log('loader配置项:', options);  
  
  const result = source  
    .replace(/console.log\(.*\);?/g, "")  
    .replace(/\n/g, "")  
    .concat(`console.log("${options.message || '没有配置项'}");`);  
  
  return result;  
}; 

// 异步的loader  
module.exports = function (source) {  
  
  let count = 1;  
  
  // 1.调用this.async() 告诉webpack这是一个异步loader，需要等待 asyncCallback 回调之后再进行下一个loader处理  
  // 2.this.async 返回异步回调，调用表示异步loader处理结束  
  const asyncCallback = this.async();  
  
  const timer = setInterval(() => {  
    console.log(`时间已经过去${count++}秒`);  
  }, 1000);  
  
  // 异步操作  
  setTimeout(() => {  
    clearInterval(timer);  
    asyncCallback(null, source);  
  }, 3200);  
};

/**
 * Plugin
 * 
 * 在webpack编译整个生命周期的特定节点执行特定功能：
 * 实现准则：
 * (1) 一个命名JS函数或者JS类
 * (2) 在prototype上定义一个apply方法（供webpack调用，并且在调用时注入 compiler 对象）
 * (3) 在 apply 函数中需要有通过 compiler 对象挂载的 webpack 事件钩子（钩子函数中能拿到当前编译的 compilation 对象）
 * (4) 处理 webpack 内部实例的特定数据
 * (5) 功能完成后调用 webpack 提供的回调
 */
// 插件功能：自动生成README文件，标题取自插件option
// 1、Plugin名称  
const MY_PLUGIN_NAME = "MyReadMePlugin";  
  
class MyReadMePlugin {
  constructor(option) {  
    // 2、在构造函数中获取插件配置项 
    this.option = option || {};  
  }
  
  // 3、在原型对象上定义一个apply函数供webpack调用 
  apply(compiler) {  
    // 4、注册webpack事件监听函数 
    compiler.hooks.emit.tapAsync(  
      MY_PLUGIN_NAME,  
      (compilation, asyncCallback) => {  
        // 5、操作Or改变compilation内部数据 
        compilation.assets["README.md"] = {  
          // 文件内容  
          source: () => {  
            return `# ${this.option.title || '默认标题'}`;  
          },  
          // 文件大小  
          size: () => 30,  
        }; 
        // 6、如果是异步钩子，结束后需要执行异步回调 
        asyncCallback();  
      }  
    );  
  }  
}

// 7、模块导出
module.exports = MyReadMePlugin


