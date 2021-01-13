/**
 * https://mp.weixin.qq.com/s/ND8OW9ncAu7uv4UeGOOu9g
 * 
 * 一些关于web的知识点(也属于优化的前提)
 */

/**
 * (1) waterfall
 * 
 * Queueing               浏览器将资源放入队列时间
 * Stalled                因放入队列时间而发生的停滞时间
 * DNS Lookup             DNS解析时间
 * Initial connection     建立HTTP连接的时间
 * SSL                    浏览器与服务器建立安全性连接的时间
 * TTFB                   等待服务端返回数据的时间
 * Content Download       浏览器下载资源的时间
 */ 

/**
 * (2) 资源打包分析
 * 
 * npm install --save-dev webpack-bundle-analyzer
 */
// webpack.config.js 文件
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports={
  plugins: [
    new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerHost: '127.0.0.1',
          analyzerPort: 8889,
          reportFilename: 'report.html',
          defaultSizes: 'parsed',
          openAnalyzer: true,
          generateStatsFile: false,
          statsFilename: 'stats.json',
          statsOptions: null,
          logLevel: 'info'
        }),
  ]
}
// package.json
"analyz": "NODE_ENV=production npm_config_report=true npm run build"

// 开启source-mapwebpack.config.js
module.exports = {
  mode: 'production',
  devtool: 'hidden-source-map',
}

// package.json
"analyze": "source-map-explorer 'build/*.js'",
npm run analyze 

/**
 * (3) 监听视窗激活状态
 */
let vEvent: string = 'visibilitychange';
if (document?.webkitHidden != undefined) {
  vEvent = 'webkitvisibilitychange';
}

function visibilityChanged() {
  if (document.hidden || document?.webkitHidden) {
    document.title = '当前页面隐藏了'
  } else {
    document.title = '当前页面显示了'
  }
}

document.addEventListener(vEvent, visibilityChanged, false);


/**
 * (4) 监听网络变化
 * 
 * 网络变化时给用户反馈网络问题，有时候看直播的时候自己的网络卡顿，直播平台也会提醒你或者自动给你切换清晰度
 */
var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
var type = connection.effectiveType;

function updateConnectionStatus() {
  console.log("Connection type changed from " + type + " to " + connection.effectiveType);
  type = connection.effectiveType;
}

connection.addEventListener('change', updateConnectionStatus);


/**
 * (5) 计算DOMContentLoaded时间
 */
window.addEventListener('DOMContentLoaded', (event) => {
  let timing = performance.getEntriesByType('navigation')[0];
  console.log(timing.domInteractive);
  console.log(timing.fetchStart);
  let diff = timing.domInteractive - timing.fetchStart;
  console.log("TTI: " + diff);
})


