/**
 * https://juejin.cn/post/6855129007852109837#heading-14
 * 
 * 关于 React.Component 和 React.PureComponen
 * 
 * 这两个函数很类似，在React文件中，该函数很简单，复杂的逻辑全部都在react-dom文件夹中，react-dom其实就是React和UI之间的胶水层，可以兼容多个平台，例如 Web,RN,SSR等。
 */
const emptyObject = {};
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  // 如果组件有字符串refs,后面会分配一个不同的对象。
  this.refs = emptyObject;
  // 我们初始化一个默认的updater,在真正渲染时会注入一个updater
  this.updater = updater || ReactNoopUpdateQueue;
}

Component.prototype.isReactComponent = {};

/**
 * 可以认为this.state是不可变的。可以使用setState来更新state的状态
 * 不能保证`this.state`立即更新，因此调用该方法可能会返回旧值
 * 多次调用setState，不能保证setState的调用是同步进行，因为它们会分批次执行。你可以提供一个可选的callback,改回调会在setState的调用实际完成后执行
 * 
 * 当函数提供给setState,将在后面的某个时刻被调用（不同步），它拥有最新的组件参数（state,props,context）,
 *    因为该函数是在receiveProps 之后，shouldComponentUpdate之前调用，因此还未分配给当前的组件（此时的组件的参数还未更新）
 */
Component.prototype.setState = function(partialState, callback) {
  this.updater.enqueueSetState(this, partialState, callback, 'setState')
}

/**
 * 强制更新，当我们确认组件的某些深层次的数据修改，未调用setState时，我们可以直接调用forceUpdate来更新组件，
 * 该方法不会调用 shouldComponentUpdate,但是会调用componentWillUpdate和componentDidUpdate。
 */
Component.prototype.forceUpdate = function(callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate')
}


/**
 * PureComponent
 * 
 * PureComponent使用了寄生式组合继承，并在自己身上标记了一个isPureReactComponent的标签。
 * 而Componment身上也有一个isReactComponent标签，其实可以看出来，每一个组件都有一个isXXX来表示自己是属于什么组件的。
 */
function ComponentDummy() {}
ComponentDummy.prototype = Component.prototype;
/**
 * 进行了浅层比较的组件
 */
function PureComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}

const pureComponentPrototype = (PureComponent.prototype = new ComponentDummy());
pureComponentPrototype.constructor = PureComponent;
Object.assign(pureComponentPrototype, Component.prototype);
pureComponentPrototype.isPureReactComponent = true;

export {Component, PureComponent};



/**
 * React.createElement
 * 我们可以查看【createElement的流程图.jpg】
 * 
 * 我们的编写react组件时，最终都是通过Bable编译为JSX,而在JSX中调用了React.createElement
 */
function User({name, addField}) {
  return (
      <div>
          <p>{name}</p>
          <Button addField={addField}></Button>
          hello,world
      </div>
  );
}

// 编译为JSX的形态，可以看到最终调用的还是React.createElement方法
function User( { name, addField } ) {
  return React.createElement(
        "div",  
        null, 
        React.createElement("p", { id: "pid" }, name), 
        React.createElement(Button, { addField: addField }), 
        "hello,world"
    );
}

// ReactElement形态， 最终返回的User组件的React节点如图：【react节点图.png】


/**
 * React.createElement 源码分析 - 编译为ReactElement的过程
 */
const RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true,
};
// 跟踪当前的所有者，拥有当前正在被构造的组件
const ReactCurrentOwner = {
  current: (null: null | Fiber), // ReactComponent
};
/*
*创建并返回一个新的ReactElement
*/
export function createElement(type, config, children) {
  let propName;
  // 存储从config中传进来的props参数名称
  const props = {};

  let key = null;
  let ref = null;
  let self = null;
  let source = null;

  if (config != null) {
    // 验证ref
    if (hasValidRef(config)) {
      ref = config.ref;
    }
    // 验证key
    if (hasValidKey(config)) {
      key = '' + config.key;
    }
    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // 出来key,ref,__self,__soource,其余属性保存在props中
    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)
      ) {
        props[propName] = config[propName];
      }
    }
  }

  // 该部分是children的计算与存储，函数参数除了type 和config,就是children节点参数（可以有N个child）。
  const childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    const childArray = Array(childrenLength);
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }
  // 返回ReactElement节点
  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props,
  );
}


/**
 * ReactElement 源码
 */
// self: 临时帮助对象，用于检测调用React.creatElement时的`this`和`owner`不同的地方...在开发环境中使用，因此此处不进行详解
const ReactElement = function(type, key, ref, self, source, owner, props) {
  const element = {
    // 这个标签使我们能够唯一标识为React Element的类型
    ?typeof: REACT_ELEMENT_TYPE,
    // 属于元素的内置属性： 从上面图中打印看出，type是组件的jsx语法，但传入的参数看起来是标签(div，span等)
    type: type,
    key: key,
    ref: ref,
    props: props,
    _owner: owner, // 记录负责创建此元素的组件。当前的操作React
  };
  return element;
}


