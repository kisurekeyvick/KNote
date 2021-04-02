/**
 * https://github.com/Cosen95/blog/issues/52
 * 
 * react 源码 16.13.1 版本
 */
/* 首先来到packages/react-dom/src/client/ReactDOM.js 文件 */
import {
  findDOMNode,
  render,
  hydrate,
  unstable_renderSubtreeIntoContainer,
  unmountComponentAtNode,
} from "./ReactDOMLegacy";

/* 可以看到render、hydrate方法定义在packages/react-dom/src/client/ReactDOMLegacy.js文件中 */


/** 首先来看render方法 */
/**
 * 客户端渲染
 * @param element 表示一个ReactElement对象
 * @param container 需要将组件挂载到页面中的DOM容器
 * @param callback 渲染完成后需要执行的回调函数
 */
 export function render(
  element: React$Element<any>,
  container: Container,
  callback: ?Function
) {
  invariant(
    isValidContainer(container),
    "Target container is not a DOM element."
  );
  if (__DEV__) {
    const isModernRoot =
      isContainerMarkedAsRoot(container) &&
      container._reactRootContainer === undefined;
    if (isModernRoot) {
      console.error(
        "You are calling ReactDOM.render() on a container that was previously " +
          "passed to ReactDOM.createRoot(). This is not supported. " +
          "Did you mean to call root.render(element)?"
      );
    }
  }
  return legacyRenderSubtreeIntoContainer(
    null,
    element,
    container,
    false,
    callback
  );
}


/** 然后是hydrate方法 */
/**
 * 服务端渲染
 * @param element 表示一个ReactNode，可以是一个ReactElement对象
 * @param container 需要将组件挂载到页面中的DOM容器
 * @param callback 渲染完成后需要执行的回调函数
 */
 export function hydrate(
  element: React$Node,
  container: Container,
  callback: ?Function
) {
  invariant(
    isValidContainer(container),
    "Target container is not a DOM element."
  );
  if (__DEV__) {
    const isModernRoot =
      isContainerMarkedAsRoot(container) &&
      container._reactRootContainer === undefined;
    if (isModernRoot) {
      console.error(
        "You are calling ReactDOM.hydrate() on a container that was previously " +
          "passed to ReactDOM.createRoot(). This is not supported. " +
          "Did you mean to call createRoot(container, {hydrate: true}).render(element)?"
      );
    }
  }
  // TODO: throw or warn if we couldn't hydrate?
  return legacyRenderSubtreeIntoContainer(
    null,
    element,
    container,
    true,
    callback
  );
}


/** 可以看到：render方法和hydrate方法在执行legacyRenderSubtreeIntoContainer时，第一个参数的值均为null，第四个参数的值恰好相反。 */
//  packages/react-dom/src/client/ReactDOMLegacy.js
/**
 * 开始构建FiberRoot和RootFiber，之后开始执行更新任务
 *
 * @param {?React$Component<any, any>} parentComponent 父组件，可以把它当成null值来处理
 * @param {ReactNodeList} children ReactDOM.render()或者ReactDOM.hydrate()中的第一个参数，可以理解为根组件
 * @param {Container} container ReactDOM.render()或者ReactDOM.hydrate()中的第二个参数，组件需要挂载的DOM容器
 * @param {boolean} forceHydrate 表示是否融合，用于区分客户端渲染和服务端渲染，render方法传false，hydrate方法传true
 * @param {?Function} callback ReactDOM.render()或者ReactDOM.hydrate()中的第三个参数，组件渲染完成后需要执行的回调函数
 * @returns
 */
 function legacyRenderSubtreeIntoContainer(
  parentComponent: ?React$Component<any, any>,
  children: ReactNodeList,
  container: Container,
  forceHydrate: boolean,
  callback: ?Function
) {
  if (__DEV__) {
    topLevelUpdateWarnings(container);
    warnOnInvalidCallback(callback === undefined ? null : callback, "render");
  }

  // 在第一次执行的时候，container上是肯定没有_reactRootContainer属性的
  // 所以第一次执行时，root肯定为undefined

  // TODO: Without `any` type, Flow says "Property cannot be accessed on any
  // member of intersection type."
  let root: RootType = (container._reactRootContainer: any);
  let fiberRoot;
  if (!root) {
    // Initial mount
    // 首次挂载，进入当前流程控制中，container._reactRootContainer指向一个ReactSyncRoot实例
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
      container,
      forceHydrate
    );
    // root表示一个ReactSyncRoot实例，实例中有一个_internalRoot方法指向一个fiberRoot实例
    fiberRoot = root._internalRoot;
    // callback表示ReactDOM.render()或者ReactDOM.hydrate()中的第三个参数
    // 重写callback，通过fiberRoot去找到其对应的rootFiber，然后将rootFiber的第一个child的stateNode作为callback中的this指向
    if (typeof callback === "function") {
      const originalCallback = callback;
      callback = function () {
        const instance = getPublicRootInstance(fiberRoot);
        originalCallback.call(instance);
      };
    }
    // Initial mount should not be batched.
    // 对于首次挂载来说，更新操作不应该是批量的，所以会先执行unbatchedUpdates方法
    // 该方法中会将executionContext(执行上下文)切换成LegacyUnbatchedContext(非批量上下文)
    // 切换上下文之后再调用updateContainer执行更新操作
    // 执行完updateContainer之后再将executionContext恢复到之前的状态
    unbatchedUpdates(() => {
      updateContainer(children, fiberRoot, parentComponent, callback);
    });
  } else {
    // 不是首次挂载，即container._reactRootContainer上已经存在一个ReactSyncRoot实例
    fiberRoot = root._internalRoot;
    if (typeof callback === "function") {
      const originalCallback = callback;
      callback = function () {
        const instance = getPublicRootInstance(fiberRoot);
        originalCallback.call(instance);
      };
    }
    // Update
    // 对于非首次挂载来说，是不需要再调用unbatchedUpdates方法的
    // 即不再需要将executionContext(执行上下文)切换成LegacyUnbatchedContext(非批量上下文)
    // 而是直接调用updateContainer执行更新操作
    updateContainer(children, fiberRoot, parentComponent, callback);
  }
  return getPublicRootInstance(fiberRoot);
}


