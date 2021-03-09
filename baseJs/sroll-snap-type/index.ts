/**
 * https://github.com/chokcoco/iCSS/issues/74
 * 
 * 使用 sroll-snap-type 优化滚动
 * 
 * CSS 新增了一批能够控制滚动的属性，让滚动能够在仅仅通过 CSS 的控制下，得到许多原本需要 JS 脚本介入才能实现的美好交互。
 */

/**
 * sroll-snap-type：none | [ x | y | block | inline | both ] [ mandatory | proximity ]?
 * 
 * 简而言之：让滚动操作结束后，元素停止在适合的位置。 
 * 
  如图：【容器滚动-X轴.gif】
  
  <style>
    ul {
        scroll-snap-type: x mandatory;
    }

    li {
        scroll-snap-align: center;
    }
  </style>
  
  <body>
    <div>
      <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
      </ul>
    </div>
  </body>

  scroll-snap-type: x mandatory 中，x 表示捕捉 x 轴方向上的滚动，
  mandatory 表示强制将滚动结束后元素的停留位置设置到我们规定的地方。
 * 
  
 */


/**
 * 如果是 y 轴方向的滚动也是一样的，只需要简单改一下 scroll-snap-type
 * 
  如图：【容器滚动-Y轴.gif】    

    ul {
      scroll-snap-type: y mandatory;
    }
 * 
 * 
 */  


/**
 * scroll-snap-type 中的 mandatory 与 proximity
 * 
 * mandatory: 通常在 CSS 代码中我们都会使用这个，mandatory 的英文意思是强制性的，表示滚动结束后，
 *            滚动停止点一定会强制停在我们指定的地方
 * 
 * proximity: 英文意思是接近、临近、大约，在这个属性中的意思是滚动结束后，滚动停止点可能就是滚动停止的地方，
 *            也可能会再进行额外移动，停在我们指定的地方
 */    


/**
 * scroll-snap-align
 * 
 * 使用 scroll-snap-align 可以控制滚动子元素与父容器的对齐方式
 * 
 * scroll-snap-align: start   如图：【scroll-snap-align start.gif】
 *      当前聚焦的滚动子元素在滚动方向上相对于父容器顶部对齐
 * 
 * scroll-snap-align: center  如图：【scroll-snap-align center.gif】
 *      使当前聚焦的滚动子元素在滚动方向上相对于父容器中心对齐
 * 
 * scroll-snap-align: end     如图：【scroll-snap-align end.gif】
 *      使当前聚焦的滚动子元素在滚动方向上相对于父容器底部对齐
 */


/**
 * scroll-margin / scroll-padding
 *  
 * scroll-padding 是作用于滚动父容器，类似于盒子的 padding
 * scroll-margin 是作用于滚动子元素，每个子元素的 scroll-margin 可以设置为不一样的值，类似于盒子的 margin
 */
/** 
 * 案例：在竖向滚动下，给滚动父容器添加一个 scroll-padding-top: 30px 等同于给每个子元素添加 ``scroll-margin-top: 30px`：
 *      我们希望滚动子元素在 scroll-snap-align: start 的基础上，与容器顶部的距离为 30px：
 * 
    .snap {
      overflow-x: auto;
      scroll-snap-type: y mandatory;
      scroll-padding-top: 30px;
    }

    li {
      scroll-snap-align: start;
    }

    <ul class="snap">
      <li>1</li>
      <li>2</li>
      <li>3</li>
      ...
    </ul>

    效果如图：【scroll-margin scroll-padding.gif】
 */
