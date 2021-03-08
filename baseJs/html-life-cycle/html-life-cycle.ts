/**
 * 详解 HTML 页面原生的生命周期事件
 * https://mp.weixin.qq.com/s/YqOSCHE3-c8bVB44qxKWCw
 */

/**
 * DOMContentLoaded —— 浏览器已完全加载 HTML，并构建了 DOM 树，但像 <img> 和样式表之类的外部资源可能尚未加载完成。
 * 
 * load —— 浏览器不仅加载完成了 HTML，还加载完成了所有外部资源：图片，样式等。
 * 
 * beforeunload —— 当用户正在离开页面时。
 * 
 * unload 事件 —— 用户几乎已经离开了，但是我们仍然可以启动一些操作，例如发送统计数据。
 */

/**
 * DOMContentLoaded
 * 
 * DOMContentLoaded 和 js脚本
 * 
 * 当浏览器处理一个 HTML 文档，并在文档中遇到 <script> 标签时，就会在继续构建 DOM 之前运行它。
 * 这是一种防范措施，因为脚本可能想要修改 DOM，甚至对其执行 document.write 操作，
 * 所以 DOMContentLoaded 必须等待脚本执行结束。
 * 
 * 不会阻塞 DOMContentLoaded 的脚本：
 *  具有 async 特性（attribute）的脚本不会阻塞 DOMContentLoaded
 *  使用 document.createElement('script') 动态生成并添加到网页的脚本也不会阻塞 DOMContentLoaded
 * 
 * 
 * 
 * DOMContentLoaded 和 样式
 * 
 * 外部样式表不会影响 DOM，因此 DOMContentLoaded 不会等待它们。
 * 但是，如果在样式后面有一个脚本，那么该脚本必须等待样式表加载完成。
 * 原因是，脚本可能想要获取元素的坐标和其他与样式相关的属性，因此，它必须等待样式加载完成。
 * 当 DOMContentLoaded 等待脚本时，它现在也在等待脚本前面的样式。
 */


/** 
 * document.readyState - 可以为我们提供当前加载状态的信息
 * 
 *  loading —— 文档正在被加载
 *  interactive —— 文档被全部读取
 *  complete —— 文档被全部读取，并且所有资源（例如图片等）都已加载完成
 */
// 当document.readyState状态改变时打印它
document.addEventListener('readystatechange', () => {
    console.log(document.readyState)
});
