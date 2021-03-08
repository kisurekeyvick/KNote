/**
 * (1) 逗号运算符
 * 
 * , 是用于分隔表达式并返回链中最后一个表达式的运算符
 */
let oo = (1, 2, 3)
console.log(oo)

// 这里有三个主要表达式 1 、 2 和 3。所有这些表达式均被求值，最后一个赋给 oo


/**
 * (2) Array 构造函数
 */
// 这两个表达的是一个意思
var arr = new Array(1, 2, 3)
var arr = [1, 2, 3]

// 但使用 new Array() 有一个问题
var a = new Array(10);
a[0] // 返回 undefined
a.length // 返回 10

// 当你仅给 Array 构造函数一个整数（大于等于 0 的整数，否则将会报错）时，才会发生这种情况。这是为什么喃？
/** 
 * 其实，新的 Array 构造函数正在从某些编程语言中提取思想，在这些语言中，你需要为数组指定内存，
 * 这样就不会出现 ArrayIndexOutOfBounds 异常。
 * 
    int *a = (int *) malloc( 10*sizeof(int) ); // ya ol' c
    int *a = new int[10]; // c++
    int[] a = new int[10]; // java  
 *
 * 而在js中是不存在sizeof函数的，所以我们可以使用toString来证明数组的长度
 */
a.toString() // 返回 ",,,,,,,,," 它相当于 [,,,,,,,,,]
a // [empty × 10]

// 所以，当将一个参数传递给的 new Array，将导致 JS 引擎为传递的参数大小的数组分配空间。


/**
 * (3) 数组解构
 * 
 * 我们可以使用索引号来提取元素。索引是定义数组中元素位置的属性
 */
const numberArr = [1, 2, 3]
const { 0: firstA, 1: secA, 2: thirdA  } = numberArr


/**
 * (4) 使用 length 属性减少数组内容
 * 
 * 减小 length 属性值，会使 JS 引擎将数组元素个数减少到与 length 属性的值相等
 */
const numberArr_1 = [1, 2, 3]
numberArr_1.length // 3
numberArr_1.length = 1
numberArr_1 // [1]

// 如果增加 length 属性，则 JS 引擎将添加元素（未定义的元素）以使数组中的元素数量达到 length 属性的值
numberArr_1.length = 5
numberArr_1 // [1, empty × 4]

 
/**
 * (5) 跳过 ()
 * 
 * 实例化对象时可以跳过方括号 ()
 */
class D {
    logger() {
        console.log("D")
    }
}
// 一般情况下，我们这么做：
(new D()).logger(); // D

// 其实，我们可以跳过 ():   并且它可以正常运行
(new D).logger(); // D


/**
 * (6) void
 * 
 * void 是 JS 中的关键字，用于评估语句并返回未定义
 */
class E {
    logger() {
        return 89
    }
 }
 
const e = new E
console.log(void e.logger()) // undefined
// logger 方法应该返回 89 ，但是 void 关键字将使其无效并返回 undefined


/**
 * (7) 通过 `proto` 继承
 * 
 * _proto_ 是从 JavaScript 中的对象继承属性的方法。_proto_是Object.prototype 的访问器属性，它公开访问对象的 [[Prototype]]。
 * 此 __proto__ 将其 [[Prototype]] 中设置的对象的所有属性设置为目标对象。
 */
const l = console.log
const obj = {
    method: function() {
        l("method in obj")
    }
}
const obj2 = {}
obj2.__proto__ = obj
obj2.method() // method in obj


/**
 * (8) 一元运算符 +
 */
+"23" // 23
+{} // NaN
+null // 0
+undefined // NaN
+{ valueOf: () => 67 } // 67
+"nnamdi45" // NaN


/**
 * (9) 一元运算符 -
 * 
 * 一元运算符 - 将其操作数转换为 Number 类型，然后取反
 */
// -"26" // -23
// -{} // NaN
// -null // -0
// -undefined // NaN
// -{ valueOf: () => 67 } // -67
// -"nnamdi45" // NaN


/**
 * (10) 指数运算符 **
 * 
 * 该运算符用于指定数字的指数
 */
// 在数学中， 2 的 3 次方意味着将 2 乘以 3 次：
2 * 2 * 2
// 也可以表示为
2 ** 3 // 8





