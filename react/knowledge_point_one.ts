/**
 * https://mp.weixin.qq.com/s/4JgzJ1zHv8M8447t9nHfpA
 */

/**
 * (1) 为什么要引入 React
 * 
 * 如果你把 import React from ‘react’ 删掉，会报错
 */
import React from 'react'

function A() {
  // ...other code
  return <h1>前端桃园</h1>
}

/** 
 * 引入react是因为jsx需要经过bable转化为React.createElement(component, props, ...children)
 */
function A_bable() {
    // ...other code
    return React.createElement("h1", null, "前端桃园");
}

/** 
 * (2) 为什么要用 className 而不用 class
 * 
 * - React 一开始的理念是想与浏览器的 DOM API 保持一直而不是 HTML，因为 JSX 是 JS 的扩展，而不是用来代替 HTML 的，这样会和元素的创建更为接近。
 * - 解构问题，当你在解构属性的时候，如果分配一个 class 变量会出问题
        const { class } = { class: 'foo' } // Uncaught SyntaxError: Unexpected token }
        const { className } = { className: 'foo' } 
        const { class: className } = { class: 'foo' } 
 * 
 */

/**
 * (3) 为什么属性要用小驼峰
 * 
 * 因为 JSX 语法上更接近 JavaScript 而不是 HTML，所以 React DOM 使用 camelCase（小驼峰命名）来定义属性的名称，而不使用 HTML 属性名称的命名约定。
 */ 
 
/**
 * (4) 为什么 constructor 里要调用 super 和传递 props
 * 
 * - 为什么要调用 super?
 * 其实这不是 React 的限制，这是 JavaScript 的限制，在构造函数里如果要调用 this，那么提前就要调用 super，在 React 里，
 * 我们常常会在构造函数里初始化 state，this.state = xxx ，所以需要调用 super。
 * 
 * - 为什么要传递 props?
    class Component {
        constructor(props) {
            this.props = props;
            // ...
        }
    }
 * 
 * 不过，如果你不小心漏传了 props，直接调用了 super()，你仍然可以在 render 和其他方法中访问 this.props。
 * 为啥这样也行？因为React 会在构造函数被调用之后，会把 props 赋值给刚刚创建的实例对象
    const instance = new YourComponent(props);
    instance.props = props;
 * 
 * 
 * - 但这意味着你在使用 React 时，可以用 super() 代替 super(props) 了么？
 * 不行的，虽然 React 会在构造函数运行之后，为 this.props 赋值，但在 super() 调用之后与构造函数结束之前， this.props 仍然是没法用的。
 * 
    // Inside your code
    class Button extends React.Component {
        constructor(props) {
            super(); // 😬 忘了传入 props
            console.log(props); // ✅ {}
            console.log(this.props); // 😬 undefined
        }
        // ...
    }
 */
class Clock extends React.Component {
    constructor(props) {
      super(props);
      this.state = {date: new Date()};
    }
  
    render() {
      return (
        <div>
          <h1>Hello, world!</h1>
          <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
        </div>
      );
    }
}

/**
 * (5) 为什么组件用大写开头?
 * 
 * JSX 是 React.createElement(component, props, …children) 提供的语法糖，component 的类型是：string/ReactClass type
 * 
 * - string类型
 *  <div></div>
 *  转换为js的时候就变成了：React.createElement("div", null)
 * 
 * - ReactClass type类型
    function MyDiv() {
        return (<div><div>)
    }
    <MyDiv></MyDiv>

    // 转换为js的时候就变成了
    function MyDiv() {
        return React.createElement("div", null);
    }

    React.createElement(MyDiv, null);

    // 如果将MyDiv中的首字母小写
    function myDiv() {
        return (<div><div>)
    }
    <myDiv></myDiv>

    // 小写的转化：
    function MyDiv() {
        return React.createElement("div", null);
    }

    React.createElement("myDiv", null);
 * 
 */

/** 
 * (6) 为什么调用方法要 bind this？
 * 
 * jsx 实际上是 React.createElement(component, props, …children) 函数提供的语法糖，那么这段 jsx 代码：
    <button onClick={this.handleClick}>
        Click me
    </button>

    会被转化为：

    React.createElement("button", {
        onClick: this.handleClick
    }, "Click me")

    了解了上面的，然后简单的理解 react 如何处理事件的，React 在组件加载(mount)和更新(update)时，
    将事件通过 addEventListener  统一注册到 document 上，然后会有一个事件池存储了所有的事件，当事件触发的时候，通过 dispatchEvent 进行事件分发。
    所以你可以简单的理解为，最终 this.handleClick 会作为一个回调函数调用。
 */ 

/**
 * (7) 为什么React没有自动的把 bind 集成到 render 方法中呢?
 * 
 * 因为 render 多次调用每次都要 bind 会影响性能，所以官方建议你自己在 constructor 中手动 bind 达到性能优化
 */
class Foo {
    sayThis () {
         console.log(this); // 这里的 `this` 指向谁？
     }

     exec (cb) {
         cb().bind(this);
     }

    render () {
         this.exec(this.sayThis);
  }
}

var foo = new Foo();
foo.render();

/**
 * (8) 四种绑定事件处理对比
 * 
 * - 直接 bind this 型
    <button onClick={this.handleClick.bind(this)}>
        Click me
    </button>

    性能不太好，这种方式跟 react 内部帮你 bind 一样的，每次 render 都会进行 bind，而且如果有两个元素的事件处理函数式同一个，
    也还是要进行 bind，这样会多写点代码，而且进行两次 bind，性能不是太好
 * 
 * - constuctor 手动 bind 型
    constuctor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }

    相比于第一种性能更好，因为构造函数只执行一次，那么只会 bind 一次，而且如果有多个元素都需要调用这个函数，也不需要重复 bind，基本上解决了第一种的两个缺点。
 * 
 * - 箭头函数型
    <button onClick={(e) => this.handleClick(e)}>
        Click me
    </button>

    每次 render 都会重复创建函数，性能会差一点。
 */
 