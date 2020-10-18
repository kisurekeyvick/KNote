/**
 * TS 中的基础类型
 * 
 * boolean
 * number
 * string
 * array
 * tuple
 * enum
 * void
 * null & undefined
 * any & unknown
 * never
 */

/**
 * 1.any 和 unknown 的区别
 * 
 * any: 任意类型
 * unknown: 未知的类型
 */


/**
 * 2.enum 和 const 的区别
 * 
 * 他们两者的相同点，都是定义数据，且定义的数据不可更改
 * 区别：enum是定义数据，const是赋值数据
 */

/** 
 * 3.交叉类型(也就是 共同的意思)
 * 
 * 这个和extends功能上相差不大，但是extends如果是类的话需要调用父函数构造函数
 * 大致使用如下：
 */
interface UserApi {
    getOrderList():void
}

// extends方式
interface AppApi extends UserApi {
    getUserList():void
}

const appApi: AppApi={
    getOrderList(){},
    getUserList(){}
}

// 交叉类型
const appApi_two: AppApi & UserApi={
    getOrderList(){},
    getUserList(){}
}
