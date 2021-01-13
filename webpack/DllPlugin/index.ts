/**
 * https://www.cnblogs.com/tugenhua0707/p/9520780.html
 * 
 * DllPlugin 
 */

/**
 * 前言
 * 
 * 在使用webpack进行打包时候，对于依赖的第三方库，比如vue，vuex等这些不会修改的依赖，我们可以让它和我们自己编写的代码分开打包，
 * 这样做的好处是每次更改我本地代码的文件的时候，webpack只需要打包我项目本身的文件代码，而不会再去编译第三方库，
 * 那么第三方库在第一次打包的时候只打包一次，以后只要我们不升级第三方包的时候，那么webpack就不会对这些库去打包，
 * 这样的可以快速的提高打包的速度。因此为了解决这个问题，DllPlugin 和 DllReferencePlugin插件就产生了。
 */

/**
 * DLLPlugin的作用：
 * 
 * DLLPlugin 它能把第三方库代码分离开，并且每次文件更改的时候，它只会打包该项目自身的代码。所以打包速度会更快。
 * 
 * DLLPlugin 这个插件是在一个额外独立的webpack设置中创建一个只有dll的bundle，也就是说我们在项目根目录下除了有webpack.config.js，
 * 还会新建一个webpack.dll.config.js文件。webpack.dll.config.js作用是把所有的第三方库依赖打包到一个bundle的dll文件里面，
 * 还会生成一个名为 manifest.json文件。
 * 
 * 该manifest.json的作用是用来让 DllReferencePlugin 映射到相关的依赖上去的。
 */

/**
 * 使用 DLLPlugin
 * 
  ### 目录结构如下：
      demo1                                       # 工程名
      |   |--- dist                               # 打包后生成的目录文件             
      |   |--- node_modules                       # 所有的依赖包
      |   |--- js                                 # 存放所有js文件
      |   | |-- demo1.js  
      |   | |-- main.js                           # js入口文件
      |   |--- webpack.config.js                  # webpack配置文件
      |   |--- webpack.dll.config.js              # 打包第三方依赖的库文件
      |   |--- index.html                         # html文件
      |   |--- styles                             # 存放所有的css样式文件   
      |   | |-- main.styl                         # main.styl文件   
      |   | |-- index.styl                        
      |   |--- .gitignore  
      |   |--- README.md
      |   |--- package.json
      |   |--- .babelrc                           # babel转码文件
 * 
 */
// 首先需要在我们的项目根目录下创建一个 webpack.dll.config.js 文件。然后配置代码如下：
const path = require('path');
const DllPlugin = require('webpack/lib/DllPlugin');

module.exports = {
  // 入口文件
  entry: {
    // 项目中用到该两个依赖库文件
    jquery: ['jquery'],
    echarts: ['echarts']
  },
  // 输出文件
  output: {
    // 文件名称
    filename: '[name].dll.js', 
    // 将输出的文件放到dist目录下
    path: path.resolve(__dirname, 'dist'),
    /*
     存放相关的dll文件的全局变量名称，比如对于jquery来说的话就是 _dll_jquery, 在前面加 _dll
     是为了防止全局变量冲突。
    */
    library: '_dll_[name]'
  },
  plugins: [
    // 使用插件 DllPlugin
    new DllPlugin({
      /*
       该插件的name属性值需要和 output.library保存一致，该字段值，也就是输出的 manifest.json文件中name字段的值。
       比如在jquery.manifest文件中有 name: '_dll_jquery'
      */
      name: '_dll_[name]',
      /* 生成manifest文件输出的位置和文件名称 */
      path: path.join(__dirname, 'dist', '[name].manifest.json')
    })
  ]
}



