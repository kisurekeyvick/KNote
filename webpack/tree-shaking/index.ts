/** 
 * tree-shaking
 * 
 * https://twindy.org/qian-xi-tree-shakinggong-zuo-yuan-li/
 * https://juejin.cn/post/6844903544756109319#heading-1
 */

/** 
 * 它是什么：是一种通过清除多余代码方式来优化项目打包体积的技术
 * 
 * 为什么需要它： 当前端项目到达一定的规模后，我们一般会采用按模块方式组织代码，这样可以方便代码的组织及维护。
 *              但会存在一个问题，比如我们有一个utils工具类，在另一个模块中导入它。
 *              这会在打包的时候将utils中不必要的代码也打包，从而使得打包体积变大，这时候就需要用到Tree shaking技术了。
 */

/** 
 * tree shaking 如何工作的呢?
 * 
 * 前提：
 *      ES6的import语法完美可以使用tree shaking，因为可以在代码不运行的情况下就能分析出不需要的代码
 * 
 *      tree shaking只能在静态modules下工作。ECMAScript 6 模块加载是静态的,因此整个依赖树可以被静态地推导出解析语法树。
 *      所以在ES6中使用tree shaking是非常容易的。
 *      而且，tree shaking不仅支持import/export级别，而且也支持statement(声明)级别。
 * 
 * 
 */

/**
 * CommonJS的动态特性模块意味着tree shaking不适用。因为它是不可能确定哪些模块实际运行之前是需要的或者是不需要的。
 * 
 * 在ES6以前，我们可以使用CommonJS引入模块：require()，这种引入是动态的，
 * 也意味着我们可以基于条件来导入需要的代码：
 */ 
let myDynamicModule;
const condition = Math.random() > 0.5
// 动态导入
if(condition) {
    myDynamicModule = require("foo");
} else {
    myDynamicModule = require("bar");
}


/** 
 * 如何使用Tree shaking?
 * 
 * 从webpack 2开始支持实现了Tree shaking特性，webpack 2正式版本内置支持ES2015 模块（也叫做harmony模块）和未引用模块检测能力。
 * 
 * 新的webpack 4 正式版本，扩展了这个检测能力，通过package.json的 sideEffects属性作为标记，向compiler 提供提示，
 * 表明项目中的哪些文件是 “pure(纯的 ES2015 模块)”，由此可以安全地删除文件中未使用的部分。
 */

// webpack4,只需要将mode设置为production即可开启tree shaking。
entry: './src/index.js',
mode: 'production', // 设置为production模式
output: {
	path: path.resolve(__dirname, 'dist'),
	filename: 'bundle.js'
}

// 使用webpack2,可能你会发现tree shaking不起作用。因为babel会将代码编译成CommonJs模块，而tree shaking不支持CommonJs。所以需要配置不转义：
options: { presets: [ [ 'es2015', { modules: false } ] ] }


/**
 * 关于side effects
 * 
 * side effects是指那些当import的时候会执行一些动作，但是不一定会有任何export。
 * 比如 ployfill, ployfills 不对外暴露方法给主程序使用。
 * 
 * tree shaking 不能自动的识别哪些代码属于side effects，因此手动指定这些代码显得非常重要，
 * 如果不指定可能会出现一些意想不到的问题。
 * 
 * 在webapck中，是通过package.json的sideEffects属性来实现的。
 * sideEffects设置为false，用来告诉 webpack，项目中都是 ”pure“(纯正 ES6 模块)，可以安全地删除未用到的 export。
 * 
 */
{
  'name': 'tree-shaking',
  'sideEffects': false
}

// 如果我们想要告诉 webpack 有些文件有副作用，不能 shaking 掉的，我们可以指定一个数组，例如：
{
  "name": "your-project",
  "sideEffects": [
    "./src/some-side-effectful-file.js"
  ]
}

/** 
 * tree-shaking原理
 * 
 * Tree-shaking的本质是消除无用的js代码。Tree-shaking 是 DCE 的一种新的实现。（
 *    Javascript同传统的编程语言不同的是，javascript绝大多数情况需要通过网络进行加载，
 *    然后执行，加载的文件大小越小，整体执行时间更短，所以去除无用代码以减少文件体积，对javascript来说更有意义。
 * ）
 * 
 * 
 * Dead Code 一般具有以下几个特征：
 * (1) 代码不会被执行，不可到达
 * (2) 代码执行的结果不会被用到
 * (3) 代码只会影响死变量（只写不读）
 * 
 * tree-shaking是由 代码压缩优化工具uglify，uglify完成了javascript的DCE
 * tree-shaking更关注于无用模块的消除，消除那些引用了但并没有被使用的模块
 * 
 * 
 * ES6 module 特点：
 * (1) 只能作为模块顶层的语句出现
 * (2) import 的模块名只能是字符串常量
 * (3) import binding 是 immutable的
 * 
 * ES6模块依赖关系是确定的，和运行时的状态无关，可以进行可靠的静态分析，这就是tree-shaking的基础。
 * 所谓静态分析就是不执行代码，从字面量上对代码进行分析，ES6之前的模块化。
 * 
 * 
 * uglify目前不会跨文件去做DCE
 * rollup只处理函数和顶层的import/export变量，不能把没用到的类的方法消除掉(主要用于函数的消除，但是对于类的消除是不能够的)
 */




/**
 * 如下代码：说明为什么不能消除menu.js
 *    如果删除里menu.js，那对Array的扩展也会被删除，就会影响功能。
 */
// menu.js
function Menu() {
}

Menu.prototype.show = function() {
}

Array.prototype.unique = function() {
    // 将 array 中的重复元素去除
}

export default Menu;


/**
 * 那也许你会问，难道rollup，webpack不能区分是定义Menu的proptotype 还是定义Array的proptotype吗？
 * 当然如果代码写成上面这种形式是可以区分的，如果我写成这样呢？
 */
function Menu() {
}

Menu.prototype.show = function() {
}

var a = 'Arr' + 'ay'
var b
if(a == 'Array') {
    b = Array
} else {
    b = Menu
}

b.prototype.unique = function() {
    // 将 array 中的重复元素去除
}

export default Menu;




/** 
 * 总结：
 * (1) tree shaking 不支持动态导入（如CommonJS的require()语法），只支持纯静态的导入（ES6的import/export）
 * (2) webpack中可以在项目package.json文件中，添加一个 “sideEffects” 属性,手动指定由副作用的脚本
 */
