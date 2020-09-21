/** 
 * https://www.jianshu.com/p/55039f5136cb
 * 
 * event.dataTransfer
 * 
 * 在进行拖放操作的时候，dataTransfer对象可以用来保存被拖动的数据。它可以保存一项或多项数据、一种或多数数据类型。
 * 
 * 在所有的拖放事件中都提供了一个数据传输对象dataTransfer，主要是用于在源对象和目标对象之间传递数据
 */

/** api 方法 */ 

/** 
 * 知识点1：setData(format, data) 设置拖拽事件中要传递的数据
 * 
 * format：数据类型 
 *    text/plain
 *    text/html
 *    text/xml
 *    text/uri-list
 *    当然，我们也可以自己定义数据类型
 * 
 * data：要存入的数据
 *    例如：event.dataTransfer.setData('text/plain', 'hello world')
 */

/** 
 * 知识点2：getData(format) 获得拖拽事件中传递的数据
 * 
 * format：数据类型
 * 该方法从dataTransfer对象中读取数据，参数为在setData方法中指定的数据类型，
 *    例如：event.dataTransfer.getData('text/plain')
 */

/** 
 * 知识点3：clearData()
 * 
 * 该方法清空dataTransfer对象中存储的数据，参数可选，为数据类型。若为空，则清空所有数据。
 */
