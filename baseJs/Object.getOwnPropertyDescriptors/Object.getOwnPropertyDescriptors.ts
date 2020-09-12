/** 
 * https://blog.csdn.net/qs8lk88/article/details/79024709
 * 
 * Object.getOwnPropertyDescriptors
 */

const obj: any = {
    prop1 : 100,
    prop2 : "字符串属性",
    get bar(){return "bar返回字符串"}
}

console.log(obj.getOwnPropertyDescriptors)

/** 
 * Object.getOwnPropertyDescriptors 方法返回一个对象，所有原来的对象的属性名都是该对象的属性名，对应的属性值就是该属性的描述对象。
 * 
 * (1) 作用：克隆对象
 * 
 * (2) 和Object.assign的区别：Object.assign()接口无法正确拷贝set属性和get属性的对象。
 *                          因为assign做合并的时候，只能拷贝一个属性值，不会把它背后的赋值方法或者取值方法一同拷贝过来
 */

/** 
 * 另一种方法，让getOwnPropertyDescriptors方法配合Object.create方法，来克隆对象
 */

var source: any = {
    prop1 : "prop1",
    prop2 : 100
}

Object.getPrototypeOf
Object.getOwnPropertyDescriptor

// source 是源对象，我们获取source的原型对象和source的属性描述对象，根据二者生成的新对象就是source的克隆
var clone = Object.create(Object.getPrototypeOf(source),Object.getOwnPropertyDescriptors(source));
 
