/**
 * https://www.zhihu.com/question/361787198/answer/942841740
 * 
 * "ReactRoot"、"FiberRoot"、"RootFiber" 三者之间的关系
 */

/**
 * react内部有两个阶段:render阶段、commit阶段
 * 
 * (1) render阶段
 * 这个render阶段和我们平时理解的浏览器的render不太一样，这个render阶段指的是react从RootFiber开始循环生成fiber树的过程叫render阶段，
 * 这个阶段不涉及浏览器渲染，之前我们老说的concurrentMode的时间分片，也是分的这部分。
 * 
 * react每次的render阶段，都会从FiberRoot往下开始生成一个有着新状态的fiber树，react内部叫workInProgress树。
 * 这棵树上的每个fiber节点，都通过一个current属性连接着保存着它上一个状态的fiber，
 * 保存着上一个状态的fiber对象则通过一个alternate属性连接着本次保存着新状态的fiber。
 * 我们可以查看图：【workInProgress.jpg】
 *  
 * 在本次更新创建workInProgress树的过程中，会和上一次旧状态的workInProgress树做对比，
 * 将所有发生了更新（比如插入，删除，移位等操作）的fiber节点，做成一条链表，挂到RootFiber上。
 * 
 * 但是初次渲染的时候，明显是没有上一次的fiber树的，所以就有了上面截图源码中的那个uninitializedFiber，
 * 也就是说react上来先“假装”有上一次的状态，
 * 之后才根据ReactDOM.render传进来的第一个参数去遍历生成新的workInProgress树。
 * 
 * 
 * (2) commit阶段
 * 这个commit阶段就是真正做dom操作的阶段了。首先会从RootFiber上拿到上一步render阶段生成的那条链表，链表上是所有发生了更新的fiber对象。
 * 
 * 然后commit阶段走了三个循环：
 * - 第一个循环是为了执行getSnapshotBeforeUpdate生命周期
 * - 第二个循环是从链表上拿到每个fiber，然后从fiber上读取真实dom进行更新
 * - 第三个循环是执行didMount之类的生命周期
 * 
 * 
 * 等三个循环都执行完毕后，再让上面图中的FiberRoot的current指向本次新生成的fiber树的RootFiber
 *  如图：【新生成的fiber树.jpg】
 */







