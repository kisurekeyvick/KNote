# 2020-8-25 KISURE新创建的笔记
- 入行4年，常年苦修，却修不到字词入心，只能眼睁睁看着时光溜走。
我曾清醒过，也曾无来由的堕入黑甜梦乡。而那座山始终在面前，不近不远。
如果它是虚妄的，为何我能看到它。如果它是真实的，为何我不能触及到。
何为真实何为虚妄？再上层楼再上层楼。

# baseJs
```
├── 如何排查内存泄漏导致的页面卡顿现象
│   ├── index.ts          
│
├── CORS
│   ├── index.ts          CORS 详解
│
├── base64原理
│   ├── index.ts          base64原理
│
├── 图片懒加载及底层实现原理
│   ├── index.ts          4种实现图片懒加载的方式
│
├── Object.getOwnPropertyDescriptors
│   ├── Object.getOwnPropertyDescriptors.ts     getOwnPropertyDescriptors用于copy存在get，set属性的object
│
│── memoryleak
│   ├── memoryleak.ts 内存泄漏以及如何辨别避免内存泄漏
│
│── handwritten-js-array-api
│   ├── handwritten-js-array-api.ts 手写js数组api
│
│── design-patterns
│   ├── design-patterns.ts  设计模式
│
│── import-webpack
│   ├── index.ts            关于import的问题
│   ├── webpack-import.ts   webpack打包后的代码分析
│
│── es2020-es2021
│   ├── index.ts            关于es2020和es2021一些有用的语法
│
│── examination
│   ├── index.ts            一些你需要知道的知识：dns-prefetch、get/post请求传参长度、SEO、Reflect 对象创建目的、什么是堆？什么是栈？等等
│
│── https
│   ├── index.ts            关于https的一些优化：协议优化、证书优化、会话复用；也需要了解一下TLS 1.3
│
│── JavaScript 事件循环
│   ├── index.ts            
│
│── setTimeout 模拟 setInterval
│   ├── index.ts            为什么要使用setTimeout 模拟 setInterval，setInterval的机制以及产生的问题
│
│── sroll-snap-type
│   ├── index.ts            关于滚动位置的一些了解
│
│── Web 用户体验设计提升指南    
│
```

# typescript
```
├── implements&extends.ts   关于implenets和extends的区别
│
```

# electron
```
├──
│
```

# 前端脚手架
```
├── 
│
```

# optimize
```
├── web-optimize
│   ├── web-optimize.ts     web优化：(1)资源的压缩合并 (2)异步加载 (3)浏览器缓存策略 (4)使用CDN
│
├── web-optimize
│   ├── index.ts            web的优化
│
├── service-worker          
│
│
```

# node
```
├── 
│
```

# webpack
```
├── 9条Webpack优化策略
│   ├── index.ts  
│
├── webpack-optimize
│   ├── index.ts        webpack的一些优化方案 
│
├── webpack-core-knowledge
│   ├── index.ts        webpack核心知识点
│
├── tree-shaking
│   ├── index.ts        tree-shaking的理解
│ 
│
```

# engineering   工程化相关的
```
├── standard
│   ├── standard.ts (1) 前端规范
│
```

# react
```
├── 【源码分析】ReactDOM.render
│   ├── index.ts
│
├── knowledge_point_one.ts  关于一些react细节知识点
│
```

# vue
```
├── object.defineProperty
│   ├── object.defineProperty.ts    vue双向绑定
│
├── $set $delete
│   ├── $set $delete.ts      $set $delete用于给动态的属性添加响应
│                           (1) 对象和数组不会响应式更新的情况
│                           (2) vue响应式原理
│                           (3) vue无法检测属性的添加或者删除
│                           (4) vue.set() 源码分析
│                           (5) vm.$set()的流程描述
│                           (6) vm.$delete源码分析
│
├── $on $emit $off
│   ├── $on $emit $off.ts   $on $emit $off就是发布订阅模式
│
├── introduce.ts    vue渐进式的框架，理解
├── data-method.ts  (1) vue初始化，具体做了什么
│                   (2) 为什么data需要return一个对象
│                   (3) data初始化的时候具体做了什么    
│                   (4) data中不要使用$和_开头，为什么会这样?
├── vm.$data.ts     this.$data.xxx、this._data.xxx、this.xxx 都能获取数据
├── life-cycle.ts   (1) 生命周期钩子的介绍
│                   (2) 生命钩子触发顺序
│                   (3) 生命周期业务场景
│                   (4) 关于生命钩子需要注意的地方
├── $nextTick
│   ├── $nextTick.ts    (1) nextTick的使用
│                       (2) nextTick的原理
├── mixin           
│   ├── mixin.ts    (1) 关于mixin的一些理解
│
├── vuex-class
│   ├── vuex-class.ts   (1) namespace的作用，使用方法
│                       (2) ts写法，关于定义vuex的初始化state，action，getters，mutations
│
├── vue-property-decorator          vue的ts写法
│   ├── vue-property-decorator      (1) @Component的写法
│                                   (2) @Props的写法
│                                   (3) @watch的写法
│                                   (4) @emit的写法
│                                   (5) @Ref的写法
│
```

# vue
```
遗留问题： 
    (1) $watch $set $delete/$watch $set $delete.ts 中出现的observeArray，它用于观察，观察里面做了操作需要分析理解一下
```