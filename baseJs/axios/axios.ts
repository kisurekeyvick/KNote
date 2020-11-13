/**
 * https://mp.weixin.qq.com/s/5N-L_kYiDCrxMYdybHUaJw
 * https://github.com/Sunny-lucking/howToBuildMyAxios
 * 
 * axios
 */

/**
 * Axios 是一个基于 promise 的 HTTP 库，可以用在浏览器和 node.js 中。
 * 
 * axios有什么特性？
 * (1)从浏览器中创建 XMLHttpRequests从 node.js
 * (2)创建 http 请求
 * (3)支持 Promise API
 * (4)拦截请求和响应转换请求数据和响应数据
 * (5)取消请求
 * (6)自动转换JSON 数据
 * (7)客户端支持防御 XSRF
 */ 

/**
 * 源码的实现
 */ 
class Axios {
  constructor() {

  }

  request(config) {
    return new Promise(resolve => {
      const {url = '', method = 'get', data = {}} = config;
      // 发送ajax请求
      const xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      xhr.onload = function() {
        console.log(xhr.responseText)
        resolve(xhr.responseText);
      }
      xhr.send(data);
    })
  }
}

const utils = {
  extend(a,b, context) {
    for(let key in b) {
      if (b.hasOwnProperty(key)) {
        if (typeof b[key] === 'function') {
          a[key] = b[key].bind(context);
        } else {
          a[key] = b[key]
        }
      }
    }
  }
}

/** 
 * 最终导出axios的方法，即实例的request方法
 */
function CreateAxiosFn() {
  let axios = new Axios();
  let req = axios.request.bind(axios);
  utils.extend(req, Axios.prototype, axios)
  
  return req;
}

// 得到最后的全局变量axios
let axios = CreateAxiosFn();

/**
 * 现在我们来实现下axios.method()的形式
 * 我们可以再Axios.prototype添加这些方法。而这些方法内部调用request方法即可
 */
// 定义get,post...方法，挂在到Axios原型上
const methodsArr = ['get', 'delete', 'head', 'options', 'put', 'patch', 'post'];
methodsArr.forEach(met => {
    Axios.prototype[met] = function() {
        // 处理单个方法
        if (['get', 'delete', 'head', 'options'].includes(met)) { // 2个参数(url[, config])
            return this.request({
                method: met,
                url: arguments[0],
                ...arguments[1] || {}
            })
        } else { // 3个参数(url[,data[,config]])
            return this.request({
                method: met,
                url: arguments[0],
                data: arguments[1] || {},
                ...arguments[2] || {}
            })
        }
    }
})


/**
 * 请求和响应拦截器
 * 
 * 拦截器是什么意思呢？
 * 其实就是在我们发送一个请求的时候会先执行请求拦截器的代码，然后再真正地执行我们发送的请求，这个过程会对config，也就是我们发送请求时传送的参数进行一些操作。
 * 而当接收响应的时候，会先执行响应拦截器的代码，然后再把响应的数据返回来，这个过程会对response，也就是响应的数据进行一系列操作。
 */
class InterceptorsManage {
  public handlers: Array<any>

  constructor() {
    this.handlers = [];
  }

  use(fullfield, rejected) {
    this.handlers.push({
      fullfield,
      rejected
    })
  }
}

class Axios {
  public interceptors

  constructor() {
      this.interceptors = {
          request: new InterceptorsManage,
          response: new InterceptorsManage
      }
  }

  request(config) {
      return new Promise(resolve => {
          const {url = '', method = 'get', data = {}} = config;
          // 发送ajax请求
          console.log(config);
          const xhr = new XMLHttpRequest();
          xhr.open(method, url, true);
          xhr.onload = function() {
              console.log(xhr.responseText)
              resolve(xhr.responseText);
          };
          xhr.send(data);
      })
  }
}

function CreateAxiosFn() {
  let axios = new Axios();
  
  let req = axios.request.bind(axios);
  // 混入方法， 处理axios的request方法，使之拥有get,post...方法
  utils.extend(req, Axios.prototype, axios)
  // 将拦截器也添加到req中
  utils.extend(req, axios, this)
  return req;
}


/**
 * axios的拦截使用方式：
 */
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});




