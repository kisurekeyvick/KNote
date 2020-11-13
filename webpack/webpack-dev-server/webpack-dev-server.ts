/**
 * https://mp.weixin.qq.com/s/3fxWbEK22KublTMxWbcnhg
 * 
 * webpack-dev-server 运行原理
 */

/**
 * webpack 将我们的项目源代码进行编译打包成可分发上线的静态资源，在开发阶段我们想要预览页面效果的话就需要启动一个服务器伺服 webpack 编译出来的静态资源。
 * webpack-dev-server 就是用来启动 webpack 编译、伺服这些静态资源。
 * 
 * 除此之外，它还默认提供了liveReload的功能，就是在一次 webpack 编译完成后浏览器端就能自动刷新页面读取最新的编译后资源。
 * 为了提升开发体验和效率，它还提供了 hot 选项开启 hotReload，相对于 liveReload, hotReload 不刷新整个页面，只更新被更改过的模块。
 */
 
/**
 * 作为命令行启动，webpack-dev-server/bin/webpack-dev-server.js 就是整个命令行的入口。
 */
// webpack-dev-server/bin/webpack-dev-server.js
function startDevServer(config, options) {

  let compiler;

  try {
    // 2. 调用webpack函数返回的是 webpack compiler 实例
    compiler = webpack(config);
  } catch (err) {
  }

  try {
    // 3. 实例化 webpack-dev-server
    server = new Server(compiler, options, log);
  } catch (err) {
  }

  if (options.socket) {
  } else {
    // 4. 调用 server 实例的 listen 方法
    server.listen(options.port, options.host, (err) => {
      if (err) {
        throw err;
      }
    });
  }
}

// 1. 对参数进行处理后启动
processOptions(config, argv, (config, options) => {
  startDevServer(config, options);
});


