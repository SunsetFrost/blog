---
title: JS面试问答题整理
date: 2018/7/12
categories: 面试
tags: Js
---

## Js的数据类型
### 基本类型
6种
unidefined, null, boolean, number, string  

ECMA2015新增Symbol：唯一且不可变

### 引用类型
统称Object

Object, Array, Date, RegExp, Function

### 内存位置
基础：栈  
引用： 堆

---

## null undefined 的区别
null 		表示一个对象是“没有值”的值，也就是值为“空”；
undefined 	表示一个变量声明了没有初始化(赋值)；

- undefined不是一个有效的JSON，而null是；
- undefined的类型(typeof)是undefined；
- null的类型(typeof)是object；

Javascript将未赋值的变量默认值设为undefined；
Javascript从来不会将变量设为null。它是用来让程序员表明某个用var声明的变量时没有值的。

typeof undefined //"undefined"

typeof null //"object"

> 注意：
    在验证null时，一定要使用　=== ，因为 == 无法分别 null 和 undefined  
    null == undefined // true  
    null === undefined // false

参考阅读：[undefined与null的区别](http://www.ruanyifeng.com/blog/2014/03/undefined-vs-null.html)

---

## 判断数据类型
typeof  
instanceof  
Object.prototype.toString.call(1) // "[object Number]"  
[参考](https://juejin.im/post/5b0b9b9051882515773ae714)

---

## .forEach 与 .map 循环的区别
forEach
- 遍历数组中的元素
- 为每个元素执行回调
- 无返回值
```
const a = [1, 2, 3];
a.forEach((num, index) => {

});
```

map
- 遍历数组中的元素
- 对每个元素调用函数 映射到一个新元素 返回新数组
```
const a = [1, 2, 3];
a.map(num => {
	return num * 2;
})
```
---

## JavaScript原型 原型链 
### 原理
每个对象都会在其内部初始化一个属性，就是prototype(原型)，当我们访问一个对象的属性时，
如果这个对象内部不存在这个属性，那么他就会去prototype里找这个属性，这个prototype又会有自己的prototype，
于是就这样一直找下去，也就是我们平时所说的原型链的概念。
关系：instance.constructor.prototype = instance.__proto__

### 特点
JavaScript对象是通过引用来传递的，我们创建的每个新对象实体中并没有一份属于自己的原型副本。当我们修改原型时，与之相关的对象也会继承这一改变。


当我们需要一个属性的时，Javascript引擎会先看当前对象中是否有这个属性， 如果没有的话，
就会查找他的Prototype对象是否有这个属性，如此递推下去，一直检索到 Object 内建对象。
```
function Pokemon() {}
Pokemon.prototype.name = 'Pikachu';
Pokemon.prototype.getSpecies = () => {
	return this.name;
};
let pikachu = new Pokemon();
console.log(pikachu.getSpecies());
//Pikachu   拥有了getSpecies方法

```
### 关系图
![关系图](https://user-gold-cdn.xitu.io/2018/3/13/1621e8a9bcb0872d?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

###例外
```
 let fun = Function.prototype.bind()
 ```
 上述方法创建函数，该函数不具有prototype属性


[参考资料-掘金](https://juejin.im/post/5aa78fe66fb9a028d2079ca4)

---

## JavaScript继承的实现方式
### 例子
```
function Pokemon(name) {
	this.name = name;
	this.species = 'pokemon';
}

Pokemon.prototype.getSpecies = function() {
	console.log(this.species);
}
```
### 构造函数继承
```
function Pikachu(name) {
	Pokemon.apply(this, arguments);
}

var pikachu = new Pikachu('pikapi');
> pikachu.name
> 'pikapi'
> pikachu.getSpecies()
> 报错
```
### 原型链继承
```
function Pikachu() {}

Pikachu.prototype = new Pokemon();
var pikachu = new Pikachu();
> pikachu.getSpecies()
> 'pokemon'
```
### 组合继承
```
function Pikachu(name) {
	Pokemon.apply(this, arguments);
}

Pikachu.prototype = new Pokemon();
var pikachu = new Pikachu('pikapi');
> pikachu.name
> 'pikapi'
> pikachu.getSpecies()
> 'pokemon'? 错误 输出 'pikapi'
//覆盖了原型的name属性

```
### 寄生组合
参考：
[继承与多态](https://juejin.im/post/5912753ba22b9d005817524e)
[构造函数的继承](http://www.ruanyifeng.com/blog/2010/05/object-oriented_javascript_inheritance.html)
[非构造函数的继承](http://www.ruanyifeng.com/blog/2010/05/object-oriented_javascript_inheritance_continued.html)

---

## 闭包（closure）
闭包是指有权访问另一个函数作用域中变量的函数，创建闭包的最常见的方式就是在一个函数内创建另一个函数，通过另一个函数访问这个函数的局部变量,利用闭包可以突破作用链域，将函数内部的变量和方法传递到外部。

闭包的特性：

1.函数内再嵌套函数
2.内部函数可以引用外层的参数和变量
3.参数和变量不会被垃圾回收机制回收
```
//li节点的onclick事件都能正确的弹出当前被点击的li索引
<ul id="testUL">
    <li> index = 0</li>
    <li> index = 1</li>
    <li> index = 2</li>
    <li> index = 3</li>
</ul>
<script type="text/javascript">
    var nodes = document.getElementsByTagName("li");
    for(i = 0;i < nodes.length; i += 1) {
        nodes[i].onclick = (function(i){
			return function() {
				console.log(i);
			} //不用闭包的话，值每次都是4
		})(i);
    }
</script>
```

```
function closure() {
	let count = 0;
	return function() {
		count++;
		console.log(count);
	}
}
var test = closure();
test();
test();
> 1
> 2
```
[阮一峰-闭包](http://www.ruanyifeng.com/blog/2009/08/learning_javascript_closures.html)

---

## Js函数重载
1. 使用arguments实现重载
```
function overLoading() {
　　// 根据arguments.length，对不同的值进行不同的操作
　　switch(arguments.length) {
　　　　case 0:
　　　　　　/*操作1的代码写在这里*/
　　　　　　break;
　　　　case 1:
　　　　　　/*操作2的代码写在这里*/
　　　　　　break;
　　　　case 2:
　　　　　　/*操作3的代码写在这里*/
 　　　　　　
　　//后面还有很多的case......
	}
}
```
2. 利用闭包特性
```
//addMethod
function addMethod(object, name, fn) {
　　var old = object[name];
　　object[name] = function() {
　　　　if(fn.length === arguments.length) {
　　　　　　return fn.apply(this, arguments);
　　　　} else if(typeof old === "function") {
　　　　　　return old.apply(this, arguments);
　　　　}
　　}
}
 
 
var people = {
　　values: ["Dean Edwards", "Alex Russell", "Dean Tom"]
};
 
/* 下面开始通过addMethod来实现对people.find方法的重载 */
 
// 不传参数时，返回peopld.values里面的所有元素
addMethod(people, "find", function() {
　　return this.values;
});
 
// 传一个参数时，按first-name的匹配进行返回
addMethod(people, "find", function(firstName) {
　　var ret = [];
　　for(var i = 0; i < this.values.length; i++) {
　　　　if(this.values[i].indexOf(firstName) === 0) {
　　　　　　ret.push(this.values[i]);
　　　　}
　　}
　　return ret;
});
 
// 传两个参数时，返回first-name和last-name都匹配的元素
addMethod(people, "find", function(firstName, lastName) {
　　var ret = [];
　　for(var i = 0; i < this.values.length; i++) {
　　　　if(this.values[i] === (firstName + " " + lastName)) {
　　　　　　ret.push(this.values[i]);
　　　　}
　　}
　　return ret;
});
 
// 测试：
console.log(people.find()); //["Dean Edwards", "Alex Russell", "Dean Tom"]
console.log(people.find("Dean")); //["Dean Edwards", "Dean Tom"]
console.log(people.find("Dean Edwards")); //["Dean Edwards"]
```
[参考](https://www.cnblogs.com/yugege/p/5539020.html)

----



## This对象的理解
this是使用call方法调用函数时传递的第一个参数，它可以在函数调用时修改，在函数没有调用的时候，this的值是无法确定。

this总是指向函数的直接调用者（而非间接调用者）  
如果有new关键字，this指向new出来的那个对象  
在事件中，this指向触发这个事件的对象，特殊的是，IE中的attachEvent中的this总是指向全局对象Window

#### 箭头函数默认不会使用自己的this，而是会和外层的this保持一致, 且不能用call修改this
```
const obj = {
    a: () => {
        console.log(this)
    }
}
obj.a()  //打出来的是window
```
[参考资料](https://juejin.im/post/5aa1eb056fb9a028b77a66fd)

---

## arguments 
每个js的函数都会有一个arguments，它引用着函数的实参，是一个伪数组对象

### 将参数转化为一个数组
```
fucntion () {
	var args = Array.prototype.slice.apply(arguments);
}

//es6
function func(...arguments) {
	//即可转为数组
}
```

### callee属性
Arguments对象的callee属性，通过他可调用函数自身
#### callee实现闭包
```
var data = [];

for (var i = 0; i < 3; i++) {
    (data[i] = function () {
       console.log(arguments.callee.i) 
    }).i = i;
}

data[0]();//0
data[1]();//1
data[2]();//2

```
[参考资料-掘金](https://juejin.im/post/590fd5de44d904007bed2e0c)

---

## call apply bind的区别
- call为参数列表
- apply为数组
- es6扩展 bind返回新函数，原函数不改变

[参考资料-call, apply, bind](https://github.com/lin-xin/blog/issues/7)

---

## js的dom与bom元素操作
[参考](https://segmentfault.com/a/1190000000654274)
### js获取协议名、url等
https://blog.csdn.net/tiemufeng1122/article/details/9254591

---

## Array splice slice
```
var myFish = ['angel', 'clown', 'drum', 'sturgeon'];
var removed = myFish.splice(2, 1, 'trumpet');

// myFish is ["angel", "clown", "trumpet", "sturgeon"]
// removed is ["drum"]
```
The slice() method returns a shallow copy of a portion of an array into a new array object selected from begin to end (end not included). The original array will not be modified.
```
var animals = ['ant', 'bison', 'camel', 'duck', 'elephant'];

console.log(animals.slice(2));
// expected output: Array ["camel", "duck", "elephant"]

console.log(animals.slice(2, 4));
// expected output: Array ["camel", "duck"]

console.log(animals.slice(1, 5));
// expected output: Array ["bison", "camel", "duck", "elephant"]
```

---

## 数组的创建方式
- 数组字面量
- 构造函数 
```
const arr = Array(3) //[empty * 3]  
const arr2 = Array('3') //['3']  
//避免使用这种方法创建数组, 类型不同导致创建行为的不同
```
- of
```
const arr1 = Array.of(3) // [3]
const arr2 = Array.of('3') // ['3']
```
- from
```
const arr1 = Array.from({length: 3}) // [undefined, undefined, undefined]
```
[参考](https://juejin.im/post/5b14cc5de51d45069773a4a9)

---

## 删除数组某一项的方法 区别
- splice 
- delete

#### document.write()
document.write()用来将一串文本写入由document.open()打开的文档流中。当页面加载后执行document.write()时，它将调用document.open，会清除整个文档（<head>和<body>会被移除！），并将文档内容替换成给定的字符串参数。因此它通常被认为是危险的并且容易被误用

 https://harttle.land/2015/10/01/javascript-dom-api.html

 https://segmentfault.com/a/1190000000654274

-----

## 事件绑定 事件监听 事件委托 事件冒泡
#### 事件绑定
- 在Dom元素中绑定
- 在JS代码中绑定
- 绑定事件监听函数  addEventListener(event, function, useCapture = false) attachEvent（ie10以下）
#### Dom事件机制 
1 事件捕获  从根节点由外到内进行事件传播
2 事件冒泡  相反
先捕获后冒泡  
阻止冒泡  stopPropagation 

#### 事件委托
利用冒泡原理  事件加到父或祖先元素上 触发效果

#### 原生js，onclick与addEventListener区别
onclick添加的事件会被覆盖
addEventListener可以添加多个事件，先后执行

[参考](https://juejin.im/entry/57ea329e67f3560057ad41a6)  
[参考](https://blog.csdn.net/qq947289507/article/details/74370423)

---

## javascript创建对象的方式

javascript创建对象简单的说,无非就是使用内置对象或各种自定义对象，当然还可以用JSON；但写法有很多种，也能混合使用。

1、对象字面量的方式

	person={firstname:"Mark",lastname:"Yun",age:25,eyecolor:"black"};

2、用function来模拟无参的构造函数

	function Person(){}
		var person=new Person();//定义一个function，如果使用new"实例化",该function可以看作是一个Class
		person.name="Mark";
		person.age="25";
		person.work=function(){
		alert(person.name+" hello...");
	}
	person.work();

3、用function来模拟参构造函数来实现（用this关键字定义构造的上下文属性）

	function Pet(name,age,hobby){
		this.name=name;//this作用域：当前对象
		this.age=age;
		this.hobby=hobby;
		this.eat=function(){
			alert("我叫"+this.name+",我喜欢"+this.hobby+",是个程序员");
		}
	}
	var maidou =new Pet("麦兜",25,"coding");//实例化、创建对象
	maidou.eat();//调用eat方法


4、用工厂方式来创建（内置对象）

	var wcDog = new Object();
	wcDog.name="旺财";
	wcDog.age=3;
	wcDog.work=function(){
	alert("我是"+wcDog.name+",汪汪汪......");
	}
	wcDog.work();


5、用原型方式来创建

	function Dog(){}
	Dog.prototype.name="旺财";
	Dog.prototype.eat=function(){
		alert(this.name+"是个吃货");
	}
	var wangcai =new Dog();
	wangcai.eat();


5、用混合方式来创建

	function Car(name,price){
		this.name=name;
		this.price=price;
	}
	Car.prototype.sell=function(){
	alert("我是"+this.name+"，我现在卖"+this.price+"万元");
	}
	var camry = new Car("凯美瑞",27);
	camry.sell();

---


## Object.create 和 new 的区别
https://blog.csdn.net/qq8427003/article/details/19125761

-----

## JS模块化
#### CommonJS   
同步  
Node.js
```
function add(a, b) {
	return a + b;
}

module.exports = {
	add: add,
}

var math = require('./math');
math.add(2, 3);
```
#### AMD   
异步  
require.js  
#### CMD   
异步  
sea.js  
#### AMD CMD异同
AMD 推崇依赖前置、提前执行，CMD推崇依赖就近、延迟执行

ES6 
```
var basic = 0;
var add = function (a, b) {
	return a + b;
};
export { basic, add };

import math from './math';
function test(ele) {
	return math.basic;
}
```
#### ES6 CommonJS 差异
1. CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
2. CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。

---

## Ajax  

#### 优缺点
[参考](https://yq.aliyun.com/articles/625098)

---

## 变量提升
变量提升（hoisting）是用于解释代码中变量声明行为的术语。使用var关键字声明或初始化的变量，会将声明语句“提升”到当前作用域的顶部。 但是，只有声明才会触发提升，赋值语句（如果有的话）将保持原样。
```
// 用 var 声明得到提升
console.log(foo); // undefined
var foo = 1;
console.log(foo); // 1

// 用 let/const 声明不会提升
console.log(bar); // ReferenceError: bar is not defined
let bar = 2;
console.log(bar); // 2
```
函数声明会使函数体提升，但函数表达式（以声明变量的形式书写）只有变量声明会被提升。
```
// 函数声明
console.log(foo); // [Function: foo]
foo(); // 'FOOOOO'
function foo() {
  console.log('FOOOOO');
}
console.log(foo); // [Function: foo]

// 函数表达式
console.log(bar); // undefined
bar(); // Uncaught TypeError: bar is not a function
var bar = function() {
  console.log('BARRRR');
};
console.log(bar); // [Function: bar]
```

---

## document 中的load事件和DOMContentLoaded事件之间的区别
load 所有加载结束才会调用  
DOMContentLoaded 初始html完全解析和加载后即可调用，无需等待样式表和图像加载

---

## 1 和 Number(1) 的区别

 数字、字符串、布尔三者，在JS中称为原始的(primitives)资料类型，再加上null与undefined也是。除了这些类型外，其他的都是对象。(注: ES6的Symbol是新加的原始资料类型)

包装对象
对象中有一类是Number, String, Boolean这三个对象，分别对应数字、字符串、布尔类型，我们称它们为包装对象或包装类型(Wrappers)，很少会直接使用到它们，在很多情况下也尽量避免使用它们。

包装类型与原始资料类型之间的正确转换方式如下:

原始->包装: new Number(123)

包装->原始: (new Number(123)).valueOf()

包装对象是个对象，所以它与原始资料类型并不相同，用typeof与instanceof都可以检测出来:
```
typeof 123 // "number"
typeof new Number(123) // "object"
123 instanceof Number // false
(new Number(123)) instanceof Number // true
123 === new Number(123) // false
```
---

## 写一个函数是否存在循环引用

----

## 说几条写JavaScript的基本规范
 1. 不要在同一行声明多个变量。
 2. 请使用 ===/!==来比较true/false或者数值
 3. 使用对象字面量替代new Array这种形式
 4. 不要使用全局函数。
 5. Switch语句必须带有default分支
 6. 函数不应该有时候有返回值，有时候没有返回值。
 7. For循环必须使用大括号
 8. If语句必须使用大括号
 9. for-in循环中的变量 应该使用var关键字明确限定作用域，从而避免作用域污染。
 
---

## 函数柯里化
curry(function())

```
function ajax(type, url, data) {
    var xhr = new XMLHttpRequest();
    xhr.open(type, url, true);
    xhr.send(data);
}

// 虽然 ajax 这个函数非常通用，但在重复调用的时候参数冗余
ajax('POST', 'www.test.com', "name=kevin")
ajax('POST', 'www.test2.com', "name=kevin")
ajax('POST', 'www.test3.com', "name=kevin")

// 利用 curry
var ajaxCurry = curry(ajax);

// 以 POST 类型请求数据
var post = ajaxCurry('POST');
post('www.test.com', "name=kevin");

// 以 POST 类型请求来自于 www.test.com 的数据
var postFromTest = post('www.test.com');
postFromTest("name=kevin");
```
[参考资料-冴羽](https://github.com/mqyqingfeng/Blog/issues/42)

---

## 功能检测 功能推断
功能检测判断浏览器是否支持某个功能或某代码，以便浏览器能正常执行代码功能  
功能推断与上者相同，不同的是在判断通过后还会使用其他功能，不推荐

---

## SPA 及 SEO性能

---

## es6 class 与 es5 构造函数的区别
#### 重复定义
function 覆盖之前方法  
class 报错  
#### 枚举
class方法不可被Object.keys(class.prototype)枚举  
function可以  
所有原型方法属性都可用Object.getOwnPropertyNames(Class.prototype)
#### class没有变量提升
#### class没有私有方法和私有属性

---

## `[].forEach.call($$("*"),function(a){a.style.outline="1px solid #"+(~~(Math.random()*(1<<24))).toString(16)})` 能解释一下这段代码的意思吗？
[SegmentFault](https://segmentfault.com/a/1190000007542527)

---

