/** 
 * 泛型
 */

/** 
 * 借助typeof获取函数类型
 */
function helloKisure(a: number): number[] {
    return [a];
}

type helloKisureFunc = typeof helloKisure;

/** 
 * keyof 和 typeof 的联合使用
 */
const me = {
    name: 'kisure',
    age: 1
};

type Person = typeof me;
type PersonProperty = keyof Person;
let personProperty: PersonProperty = 'name';

/** 
 * 泛型class
 */
interface IClass<T> {
    value: T;
    getValue: () => T;
}

class InnerClass<T> implements IClass<T> {
    value: T;

    getValue(): T {
        return this.value; 
    }
}
