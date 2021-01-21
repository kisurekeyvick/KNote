/**
 * https://mp.weixin.qq.com/s/1cP6mT8GVG3PsLCtKlammQ
 * 
 * npm install 流程，如图【npm-install流程.webp】
 */

/**
 * (1) 嵌套结构
 * 
 * 执行 npm install 后，依赖包被安装到了 node_modules ，下面我们来具体了解下，npm 将依赖包安装到 node_modules 的具体机制是什么?
 * 
 * 在 npm 的早期版本， npm 处理依赖的方式简单粗暴，以递归的形式，
 * 严格按照 package.json 结构以及子依赖包的 package.json 结构将依赖安装到他们各自的 node_modules 中。
 * 直到有子依赖包不在依赖其他模块。
 * 
 * 
 * 举个例子，我们的模块 my-app 现在依赖了两个模块：buffer、ignore：
    {
      "name": "my-app",
      "dependencies": {
        "buffer": "^5.4.3",
        "ignore": "^5.1.4",
      }
    }
 * 
 * gnore是一个纯 JS 模块，不依赖任何其他模块，而 buffer 又依赖了下面两个模块：base64-js 、 ieee754
    {
      "name": "buffer",
      "dependencies": {
        "base64-js": "^1.0.2",
        "ieee754": "^1.1.4"
      }
    }
 * 
 * 那么，执行 npm install 后，得到的 node_modules 中模块目录结构就是下面这样的：【node_modules_浅层模块依赖.webp】
 * 
 * 
 * 这样的方式优点很明显， node_modules 的结构和 package.json 结构一一对应，层级结构明显，并且保证了每次安装目录结构都是相同的。
 * 
 * 但是，试想一下，如果你依赖的模块非常之多，你的 node_modules 将非常庞大，嵌套层级非常之深：【node_modules_深层模块依赖.jpg】
 * 这会造成如下问题：
 *    - 在不同层级的依赖中，可能引用了同一个模块，导致大量冗余
 *    - 在 Windows 系统中，文件路径最大长度为260个字符，嵌套层级过深可能导致不可预知的问题。
 */

/**
 * (2) 扁平结构
 * 
 * 为了解决以上问题，NPM 在 3.x 版本做了一次较大更新：
 *    - 安装模块时，不管其是直接依赖还是子依赖的依赖，优先将其安装在 node_modules 根目录。【扁平结构下载模块.png】
 * 
 * 此时我们若在模块中又依赖了 base64-js@1.0.1 版本
    {
      "name": "my-app",
      "dependencies": {
        "buffer": "^5.4.3",
        "ignore": "^5.1.4",
        "base64-js": "1.0.1",
      }
    }
 * 当安装到相同模块时，判断已安装的模块版本是否符合新模块的版本范围，
 *    如果符合则跳过，
 *    不符合则在当前模块的 node_modules 下安装该模块。
 * 
 *    此时，我们在执行 npm install 后将得到下面的目录结构：【不符合新模块的版本范围时的目录结构.webp】 - 【不符合新模块的版本范围时的目录结构-直观图.jpg】
 * 
 * 对应的，如果我们在项目代码中引用了一个模块，模块查找流程如下：
 *    - 在当前模块路径下搜索
 *    - 在当前模块 node_modules 路径下搜素
 *    - 在上级模块的 node_modules 路径下搜索
 *    ...
 *    - 直到搜索到全局路径中的 node_modules
 * 
 * 
 * 
 * 但是仍旧存在问题：
 * 假设我们又依赖了一个包 buffer2@^5.4.3，而它依赖了包 base64-js@1.0.3，则此时的安装结构是下面这样的：【模块冗余.jpg】
 * 假设我们的APP
 * 
 * 所以：为了让开发者在安全的前提下使用最新的依赖包，我们在 package.json 通常只会锁定大版本，
 *       这意味着在某些依赖包小版本更新后，同样可能造成依赖结构的改动，依赖结构的不确定性可能会给程序带来不可预知的问题。
 */

