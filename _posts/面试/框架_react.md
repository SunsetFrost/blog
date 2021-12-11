---
title: React面试问答题整理
date: 2018/7/13
categories: 面试
tags: React
---

## 为什么使用react
react定位是一个视图层的类库，angular定位是一个框架，angular自带模板引擎，路由引擎，有健全的数据双向绑定机制，内置Ajax请求功能，还能够定义Model。而React.js类库只能用于定义视图组件。  
![MVC架构](https://pic2.zhimg.com/80/3d2abf5c8d81424c4797201384b456ac_hd.jpg)  
现实程序存在多视图，多模型，单个视图可能会来自多个模型，单个模型可能通知多个视图  
![flux架构](https://pic2.zhimg.com/80/004fe0045e9e2b0fe1673a5a9542230c_hd.jpg)
component/view action dispatcher  store

MVC架构的双向绑定以及一对多的关系容易造成连级/联动（Cascading）修改，对于代码的调试和维护都成问题。

### react框架与vue angular 的区别

## MVVM 与 MVC MVP的区别
https://juejin.im/post/593021272f301e0058273468

## MVVM实现双向数据绑定 数组是如何实现的

#### 数据流
angular 双向绑定  基于脏值检测
vue 支持双向绑定 默认单向绑定
react 单向数据流

#### 视图渲染
虚拟dom 
react 服务端渲染

https://www.jianshu.com/p/b2b8161c9565

## react创建组件的三种方法

## react 生命周期
https://juejin.im/post/5a062fb551882535cd4a4ce3

## setState原理

## react继承
单一职责(Single responsibility principle)，React组件设计推崇的是“组合”，而非“继承”。例如你的页面需要一个表单组件，表单中需要有输入框，按钮，列表，单选框等。那么在开发中你不应该只开发一（整）个表单组件（<Form>），而是应该开发若干个单一功能的组件

## React.PureComponent  Stateless component

## Component与Element与Instance的区别
[](http://qingbob.com/understand-react-03/)

## React、Flux 与 Redux

## 高阶组件 
hoc（high order component）
ES6中的class只是语法糖，本质还是原型继承

mixins
实质就是将mixins中的方法遍历赋值给newObj.prototype，从而实现mixin返回的函数创建的对象都有mixins中的方法

React 中实现高阶组件的方法：属性代理（Props Proxy）和 反向继承（Inheritance Inversion）

## 父子组件通讯
[React组件之间的通信](https://github.com/sunyongjian/blog/issues/27)

## 状态撤销（回溯state）

## react 单向数据流  angular双向绑定 区别

## react bind
### 1
    constructor() {
        this.handleClick = this.handleClick.bind(this);
    }
### 2
    <button onClick={(e) => this.deleteRow(id, e)}></button>
### 3
    <button onClick={this.deleteRow.bind(this, id)}></button>

## 虚拟dom 
DOM是浏览器提供的让javascript操纵dom的api，不属于javascript，调用dom开销很大  
虚拟dom执行在javascript引擎中，开销小  

virtual dom性能优势在于batching diff。
- batching将所有dom操作搜集起来，一次性提交给真实dom
- diff算法时间复杂度将标准的O(n^3)降到了O(n)

[参考](http://www.alloyteam.com/2015/10/react-virtual-analysis-of-the-dom/)
```
//diff 深度遍历
function dfsWalk(oldNode, newNode, index, patches) {
    var currentPatch = [];
    if(newNode = null) {
        //依赖listdiff算法标记为删除
    } else if(util.isString(oldNode) && util.isString(newNode)) {
        if(oldNode !== newNode) {
            //如果是文本节点则替换文本
            currentPatch.push({
                type: patch.TEXT,
                content: newNode
            });
        }
    } else if(oldNode.tagName === newNode.tagName && oldNode.key === newNode.key) {
        //节点类型相同
        //比较节点属性
        var propsPatches = diffProps(oldNode, newNode);
        if(propsPatches) {
            currentPatch.push({
                type: patch.PROPS,
                props: propsPatches
            })
        }
        //比较子节点是否相同
        diffChildren(oldNode.children, newNode.children, index, patches, currentPatch);
    } else {
        //节点类型不同 直接替换
        currentPatch.push({type: patch.REPLACE, node:newNode});
    }

    if(currentPatch.length) {
        patches[index] = currentPatch;
    }
}
```

## flux 观察者模式  redux中介者模式
