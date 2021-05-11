/**
 * https://github.com/Cosen95/blog/issues/48
 * 
 * webpack原理
 * 
 * webpack 到4.x版本后，其源码已经比较庞大，对各种开发场景进行了高度抽象，阅读成本也愈发昂贵。
 * 过度分析源码对于大家并没有太大的帮助。本文主要是想通过分析webpack的构建流程以及实现一个简单的webpack来让大家对webpack的内部原理有一个大概的了解
 */

/**
 * (1) webpack 构建流程分析
 * 
 * 如图：【webpack 构建流程分析.png】
 * 
 * webpack 的运行流程是一个串行的过程，从启动到结束会依次执行以下流程：
 * 首先会从配置文件和 Shell 语句中读取与合并参数，
 * 并初始化需要使用的插件和配置插件等执行环境所需要的参数；初始化完成后会调用Compiler的run来真正启动webpack编译构建过程，
 * webpack的构建流程包括compile、make、build、seal、emit阶段，执行完这些阶段就完成了构建过程。
 * 
 * 
 * 【初始化阶段】
 * - entry-options 启动
 * 从配置文件和 Shell 语句中读取与合并参数，得出最终的参数。
 * 
 * - run 实例化
 * compiler：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译
 * 
 * 【编译构建】
 * - entry 确定入口
 * 根据配置中的 entry 找出所有的入口文件
 * 
 * - make 编译模块
 * 从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
 * 
 * - build module 完成模块编译
 * 经过上面一步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系
 * 
 * - seal 输出资源
 * 根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会
 * 
 * - emit 输出完成
 * 在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统
 */



/**
 * 实现一个简易的 webpack
 * 
 * 目录结构:
  |-- forestpack
    |-- dist
    |   |-- bundle.js
    |   |-- index.html
    |-- lib
    |   |-- compiler.js
    |   |-- index.js
    |   |-- parser.js
    |   |-- test.js
    |-- src
    |   |-- greeting.js
    |   |-- index.js
    |-- forstpack.config.js
    |-- package.json
 * 
 * 这里我先解释下每个文件/文件夹对应的含义：
 * - dist：打包目录
 * - lib：核心文件，主要包括compiler和parser
 *    compiler.js：编译相关。Compiler为一个类, 并且有run方法去开启编译，还有构建module（buildModule）和输出文件（emitFiles）
 *    parser.js：解析相关。包含解析AST（getAST）、收集依赖（getDependencies）、转换（es6转es5）
 *    index.js：实例化Compiler类，并将配置参数（对应forstpack.config.js）传入
 *    test.js：测试文件，用于测试方法函数打console使用
 * 
 * - src：源代码。也就对应我们的业务代码
 * - forstpack.config.js： 配置文件。类似webpack.config.js
 * - package.json
 * 
 * 
 */
