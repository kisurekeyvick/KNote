/**
 * @param param0 
 * method: 请求方法
 * url:    请求地址
 * params: 请求参数
 * func:   回调函数
 */
function ajax({ method, url, params, func, async = true }) {
  /**
   * IE6兼容：xhr = new ActiveXObject("Microsoft.XMLHTTP");
   */
  const xhr = window.XMLHttpRequest && new XMLHttpRequest() || new ActiveXObject("Microsoft.XMLHTTP");
  const requestParams = buildParams(params)
  /* 判断请求方法 */
  if ( method === "GET" ) {
    url += "?" + requestParams;
  }

  xhr.open(method, url, async);

  if (method === "POST") {
    /* 需要请求头 */
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  }
  
  xhr.send(requestParams);

  /**
   * 指定xhr状态变化事件处理函数
   * 执行回调函数
   */
  xhr.onreadystatechange = function () {
    if(this.readyState === 4){
      if (xhr.status == 200) {
        /* 根据响应头的content-type属性指定方法接收到的内容 */
        let soure = null;
        const contentType = xhr.getResponseHeader('content-type');
        
        if (contentType.indexOf('json') > -1) {
          soure = JSON.parse(xhr.responseText);
        } else if (contentType.indexOf('xml') > -1) {
          soure = xhr.responseXML;
        } else {
          soure = xhr.responseText;
        }

        /** success */
        func(soure);
      } else {
        /** error */
      }
    }
  }
}

/**
 * 将obj对象转换成参数, 将对象转换成参数列表
 * @param params 
 * @returns 
 */
function buildParams(params: any): string {
  if (!params) {
    return '';
  }

  const result = [];
  for (const key in params) {
    result.push(key + "=" + params[key]);
  }

  return result.join("&");
}

ajax({
  method: "GET",
  url: "http://localhost:3000/users",
  params: {
    name:"zs",
    age:45
  },
  func: function (a){
    console.log(a);
  }
});
