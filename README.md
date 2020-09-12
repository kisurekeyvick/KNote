# 2020-8-25 KISURE新创建的笔记 剑指前端技术专家
- 入行4年，常年苦修，却修不到字词入心，只能眼睁睁看着时光溜走。
我曾清醒过，也曾无来由的堕入黑甜梦乡。而那座山始终在面前，不近不远。
如果它是虚妄的，为何我能看到它。如果它是真实的，为何我不能触及到。
何为真实何为虚妄？再上层楼再上层楼。

# baseJs
```
├── Object.getOwnPropertyDescriptors
│   ├── Object.getOwnPropertyDescriptors.ts     getOwnPropertyDescriptors用于copy存在get，set属性的object
│
```

# typescript
```
├──
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

# node
```
├── 
│
```

# engineering   工程化相关的
```
├── standard
│   ├── standard.ts (1) 前端规范
│
```

# vue
```
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