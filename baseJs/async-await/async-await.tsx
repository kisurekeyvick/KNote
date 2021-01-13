/**
 * https://mp.weixin.qq.com/s/7Naavk6hxa3YRpFTHK-QUQ
 * 
 * 关于async await的异常处理
 */

/**
 * 写一个工具函数来捕获异常统一处理
 * @param promise 
 */
function awaitTo (promise: Promise<any>) {
  return promise.then(data => {
    return [null, data]
  }).catch(err => {
    return [err]
  })
}

import React, { useState, useEffect } from "react";

function App() {
  const [apps, setApps] = useState({ apps: [] })
  const [news, setNews] = useState({ news: [] })

  /** 
   * getApps 和 getNews 是返回Promise的接口函数
   */
  useEffect(() => {
    const [appError, appData] = awaitTo(getApps({}));
    const [newError, newData] = awaitTo(getNews({}));
    setApps(appData||[]);
    setNews(newData||[]);
  }, [])

  return (
    <div>
      {
        /** */
      }
    </div>
  )
}
