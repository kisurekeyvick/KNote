/**
 * https://mp.weixin.qq.com/s/zfRRlsdVNJv2vpFaJvVPmg
 * 
 * CORS 完全手册之 CORS 详解
 */

/**
 * (1) 在fetch 上了no-cors 的mode
  如图【fetch 出现错误.webp】，我们在调试接口的时候，可能会出现如图的问题：
  fetch('https://....', {
    mode: 'no-cors'
  }).then(res => console.log(res))
 * 
 * 结果：如图【mode no-cors.webp】，内容status为0，数据也没有拿到
 * no-cors的作用：它的意思并不是「绕过cors拿到资料」，而是「我知道它过不了cors，但我没差，所以不要给我错误也不要给我response」
 * 
 * 
 * 改正：后端那边也帮忙加上了一个header：Access-Control-Allow-Origin: *，代表来自任何origin的网站都可以用AJAX存取这个资源
 */
// 后端代码
app.get('/', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.json({
    data: db.getFormOptions()
  })
})
// 前端代码
fetch('https://...')
.then(res => res.json)
.then(res => console.log(res))

/**
 * 最终： 打开了浏览器，发现可以成功拿到选项了，也从network tab 里面看到了新增加的header
 * 如图：【新增加的header.webp】
 */

/**
 * --------------- 总结 ---------------
 * 针对于第一个问题，mode: 'no-cors'是没有办法解决CORS 问题的，先确认后端有没有给你Access-Control-Allow-Origin这个header，没有的话请后端给你，否则你怎么试都不会过。
 * Access-Control-Allow-Origin的值可以带*，代表通配符，任何origin都合法
 */



/**
 * (2) 简单请求、非简单请求
 */
const data = {
  source: '....'
};

fetch('https://....', {
  method: 'POST',
  headers: { 'Content-type': 'application/json' },
  body: JSON.stringify(data)
}).then(res => res.json())
.then(res => console.log(res))

/**
 * 当把数据body的格式从对象改成json格式以后，就从简单请求变成了非简单请求
 * 
 * 所谓简单请求：method是GET、POST或是HEAD然后不要带自定义的header，
 *              Content-Type也不要超出：application/x-www-form-urlencoded、multipart/form-data或是text/plain这三种，基本上就可以被视为是「简单请求」
 * 
 * 那非简单请求会怎么样呢?
 * 会多送出一个东西，叫做preflight request，中文翻作「预检请求」。如图：【OPTIONS.png】
 * 针对于options请求，浏览器会帮忙带上两个header：
 * - Access-Control-Request-Headers
 * - Access-Control-Request-Method
 * 
 * 前者会带上不属于简单请求的header，后者会带上HTTP Method，让后端对前端想送出的request 有更多的资讯。
 */

// 后端需要配合修改为如下代码：
app.get('/', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.json({
    data: db.getFormOptions()
  })
})

app.options('/form', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.end()
})

/**
 * 改过之后，发现还有如下错误：
 * Access to fetch at ' http://localhost:3000/form ' from origin 'null' has been blocked by CORS policy: 
 * Request header field content-type is not allowed by Access-Control-Allow-Headers in preflight response.
 * 
 * 针对于整个错误：当你的CORS request含有自订的header的时候，
 *              preflight response需要明确用Access-Control-Allow-Headers来表明：「我愿意接受这个header」，浏览器才会判断预检通过。
 */
// 所以后端需要修改为：
app.options('/form', (req, res)=> {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-headers', 'content-type')
  res.end()
})
/**
 * 如此，就可以用过预请求，然后真正的request才会发出
 * 
 * 非简单请求流程是这样的：
 * - 我们要送出POST的request到http://localhost:3000/form
 * - 浏览器发现是非简单请求，因此先发出一个预 request
 * - 检查response，预先请求通过
 * - 送出POST的request到http://localhost:3000/form
 */

/**
 * --------------- 总结 ---------------
 * CORS request分成两种：简单请求与非简单请求，无论是哪一种，后端都需要给Access-Control-Allow-Origin这个header。
 * 而最大的差别在于非简单请求在发送正式的request之前，会先发送一个preflight request，如果preflight没有通过，是不会发出正式的request的。
 * 针对preflight request，我们也必须给 Access-Control-Allow-Origin这个header才能通过。
 * 
 * 除此之外，有些产品可能会想要送一些自订的header，例如说X-App-Version好了，带上目前网站的版本，这样后端可以做个纪录：
 * 
 */
