---
title: NodeJs面试问答题整理
date: 2018/8/03
categories: 面试
tags: NodeJS
---

## next.trick发生在哪里

---

## 中间件

---

## node 捕获错误
node中try/catch无法捕获异步回调中的异常 node.js原生提供uncaugthException事件挂到process对象上，用于捕获所有未处理的异常

---

#### 使用domain模块捕获异常
[参考](http://www.alloyteam.com/2013/12/node-js-series-exception-caught/)

---

#### es7 async await
通过try catch 捕获异常

----