/**
 * (3) Lock文件
 * 为了解决 npm install 的不确定性问题，在 npm 5.x 版本新增了 package-lock.json 文件，而安装方式还沿用了 npm 3.x 的扁平化的方式。
 * 
 * package-lock.json 的作用是锁定依赖结构，即只要你目录下有 package-lock.json 文件，
 *                    那么你每次执行 npm install 后生成的 node_modules 目录结构一定是完全相同的。
 */
// package-lock.json
{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "base64-js": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/base64-js/-/base64-js-1.0.1.tgz",
      "integrity": "sha1-aSbRsZT7xze47tUTdW3i/Np+pAg="
    },
    "buffer": {
      "version": "5.4.3",
      "resolved": "https://registry.npmjs.org/buffer/-/buffer-5.4.3.tgz",
      "integrity": "sha512-zvj65TkFeIt3i6aj5bIvJDzjjQQGs4o/sNoezg1F1kYap9Nu2jcUdpwzRSJTHMMzG0H7bZkn4rNQpImhuxWX2A==",
      "requires": {
        "base64-js": "^1.0.2",
        "ieee754": "^1.1.4"
      },
      "dependencies": {
        "base64-js": {
          "version": "1.3.1",
          "resolved": "https://registry.npmjs.org/base64-js/-/base64-js-1.3.1.tgz",
          "integrity": "sha512-mLQ4i2QO1ytvGWFWmcngKO//JXAQueZvwEKtjgQFM4jIK0kU+ytMfplL8j+n5mspOfjHwoAg+9yhb7BwAHm36g=="
        }
      }
    },
    "ieee754": {
      "version": "1.1.13",
      "resolved": "https://registry.npmjs.org/ieee754/-/ieee754-1.1.13.tgz",
      "integrity": "sha512-4vf7I2LYV/HaWerSo3XmlMkp5eZ83i+/CDluXi/IGTs/O1sejBNhTtnxzmRZfvOUqj7lZjqHkeTvpgSFDlWZTg=="
    },
    "ignore": {
      "version": "5.1.4",
      "resolved": "https://registry.npmjs.org/ignore/-/ignore-5.1.4.tgz",
      "integrity": "sha512-MzbUSahkTW1u7JpKKjY7LCARd1fU5W2rLdxlM4kdkayuCwZImjkpluF9CM1aLewYJguPDqewLam18Y6AU69A8A=="
    }
  }
}
/**
 * 最外面的两个属性 name 、version 同 package.json 中的 name 和 version ，用于描述当前包名称和版本。
 * 
 * dependencies 是一个对象，对象和 node_modules 中的包结构一一对应，对象的 key 为包名称，值为包的一些描述信息：
 *    version：包版本 —— 这个包当前安装在 node_modules 中的版本
 *    resolved：包具体的安装来源
 *    integrity：包 hash 值，基于 Subresource Integrity 来验证已安装的软件包是否被改动过、是否已失效
 *    requires：对应子依赖的依赖，与子依赖的 package.json 中 dependencies的依赖项相同
 *    dependencies：结构和外层的 dependencies 结构相同，存储安装在子依赖 node_modules 中的依赖包
 * 
 * 这里注意，并不是所有的子依赖都有 dependencies 属性，只有子依赖的依赖和当前已安装在根目录的  node_modules 中的依赖冲突之后，才会有这个属性。
 * 
 * 
 * 根据上面的分析， package-lock.json 文件 和 node_modules 目录结构是一一对应的，
 * 即项目目录下存在  package-lock.json 可以让每次安装生成的依赖目录结构保持相同。
 * 另外，项目中使用了 package-lock.json 可以显著加速依赖安装时间。
 */


