/**
 * https://mp.weixin.qq.com/s/aSo8kcyRgRAfPtVLvMHhFA
 * 
 * TypeScript进阶之工具类型&高级类型
 */

// 一个用户接口
interface User {
    name: string;
    avatar: string;
    country: string;
    friend: {
        name: string
        sex: string
    }
}

// 现在业务要求 User 接口里的成员都变为可选
type IIPartial<T> = {[K in keyof T]?: T[K]}
type IIPartialUser = IIPartial<User>

// IPartialUser等同于如下
type IIIPartialUser = {
    name?: string | undefined;
    avatar?: string | undefined;
    country?: string | undefined;
    friend?: {
      name: string;
      sex: string;
    } | undefined;
}

// 如需要将对象成员内的成员也添加可选修饰符，可以使用 Partial 递归来解决
type partial<T> = {
    [K in keyof T]?: T[K] extends object ? partial<T[K]> : T[K]
}

// 关键字  TypeScript 中的一些关键字对于编写工具类型必不可缺

/**
 * keyof
 * 
 * 「keyof T」 。返回联合类型，为 T 的所有 key
 */
interface User{
    name: string
    age: number
}
  
type Man = { 
    name:string, 
    height: 180
}

type ManKeys = keyof Man // "name" | "height"
type UserKeys = keyof User // "name" | "age"

/**
 * typeof
 * 
 * 「typeof T」 。返回 T 的成员的类型
 */
let arr = ['apple', 'banana', 100]
let man = {
    name: 'Jeo',
    age: 20,
    height: 180
}

type IArr = typeof arr // (string | number)[]
type IMan = typeof man // {name: string; age: number; height: number;}

/**
 * infer
 * 
 * infer 声明，它会引入一个待推断的类型变量。这个推断的类型变量可以在有条件类型的 true 分支中被引用
 */
/**
 * (...args: any[]) => infer R 和 Function 类型的作用是差不多的，这样写只是为了能够在过程中拿到函数的返回值类型。
 * infer 在这里相当于把返回值类型声明成一个类型变量，提供给后面的过程使用。
 */
type IIReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

/**
 * 交叉类型
 * 
 * 「A & B」 ，交叉类型可以把多个类型合并成一个新类型，新类型将拥有所有类型的成员
 */
interface Shape {
    size: string
    color: string
}

interface Brand {
    name: string
    price: number
}

let clothes: Shape & Brand = {
    name: 'Uniqlo',
    color: 'blue',
    size: 'XL',
    price: 200
}

/**
 * 联合类型
 * 
 * 「typeA | typeB」 ，联合类型是包含多种类型的类型，被绑定联合类型的成员只需满足其中一种类型
 */
function pushItem(item:string|number){
    let array:Array<string|number> = ['apple','banana','cherry']
    array.push(item)
}

pushItem(10) // ok
pushItem('durian') // ok

/**
 * 字面量类型
 * 
 * 字⾯量类型主要分为 真值字⾯量类型，数字字⾯量类型，枚举字⾯量类型，⼤整数字⾯量类型、字符串字⾯量类型
 */
const a: 2333 = 2333 // ok
const b: 0b10 = 2 // ok
const c: 0x514 = 0x514 // ok
const d: 'apple' = 'apple' // ok
const e: true = true // ok
const f: 'apple' = 'banana' // 不能将类型“"banana"”分配给类型“"apple"”

// 字符串字面量类型允许指定的字符串作为类型，level 表示的就是一个字符串 coder 的类型，被绑定这个类型的变量，它的值只能是 coder 。


/**
 * 索引类型
 * 
 * 「T[K]」 ，使用索引类型，编译器就能够检查使用动态属性名的代码
 * 在 TypeScript 中，这一切被抽象化，变成通过索引获取类型。就像 person[name] 被抽象成类型 Person[name]
 */
interface IPerson {
    name: string;
    age: number;
}

let person: IPerson = {
    name: 'Jeo',
    age: 20
}

let k_name = person['name'] // 'Jeo'
type str = IPerson['name'] // string

function getProperty<T, K extends keyof T>(o: T, name: K): T[K] {
    return o[name]; // o[name] is of type T[K]
}

// getProperty 里的 o: T 和 name: K ，意味着 o[name]: T[K]
let name_1: string = getProperty(person, 'name');
let age_1: number = getProperty(person, 'age');

type IUnion = IPerson[keyof IPerson]    // string | number


/**
 * 映射类型
 * 
 * 「[K in Keys]」
 * TypeScript 提供了从旧类型中创建新类型的一种方式 。在映射类型里，新类型以相同的形式去转换旧类型里每个属性。
 * 根据 Keys 来创建类型， Keys 有效值为 string | number | symbol 或 联合类型。
 */
type IIKeys = 'name' | 'like'
type IUser = {
  [K in IIKeys]: string
}

// 等同于
type IIUser = {
    name: string
    like: string
}

