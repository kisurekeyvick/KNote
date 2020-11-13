/**
 * https://1991421.cn/2020/01/30/9b18a5df/
 * https://blog.csdn.net/weixin_30466039/article/details/94860917
 * 
 * TypeScript中implements与extends的区别
 */

/**
 * implements
 * (1)顾名思义，实现，一个新的类，从父类或者接口实现所有的属性和方法，同时可以重写属性和方法，包含一些新的功能
 * (2)
 * 
 * extends
 * (1)顾名思义，继承，一个新的接口或者类，从父类或者接口继承所有的属性和方法，不可以重写属性，但可以重写方法
 */

/**
 * https://www.softwhy.com/article-10006-1.html
 * 
 * TypeScript abstract 抽象类
 * (1) 抽象类中的抽象方法不包含具体实现并且必须在派生类中实现。 
 * (2) 抽象方法的语法与接口方法相似，两者都是定义方法签名但不包含方法体。 
 * (3) 然而，抽象方法必须包含 abstract关键字并且可以包含访问修饰符。
 */
abstract class A {
  abstract m(): void;
  run(): void {};
}

class B extends A{
  m() {
    /** 抽象类中的抽象方法不包含具体实现并且必须在派生类中实现 */
  }
}

class C implements A {
  /** implementsA以后，class C需要实现所有的属性和方法 */
  m(): void { }
  run() {}
}
 
/**
 * class和abstract class
 * 
 * abstract class不能被实例化，class是可以被实例化
 */

/**
 * interface和abstract class
 * 
 * 两者都不能被实例化，但是abstract class 也可以被赋值给变量
 * interface 里面不能有方法的实现，abstract class 可以提供部分的方法实现，这些方法可以被子类调用。
 */


 