/**
 * (6) 查看一下雅虎军规：雅虎军规.jpg
 * 
 * 
 * 1.减少cookie传输
 * cookie传输会造成带宽浪费，可以：减少cookie中存储的东西、静态资源不需要cookie，可以采用其他的域名，不会主动带上cookie。
 * 
 * 
 * 2.避免过多的回流与重绘
 * 
 * 3.压缩-Gzip
 *    - 开启方式 可参考：nginx开启gzip
 *    - 还有一种方式：打包的时候生成gz文件，上传到服务器端，这样就不需要nginx来压缩了，可以降低服务器压力。
 *        可参考：gzip压缩文件&webPack配置Compression-webpack-plugin
 * 
 * 4.压缩-JavaScript、Css、Html压缩
 *      压缩原理简单的讲就是去除一些空格、换行、注释，借助es6模块化的功能，做了一些tree-shaking的优化。
 *      同时做了一些代码混淆，一方面是为了更小的体积，另一方面也是为了源码的安全性。
 *      
 *      UglifyJS、webpack-parallel-uglify-plugin、terser-webpack-plugin 具体优缺点可参考：webpack常用的三种JS压缩插件。
 * 
 *      css压缩主要是mini-css-extract-plugin。
 * 
 *      html压缩可以用HtmlWebpackPlugin，单页项目就一个index.html,性能提升微乎其微
 * 
 * 5.http2首部压缩
 *    http2的特点
 *      二进制分帧、首部压缩、流量控制、多路复用、请求优先级、服务器推送http2_push: 'xxx.jpg' 
 *      具体升级方式也很简单，修改一下nginx配置
 * 
 *    当前网络环境中，同一个页面发出几十个HTTP请求已经是司空见惯的事情了。
 *    在HTTP/1.1中，请求之间完全相互独立，使得请求中冗余的首部字段不必要地浪费了大量的网络带宽，并增加了网络延时。
 * 
 *    如图：http请求_1.jpg 和 http请求_2.jpg
 *        同一个页面中对不同资源的请求，请求中的头部字段绝大部分是完全相同的。
 *        特别是 "User-Agent" 等头部字段通常还会消耗大量的带宽。
 *        HTTP/2的首部压缩正是为了解决这个问题而设计。
 *        HTTP/2的首部压缩，主要从两个方面实现，一是首部表示，二是请求间首部字段内容的复用。
 *        
 *        HTTP/2首部压缩(https://sq.163yun.com/blog/article/188769987293102080)
 */


/**
 * webpack优化
 */

/**
 * (1) DllPlugin 提升构建速度
 * 
 * 通过DllPlugin插件，将一些比较大的，基本很少升级的包拆分出来，生成xx.dll.js文件,通过manifest.json引用
 * 
 * 关于DllPlugin的一些相关信息，查看 仓库下 webpack/DllPlugin/index.ts
 */ 
// webpack.dll.config.js
const path = require("path");
const webpack = require("webpack");
module.exports = {
    mode: "production",
    entry: {
        react: ["react", "react-dom"],
    },
    output: {
        filename: "[name].dll.js",
        path: path.resolve(__dirname, "dll"),
        library: "[name]"
    },
    plugins: [
        new webpack.DllPlugin({
            name: "[name]",
            path: path.resolve(__dirname, "dll/[name].manifest.json")
        })
    ]
};

// package.json
"scripts": {
  "dll-build": "NODE_ENV=production webpack --config webpack.dll.config.js",
}

// splitChunks 拆包
optimization: {
  splitChunks: {
    cacheGroups: {
      vendor: {
        name: 'vendor',
        test: /[\\/]node_modules[\\/]/,
        minSize: 0,
        minChunks: 1,
        priority: 10,
        chunks: 'initial'
      },
      common: {
        name: 'common',
        test: /[\\/]src[\\/]/,
        chunks: 'all',
        minSize: 0,
        minChunks: 2
      }
    }
  }
}

/**
 * 缓存
 */

/**
 * (1) http缓存
 * 
 * keep-alive 
 * 判断是否开启：看response headers中有没有Connection: keep-alive 。
 * 开启以后，看network的瀑布流中就没有 Initial connection耗时了
 * nginx设置keep-alive（默认开启）
 * #0 为关闭
 * #keepalive_timeout 0;
 * #65s无连接 关闭
 * keepalive_timeout 65;
 * #连接数，达到100断开
 * keepalive_requests 100;
 * 
 * Cache-Control / Expires / Max-Age 设置资源是否缓存，以及缓存时间
 * Etag / If-None-Match 资源唯一标识作对比，如果有变化，从服务器拉取资源。如果没变化则取缓存资源，状态码304，也就是协商缓存
 * Last-Modified / If-Modified-Since 通过对比时间的差异来觉得要不要从服务器获取资源
 * 更多HTTP缓存参数可参考：使用 HTTP 缓存：Etag, Last-Modified 与 Cache-Control
 */

/**
 * (2) Service Worker
 * 
 * 借助webpack插件WorkboxWebpackPlugin和ManifestPlugin,加载serviceWorker.js,通过serviceWorker.register()注册
 */




