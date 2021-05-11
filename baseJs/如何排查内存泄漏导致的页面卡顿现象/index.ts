/**
 * https://mp.weixin.qq.com/s/XQeLeTmXiqVbn_pPYQMvMg
 * 
 * 了解如何排查内存泄漏导致的页面卡顿现象
 */

/** 
 * 问：页面卡顿的原因可能是什么引起的?
 * 
 * (1) 先会检查是否是网络请求太多，导致数据返回较慢，可以适当做一些缓存
 * (2) 也有可能是某块资源的bundle太大，可以考虑拆分一下
 * (3) 然后排查一下js代码，是不是某处有过多循环导致占用主线程时间过长
 * (4) 浏览器某帧渲染的东西太多，导致的卡顿
 * (5) 在页面渲染过程中，可能有很多重复的重排重绘
 * 
 * (~~) 长时间运行页面卡顿也有可能是因为内存泄漏引起的
 */


/**
 * 1. 内存泄漏的定义
 * 
 * 内存泄漏就是指由于疏忽或者程序的某些错误造成未能释放已经不再使用的内存的情况。
 * 简单来讲就是假设某个变量占用100M的内存，而你又用不到这个变量，但是这个变量没有被手动的回收或自动回收，
 * 即仍然占用100M的内存空间，这就是一种内存的浪费，即内存泄漏
 */


/**
 * 2. JS的数据存储
 * 
 * JavaScript的内存空间分为栈内存和堆内存，前者用来存放一些简单变量，后者用来存放复杂对象
 * 简单变量指的是JS的基本数据类型，例如：String、Number、Boolean、null、undefined、Symbol、BigInt
 * 复杂对象指的是JS的引用数据类型，例如：Object、Array、Function
 */


/**
 * 3. JS垃圾回收机制
 * 
 * (1) JavaScript的垃圾回收机制是自动执行的，并且会通过标记来识别并清除垃圾数据
 * (2) 在离开局部作用域后，若该作用域内的变量没有被外部作用域所引用，则在后续会被清除
 * 
 * 补充： 
 * JavaScript的垃圾回收机制有着很多的步骤，上述只讲到了标记-清除，其实还有其它的过程，这里简单介绍一下就不展开讨论了。
 * 
 * 例如：
 * 【标记-整理】，在清空部分垃圾数据后释放了一定的内存空间后会可能会留下大面积的不连续内存片段，
 *              导致后续可能无法为某些对象分配连续内存，此时需要整理一下内存空间；
 * 【交替执行】，因为JavaScript是运行在主线程上的，所以执行垃圾回收机制时会暂停js的运行，若垃圾回收执行时间过长，
 *            则会给用户带来明显的卡顿现象，所以垃圾回收机制会被分成一个个的小任务，穿插在js任务之中，即交替执行，尽可能得保证不会带来明显的卡顿感
 */


/**
 * 4. Chrome devTools查看内存情况
 * 
 * 首先打开Chrome的无痕模式，这样做的目的是为了屏蔽掉Chrome插件对我们之后测试内存占用情况的影响
 * 
 * 如图：【使用chrome查看内存占用.webp】
 * 然后打开开发者工具，找到Performance这一栏，可以看到其内部带着一些功能按钮，
 * 例如：开始录制按钮；刷新页面按钮；清空记录按钮；记录并可视化js内存、节点、事件监听器按钮；触发垃圾回收机制按钮等等
 * 
 * 如图：【简单录制一下百度页面.gif】
 * 从上图中我们可以看到，在页面从零到加载完成这个过程中JS Heap（js堆内存）、documents（文档）、Nodes（DOM节点）、Listeners（监听器）、GPU memory（GPU内存）的最低值、最高值
 * 以及随时间的走势曲线，这也是我们主要关注的点
 * 
 * 如图：【menory-点击动态快照.webp】
 * 再来看看开发者工具中的Memory一栏，其主要是用于记录页面堆内存的具体情况以及js堆内存随加载时间线动态的分配情况
 * 
 * 如图：【页面动态的内存变化.gif】
 * 图中右上角有起伏的蓝色与灰色的柱形图，其中蓝色表示当前时间线下占用着的内存；灰色表示之前占用的内存空间已被清除释放。
 * 
 * 从上图过程来看，我们可以看到刚开始处于的tab所对应显示的页面中占用了一定的堆内存空间，成蓝色柱形，在点击别的tab后，原tab对应的内容消失，
 * 并且原来蓝色的柱形变成灰色（表示原占用的内存空间得到了释放），同时新tab所对应显示的页面也占用了一定的堆内存空间。
 * 因此后续我们就可以针对这个图来查看内存的占用与清除情况
 */


