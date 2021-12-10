---
title: CSS面试问答题整理
date: 2018/7/12 
categories: 面试
tags: Css
---

## CSS的盒子模型 IE的盒子模型 相互转化
- IE 盒子模型
- W3C 盒子模型  
盒模型： 内容(content)、填充(padding)、边界(margin)、 边框(border)；
区别：IE的content部分把 border 和 padding计算了进去;
- box-sizing: border-box  
box-sizing类似于ie盒模型，它会把内边距和边框包含在width内。在实际工作中，我们设置一个固定宽度的盒子，但当给它设置padding、border之后，它的真正宽度就会改变。这时box-sizing就派上用途了。它会自动调整内容的宽度，保证盒子的真正宽度还是我们设置的宽度。
---

## CSS选择符 可继承的属性
id选择器 #id
类选择器 .classname
标签选择器 div,h1, p
相邻选择器 h1 + p
子选择器 ul > li
后代选择器 ul li 
通配符选择器 *
属性选择器 a[rel = "external"]
伪类选择器 a:hover li:nth-child 

可继承的样式: font-size font-family color ul li dl dd dt ;
不可继承样式: border padding margin width height;

---

## css定义的权重与优先级
标签的权重为1，class的权重为10，id的权重为100
- 优先级就近原则，同权重情况下样式定义最近者为准;
- 载入样式以最后载入的定位为准;

同权重 优先级为: 
-  内联样式表（标签内部）> 嵌入样式表（当前文件中）> 外部样式表（外部文件中）
-  !important >  id > class > tag
-  important 比 内联优先级高

优先级高的不一定效率高

eg：#id .class 与 div#id p.class

