/** 
 * https://mp.weixin.qq.com/s/I5fd1eaNj_NF2yZ4Wff2fA
 * 
 * 关于内存泄漏
 */

/**
 * Chrome 浏览器查看内存占用，按照以下步骤操作：

    (1) 在网页上右键, 点击“检查”打开控制台(Mac快捷键option+command+i);
    (2) 选择Performance面板(很多教材中用的是Timeline面板, 不知道是不是版本的原因);
    (3) 勾选Memory, 然后点击左上角的小黑点Record开始录制;
    (4) 点击弹窗中的Stop结束录制, 面板上就会显示这段时间的内存占用情况。

    如果内存的使用情况一直在做增量, 那么就是内存泄露了:
 */ 

/** 
 * Node提供的process.memoryUsage方法
 * 
 * process.memoryUsage返回一个对象，包含了 Node 进程的内存占用信息。该对象包含四个字段，单位是字节，含义如下：
    (1) rss（resident set size）：所有内存占用，包括指令区和堆栈。
    (2) heapTotal："堆"占用的内存，包括用到的和没用到的。
    (3) heapUsed：用到的堆的部分。
    (4) external：V8 引擎内部的 C++ 对象占用的内存。

   判断内存泄露, 是看heapUsed字段
 */

/** 
 * 常见的内存泄露包括：
 * 
 * 意外的全局变量
 * 被遗忘的定时器或回调函数
 * 脱离DOM的引用
 * 闭包中重复创建的变量
 */

/** 
 * 脱离DOM的引用
 * 
 * 把DOM 存成字典（JSON 键值对）或者数组，此时，同样的 DOM 元素存在两个引用：一个在 DOM 树中，另一个在字典中。那么将来需要把两个引用都清除。
 */
// 在对象中引用DOM
var elements = {
    btn: document.getElementById('btn')
}

function doSomeThing () {
    elements.btn.click();
}

function removeBtn () {
    // 将body中的btn移除, 也就是移除 DOM树中的btn
    document.body.removeChild(document.getElementById('button'));
    // 但是此时全局变量elements还是保留了对btn的引用, btn还是存在于内存中,不能被GC回收
}

/** 
 * 闭包中重复创建的变量
 */
var globalVar = null; // 全局变量
var fn = function () {
    var originVal = globalVar; // 局部变量
    var unused = function () { // 未使用的函数
        if (originVal) {
            console.log('call')
        }
    }
    globalVar = {
        longStr: new Array(1000000).join('*'),
        someThing: function () {
            console.log('someThing')
        }
    }
}
setInterval(fn, 100);


/** 
 * 避免内存泄露
 * 
 * (1) 注意程序逻辑，避免“死循环”之类的
 * (2) 减少不必要的全局变量，或者生命周期较长的对象，及时对无用的数据进行垃圾回收
 * (3) 避免创建过多的对象 原则：不用了的东西要及时归还
 */

