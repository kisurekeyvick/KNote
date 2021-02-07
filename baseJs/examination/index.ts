/**
 * https://mp.weixin.qq.com/s/KDR_5N_YU5AOo5AsHhOPdg
 * 
 * 题集
 */

/**
 * (1) 对 dns-prefetch 的理解
 * 
 * DNS 是什么-- Domain Name System，域名系统，作为域名和IP地址相互映射的一个分布式数据库
 * 
 * DNS Prefetching：
 *     浏览器根据自定义的规则，提前去解析后面可能用到的域名，来加速网站的访问速度。
 *     简单来讲就是提前解析域名，以免延迟。
 * 
 * 使用方式：<link rel="dns-prefetch" href="//wq.test.com">
 * 
 * 这个功能有个默认加载条件，所有的a标签的href都会自动去启用DNS Prefetching。
 *                        也就是说，你网页的a标签href带的域名，是不需要在head里面加上link手动设置的。
 *              
 *     但a标签的默认启动在HTTPS不起作用，这时要使用 meta里面http-equiv来强制启动功能。：
 *     <meta http-equiv="x-dns-prefetch-control" content="on">
 * 
 * 
 * 总结：
 *      (1) DNS Prefetching是提前加载域名解析的，省去了解析时间。a标签的href是可以在chrome。firefox包括高版本的IE，
 *          但是在HTTPS下面不起作用，需要meta来强制开启功能          
 *      (2) 如果直接做了js的重定向，或者在服务端做了重定向，没有在link里面手动设置，是不起作用的。
 *      (3) 这个对于什么样的网站更有作用呢?
 *          类似taobao这种网站，你的网页引用了大量很多其他域名的资源，
 *          如果你的网站，基本所有的资源都在你本域名下，那么这个基本没有什么作用。因为DNS Chrome在访问你的网站就帮你缓存了。
 */


/**
 * (2) get/post请求传参长度有什么特点
 * 
 * 我们经常说get请求参数的大小存在限制，而post请求的参数大小是无限制的。这是一个错误的说法，实际上HTTP 协议从未规定 GET/POST 的请求长度限制是多少。
 * 对get请求参数的限制是来源与浏览器或web服务器，浏览器或web服务器限制了url的长度。
 * 
 * 1.HTTP 协议 未规定 GET 和POST的长度限制
 * 2.GET的最大长度显示是因为 浏览器和 web服务器限制了 URI的长度
 * 3.不同的浏览器和WEB服务器，限制的最大长度不一样
 * 4.要支持IE，则最大长度为2083byte，若只支持Chrome，则最大长度 8182byte
 */


/**
 * (3) 前端需要注意哪些 SEO
 * 
 * - 合理的 title、description、keywords：搜索对着三项的权重逐个减小，
 *      title 值强调重点即可，重要关键词出现不要超过 2 次，而且要靠前，不同页面 title 要有所不同；
 *      description 把页面内容高度概括，长度合适，不可过分堆砌关键词，不同页面 description 有所不同；
 *      keywords 列举出重要关键词即可
 * 
 * - 语义化的 HTML 代码，符合 W3C 规范：语义化代码让搜索引擎容易理解网页
 * 
 * - 重要内容 HTML 代码放在最前：搜索引擎抓取 HTML 顺序是从上到下，有的搜索引擎对抓取长度有限制，保证重要内容一定会被抓取
 * 
 * - 重要内容不要用 js 输出：爬虫不会执行 js 获取内容
 * 
 * - 少用 iframe(搜索引擎不会抓取 iframe 中的内容)
 * 
 * - 非装饰性图片必须加 alt
 * 
 * - 提高网站速度(网站速度是搜索引擎排序的一个重要指标)
 */ 


/**
 * (4) 实现一个页面操作不会整页刷新的网站，并且能在浏览器前进、后 退时正确响应。给出你的技术实现方案?
 * 
 * 第一步，通过使用 pushState + ajax 实现浏览器无刷新前进后退，当一次 ajax 调用成功后我们将一 条 state 记录加入到 history 对象中。
 * 
 * 第二步，一条 state 记录包含了 url、title 和 content 属性，在 popstate 事件中可以 获取到这个 state 对象，
 *        我们可 以使用 content 来传递数据。第三步，我们通过对 window.onpopstate 事件监听来响应浏览器 的前进后退操作。
 * 
 * 
 * 使用 pushState 来实现有两个问题：
 *    一个是打开首页时没有记录，我们可以使用 replaceState 来将首页的记录替换，
 *    另一个问题是当一个页面刷新的时候，仍然会向服务器端请求数据，因此如果请求的 url 需要后端的配合将其重定向到一个页面。
 */


