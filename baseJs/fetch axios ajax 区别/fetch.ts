import Qs from 'qs'

export enum ContentType {
  json = 'application/json;charset=UTF-8',
  form = 'application/x-www-form-urlencoded; charset=UTF-8'
}

export enum HttpMethod {
  get = 'GET',
  post = 'POST',
  put = 'PUT',
  patch = 'PATCH',
  delete = 'DELETE'
}

export interface IReqConfig {
  body?: any
  method?: string
  headers?: IHeader
  token?: string
  'Content-Type'?: string
}

export interface IHeader {
  'Content-Type': string
  'X-Requested-With': string
  token: string
  [propName: string]: any
}

export const baseUrl = '/'

const $req = async (url: string, config: IReqConfig) => {
  let promise: Response
  let contentType: string

  if (config['Content-Type'] !== undefined) {
    contentType = config['Content-Type']
  } else if (config.method === HttpMethod.post) {
    contentType = ContentType.form
  } else {
    contentType = ContentType.json
  }

  const reqUrl = (baseUrl + url).replace('//', '/')
  const headers: Headers = new Headers({
    // 如果实例配置没传token过来的话，直接使用保存在sessionStorage的token
    // 这里假设后端直接读头文件的token字段，我直接用token当字段了，Authorization也同理
    token: config.token === undefined ? sessionStorage.token : config.token,
    'Content-Type': contentType
  } as IHeader)

  if (!config.method || config.method === HttpMethod.get) {
    promise = await fetch(reqUrl, {
      headers
    })
  } else if (config.method === HttpMethod.post) {
    promise = await fetch(reqUrl, {
      body: Qs.stringify(config.body),
      headers,
      method: HttpMethod.post
    })
  } else {
    promise = await fetch(reqUrl, {
      body: JSON.stringify(config.body),
      headers,
      method: config.method
    })
  }
  
  return handleRes(promise)
}

const handleRes = async (res: Response) => {
  const parsedRes = await parseRes(res)
  // 如果res.ok，则请求成功
  if (res.ok) {
    return parsedRes
  }
  // 请求失败，返回解析之后的失败的数据
  const error = parsedRes
  throw error
}

const parseRes = async (res: Response) => {
  const contentType = res.headers.get('Content-Type')
  // 判定返回的内容类型，做不同的处理
  if (contentType) {
    if (contentType.indexOf('json') > -1) {
      return await res.json()
    }
    if (contentType.indexOf('text') > -1) {
      return await res.text()
    }
    if (contentType.indexOf('form') > -1) {
      return await res.formData()
    }
    if (contentType.indexOf('video') > -1) {
      return await res.blob()
    }
  }
  return await res.text()
}

export default $req

