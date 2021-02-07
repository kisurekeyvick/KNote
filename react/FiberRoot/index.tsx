/**
 * https://juejin.cn/post/6857408790698917901
 * 
 * 渲染流程是jsx => element tree => fiber tree => html dom
 */


/**
 * render
 */
ReactDOM.render(<App />, document.getElementById('root'));

/**
 * 调用render之后，转为fiber tree：
 */
/**
* element : 对应我们传入的ReactElement对象
* container ： 需要将我们的组件挂在到页面的DOM容器
* callback ： 渲染完成后执行的回调
**/
export function render(element: React$Element<any>, container: Container, callback: ?Function) {
  // 注意： 第一个参数为空，第4个参数为false
  return legacyRenderSubtreeIntoContainer(null, element, container, false, callback);
}


/**
 * legacyRenderSubtreeIntoContainer (正式进入渲染流程)
 */
/**
* parentComponent ：父组件，可以传入null
* children ReactDOM.render()或者ReactDOM.hydrate()中的第一个参数，可以理解为根组件。也就是render里的ReactElement对象
* container： 组件需要挂在的容器
* forceHydrate： true 为 服务端渲染，false为客户端渲染，我们研究的是客户端渲染
* callback： 组件渲染完成后需要执行的回调函数，我没有使用过这个参数，大家可以尝试一下
**/
function legacyRenderSubtreeIntoContainer(parentComponent: ?React$Component<any, any>,children: ReactNodeList,container: Container,forceHydrate: boolean,callback: ?Function,) {
  let root: RootType = (container._reactRootContainer: any);
  let fiberRoot;
  // 首次加载，root是不存在的，因此进行首次初始化
  if (!root) {
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(container,forceHydrate,);
    fiberRoot = root._internalRoot;
    // ...移除掉callback和初始化关在流程
  } else {
    fiberRoot = root._internalRoot;
    // 移除掉更新流程
  }
  return getPublicRootInstance(fiberRoot);
}

/**
 * 我们可以看到，首先定义了root,并且指向了container._reactRootContainer，也就是我们的container DOM容器也同样挂在了ReactRoot对象。
 * 还创建了一个fiberRoot。fiberRoot指向了root._internalRoot。
 * _internalRoot 也就是我们的重点fiber对象。
 */
document.getElementById('root')._reactRootContainer 
// 会返回如图的信息：【_reactRootContainer.jpg】


/**
 * legacyCreateRootFromDOMContainer
 * 
 * 首先这里的forceHydrate对于客户端渲染来说，永远都是false。一般在使用render函数时，我们传入的挂载节点是<div id="root"></div>.
 * 可以看出，我们传入的DOM不会有任何子节点。
 * 假如你传入了子节点，那么这个函数也会将你的子节点给清除掉。
 */
/**
* container： 组件需要挂在的容器
* forceHydrate： true 为 服务端渲染，false为客户端渲染，我们研究的是客户端渲染
**/
function legacyCreateRootFromDOMContainer(container: Container, forceHydrate: boolean): RootType {
  const shouldHydrate = forceHydrate || shouldHydrateDueToLegacyHeuristic(container);
  // 清除任何存在的子节点
  if (!shouldHydrate) {
    let rootSibling;
    while ((rootSibling = container.lastChild)) {
      container.removeChild(rootSibling);
    }
  }
  return createLegacyRoot(container, shouldHydrate? {hydrate: true,} : undefined,); // =>   return new ReactDOMBlockingRoot(container, LegacyRoot, options);
}


/**
 * ReactDOMBlockingRoot
 * 
 * 从这里开始，我们要理解FiberRoot和RootFiber这两个概念了
 * 
 * ReactDOMBlockingRoot类创建了一个FiberRoot对象，并将其挂在到 _internalRoot 属性上，
 * 它就是我们上面在legacyRenderSubtreeIntoContainer函数中使用到的 _internalRoot 属性
 */
export type RootTag = 0 | 1 | 2;
export const LegacyRoot = 0; 
export const BlockingRoot = 1;
export const ConcurrentRoot = 2;

/**
* container： 组件需要挂在的容器
* forceHydrate： true 为 服务端渲染，false为客户端渲染，我们研究的是客户端渲染
**/
function createLegacyRoot(container: Container, options?: RootOptions,): RootType {
  return new ReactDOMBlockingRoot(container, LegacyRoot, options);
}

function ReactDOMBlockingRoot( container: Container, tag: RootTag, options: void | RootOptions) {
  this._internalRoot = createRootImpl(container, tag, options);
}


/**
 * createRootImpl
 * 
 * 下面的方法，创建并返回一个fiberRoot。并给容器dom生成一个随机key,挂载current属性对应的rootFiber
 */
/**
* container：组件需要挂在的容器
* tag: fiberRoot节点的标记(LegacyRoot、BatchedRoot、ConcurrentRoot)
* options： hydrate时才有值，否则为undefined
**/
function createRootImpl(container: Container,tag: RootTag,options: void | RootOptions,) {
  //   .....
  // 创建一个fiberRoot
  const root = createContainer(container, tag, hydrate, hydrationCallbacks);
  // 给container附加一个内部属性用于指向fiberRoot的current属性对应的rootFiber节点
  markContainerAsRoot(root.current, container);
  // ....
  return root;
}

const randomKey = Math.random().toString(36).slice(2);
// 将rootFiber绑定到coantainer容器上，key是随机数
const internalContainerInstanceKey = '__reactContainer$' + randomKey;
function markContainerAsRoot(hostRoot: Fiber, node: Container): void {
  node[internalContainerInstanceKey] = hostRoot;
}



/**
 * createContainer/createFiberRoot
 * 
 * 
 */