/**
 * (5) 如何优化SPA应用的首屏加载速度慢的问题?
 * 
 * - 将公用的JS库通过script标签外部引入，减小app.bundel的大小，让浏览器并行下载资源文件，提高下载速度；
 * - 在配置 路由时，页面和组件使用懒加载的方式引入，进一步缩小 app.bundel 的体积，在调用某个组件时再加载对应的js文件；
 * - root中插入loading 或者 骨架屏 prerender-spa-plugin，提升用户体验；
 * - 如果在webview中的页面，可以进行页面预加载
 * - 独立打包异步组件公共 Bundle，以提高复用性&缓存命中率
 * - 静态文件本地缓存，有两种方式分别为HTTP缓存，设置Cache-Control，Last-Modified，Etag等响应头和Service Worker离线缓存
 * - 配合 PWA 使用
 * - SSR
 * - root中插入loading 或者 骨架屏 prerender-spa-plugin
 * - 使用 Tree Shaking 减少业务代码体积
 */


/**
 * (6) Reflect 对象创建目的?
 * 
 * - 将 Object 对 象 的 一 些 明 显 属 于 语 言 内 部 的 方 法 （ 比 如 Object.defineProperty，放到 Reflect 对象上）。
 * - 修改某些 Object 方法的返回结果，让其变得更合理
 * - 让 Object 操作都变成函数行为
 * - Reflect 对象的方法与 Proxy 对象的方法一一对应，只要是 Proxy 对象 的方法，就能在 Reflect 对象上找到对应的方法。
 *    这就让 Proxy 对象可 以方便地调用对应的 Reflect 方法，完成默认行为，作为修改行为的基础。
 * 
 * 也就是说，不管 Proxy 怎么修改默认行为，你总可以在 Reflect 上获取 默认行为。
 */ 


/**
 * (7) 内部属性 [[Class]] 是什么?
 * 
 * 所有 typeof 返回值为 "object" 的对象（如数组）都包含一个内部属性 [[Class]]（我 们可以把它看作一个内部的分类，而非传统的面向对象意义上的类）。
 * 这个属性无法直接访问， 一般通过 Object.prototype.toString(..) 来查看。
 * 
    Object.prototype.toString.call( [1,2,3] );  // "[object Array]" 
    Object.prototype.toString.call( /regex-literal/i ); //"[object RegExp]"
 * 
 * 多数情况下，对象的内部[[class]]属性和创建该对象的内建原生构造函数相对应，不过也不总是这样
 * 
 * 
 * 虽然Null()和Undefined()这样的原生构造函数并不存在，但是内部[[class]]属性仍然是“Null”和“Undefined”
 * 
    console.log(Object.prototype.toString.call(null)); //[object Null]
    console.log(Object.prototype.toString.call(undefined)); //[object Undefined]
 * 
 */ 


/**
 * (8) 什么是堆？什么是栈？它们之间有什么区别和联系
 * 
 * 堆和栈的概念存在于数据结构中和操作系统内存中。
 * 
 * 在数据结构中，栈中数据的存取方式为 先进后出。
 * 而堆是一个优先队列，是按优先级来进行排序的，优先级可以按照大小来规定。二叉树是堆的一种实现方式。
 * 
 * 在操作系统中，内存被分为栈区和堆区。栈区内存由编译器自动分配释放，存放函数的参数值，局部变量的值等。
 * 其操作方式类似于数据结构中的栈。
 * 堆区内存一般由程序员分配释放，若程序员不释放，程序结束时可能由垃圾回收机制回收。
 */ 


/**
 * (9) isNaN 和 Number.isNaN 函数的区别?
 * 
 * 函数 isNaN 接收参数后，会尝试将这个参数转换为数值，任何不能被转换为数值的值都会返回 true。
 *    因此非数字值传入也会返回 true ，会影响 NaN 的判断。
 * 
 * 函数 Number.isNaN 会首先判断传入参数是否为数字，如果是数字再继续判断是否为 NaN ，这种方法对于 NaN 的判断更为准确。
 */


/** 
 * (10) 什么情况下会发生布尔值的隐式强制类型转换?
 * 
 * - if (..) 语句中的条件判断表达式
 * - for ( .. ; .. ; .. ) 语句中的条件判断表达式（第二个）
 * - while (..) 和 do..while(..) 循环中的条件判断表达式。
 * - ? : 中的条件判断表达式。
 * - 逻辑运算符 ||（逻辑或）和 &&（逻辑与）左边的操作数（作为条件判断表达式）。
 */


/**
 * (11) undefined 与 undeclared 的区别?
 * 
 * 已在作用域中声明但还没有赋值的变量，是 undefined。
 * 还没有在作用域中声明过的变量，是 undeclared。
 * 对于 undeclared 变量的引用，浏览器会报引用错误，如 ReferenceError: b is not defined 。
 * 但是我们可以使用 typeof 的安全防范机制来避免 报错，因为对于 undeclared（或者 not defined ）变量，typeof 会返回 undefined。
 */ 


/**
 * (12) 如何封装一个 javascript 的类型判断函数?
 */
function getType(value) { 
  // 判断数据是 null 的情况 
  if (value === null) {
      return value + ""
  }
  // 判断数据是引用类型的情况 
  if (typeof value === "object") { 
    let valueClass = Object.prototype.toString.call(value), 
    type = valueClass.split(" ")[1].split("")
    type.pop()
    return type.join("").toLowerCase()
  } else { 
    // 判断数据是基本数据类型的情况和函数的情况
    return typeof value
  }
}

