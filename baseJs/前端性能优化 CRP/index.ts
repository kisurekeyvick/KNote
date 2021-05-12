/**
 * https://github.com/Cosen95/blog/issues/45
 * 
 * 前端性能优化 CRP
 */

/**
 * (1) 什么是 CRP?
 * 
 * CRP又称关键渲染路径，引用MDN对它的解释:
 * - 关键渲染路径是指浏览器通过把 HTML、CSS 和 JavaScript 转化成屏幕上的像素的步骤顺序。
 * - 优化关键渲染路径可以提高渲染性能。
 * - 关键渲染路径包含了: Document Object Model (DOM)，CSS Object Model (CSSOM)，渲染树和布局。
 */

/**
 * (2) 浏览器渲染过程
 * 
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <link href="style.css" rel="stylesheet">
        <title>构建DOM树</title>
      </head>
      <body>
        <p>森林</p>
        <div>之晨</div>
      </body>
    </html>
 * 
 *  首先浏览器从磁盘或网络中读取 HTML 原始字节，并根据文件的指定编码将它们转成字符。
 *  然后通过分词器将字节流转换为 Token，在Token（也就是令牌）生成的同时，另一个流程会同时消耗这些令牌并转换成 HTML head 这些节点对象，起始和结束令牌表明了节点之间的关系。
 *  当所有的令牌消耗完以后就转换成了DOM (文档对象模型)
 */
