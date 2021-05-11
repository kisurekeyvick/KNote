/**
 * fetch、ajax、axios 区别
 * https://www.jianshu.com/p/c6138494e70a
 */

/**
 * 1. ajax
 * 
 * Ajax的本质是使用XMLHttpRequest对象来请求数据
 */

/**
 * 1.1 封装一个ajax
 * 查看 ajax.ts
 */

/**
 * 2. fetch
 */

/**
 * 2.1 fetch 的特征
 * 
 * fetch 是全局量 window 的一个方法，它的主要特点有：
 * (1) 第一个参数是URL, 第二个是可选参数，可以控制不同配置的 init 对象，使用了 JavaScript Promises 来处理结果/回调
 * (2) 所有的IE浏览器都不会支持 fetch()方法
 * (3) 当接收到一个代表错误的 HTTP 状态码时，从 fetch() 返回的 Promise 不会被标记为 reject， 即使响应的 HTTP 状态码是 404 或 500。
 *      相反，它会将 Promise 状态标记为 resolve （但是会将 resolve 的返回值的 ok 属性设置为 false ），
 *      仅当网络故障时或请求被阻止时，才会标记为 reject
 * (4) fetch没有办法原生监测请求的进度，而XHR可以
 * (5) Fetch API 是基于 Promise 设计，支持 async/await
 * 
 * Fetch 常见坑：
 * (1) Fetch 请求默认是不带 cookie 的，需要设置 fetch(url, {credentials: 'include'})
 * (2) 服务器返回 400，500 错误码时并不会 reject，只有网络错误这些导致请求不能完成时，fetch 才会被 reject
 * (3) 缺少其它一些方法：always，progress，finally
 *      always 可以通过在 then 和 catch 里重复调用方法实现。finally 也类似。progress 这种进度通知的功能还没有用过，暂不知道如何替代。
 * (4) 不能中断，没有 abort、terminate、onTimeout 或 cancel 方法
 *      Fetch 和 Promise 一样，一旦发起，不能中断，也不会超时，只能等待被 resolve 或 reject。
 */

/**
 * 2.2 封装一个fetch 
 * 查看 fetch.ts
 */

/** 
 * 3. axios
 */

/**
 * fetch规范与jQuery.ajax()主要有两种方式的不同，牢记
 * 
 * 1. 从 fetch()返回的 Promise 将不会拒绝HTTP错误状态, 即使响应是一个 HTTP 404 或 500。相反，它会正常解决 (其中ok状态设置为false), 
 *    并且仅在网络故障时或任何阻止请求完成时，它才会拒绝。
 * 2. 默认情况下, fetch在服务端不会发送或接收任何 cookies, 如果站点依赖于维护一个用户会话，
 *    则导致未经认证的请求(要发送 cookies，必须发送凭据头)。这一点也可以做一些处理：
 *    如果想要在同域中自动发送cookie,加上 credentials 的 same-origin 选项
 *       
      fetch(url, {
        credentials: 'same-origin'
      })
 * 
 *    same-origin值使得fetch处理Cookie与XMLHttpRequest类似。否则，Cookie将不会被发送，导致这些请求不保留认证会话。
 * 
 *    对于CORS请求，使用include值允许将凭据发送到其他域：
      fetch(url, {
        credentials: 'include'
      })
 * 
 */