前者效率高于后者，而后者优先级高于前者。我们需要在效率与优先级之间平衡取舍。

  [CSS优先级实例](https://www.jb51.net/css/468385.html)

---

## CSS3伪类 伪元素
    p:first-of-type	选择属于其父元素的首个 <p> 元素的每个 <p> 元素。
    p:last-of-type	选择属于其父元素的最后 <p> 元素的每个 <p> 元素。
    p:only-of-type	选择属于其父元素唯一的 <p> 元素的每个 <p> 元素。
    p:only-child		选择属于其父元素的唯一子元素的每个 <p> 元素。
    p:nth-child(2)	选择属于其父元素的第二个子元素的每个 <p> 元素。

  	::after			在元素之前添加内容,也可以用来做清除浮动。
  	::before	  在元素之后添加内容
    :enabled  		
  	:disabled 		控制表单控件的禁用状态。
  	:checked        单选框或复选框被选中。

### ::before 和 :after中双冒号和单冒号区别 作用
单冒号用于CSS伪类，双冒号用于CSS伪元素。
双冒号是在当前规范中引入的，用于区分伪类和伪元素。不过浏览器需要同时支持旧的已经存在的伪元素写法，比如:first-line、:first-letter、:before、:after等，而新的在CSS3中引入的伪元素则不允许再支持旧的单冒号的写法。

---



## 水平居中与垂直居中
- 水平居中
```
 div{
 	width:200px;
 	margin:0 auto;
  }
```
- 绝对定位的div水平居中
```
 div {
 	position: absolute;
 	width: 300px;
 	height: 300px;
 	margin: auto;
 	top: 0;
 	left: 0;
 	bottom: 0;
 	right: 0;
 	background-color: pink;	/* 方便看效果 */
 }
```
- 水平垂直居中1
```
 确定容器的宽高 宽500 高 300 的层
 设置层的外边距

 div {
 	position: relative;		/* 相对定位或绝对定位均可 */
 	width:500px;
 	height:300px;
 	top: 50%;
 	left: 50%;
 	margin: -150px 0 0 -250px;     	/* 外边距为自身宽高的一半 */
 	background-color: pink;	 	/* 方便看效果 */

  }
```
- 水平垂直居中2
```
 未知容器的宽高，利用 `transform` 属性

 div {
 	position: absolute;		/* 相对定位或绝对定位均可 */
 	width:500px;
 	height:300px;
 	top: 50%;
 	left: 50%;
 	transform: translate(-50%, -50%);
 	background-color: pink;	 	/* 方便看效果 */

 }
```
- 水平垂直居中3
```
 利用 flex 布局
 实际使用时应考虑兼容性

 .container {
 	display: flex;
 	align-items: center; 		/* 垂直居中 */
 	justify-content: center;	/* 水平居中 */
 }
 .container div {
 	width: 100px;
 	height: 100px;
 	background-color: pink;		/* 方便看效果 */
 }  
```
[掘金-路易斯](https://juejin.im/post/58f818bbb123db006233ab2a)
[codepen-demo](https://codepen.io/SunsetFrost/pen/EeOaWe)

---

## position
- static：无特殊定位，对象遵循正常文档流。top，right，bottom，left等属性不会被应用。
- relative：对象遵循正常文档流，但将依据top，right，bottom，left等属性在正常文档流中偏移位置。而其层叠通过z-index属性定义。
- absolute：对象脱离正常文档流，使用top，right，bottom，left等属性进行绝对定位。而其层叠通过z-index属性定义。
- fixed：对象脱离正常文档流，使用top，right，bottom，left等属性以窗口为参考点进行定位，当出现滚动条时，对象不会随着滚动。而其层叠通过z-index属性定义。

#### absolute的containing block(容器块)计算方式跟正常流有什么不同？
无论属于哪种，都要先找到其祖先元素中最近的 position 值不为 static 的元素，然后再判断：
1. 若此元素为 inline 元素，则 containing block 为能够包含这个元素生成的第一个和最后一个 inline box 的 padding box (除 margin, border 外的区域) 的最小矩形；
2. 否则,则由这个祖先元素的 padding box 构成。
如果都找不到，则为 initial containing block。

补充：
1. static(默认的)/relative：简单说就是它的父元素的内容框（即去掉padding的部分）
2. absolute: 向上找最近的定位为absolute/relative的元素
3. fixed: 它的containing block一律为根元素(html/body)，根元素也是initial containing block


#### position跟display、margin collapse、overflow、float这些特性相互叠加后会怎么样
如果元素的display为none,那么元素不被渲染,position,float不起作用,如果元素拥有position:absolute;或者position:fixed;属性那么元素将为绝对定位,float不起作用.如果元素float属性不是none,元素会脱离文档流,根据float属性值来显示.有浮动,绝对定位,inline-block属性的元素,margin不会和垂直方向上的其他元素margin折叠.

---

## CSS3的新特性
- 过渡 transition
- 动画
- 形状转换 2d 3d  transform: translate 
- 选择器 
- 阴影 box-shadow 
- 边框
  - 边框图片 border-image 
  - border-radius 
- 背景 background
- 倒影 reflect 
- 文字 
  - 换行 text-overflow:ellipsis
  - 文字阴影
- 渐变 滤镜

---

## display种类 作用
- block       	块类型。默认宽度为父元素宽度，可设置宽高，换行显示。
- none        	缺省值。象行内元素类型一样显示。
- inline      	行内元素类型。默认宽度为内容宽度，不可设置宽高，同行显示。
- inline-block  默认宽度为内容宽度，可以设置宽高，同行显示。
- list-item   	象块类型元素一样显示，并添加样式列表标记。
- table       	此元素会作为块级表格来显示。
- inherit     	规定应该从父元素继承 display 属性的值。
- flex          flex布局

#### display:inline-block 什么时候会显示间隙？
inline-block水平呈现的元素间，换行显示或空格分隔的情况下会有间距，CSS更改非inline-block水平元素为inline-block水平，也会有该问题
解决方法
- 写成一行或借助html的注释
- 使用margin负值
- font-size: 0
- letter-spacing
- word-spacing

---

## CSS3的Flexbox（弹性盒布局模型）
2009年，W3C 提出了一种新的方案----Flex 布局，一个用于页面布局的全新CSS3功能，Flexbox可以把列表放在同一个方向（从上到下排列，从左到右），并让列表能延伸到占用可用的空间。
较为复杂的布局还可以通过嵌套一个伸缩容器（flex container）来实现。

- 容器属性
flex-direction
flex-wrap
flex-flow
justify-content
align-items
align-content

[阮一峰](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)

---

## 浮动和它的工作原理 清除浮动的技巧
浮动框不属于文档流中的普通流，当元素浮动之后，不会影响块级元素的布局，只会影响内联元素布局。此时文档流中的普通流就会表现得该浮动框不存在一样的布局模式。当包含框的高度小于浮动框的时候，此时就会出现“高度塌陷”。

1. 使用空标签清除浮动。
这种方法是在所有浮动标签后面添加一个空标签 定义css clear:both. 弊端就是增加了无意义标签。

2. 使用overflow。
给包含浮动元素的父标签添加css属性 overflow:auto; zoom:1; zoom:1用于兼容IE6。

3. 使用after伪对象清除浮动。
该方法只适用于非IE浏览器。具体写法可参照以下示例。使用中需注意以下几点。一、该方法中必须为需要清除浮动元素的伪对象中设置 height:0，否则该元素会比实际高出若干像素；

方法3为当前主流方法

---

## 初始化CSS样式。
  - 因为浏览器的兼容问题，不同浏览器对有些标签的默认值是不同的，如果没对CSS初始化往往会出现浏览器之间的页面显示差异。

  - 当然，初始化样式会对SEO有一定的影响，但鱼和熊掌不可兼得，但力求影响最小的情况下初始化。

#### 解决方案
-  最简单的初始化方法： * {padding: 0; margin: 0;} （强烈不建议）

-  淘宝的样式初始化代码：
  ```
  body, h1, h2, h3, h4, h5, h6, hr, p, blockquote, dl, dt, dd, ul, ol, li, pre, form, fieldset, legend, button, input, textarea, th, td { margin:0; padding:0; }
  body, button, input, select, textarea { font:12px/1.5tahoma, arial, \5b8b\4f53; }
  h1, h2, h3, h4, h5, h6{ font-size:100%; }
  address, cite, dfn, em, var { font-style:normal; }
  code, kbd, pre, samp { font-family:couriernew, courier, monospace; }
  small{ font-size:12px; }
  ul, ol { list-style:none; }
  a { text-decoration:none; }
  a:hover { text-decoration:underline; }
  sup { vertical-align:text-top; }
  sub{ vertical-align:text-bottom; }
  legend { color:#000; }
  fieldset, img { border:0; }
  button, input, select, textarea { font-size:100%; }
  table { border-collapse:collapse; border-spacing:0; }
  ```
[各大型网站初始化样式表](https://segmentfault.com/a/1190000009481642)

---

## CSS优化、提高性能的方法
关键选择器（key selector）。选择器的最后面的部分为关键选择器（即用来匹配目标元素的部分）；
如果规则拥有 ID 选择器作为其关键选择器，则不要为规则增加标签。过滤掉无关的规则（这样样式系统就不会浪费时间去匹配它们了）；
提取项目的通用公有样式，增强可复用性，按模块编写组件；增强项目的协同开发性、可维护性和可扩展性;
使用预处理工具或构建工具（gulp对css进行语法检查、自动补前缀、打包压缩、自动优雅降级）；

## CSS动画的是怎么实现的

## CSS硬件加速，如何开启

## CSS动画优化的方法

## CSS 响应式布局
https://www.jianshu.com/p/65430fd116df

## CSS Module
加入局部作用域，模块依赖
```
//react
import React from 'react';
import style from './App.css';

export default () => {
  return (
    <h1 className={style.title}>
      Hello World
    </h1>
  );
};

//css
.title {
  color: red;
}

//构建工具编译后  转为base64
<h1 class="_3zyde4l1yATCOkgn-DBWEL">
  Hello World
</h1>

//webpack loader
loaders: [
  {
    test: /\.css$/,
    loader: "style-loader!css-loader?modules"
  },
]
```
[参考](http://www.ruanyifeng.com/blog/2016/06/css_modules.html)

---

## 各种获得宽高的方式
获取屏幕的高度和宽度（屏幕分辨率）：
window.screen.height/width
获取屏幕工作区域的高度和宽度（去掉状态栏）：
window.screen.availHeight/availWidth
网页全文的高度和宽度：
document.body.scrollHeight/Width
滚动条卷上去的高度和向右卷的宽度：
document.body.scrollTop/scrollLeft
网页可见区域的高度和宽度（不加边线）：
document.body.clientHeight/clientWidth
网页可见区域的高度和宽度（加边线）：
document.body.offsetHeight/offsetWidth

---

## 如果需要手动写动画，你认为最小时间间隔是多久，为什么？
取决于显示器的频率，多数显示器默认频率为60Hz，即1秒刷新60次，理论最小间隔1/60*1000ms = 16.7ms

---

## canvas上绑定事件实现   获取绑定事件的目标

---

## 移动端的布局的媒体查询
假设你现在正用一台显示设备来阅读这篇文章，同时你也想把它投影到屏幕上，或者打印出来， 而显示设备、屏幕投影和打印等这些媒介都有自己的特点，CSS就是为文档提供在不同媒介上展示的适配方法

当媒体查询为真时，相关的样式表或样式规则会按照正常的级联规被应用。 当媒体查询返回假， 标签上带有媒体查询的样式表 仍将被下载 （只不过不会被应用）。

包含了一个媒体类型和至少一个使用 宽度、高度和颜色等媒体属性来限制样式表范围的表达式。 CSS3加入的媒体查询使得无需修改内容便可以使样式应用于某些特定的设备范围。

`<style> @media (min-width: 700px) and (orientation: landscape){ .sidebar { display: none; } } </style>`

---

## 一个满屏 品 字布局 
  简单的方式：
- 上面的div宽100%，
- 下面的两个div分别宽50%，
- 然后用float或者inline使其不换行即可

---

## CSS sprites 如何在页面或网站中使用
CSS Sprites 其实就是把网页中一些背景图片整合到一张图片文件中，再利用 CSS 的"background-image"，"background-repeat"，"background-position" 的组合进行背景定位，background-position 可以用数字能精确的定位出背景图片的位置。这样可以减少很多图片请求的开销，因为请求耗时比较长；请求虽然可以并发，但是也有限制，一般浏览器都是6个。对于未来而言，就不需要这样做了，因为有了 http2。

---


## CSS里的visibility属性的collapse属性值 在不同浏览器下区别
对于普通元素visibility:collapse;会将元素完全隐藏,不占据页面布局空间,与display:none;表现相同. 如果目标元素为table,visibility:collapse;将table隐藏,但是会占据页面布局空间. 仅在Firefox下起作用,IE会显示元素,Chrome会将元素隐藏,但是占据空间.

---

## 用纯CSS创建一个三角形
把上、左、右三条边隐藏掉（颜色设为 transparent）
   ```
  #demo {
    width: 0;
    height: 0;
    border-width: 20px;
    border-style: solid;
    border-color: transparent transparent red transparent;
  }
  ```
---

## css多列等高实现
利用padding-bottom|margin-bottom正负值相抵；
设置父容器设置超出隐藏（overflow:hidden），这样子父容器的高度就还是它里面的列没有设定padding-bottom时的高度，
当它里面的任 一列高度增加了，则父容器的高度被撑到里面最高那列的高度，
其他比这列矮的列会用它们的padding-bottom补偿这部分高度差。

---

## li与li之间有看不见的空白间隔原因 解决办法
行框的排列会受到中间空白（回车\空格）等的影响，因为空格也属于字符,这些空白也会被应用样式，占据空间，所以会有间隔，把字符大小设为0，就没有空格了。

---

