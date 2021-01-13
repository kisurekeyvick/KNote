/**
 * https://juejin.cn/post/6844903781306482695
 * 
 * Service Worker
 */

/**
 * 前言
 * 
 * 如何降低一个页面的网络请求成本从而缩短页面加载资源的时间并降低用户可感知的延时是非常重要的一部分。
 * 对于提升应用的加载速度常用的手段有Http Cache、异步加载、304缓存、文件压缩、CDN、CSS Sprite、开启GZIP等等。
 * 这些手段无非是在做一件事情，就是让资源更快速的下载到浏览器端。
 * 但是除了这些方法，其实还有更加强大的Service Worker线程
 */ 

/**
 * 什么是Service Worker
 * https://juejin.cn/post/6844903785131671565#heading-0
 * 
 * 【service-worker介绍.png】
 * 如图，可以理解为：在客户端创建了一个属于自己的金库，当我们需要取钱或者获取资源时，可以先从本地的金库中拿，本地金库没有，再通过原来的流程获取。
 */ 

/**
 * Service Worker与Cache的关系
 * 
 * 正常情况下，客户端获取一个资源的过程有如下三步: 【获取资源过程.png】
 * 
 * 而关于请求资源的优化，一般也集中在这三步完成：
 * (1) 不发出请求就能够获得资源
 * (2) 提高服务器查找资源的速度
 * (3) 减小返回内容的体积
 * 
 * 
 * 查看【缓存类型.png】可得知：
 * Service Worker、Memory Cache、Disk Cache和No Cache。资源查找顺序为从左向右，找到资源则返回，未找到则继续寻找，直至最终获取资源。
 * 
 */ 

/**
 * Service Worker基本特征
 * 
 * 无法操作DOM
 * 只能使用HTTPS以及localhost
 * 可以拦截全站请求从而控制你的应用
 * 与主线程独立不会被阻塞（不要再应用加载时注册sw）
 * 完全异步，无法使用XHR和localStorage
 * 一旦被 install，就永远存在，除非被 uninstall或者dev模式手动删除
 * 独立上下文
 * 响应推送
 */ 

/** 
 * Service Worker使用逻辑
 * 
 * 注册一个Woker，这时浏览器会在后台启动一个新的线程，在这个线程启动后，会按照Service Worker中的代码逻辑将一些资源缓存下来，
 * 缓存完毕后，启动对页面请求的监听，当监听到页面请求资源时可以做出相对应的响应，
 * 比如如果资源在Service Worker中缓存过了，就可以直接返回资源。
 */

/**
 * 应用场景
 * 
 * 用于浏览器缓存，提高加载速度
 * 实现离线应用
 * 实现消息的主动推送，为web应用增加一种给力的交互方式
 */

/**
 * Service Worker 注册
 */ 
// 官方demo
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}
/**
 * 但是这样做会有一些问题，页面在首次打开的时候就进行缓存sw的资源，因为sw内预缓存资源是需要下载的，
 * sw线程一旦在首次打开时下载资源，将会占用主线程的带宽，以及加剧对cpu和内存的使用，
 * 而且Service worker 启动之前，它必须先向浏览器 UI 线程申请分派一个线程，
 * 再回到 IO 线程继续执行 service worker 线程的启动流程，并且在随后多次在ui线程和io线程之间切换，
 * 所以在启动过程中会存在一定的性能开销，在手机端尤其严重。
 */

 
// 首次打开各种资源都非常宝贵，完全没有必要争第一次打开页面就要缓存资源，所以可在页面加载完以后注册sw
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(res => {
      console.log('注册成功', res)
    }).catch(err => {
      console.log('注册失败', err)
    })
  });
}


/**
 * Service Worker的作用域
 * 
 * 需要注意的是Service Worker是有作用域的，它的作用域为文件的当前路径，Service Worker文件只能管理自己作用下的资源，
 * 比如abcde.com/home/sw.js 的作用域为abcde.com/home/
 */


/**
 * Service Worker的激活
 * 
 * 【service-worker-激活.png】
 * 如上图，Service Worker的状态分为几种，STOPPED（已停止）、STARTING（正在启动）、RUNNING（正在运行）和STOPPING（正在停止），
 *        比如上面的截图就处于RUNNING状态。
 * 
 * 只有处于running状态的Service Worker才能生效，这就需要对注册后的Service Worker进行加载和激活，
 * 注册完毕后，Service Worker会自动开始下载，
 * 下载后会触发install事件，我们可以监听这个事件并进行下载资源的操作
 */


/**
 * Service Worker的更新
 * 
 * 【service-worker-更新.png】
 * 如上图，当应用加载时，会下载Service Worker文件，这是在浏览器中就会有两个文件，一个是当前正在使用的Service Worker，
 * 一个是新下载的Service Worker，当新下载的文件下载完毕后，浏览器会对两个文件进行Diff操作，如果发现文件没有更新，
 * 则会丢弃掉新下载的Service Worker文件，如果发现有变化，则会加载新的Service Worker，
 * 但新加载的Service Worker会处于wating状态，并不会实际发挥作用，只有当整个浏览器中对正在运行的Service Worker没有依赖时，
 * 才会将运行中的Service Worker抛弃，将新的Servier Worker置为激活状态。
 */
/**
 * 但是我们还会碰到这样的问题：
 *    修改sw文件，浏览器会更新sw.js并触发install事件去下载最新版本，但是由于浏览器的实现原理，当页面切换或者刷新
 *    浏览器是等到新的页面完成渲染之后再销毁旧的页面。这表示新旧两个页面存在共存的交叉时间，所以简单的刷新或者切换页面
 *    是不能够让SW进行刷新，老的sw依然接管页面，新的sw依然在等待。
 * 
 *    可以使用方法：
 *    (1) self.skipWaiting()，
 *        但是这个方法存在弊端：同一个页面，前半部分的请求是由旧的sw控制，而后半部分是由新的sw控制
 *        这两者的不一致性很容易导致问题，除非你能保证同一个页面在两个版本的sw相继处理的情况下依然能够正常工作
 *    (2) 监听 controllerchange 事件
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            window.location.reload();
          })
 *        但是无故的刷新，会影响用户体验，所以当检测到有新的sw被安装之后弹出一个提示栏来告诉用户站点已更新，并且让用户点击更新按钮        
 *        就像这张图：【手动刷新.png】
 *    (3) 通过onupdatefound监听sw的变化
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(reg => {
      // Registration.waiting 会返回已安装的sw的状态，初始值为null
      // 这里是为了解决当用户没有点击按钮时却主动刷新了页面，但是onupdatefound事件却不会再次发生
      // 具体可以参考 https://github.com/lavas-project/lavas/issues/212
      if (reg.waiting) {
        // 通知提示栏显示
        return
      }
      // 每当Registration.Installing属性获取新的sw时都会调用该方法
      reg.onupdatefound = function () {
        const installingWorker = reg.installing
        installingWorker.onstatechange = function () {
          switch (installingWorker.state) {
            case 'installed':
              // 应为在sw第一次安装的时候也会调用onupdatefound，所以要检查是否已经被sw控制
              if (navigator.serviceWorker.controller) {
                // 通知提示栏显示
              }
              break;
          }
        }
      }
    }).catch(err => {
      console.log('注册失败', err)
    })
  });
}


 