fetch('https://...', {
  method: 'POST',
  headers: {
    'X-App-Version': 'v0.1',
    'Content-type': 'application/json'
  },
  body: JSON.stringify({})
})
// 这样做以后，后端需要改成如下代码：
app.options('/form', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-headers', 'X-App-Version, content-type')
  res.end()
})

/**
 * 简单来说，preflight 就是一个验证机制，确保后端知道前端要送出的request 是预期的，浏览器才会放行。
 * 我之前所说的「跨来源请求挡的是response 而不是request」，只适用于简单请求。对于有preflight 的非简单请求来说，你真正想送出的request 确实会被挡下来。
 * 
 * 
 * 为什么需要预请求呢?
 * 安全性和相容性
 * 
 * - 相容性
 * 为了不让这些后端接收到预期外的request，就先发一个preflight request 出去，古老的后端没有针对这个preflight 做处理，因此就不会通过，浏览器就不会把真正的request 给送出去。
 * 这就是我所说的相容性，通过预检请求，让早期的网站不受到伤害，不接收到预期外的request。
 * 
 * - 安全性
 * 送出POST request 删除文章的那个问题。删除的API 一般来说会用DELETE 这个HTTP method，如果没有preflight request 先挡住的话，
 * 浏览器就会真的直接送这个request 出去，就有可能对后端造成未预期的行为（没有想到浏览器会送这个出来）。
 * 所以才需要preflight request，确保后端知道待会要送的这个request 是合法的，才把真正的request 送出去。
 */


/**
 * (3) Cookie
 * 
 * 如果是要带上cookie，那么后端需要明确指定哪个origin有权限
 * 除此之外，后端还要额外带上Access-Control-Allow-Credentials: true这个header。
 */
// 前端代码
fetch('...', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-type': 'application/json'
  },
  body: JSON.stringify({})
})

// 后端代码
app.post('/form', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://.....')
  res.header('Access-Control-Allow-Credentials', true)  //新增这个
  res.json({
    success: true
  })
})

app.options('/form', (req, res)=> {
  res.header('Access-Control-Allow-Origin', 'https://.....')
  res.header('Access-Control-Allow-Credentials', true)    //新增这个
  res.header('Access-Control-Allow-headers', 'content-type')
  res.end()
})

/** 
 * 改完之后的版本明确指定才有权限存取CORS Response，也加上了这个header。http://localhost:8080
 * Access-Control-Allow-Credentials
 * 如此一来就大功告成了，在发送request 的时候可以成功带上Cookie
 */

/**
 * --------------- 总结 ---------------
 * 如果你需要在发送request 的时候带上cookie，那必须满足三个条件：
 * - 后端Response header 有 Access-Control-Allow-Credentials: true
 * - 后端Response header的Access-Control-Allow-Origin不能是*，要明确指定
 * - 前端fetch 加上 credentials: 'include'
 * 
 * 这三个条件任何一个不满足的话，都是没办法带上cookie 的。
 * 
 * 
 * 除了这个之外还有一件事情要特别注意，那就是不只带上cookie，连设置cookie也是一样的。
 * 后端可以用Set-Cookie这个header让浏览器设置cookie，但一样要满足上面这三个条件。
 * 如果这三个条件没有同时满足，那尽管有Set-Cookie这个header，浏览器也不会帮你设置，这点要特别注意。
 * 
 * 
 * 事实上呢，无论有没有想要存取Cookie，都会建议 Access-Control-Allow-Origin不要设定成*而是明确指定origin，
 * 避免预期之外的origin跨站存取资源。若是你有多个origin的话，建议在后端有一个origin的清单，
 * 判断request header内的origin有没有在清单中，有的话就设定Access-Control-Allow-Origin，没有的话就不管它。
 */



/**
 * (4) 存取自定义header
 * 
 * 后端会在response header里面多带上一个header：X-List-Version，来让前端知道这个选项的清单是哪一个版本。
 * 而前端则是要拿到这个版本，并且把值放到表单里面一起送出。
 */
