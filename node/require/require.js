function KoalaModule(id = '') {
  // 这个id其实就是我们require的路径
  this.id = id;       
  // path是Node.js内置模块，用它来获取传入参数对应的文件夹路径
  this.path = path.dirname(id);     
  // 导出的东西放这里，初始化为空对象
  this.exports = {};        
  // 模块对应的文件名
  this.filename = null;     
  // loaded用来标识当前模块是否已经加载
  this.loaded = false;      
}

//创建一个空的缓存对象
KoalaModule._cache = Object.create(null);
// 创建一个空的扩展点名类型函数对象(后面会知道用来做什么)
KoalaModule._extensions = Object.create(null);



Module.prototype.require = function(id) {
  return Module._load(id, this, /* isMain */ false);
};


// request是我们传入的路劲参数
KoalaModule._load = function(request) {
  // 路径分析并定位到文件
  const filename = KoalaModule._resolveFilename(request);

  // 判断模块是否加载过(缓存判断)
  const cachedModule = koalaModule._cache[filename];
  if (cachedModule !== undefined) {
    return cachedModule.exports;
  }

  // 去加载 node 原生模块中

  /**
   * 如果缓存不存在，我们需自行加载模块，new 一个 KoalaModule实例
   * 加载完成直接返回module.exports
   */
  const module = new KoalaModule(filename);

  // load加载之前加入缓存，这也是不会造成循环引用问题的原因，但是循环引用，这个缓存里面的exports可能还没有或者不完整
  KoalaModule._cache[filename] = module;

  // module.load 真正的去加载代码
  module.load(filename);

  // 返回模块的module.exports 
  return module.exports;
}



/**
 * 2.路径分析并定位到文件
 * 
 * 找到源码中的 _resolveFilename 函数，这个方法是通过用户传入的require参数来解析到真正的文件地址。
 * 
 * 这个函数源码中比较复杂，因为 require传递过来的值需要一层一层的判断，
 * 同时支持多种参数：内置模块，相对路径，绝对路径，文件夹和第三方模块等等，
 * 如果是文件夹或者第三方模块还要解析里面的 package.json 和 index.js。
 * 
 * 这里简单处理，只实现通过相对路径和绝对路径来查找文件，并支持判断文件js和json后缀名判断
 */
KoalaModule._resolveFilename = function (request) {
  // 获取传入参数对应的绝对路径
  const filename = path.resolve(request);
  // 获取文件后缀名
  const extname = path.extname(request);

  // 如果没有文件后缀名，判断是否可以添加.js和.json
  if (!extname) {
    const exts = Object.keys(KoalaModule._extensions);

    for (let i = 0; i < exts.length; i++) {
      const currentPath = `${filename}${exts[i]}`;

      // 如果拼接后的文件存在，返回拼接的路径
      if (fs.existsSync(currentPath)) {
        return currentPath;
      }
    }
  }

  return filename
}


/**
 * 3.判断模块是否加载过(缓存判断)
 * 
 * 判断这个找到的模块文件是否缓存过，如果缓存过，直接返回 cachedModule.exports, 
 * 这里就会想到一个问题为什么在 Node.js 中模块重复引用也不会又性能问题，因为做了缓存。
 */
const cachedModule = koalaModule._cache[filename];
if (cachedModule !== undefined) {
  return cachedModule.exports;
}


/**
 * 4.去加载 node 原生模块
 * 
 * 如果没有进行缓存过，会调用一个加载原生模块的函数。
 * 比如我们require(net),走完前面的缓存判断就会到达这个 loadNativeModule 函数
 */
const mod = loadNativeModule(filename, request);
if (mod && mod.canBeRequiredByUsers) {
  return mod.exports;
}

function loadNativeModule(filename, request) {
  /**
   * 这里判断下是不是在原生js模块中  ，NativeModule在bootstrap/loader.js中定义
   * 
   * mod 是一个 NativeModule 对象，这个对象很常见，在 node启动一个文件时候也会用到
   */
  const mod = NativeModule.map.get(filename);
  if (mod) {
    debug('load native module %s', request);
    mod.compileForPublicLoader();
    return mod;
  }
}

// mod 的核心函数mod.compileForPublicLoader()
function compileForPublicLoader() {  
  this.compileForInternalLoader();  
  return this.exports;  
}  

function compileForInternalLoader() {  
  if (this.loaded || this.loading) {  
    return this.exports;  
  }  
  // id就是我们要加载的模块，比如net 
  const id = this.id;  
  this.loading = true;  

  try {  
    const fn = compileFunction(id);  
    fn(this.exports, nativeModuleRequire, this, process, internalBinding, primordials);  
    this.loaded = true;  
  } finally {  
    this.loading = false;  
  }  
  return this.exports;  
}

/** 
 * 结论：Node.js 在启动时候直接从内存中读取内容，我们通过 require 加载 net 原生模块时，
 *      通过 NativeModule的compileForInternalLoader，最终会在 _source 中找到对应的源码字符串，
 *      然后编译成一个函数，然后去执行这个函数,执行函数的时候传递 nativeModuleRequire和internalBinding两个函数，
 *      nativeModuleRequire用于加载原生 js 模块，internalBinding用于加载纯C++ 编写的内置模块。
 */


/**
 * 5.创建一个 KoalaModule 实例
 * 
 * 如果不是原生 node 模块，就会当作普通文件模块加载，自己创建一个 KoalaModule 实例，去完成加载。
 */
const module = new KoalaModule(filename);


/**
 * 6.添加缓存
 * 
 * 先进行缓存的添加，然后进行的模块代码的加载，这样就会出现下面的结论：
 * (1) main 加载a，a 在真正加载前先去缓存中占一个位置
 * (2) a 在正式加载时加载了 b
 * (3) b 又去加载了 a，这时候缓存中已经有 a 了，所以直接返回 a.exports，这时候 exports 很有可能是不完整的内容。
 */



/**
 * 7.module.load 真正的去加载代码
 * 
 * 
 */


