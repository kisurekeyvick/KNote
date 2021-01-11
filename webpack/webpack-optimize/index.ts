/**
 * https://mp.weixin.qq.com/s/JdMoc1IF1iDZUb5VPJlz3Q
 * 
 * 关于webpack的一些优化方案
 */

/** 
 * 随着项目不断发展壮大，组件数量开始变得越来越多，项目也开始变得庞大，webpack 编译的时间也会越来越久。
 * 
 * 以下仅介绍几种缓存相关的优化手段：
 * (1) babel-loader 的 cacheDirectory
 * (2) cache-loader
 * (3) HardSourceWebpackPlugin
 */

// HardSourceWebpackPlugin
/**
 * 优化的第一步，应该是分析目前的性能，这里我们使用 speed-measure-webpack-plugin 进行速度分析
 */ 
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
const webpackConfig = smp.wrap({
  plugins: [
    new MyPlugin(),
    new MyOtherPlugin()
  ]
});

/**
 * 如此，我们就可以看到每一个 Loader 以及 Plugin 的耗时，有了这个，我们就可以“对症下药”
 * 
 * 但需要注意的是：HardSourceWebpackPlugin 和 speed-measure-webpack-plugin 不能一起使用
 */
 

/**
 * babel-loader 的 cacheDirectory
 * 
 * babel-loader 允许使用 Babel 和 webpack 转译 JavaScript 文件，有时候如果我们运行 babel-loader 很慢的话，
 * 可以考虑确保转译尽可能少的文件。
 * 
 * 你可能使用 /\.m?js$/ 来匹配，这样有可能去转译 node_modules 目录或者其他不需要的源代码，
 * 导致性能下降可以通过 exclude 排除掉一些不需要编译的文件。
 */ 
module: {
  rules: [
    {
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-proposal-object-rest-spread']
        }
      }
    }
  ]
}


/** 
 * 你也可以通过使用 cacheDirectory 选项，将 babel-loader 提速至少两倍。这会将转译的结果缓存到文件系统中。
 * cacheDirectory 默认值为 false。当有设置时，指定的目录将用来缓存 loader 的执行结果。
 * 
 * 之后的 webpack 构建，将会尝试读取缓存，来避免在每次执行时，可能产生的、高性能消耗的 Babel 重新编译过程(recompilation process)。
 * 
 * 如果设置了一个空值 (loader: 'babel-loader?cacheDirectory')或者 true (loader: 'babel-loader?cacheDirectory=true')，
 * loader 将使用默认的缓存目录node_modules/.cache/babel-loader，如果在任何根目录下都没有找到 node_modules 目录，
 * 将会降级回退到操作系统默认的临时文件目录。
 */
{
  test: /\.js$/,
  use: 'babel-loader?cacheDirectory',
  include: [resolve('src'), resolve('test') ,resolve('node_modules/webpack-dev-server/client')]
}


/**
 * cache-loader
 * 
 * 除了 babel-loader,如果我们想让其他的 loader 的处理结果也缓存，该怎么做呢？
 * 答案是可以使用 cache-loader。在一些性能开销较大的 loader 之前添加 cache-loader，以便将结果缓存到磁盘里
 */
module.exports = {
  module: {
    rules: [
      {
        test: /\.ext$/,
        use: ['cache-loader', ...loaders],
        include: path.resolve('src'),
      },
    ],
  },
}
// 请注意，保存和读取这些缓存文件会有一些时间开销，所以请只对性能开销较大的 loader 使用此 loader


/**
 * HardSourceWebpackPlugin
 * 
 * HardSourceWebpackPlugin 为模块提供中间缓存，缓存默认的存放路径是: node_modules/.cache/hard-source。
 * 配置 hard-source-webpack-plugin，首次构建时间没有太大变化，但是第二次开始，构建时间大约可以节约 80%
 */
// webpack.config.js
var HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = {
  context: // ...
  entry: // ...
  output: // ...
  plugins: [
    new HardSourceWebpackPlugin()
  ]
}

