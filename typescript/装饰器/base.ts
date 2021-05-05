/**
 * https://mp.weixin.qq.com/s/iQqQCn4zk1YZXgGInlgMqQ
 * 
 * Nodejs 奇技淫巧 - 基础知识
 */

/**
 * (1) 装饰器
 * 
 * TypeScript 中，装饰器（Decorators）是一种特殊类型的声明，它能够被附加到类声明、方法、访问符、属性或参数上。
 * 装饰器为我们在类的声明及成员上通过「元编程语法」添加标注提供了一种方式。
 * 
 * 需要记住这几点：
 * - 装饰器是一个声明（表达式）
 * - 该表达式被执行后，「返回一个函数」
 * - 函数的入参分别为 target、name 和 descriptor
 * - 执行该函数后，可能返回 descriptor 对象，用于配置 target 对象
 */
// 装饰器使用 @expression这种形式，expression求值后必须为一个函数，它会在运行时被调用，被装饰的声明信息做为参数传入。
/**
 * 例如，有一个@f装饰器，我们会这样定义f函数
 */
 function f() {
  return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("f(): called");
  }
}

/**
 * (2) 装饰器分类
 * 
 * 类装饰器（Class decorators）
 * 属性装饰器（Property decorators）
 * 方法装饰器（Method decorators）
 * 参数装饰器（Parameter decorators）
 */

/**
 * (3) 示例代码
 */
 function MyDecorators(target: Function): void {
  target.prototype.say = function (): void {
    console.log("Hello 前端自习课!");
  };
}

@MyDecorators
class SayClass {
  constructor() {}
  say(){console.log("Hello Leo")}
}

let leo = new SayClass();
leo.say();  // Hello 前端自习课!

/**
 * ts编译后的代码如下：
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function MyDecorators(target) {
  target.prototype.say = function () {
      console.log("Hello 前端自习课!");
  };
}
var LeoClass = /** @class */ (function () {
  function LeoClass() {
  }
  LeoClass.prototype.say = function () { console.log("Hello Leo"); };
  LeoClass = __decorate([
      MyDecorators
  ], LeoClass);
  return LeoClass;
}());
var leo = new LeoClass();
leo.say();

/**
 * 其中 __decorate 就是装饰器
 * 
 * 从编译后 JS 代码中可以看出，「装饰器是在模块导入时便执行的」。如下：
    LeoClass = __decorate([
        MyDecorators
    ], LeoClass);
 */



/**
 * (2) reflect
 * 
 * 什么是 Reflect?
 * Reflect（即反射）是 ES6 新增的一个「内置对象」，它提供用来「拦截和操作」 JavaScript 对象的 API。
 * 并且 「Reflect 的所有属性和方法都是静态的」，就像 Math 对象（ Math.random() 等）。
 * 
 * 
 * 为什么出现 Reflect?
 * 其核心目的，是为了保持 JS 的简单
 */
 const s = Symbol('foo');
 const k = 'bar';
 const o = { [s]: 1, [k]: 1 };
 
 // 没有使用 Reflect
 const keys = Object.getOwnPropertyNames(o).concat(Object.getOwnPropertySymbols(o));  // ["bar", Symbol(foo)]
 
 // 使用 Reflect
 Reflect.ownKeys(o);  // ["bar", Symbol(foo)]








