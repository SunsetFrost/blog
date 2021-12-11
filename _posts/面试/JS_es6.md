---
title: Js-ES6面试问答题整理
date: 2018/7/20
categories: 面试
tags: ES6
---

## let const

## object 新增方法
for of

includes

repeat

模板字符串

## 数值扩展方法
2进制 8 进制

Number.isNaN()

Number.parseInt   .parseFloat

.isInteger

## 函数扩展
可以设置默认值(x, y = 0)  可以使用 ...扩展运算符

箭头函数
```
var sum = (a, b) => {
    return a + b;
}
```

> 箭头函数有几个使用注意点。  
（1）函数体内的this对象，就是定义时所在的对象，而不是使用时所在的对象。  
（2）不可以当作构造函数，也就是说，不可以使用new命令，否则会抛出一个错误。  
（3）不可以使用arguments对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。  
（4）不可以使用yield命令，因此箭头函数不能用作 Generator 函数。

尾调用
> 在函数的最后一步调用一个函数，这叫做尾调用

尾递归

## 数组扩展
... 扩展运算符

Array.from()
> 伪数组转换数组  另外两种方法是 ...   .call/.apply

Array.of()
> 弥补array构造器的不足 
```
var arr=new Array(3)
console.log(arr);//[empty*3]

var arr=Array.of(3)
console.log(arr); //[3]
```

find:用于找出第一个符合条件的数组元素。找不返回 undefined 。

findIndex:返回第一个符合条件的数组元素的索引。找不到返回-1;

fill
```
var arr=[1,2,3,4,5]
arr.fill('*',1,3)
console.log(arr);//[1, "*", "*", 4, 5]
```

## 对象扩展
属性简写

方法简写

设置对象属性  获取对象属性
```
var obj={
  name:'lang',
  age:22
}

Object.defineProperty('obj','name',{
    configurable:false,
    writable:false,
    enumerable:false
})
```
object.values()

## 解构赋值
- 数组解构
- 对象解构
```
[a, b] = [b, a];
var obj = {
    name: 'a',
    sex: 'male'
};
const {name, sex} = obj;
console.log(name);//a
console.log(sex);//male
```

## class
```
class Sunset extends Frost{
    constructor(x, y) {
        super(x);
        this.y = y;
    }

    test() {

    }
}

通过原型链进行继承

```
#### ES6的类和 ES5 的构造函数区别
[](https://blog.csdn.net/u012657197/article/details/77542404)

## promise
```
var p = new Promise((resolve, reject) => {
    console.log('');
    resolve('success');
})

p.then((value) => {
    console.log()
})
```

## promise原理及解决了什么问题

## Generator
```
function* gen() {
    yield 'hello';
    yield 'byebye';
    return 'omg';
}

var hw = helloBye();

hw.next()
// { value: 'hello', done: false }

hw.next()
// { value: 'world', done: false }

hw.next()
// { value: 'ending', done: true }

hw.next()
// { value: undefined, done: true }
```
---

## async

## module

## 数组arr.map迭代截断可以吗

## rest参数 扩展运算符
rest参数和扩展运算符都是ES6新增的特性。  
rest参数的形式为：...变量名；扩展运算符是三个点（...）。

