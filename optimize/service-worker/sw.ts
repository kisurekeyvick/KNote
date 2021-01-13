const CACHE_NAME = "demo-a";

/**
 * 注册完毕后，Service Worker会自动开始下载，下载后会触发install事件，
 *    我们可以监听这个事件并进行下载资源的操作
 */
this.addEventListener("install", function(event) {
  console.log("install service worker success")
  caches.open(CACHE_NAME)
  // 要缓存的资源
  let cacheResources = ["https://abcde.com/demo.js"]
  event.waitUntil(
      caches.open(CACHE_NAME).then(cache => {
          cache.addAll(cacheResources);
      }).then(() => {
        // 注册成功跳过等待，酌情处理
        return this.skipWaiting()
      })
  )
})

/**
 * 经过上面的代码，demo.js文件就被我们缓存下来了，
 *    下载完后Service Worker就会执行激活
 * 
 * 安装成功后就会等待进入activate阶段，这里要注意的是，并不是install一旦成功就会立即抛出activate事件，
 *    如果当前页面已经存在service worker进程，那么就需要等待页面下一次被打开时新的sw才会被激活，
 *    或者使用 self.skipWaiting() 跳过等待
 */
const cacheStorageKey = 'testCache1'
this.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => cacheStorageKey !== cacheName);
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete)
      }))
    }).then(() => {
      // 立即接管所有页面
      this.clients.claim()
    })
  )
})