/**
 * 5. 内存泄漏的场景
 * 
 * 那么到底有哪些情况会出现内存泄漏的情况呢？这里列举了常见的几种:
 * (1) 闭包使用不当引起内存泄漏
 * (2) 全局变量
 * (3) 分离的DOM节点
 * (4) 控制台的打印
 * (5) 遗忘的定时器
 * 
 * 
 * 
 * 5-1 闭包使用不当
 * 5-2 全局变量
 *    全局的变量一般是不会被垃圾回收掉的，当然这并不是说变量都不能存在全局，只是有时候会因为疏忽而导致某些变量流失到全局，
 *    例如未声明变量，却直接对某变量进行赋值，就会导致该变量在全局创建，如下所示：
      function fn1() {
          // 此处变量name未被声明
          name = new Array(99999999)
      }

      fn1()
 * 
 *    
 * 5-3 分离的DOM节点
 *    假设你手动移除了某个dom节点，本应释放该dom节点所占用的内存，但却因为疏忽导致某处代码仍对该被移除节点有引用，
 *    最终导致该节点所占内存无法被释放，例如这种情况：
      let btn = document.querySelector('button')
      let child = document.querySelector('.child')
      let root = document.querySelector('#root')
      
      btn.addEventListener('click', function() {
        root.removeChild(child)
      })
 * 
 *    该代码所做的操作就是点击按钮后移除.child的节点，虽然点击后，该节点确实从dom被移除了，但全局变量child仍对该节点有引用，所以导致该节点的内存一直无法被释放，
 * 
      代码优化：
      let btn = document.querySelector('button')
      btn.addEventListener('click', function() {  
          let child = document.querySelector('.child')
          let root = document.querySelector('#root')

          root.removeChild(child)
      })
 * 
 *    改动很简单，就是将对.child节点的引用移动到了click事件的回调函数中，那么当移除节点并退出回调函数的执行上文后就会自动清除对该节点的引用，
 *    那么自然就不会存在内存泄漏的情况了
 * 
 * 
 * 
 * 5-4 控制台的打印
 *    控制台的打印也会造成内存泄漏吗？
 *    是的，如果浏览器不一直保存着我们打印对象的信息，我们为何能在每次打开控制的Console时看到具体的数据呢？
 * 
 *    来一段测试代码：
      document.querySelector('button').addEventListener('click', function() {
        let obj = new Array(1000000)
        console.log(obj);
      })
 * 
 *    先触发一次垃圾回收清除初始的内存，然后点击三次按钮，即执行了三次点击事件，最后再触发一次垃圾回收。
 *    查看录制结果发现JS Heap曲线成阶梯上升，并且最终保持的高度比初始基准线高很多，
 *    这说明每次执行点击事件创建的很大的数组对象obj都因为console.log被浏览器保存了下来并且无法被回收
 * 
 * 
 * 
 * 5-5 遗忘的定时器
 *    定义了定时器后就再也不去考虑清除定时器了，这样其实也会造成一定的内存泄漏
 * 
      function fn1() {
        let largeObj = new Array(100000)

        setInterval(() => {
            let myObj = largeObj
        }, 1000)
      }

      document.querySelector('button').addEventListener('click', function() {
        fn1()
      })
 * 
 *    这段代码是在点击按钮后执行fn1函数，fn1函数内创建了一个很大的数组对象largeObj，
 *    同时创建了一个setInterval定时器，定时器的回调函数只是简单的引用了一下变量largeObj
 * 
 *    如图：【定时器造成的内存泄漏.gif】
 * 
 *    原因其实就是因为setInterval的回调函数内对变量largeObj有一个引用关系，而定时器一直未被清除，所以变量largeObj的内存也自然不会被释放
 *    【定时器一直未被清除】
 *    
 * 
 *    所以对应的代码改善(假设我们只需要让定时器执行三次就可以了)：
      function fn1() {
        let largeObj = new Array(100000)
        let index = 0

        let timer = setInterval(() => {
            if(index === 3) clearInterval(timer);
            let myObj = largeObj
            index ++
        }, 1000)
      }

      document.querySelector('button').addEventListener('click', function() {
        fn1()
      })
 * 
 */