// 后端代码
app.get('/', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('X-List-Version', '1.3')
  res.json({
    data: [
      { name:'1/10活动', id: 1 },
      { name:'2/14特别活动', id: 2 },
    ]
  })
})

// 前端代码
fetch('...')
.then(res => {
  console.log(res.headers.get('X-List-Version'))
  return res.json()
})
.then(res => console.log(res))
/**
 * 此时，神奇的事情发生了。明明从network tab 去看，确实有我们要的response header，但是在程式里面却拿不到，输出null
 * 如图【拿不到version.png】
 * 
 * 
 * 原因：
 * 如果你要存取CORS response的header，尤其是这种自定义的header的话，
 * 后端要多带一个Access-Control-Expose-Headers的header喔，这样前端才拿得到
 */
// 所以后端的代码对应修改为如下：
app.get('/', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Expose-Headers', 'X -List-Version')
  res.header('X-List-Version', '1.3')
  res.json({
    data: [
      { name:'1/10活动', id: 1 },
      { name:'2/14特别活动', id: 2 },
    ]
  })
})

/**
 * --------------- 总结 ---------------
 * 当你拿到跨来源的response的时候，基本上都可以拿到response body，也就是内容。
 * 但是header就不一样了，只有几个基本的header可以直接拿到，例如说Content-Type就是一个。
 * 除此之外，如果你想拿其他header，尤其是自定义的header的话，后端就需要带上Access-Control-Expose-Headers，
 * 让浏览器知道说：「我愿意把这个header开放出去让JS看到」，这样子前端才能顺利抓到header。
 * 如果没有加的话就会拿到null，就跟这个header 不存在一样。
 */



/**
 * (5) 编辑资料
 * 
 * 跟后端讨论过后，在送出表单之后后端会给一个token，前端只要带着这个token去打PATCH /form这个API，就能够编辑刚刚表单的内容。
 */
// 后端代码
app.patch('/form', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://...')
  res.header('Access-Control-Allow-Credentials', true)
  res.json({
    success: true
  })
})

app.options('/form', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://...')
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-headers', 'content-type, X-App-Version')
  res.end()
})

// 前端代码
fetch('https://...', {
  method: 'PATCH',
  credentials: 'include',
  headers: {},
  body: JSON.stringify({
    token: '',
    content: ''
  })
})

/**
 * 然而，跨来源的请求只接受三种HTTP Method：GET、HEAD以及POST，除了这三种之外，
 * 都必须由后端回传一个Access-Control-Allow-Methods，让后端决定有哪些method可以用。
 */

// 所以后台的代码应该修改为如下：
app.options('/form', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://...')
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-headers', 'content-type, X-App-Version')
  res.header('Access-Control-Allow-Methods', 'PATCH')   // 多添加这个
  res.end()
})

/**
 * --------------- 总结 ---------------
 * 如果前端要使用GET、HEAD以及POST以外的HTTP method发送请求的话，
 * 后端的 预先请求 header必须有Access-Control-Allow-Methods并且指定合法的method，
 * 预先请求才会通过，浏览器才会把真正的request发送出去
 * 
 * 这个就跟前面提过的Access-Control-Allow-Headers有点像，只是一个是在规范可以用哪些method，
 * 一个是在规范可以用哪些request headers。
 */



/**
 * (6) 快取preflight request
 * 
 * 在QA 对网站做压测的时候，发现preflight request 的数量实在是太多了，
 * 而且就算同一个使用者已经预检过了，每次都还是需要再检查，其实满浪费效能的。
 * 
 * 于是QA 那边希望后端可以把这个东西快取住，这样如果同一个浏览器重复发送request，就不用再做预检。
 * 
 * header：Access-Control-Max-Age，可以跟浏览器说这个preflight response能够快取几秒。
 */
// 后端代码
app.options('/form', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://...')
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-headers', 'content-type, X-App-Version')
  res.header('Access-Control-Max-Age', 300)
  res.end()
})
/**
 * 这样preflight response 就会被浏览器快取300 秒，在300 秒内对同一个资源都不会再打到后端去做preflight，而是会直接沿用快取的资料。
 */