/**
 * 关于使用 package-lock.json 使用建议
 * 
 * 开发系统应用时，建议把 package-lock.json 文件提交到代码版本仓库，从而保证所有团队开发者以及 CI 环节可以在执行 npm install 时安装的依赖版本都是一致的。
 * 
 * 在开发一个 npm包 时，你的 npm包 是需要被其他仓库依赖的，由于上面我们讲到的扁平安装机制，如果你锁定了依赖包版本，
 * 你的依赖包就不能和其他依赖包共享同一 semver 范围内的依赖包，这样会造成不必要的冗余。
 * 所以我们不应该把package-lock.json 文件发布出去（ npm 默认也不会把 package-lock.json 文件发布出去）。
 */ 


/**
 * 缓存
 * 
 * 在执行 npm install 或 npm update命令下载依赖后，除了将依赖包安装在node_modules 目录下外，还会在本地的缓存目录缓存一份。
 * 通过 npm config get cache 命令可以查询到：在 Linux 或 Mac 默认是用户主目录下的 .npm/_cacache 目录。
 * 
 * 
 * 在这个目录下又存在两个目录：content-v2、index-v5，content-v2 目录用于存储 tar包的缓存，而index-v5目录用于存储tar包的 hash。
 * 
 * 
 * npm 在执行安装时，可以根据 package-lock.json 中存储的 integrity、version、name 生成一个唯一的 key 对应到 index-v5 目录下的缓存记录，
 * 从而找到 tar包的 hash，然后根据 hash 再去找缓存的 tar包直接使用。
 */ 
// 我们可以找一个包在缓存目录下搜索测试一下，在 index-v5 搜索一下包路径，再将搜索到的结果json格式化：
{
  "key": "pacote:version-manifest:https://registry.npmjs.org/base64-js/-/base64-js-1.0.1.tgz:sha1-aSbRsZT7xze47tUTdW3i/Np+pAg=",
  "integrity": "sha512-C2EkHXwXvLsbrucJTRS3xFHv7Mf/y9klmKDxPTE8yevCoH5h8Ae69Y+/lP+ahpW91crnzgO78elOk2E6APJfIQ==",
  "time": 1575554308857,
  "size": 1,
  "metadata": {
    "id": "base64-js@1.0.1",
    "manifest": {
      "name": "base64-js",
      "version": "1.0.1",
      "engines": {
        "node": ">= 0.4"
      },
      "dependencies": {},
      "optionalDependencies": {},
      "devDependencies": {
        "standard": "^5.2.2",
        "tape": "4.x"
      },
      "bundleDependencies": false,
      "peerDependencies": {},
      "deprecated": false,
      "_resolved": "https://registry.npmjs.org/base64-js/-/base64-js-1.0.1.tgz",
      "_integrity": "sha1-aSbRsZT7xze47tUTdW3i/Np+pAg=",
      "_shasum": "6926d1b194fbc737b8eed513756de2fcda7ea408",
      "_shrinkwrap": null,
      "bin": null,
      "_id": "base64-js@1.0.1"
    },
    "type": "finalized-manifest"
  }
}


/**
 * npm 提供了几个命令来管理缓存数据
 * 
 * npm cache add：官方解释说这个命令主要是 npm 内部使用，但是也可以用来手动给一个指定的 package 添加缓存。
 * npm cache clean：删除缓存目录下的所有数据，为了保证缓存数据的完整性，需要加上 --force 参数。
 * npm cache verify：验证缓存数据的有效性和完整性，清理垃圾数据。
 * 
 * 基于缓存数据，npm 提供了离线安装模式，分别有以下几种：
 * --prefer-offline：优先使用缓存数据，如果没有匹配的缓存数据，则从远程仓库下载。
 * --prefer-online：优先使用网络数据，如果网络数据请求失败，再去请求缓存数据，这种模式可以及时获取最新的模块。
 * --offline：不请求网络，直接使用缓存数据，一旦缓存数据不存在，则安装失败。
 */


/**
 * 文件完整性
 * 
 * 
 */


