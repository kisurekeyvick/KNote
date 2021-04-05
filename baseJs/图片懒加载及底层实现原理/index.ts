/**
 * https://mp.weixin.qq.com/s/h_mhqfUWbOk7GjXvrJZv7Q
 * 
 * 图片懒加载及底层实现原理
 */

/** 
 * 浏览器的底层渲染机制：构建 DOM 树、样式计算、布局阶段、分层、绘制、分块、光栅化、合成
 * 
 * 而在构建DOM的过程中如果遇到img在新老版本的chrome中表现又是不一样的：
 *    (1) 老版本：阻塞 DOM 渲染
 *    (2) 新版本：虽然不会阻塞 DOM 渲染，但每一个图片请求都会占用一个 HTTP，
 *                而且 Chrome 最多允许对同一个 Host 同时建立六个 TCP 连接
 * 
 * 当你打开一个网站时，浏览器会做许多工作，这其中包括下载各种可能用到的资源，然后渲染呈现在你面前，假设你的网站有大量的图片，
 * 那么加载的过程是很耗时的，尤其像那些电商类需要大量图片的网站，可想而知，
 * 网站的初始加载时间会很长，再加上网络等其它影响，用户体验会很差。
 * 
 *      总结一下就是：直接全部加载的话会减缓渲染速度，产生白屏等进而影响用户体验。
 */

/**
 * 【方法一】基于原生 js 实现图片懒加载
 * 
 * 获取屏幕可视区域的高度：document.documentElement.clientHeight
 * 如图：【获取屏幕可视区域的高度.webp】
 * 
 * 获取元素相对于文档顶部的高度：element.offsetTop
 * 如图：【获取元素相对于文档顶部的高度.webp】
 * 
 * 获取浏览器窗口顶部与文档顶部之间的距离，也就是滚动条滚动的距离：document.documentElement.scrollTop
 * 如图：【滚动条滚动的距离.webp】
 * 
 * 根据上面的三个图可以得知：可视区域的高度、元素相对于其父元素容器顶部的距离、滚动条滚动的高度
 * 
 * 
 * 通过【思路分析.webp】，我们可以得知：如果满足offsetTop-scroolTop<clientHeight，则图片进入了可视区内，我们就去请求进入可视区域的图片。
 */

/**
 * 【方法二】基于 getBoundingClientRect()实现图片懒加载
 * 
 * getBoundingClientRect()用于获得页面中某个元素的左，上，右和下分别相对浏览器视窗的位置。
 * getBoundingClientRect()是DOM元素到浏览器可视范围的距离（不包含页面看不见的部分）。
 * 
 * 该函数返回一个rectObject对象，该对象有 6 个属性：top, left, bottom, right, width, height；
 * 这里的top、left和css中的理解很相似，width、height是元素自身的宽高，
 * 但是right，bottom和css中的理解有点不一样。right是指元素右边界距窗口最左边的距离，bottom是指元素下边界距窗口最上面的距离。
 * 
 * 可以查看：【getBoundingClientRect对应属性描述.webp】
 * 
 * 通过这个 API，我们就很容易获取img元素相对于视口的顶点位置rectObject.top，只要这个值小于浏览器的高度window.innerHeight就说明进入可视区域：
 */
 function isInSight(el){
  const bound = el.getBoundingClientRect();
  const clientHeight = window.innerHeight;
  return bound.top <= clientHeight;
}

function loadImg(el){
  if(!el.src){
    const source = el.getAttribute('data-src');;
    el.src = source;
  }
}

function checkImgs(){
  const imgs = document.querySelectorAll('img');
  Array.from(imgs).forEach(el =>{
    if (isInSight(el)){
      loadImg(el);
    }
  })
}

window.onload = function(){
  checkImgs();
}

document.onscroll = function () {
  checkImgs();
}


/**
 * 【方法三】IntersectionObserver 实现图片懒加载
 * 
 * 传统的实现方法是，监听到scroll事件后，调用目标元素（绿色方块）的getBoundingClientRect()方法，
 * 得到它对应于视口左上角的坐标，再判断是否在视口之内。这种方法的缺点是，由于scroll事件密集发生，计算量很大，容易造成性能问题。
 * 
 * 目前有一个新的 IntersectionObserver API，可以自动"观察"元素是否可见，Chrome 51+ 已经支持。
 * 由于可见（visible）的本质是，目标元素与视口产生一个交叉区，所以这个 API 叫做交叉观察器。
 */
/**
 * callback是可见性变化时的回调函数，option是配置对象（该参数可选）
 */
var io = new IntersectionObserver(callback, option);

// 开始观察
io.observe(document.getElementById('container'));
/** 
 * observe的参数是一个 DOM 节点对象
 * 
 * 如果要观察多个节点，就要多次调用这个方法
 * 
 * io.observe(elementA);
 * io.observe(elementB);
 */

// 停止观察
io.unobserve(element);

// 关闭观察器
io.disconnect();

// 基于IntersectionObserver来实现图片懒加载
const imgs = document.querySelectorAll('img') //获取所有待观察的目标元素
var options = {}
function lazyLoad(target) {
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entrie => {
      if (entrie.isIntersecting) {
        const img = entrie.target;
        const src = img.getAttribute('data-src');
        img.setAttribute('src', src)
        observer.unobserve(img); // 停止监听已开始加载的图片
      }

    })
  }, options);
  observer.observe(target)
}

imgs.forEach(lazyLoad)

/**
 * 【方法四】img.loading=lazy
 * 
 * 它是 Chrome 自带的原生 lazyload 属性。但是目前对各大浏览器支持程度还不是特别好。
 * 
 * <img src="example.jpg" loading="lazy" alt="zhangxinxu" width="250" height="150">
 */

