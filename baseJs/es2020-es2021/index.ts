/**
 * https://mp.weixin.qq.com/s/JcaQ3GxHlH0lnAwuNJ2czg
 */

/**
 * 逗号运算符
 * 
 * 逗号也可以是运算符
 * 如下函数：将数组的第一项和第二项调换，并返回两项之和
 */ 
function reverse(arr) {
  return [arr[0], arr[1]]=[arr[1], arr[0]], arr[0] + arr[1]
}

const list = [1, 2]

reverse(list) //返回 3，此时 list 为[2, 1]
/**
 * 逗号操作符对它的每个操作数求值（从左到右），并返回最后一个操作数的值
 * expr1, expr2, expr3...
 * 会返回最后一个表达式 expr3 的结果，其他的表达式只会进行求值。
 */


/**
 * 零合并操作符 ??
 * 
 * 零合并操作符 ?? 是一个逻辑操作符，当左侧的操作数为 null 或者 undefined 时，返回右侧操作数，否则返回左侧操作数。
 * 
 * expr1 ?? expr2
 * 
 * 空值合并操作符一般用来为常量提供默认值，保证常量不为 null 或者 undefined，以前一般使用 || 来做这件事 variable = variable || 'bar'。
 * 然而，由于 || 是一个布尔逻辑运算符，左侧的操作数会被强制转换成布尔值用于求值。
 * 任何假值（0， ''， NaN， null， undefined）都不会被返回。
 * 这导致如果你使用 0、''、NaN 作为有效值，就会出现不可预料的后果。
 * 
 * 正因为 || 存在这样的问题，而 ?? 的出现就是解决了这些问题，?? 只会在左侧为 undefined、null 时才返回后者，
 * ?? 可以理解为是 || 的完善解决方案。
 */

// 使用代码感受一下
undefined || 'default'// 'default'
null || 'default'// 'default'
false || 'default'// 'default'
0 || 'default'// 'default'

undefined ?? 'default'// 'default'
null ?? 'default'// 'default'
false ?? 'default'// 'false'
0 ?? 'default'// 0

// 另外在赋值的时候，可以运用赋值运算符的简写 ??=
const a = {b: null, c: 10}
a.b ??= 20
a.c ??= 20
console.log(a)     // 输出 { b: 20, c: 10 }


/**
 * 可选链操作符 ?.
 * 
 * 可选链操作符 ?. 允许读取位于连接对象链深处的属性的值，而不必验证链中的每个引用是否有效。
 * ?. 操作符的功能类似于 . 链式操作符，不同之处在于，
 * 在引用为 null 或者 undefined 的情况下不会引起错误，该表达式短路返回值是 undefined。
 */
// 当尝试访问可能不存在的对象属性时，可选链操作符将会使表达式更短、更简明。
const obj: { [key: string]: any } = {
  a: 'foo',
  b: {
    c: 'bar'
  }
}

console.log(obj.b?.c)      // 输出 bar
console.log(obj.d?.c)      // 输出 undefined
console.log(obj.func?.())  // 不报错，输出 undefined

/**
 * 可选链除了可以用在获取对象的属性，还可以用在数组的索引 arr?.[index]，
 * 也可以用在函数的判断 func?.(args)，当尝试调用一个可能不存在的方法时也可以使用可选链。
 */
const someInterface: { [key: string]: any } = {}
const result = someInterface.customFunc?.()


/**
 * 私有方法/属性
 * 
 * 在一个类里面可以给属性前面增加 # 私有标记的方式来标记为私有，除了属性可以被标记为私有外，
 * getter/setter 也可以标记为私有，
 * 方法也可以标为私有。
 */
class Person {
  getDesc(){ 
    return this.#name +' '+ this.#getAge()
  }
  
  #getAge(){ return this.#age } // 私有方法

  get #name(){ return'foo' } // 私有访问器
  #age = 23// 私有属性
}


/**
 * void 运算符
 * 
 * void 运算符 对给定的表达式进行求值，然后返回 undefined
 * 
 * 可以用来给在使用立即调用的函数表达式（IIFE）时，可以利用 void 运算符让 JS 引擎把一个 function 关键字识别成函数表达式而不是函数声明。
 */

// 报错，因为JS引擎把IIFE识别为了函数声明
function iife() { console.log('foo') }()

// 正常调用
void function iife() { console.log('foo') }()

/**
 * 还可以用在箭头函数中避免传值泄漏，箭头函数，允许在函数体不使用括号来直接返回值。这个特性给用户带来了很多便利，
 * 但有时候也带来了不必要的麻烦，如果右侧调用了一个原本没有返回值的函数，其返回值改变后，会导致非预期的副作用。
 */
/**
 * 特别是给一个事件或者回调函数传一个函数时
 * 
 * 安全起见，当不希望函数返回值是除了空值以外其他值，应该使用 void 来确保返回 undefined，
 * 这样，当 customMethod 返回值发生改变时，也不会影响箭头函数的行为。
 */
const func = () =>void customMethod()