// 需要注意的是这个语法描述的是类型而非成员。若想添加额外的成员，需使用交叉类型
// 这样使用
type IReadonlyWithNewMember<T> = {
    readonly [P in keyof T]: T[P];
} & { newMember: boolean }

// 不要这样使用
// 这会报错！
type IIReadonlyWithNewMember<T> = {
    readonly [P in keyof T]: T[P];
    newMember: boolean;
}

// 在真正应用中，映射类型结合索引访问类型是一个很好的搭配。 
// 即：映射类型[key in IType]/[key in keyof T]  和 索引访问类型 k[T]


/**
 * 条件类型
 * 
 * 「T extends U ? X : Y」 ，若 T 能够赋值给 U ，那么类型是 X ，否则为 Y
 * 条件类型以条件表达式推断类型关系，选择其中一个分支
 */
// 使用映射类型遍历，判断 T[K] 属于 object 类型，则把 T[K] 传入 partial 递归，否则返回类型 T[K]
type IIIPartial<T> = {
    [K in keyof T]?: T[K] extends object ? IIIPartial<T[K]> : T[K]
}



/** 小结 */
interface PersonA{
    name: string
    age: number
    boyfriend: string
    car: {
      type: 'Benz'
    }
}
  
interface PersonB{
    name: string
    age: string
    girlfriend: string
    car: {
      type: 'bicycle'
    }
}

type Filter<T,U> = T extends U ? T : never

type Common<A, B> = {
    [K in Filter<keyof A, keyof B>]: A[K] extends B[K] ? A[K] : A[K]|B[K]
}

type ICommonVal = Common<PersonA, PersonB>


/**
 * Partial
 * 
 * 构造类型 T ，并将它所有的属性设置为可选的。它的返回类型表示输入类型的所有子类型
 */
interface Todo {
    title: string;
    description: string;
}
  
function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
    return { ...todo, ...fieldsToUpdate };
}

const todo1 = {
    title: 'organize desk',
    description: 'clear clutter',
};

const todo2 = updateTodo(todo1, {
    description: 'throw out trash',
});


/**
 * Record<K, T>
 * 
 * 构造一个类型，其属性名的类型为K，属性值的类型为T。这个工具可用来将某个类型的属性映射到另一个类型上
 */
interface PageInfo {
    title: string;
  }
  
type Page = 'home' | 'about' | 'contact';

type IRecord = Record<Page, PageInfo>
  
const x: IRecord = {
    home: { title: '' },
    about: { title: '' },
    contact: { title: '' }
}


/**
 * Pick<T, K>
 * 
 * 从类型T中挑选部分属性K来构造类型
 */
interface Todo {
    title: string;
    description: string;
    completed: boolean;
  }
  
type TodoPreview = Pick<Todo, 'title' | 'completed'>;
  
const todo: TodoPreview = {
    title: 'Clean room',
    completed: false,
};


/**
 * Omit<T, K>
 * 
 * 从类型T中剔除部分属性K来构造类型，与Pick相反
 */
// 这个是内置的
type IOmit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

interface Todo {
    title: string;
    description: string;
    completed: boolean;
}
  
type TIodoPreview = IOmit<Todo, 'title' | 'completed'>;
  
const todo_1: TIodoPreview = {
    description: 'I am description'
};


/**
 * Exclude<T, U>
 * 
 * 从类型T中剔除所有可以赋值给U的属性，然后构造一个类型
 */
type T0 = Exclude<"a" | "b" | "c", "a">;  // "b" | "c"
type T1 = Exclude<"a" | "b" | "c", "a" | "b">;  // "c"
type T2 = Exclude<string | number | (() => void), Function>;  // string | number


/**
 * Extract<T, U>
 * 
 * 从类型T中提取所有可以赋值给U的类型，然后构造一个类型
 */
type T3 = Extract<"a" | "b" | "c", "a" | "f">;  // "a"
type T4 = Extract<string | number | (() => void), Function>;  // () => void


/**
 * NonNullable
 * 
 * 从类型T中剔除null和undefined，然后构造一个类型
 */
type T5 = NonNullable<string | number | undefined>;  // string | number
type T6 = NonNullable<string[] | null | undefined>;  // string[]


/**
 * ReturnType
 * 
 * 由函数类型T的返回值类型构造一个类型
 */
type IT0 = ReturnType<() => string>;  // string
type IT1 = ReturnType<(s: string) => void>;  // void
type IT2 = ReturnType<(<T>() => T)>;  // {}
type IT3 = ReturnType<(<T extends U, U extends number[]>() => T)>;  // number[]
type IT5 = ReturnType<any>;  // any
type IT6 = ReturnType<never>;  // any
type IT7 = ReturnType<string>;  // Error
type IT8 = ReturnType<Function>;  // Error


/**
 * 需要注意的是 T extends U,说明T是子类，U是父类，T的属性可能多余U的
 */

