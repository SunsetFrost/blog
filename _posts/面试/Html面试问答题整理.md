---
title: Html面试问答题整理
date: 2018/7/12 
categories: 面试
tags: Html
---

## Doctype
#### Doctype作用 严格模式与混杂模式区别
1. <!DOCTYPE> 声明位于文档中的最前面，处于 <html> 标签之前。告知浏览器以何种模式来渲染文档。 
2. 严格模式的排版和 JS 运作模式是  以该浏览器支持的最高标准运行。
3. 在混杂模式中，页面以宽松的向后兼容的方式显示。模拟老式浏览器的行为以防止站点无法工作。
4. DOCTYPE不存在或格式不正确会导致文档以混杂模式呈现。 

#### HTML5 为什么只需要写 !DOCTYPE HTML
HTML5 不基于 SGML，因此不需要对DTD进行引用，但是需要doctype来规范浏览器的行为（让浏览器按照它们应该的方式来运行）；

而HTML4.01基于SGML,所以需要对DTD进行引用，才能告知浏览器文档所使用的文档类型。

#### Doctype文档类型
1. 该标签可声明三种 DTD 类型，分别表示严格版本、过渡版本以及基于框架的 HTML 文档。
2. HTML 4.01 规定了三种文档类型：Strict、Transitional 以及 Frameset。
3. XHTML 1.0 规定了三种 XML 文档类型：Strict、Transitional 以及 Frameset。
4. Standards （标准）模式（也就是严格呈现模式）用于呈现遵循最新标准的网页，而 Quirks（包容）模式（也就是松散呈现模式或者兼容模式）用于呈现为传统浏览器而设计的网页。

#### HTML与XHTML——二者有什么区别
- XHTML 元素必须被正确地嵌套。
- XHTML 元素必须被关闭。
- 标签名必须用小写字母。
- XHTML 文档必须拥有根元素。

---

## Dom增删查方法
- create
  - createElement
  - createTextNode
  - cloneNode
  - createDocumentFragment
- add
  - appendChild
  - insertBefore
- delete
  - removeChild
  - replaceChild
- alter
  - setAttribute
  - innerHtml
  - innerText
  - value
- find
  - getElementById
  - ByTagName
  - ByName
  - ByClassName
  - querySelector
  - querySelectorAll

## 6. 请解释一下为什么需要清除浮动？清除浮动的方式
清除浮动是为了清除使用浮动元素产生的影响。浮动的元素，高度会塌陷，而高度的塌陷使我们页面后面的布局不能正常显示。
  1. 父级div定义height；
  2. 父级div 也一起浮动；
  3. 常规的使用一个class；
  ```
  	.clearfix::before, .clearfix::after {
  	    content: " ";
  	    display: table;
  	}
  	.clearfix::after {
  	    clear: both;
  	}
  	.clearfix {
  	    *zoom: 1;
  	}
```
  4. SASS编译的时候，浮动元素的父级div定义伪类:after
  ```
&::after,&::before{
    content: " ";
        visibility: hidden;
        display: block;
        height: 0;
        clear: both;
}
```   

解析原理：
1) display:block 使生成的元素以块级元素显示,占满剩余空间;
2) height:0 避免生成内容破坏原有布局的高度。
3) visibility:hidden 使生成的内容不可见，并允许可能被生成内容盖住的内容可以进行点击和交互;
4) 通过 content:"."生成内容作为最后一个元素，至于content里面是点还是其他都是可以的，例如oocss里面就有经典的 content:".",有些版本可能content 里面内容为空,一丝冰凉是不推荐这样做的,firefox直到7.0 content:”" 仍然会产生额外的空隙；
5) zoom：1 触发IE hasLayout。
> 清除浮动，触发hasLayout；
  Zoom属性是IE浏览器的专有属性，它可以设置或检索对象的缩放比例。解决ie下比较奇葩的bug。
  譬如外边距（margin）的重叠，浮动清除，触发ie的haslayout属性等。

  来龙去脉大概如下：
  当设置了zoom的值之后，所设置的元素就会就会扩大或者缩小，高度宽度就会重新计算了，这里一旦改变zoom值时其实也会发生重新渲染，运用这个原理，也就解决了ie下子元素浮动时候父元素不随着自动扩大的问题。

  Zoom属是IE浏览器的专有属性，火狐和老版本的webkit核心的浏览器都不支持这个属性。然而，zoom现在已经被逐步标准化，出现在 CSS 3.0 规范草案中。

  目前非ie由于不支持这个属性，它们又是通过什么属性来实现元素的缩放呢？
  可以通过css3里面的动画属性scale进行缩放。

通过分析发现，除了clear：both用来闭合浮动的，其他代码无非都是为了隐藏掉content生成的内容，这也就是其他版本的闭合浮动为什么会有font-size：0，line-height：0。

---

## 7. 如何用BFC清除浮动
粗暴的总结就是让浮动块包含在同一个BFC中加同时（也可以理解为包含块加属性overflow:hidden）。

---

## 8. 行内元素有哪些？块级元素有哪些？ 空(void)元素有那些
首先：CSS规范规定，每个元素都有display属性，确定该元素的类型，每个元素都有默认的display值，如div的display默认值为“block”，则为“块级”元素；span默认display属性值为“inline”，是“行内”元素。
1. 行内元素: a b span img input select strong
2. 块级元素: div ul li dl dt dd h1 h2 p
3. 常见空元素: br hr img input link meta

---

## 9. 页面导入样式时，使用link和@import有什么区别？
1. link属于XHTML标签，除了加载CSS外，还能用于定义RSS, 定义rel连接属性等作用；而@import是CSS提供的，只能用于加载CSS;
2. 页面被加载的时，link会同时被加载，而@import引用的CSS会等到页面被加载完再加载;
3. import是CSS2.1 提出的，只在IE5以上才能被识别，而link是XHTML标签，无兼容问题;
4. link支持使用js控制DOM去改变样式，而@import不支持;

---

## 10. 介绍一下你对浏览器内核的理解？常见的浏览器内核有哪些？
  主要分成两部分：渲染引擎(layout engineer或Rendering Engine)和JS引擎。
  渲染引擎：负责取得网页的内容（HTML、XML、图像等等）、整理讯息（例如加入CSS等），以及计算网页的显示方式，然后会输出至显示器或打印机。浏览器的内核的不同对于网页的语法解释会有不同，所以渲染的效果也不相同。所有网页浏览器、电子邮件客户端以及其它需要编辑、显示网络内容的应用程序都需要内核。

  JS引擎则：解析和执行javascript来实现网页的动态效果。

  最开始渲染引擎和JS引擎并没有区分的很明确，后来JS引擎越来越独立，内核就倾向于只指渲染引擎。

  Trident内核：IE,MaxThon,TT,The World,360,搜狗浏览器等。[又称MSHTML]
  Gecko内核：Netscape6及以上版本，FF,MozillaSuite/SeaMonkey等
  Presto内核：Opera7及以上。      [Opera内核原为：Presto，现为：Blink;]
  Webkit内核：Safari,Chrome等。   [ Chrome的：Blink（WebKit的分支）]

详细文章：[浏览器内核的解析和对比](http://www.cnblogs.com/fullhouse/archive/2011/12/19/2293455.html)

---

## 11. html5有哪些新特性、移除了那些元素？如何处理HTML5新标签的浏览器兼容问题？如何区分 HTML 和 HTML5？
  - HTML5 现在已经不是 SGML 的子集，主要是关于图像，位置，存储，多任务等功能的增加。
  	  绘画 canvas;
  	  用于媒介回放的 video 和 audio 元素;
  	  本地离线存储 localStorage 长期存储数据，浏览器关闭后数据不丢失;
        sessionStorage 的数据在浏览器关闭后自动删除;
  	  语意化更好的内容元素，比如 article、footer、header、nav、section;
  	  表单控件，calendar、date、time、email、url、search;
  	  新的技术webworker, websocket, Geolocation;

    移除的元素：
  	  纯表现的元素：basefont，big，center，font, s，strike，tt，u;
  	  对可用性产生负面影响的元素：frame，frameset，noframes；

  - 支持HTML5新标签：
  	 IE8/IE7/IE6支持通过document.createElement方法产生的标签，
    	 可以利用这一特性让这些浏览器支持HTML5新标签，
    	 浏览器支持新标签后，还需要添加标签默认的样式。

       当然也可以直接使用成熟的框架、比如html5shim;
  	 <!--[if lt IE 9]>
  		<script> src="http://html5shim.googlecode.com/svn/trunk/html5.js"</script>
  	 <![endif]-->

  - 如何区分HTML5： DOCTYPE声明\新增的结构元素\功能元素

---

## 12. HTML语义化标签
用正确的标签做正确的事情。
html语义化让页面的
- 内容结构化，结构更清晰
- 便于对浏览器、搜索引擎解析
- 方便其他设备解析（移动设备，盲人阅读器等）

#### 标签
- header
- nav
- aside
- footer
- article
- section
[](https://segmentfault.com/a/1190000008286447)

---

## 13. HTML5的离线储存的使用及工作原理？ 浏览器是如何对HTML5的离线储存资源进行管理和加载？
在用户没有与因特网连接时，可以正常访问站点或应用，在用户与因特网连接时，更新用户机器上的缓存文件。
原理：HTML5的离线存储是基于一个新建的.appcache文件的缓存机制(不是存储技术)，通过这个文件上的解析清单离线存储资源，这些资源就会像cookie一样被存储了下来。之后当网络在处于离线状态下时，浏览器会通过被离线存储的数据进行页面展示。

如何使用：
1、页面头部像下面一样加入一个manifest的属性；
2、在cache.manifest文件的编写离线存储的资源；
```
CACHE MANIFEST
#v0.11
CACHE:
js/app.js
css/style.css
NETWORK:
resourse/logo.png
FALLBACK:
/ /offline.html
```
3、在离线状态时，操作window.applicationCache进行需求实现。

在线的情况下，浏览器发现html头部有manifest属性，它会请求manifest文件，如果是第一次访问app，那么浏览器就会根据manifest文件的内容下载相应的资源并且进行离线存储。如果已经访问过app并且资源已经离线存储了，那么浏览器就会使用离线的资源加载页面，然后浏览器会对比新的manifest文件与旧的manifest文件，如果文件没有发生改变，就不做任何操作，如果文件改变了，那么就会重新下载文件中的资源并进行离线存储。

离线的情况下，浏览器就直接使用离线存储的资源。

[有趣的HTML5:离线存储](https://segmentfault.com/a/1190000000732617)

---

## 14. 请描述一下 cookies，sessionStorage 和 localStorage 的区别？
cookie是网站为了标示用户身份而储存在用户本地终端（Client Side）上的数据（通常经过加密）。
cookie数据始终在同源的http请求中携带（即使不需要），记会在浏览器和服务器间来回传递。
sessionStorage和localStorage不会自动把数据发给服务器，仅在本地保存。

存储大小：
cookie数据大小不能超过4k。
sessionStorage和localStorage 虽然也有存储大小的限制，但比cookie大得多，可以达到5M或更大。

有期时间：
localStorage    存储持久数据，浏览器关闭后数据不丢失除非主动删除数据；
sessionStorage  数据在当前浏览器窗口关闭后自动删除。
cookie          设置的cookie过期时间之前一直有效，即使窗口或浏览器关闭

坑：  
session, local在储存和读取数据的时候,需要将数据进行JSON.stringify和JSON.parse，否则会强制改变数据类型
---

## 15. $(window).load、$()与window.onload
| 效果等价代码        | Jquery代码    |  javascript原生代码  |
| --------   | -----:   | :----: |
| 页面所有内容加载完成后才执行(包括图片)        | $(window).load(function(){//代码})      |   window.onload = function(){//代码}    |
| DOM结构绘制完成后即执行(不必等到加载完毕，图片等内容还没有加载)       | $(function(){//代码})      |   无(准确的说应该是非常复杂)    |
| 主要区别        | 可同时使用多次      |   同时只能使用一次    |

---

## 16. iframe有那些缺点？
  * iframe会阻塞主页面的Onload事件；
  * 搜索引擎的检索程序无法解读这种页面，不利于SEO;

  * iframe和主页面共享连接池，而浏览器对相同域的连接有限制，所以会影响页面的并行加载。

  使用iframe之前需要考虑这两个缺点。如果需要使用iframe，最好是通过javascript
  动态给iframe添加src属性值，这样可以绕开以上两个问题。

---

## 17. Label的作用是什么？是怎么用的？
label标签来定义表单控制间的关系,当用户选择该标签时，浏览器会自动将焦点转到和标签相关的表单控件上。

```
<label for="Name">Number:</label>
<input type=“text“name="Name" id="Name"/>
<label>Date:<input type="text" name="B"/></label>
```

---

## Post Message
H5新特性  
> postMessage()方法允许来自不同源的脚本采用异步方式进行有限的通信，可以实现跨文本档、多窗口、跨域消息传递。

postMessage(data,origin)方法接受两个参数

1. data:要传递的数据，html5规范中提到该参数可以是JavaScript的任意基本类型或可复制的对象，然而并不是所有浏览器都做到了这点儿，部分浏览器只能处理字符串参数，所以我们在传递参数的时候需要使用JSON.stringify()方法对对象参数序列化，在低版本IE中引用json2.js可以实现类似效果。

2. origin：字符串参数，指明目标窗口的源，协议+主机+端口号[+URL]，URL会被忽略，所以可以不写，这个参数是为了安全考虑，postMessage()方法只会将message传递给指定窗口，当然如果愿意也可以建参数设置为"*"，这样可以传递给任意窗口，如果要指定和当前窗口同源的话设置为"/"。

## 18. HTML5的form如何关闭自动完成功能？
给不想要提示的 form 或某个 input 设置为 autocomplete=off。

---

## 19. 如何实现浏览器内多个标签页之间的通信?
WebSocket、SharedWorker；
也可以调用localstorge、cookies等本地存储方式；

localstorge另一个浏览上下文里被添加、修改或删除时，它都会触发一个事件，
我们通过监听事件，控制它的值来进行页面信息通信；
注意quirks：Safari 在无痕模式下设置localstorge值时会抛出 QuotaExceededError 的异常；

---

## 20. webSocket如何兼容低浏览器？
Adobe Flash Socket 、
ActiveX HTMLFile (IE) 、
基于 multipart 编码发送 XHR 、
基于长轮询的 XHR

---

## 21. 页面可见性（Page Visibility API） 可以有哪些用途？
通过 visibilityState 的值检测页面当前是否可见，以及打开网页的时间等;
在页面被切换到其他后台进程的时候，自动暂停音乐或视频的播放；

---

## 22. 如何在页面上实现一个圆形的可点击区域？
1、map+area或者svg
2、border-radius
3、纯js实现 需要求一个点在不在圆上简单算法、获取鼠标坐标等等

---

## 23. 实现不使用 border 画出1px高的线，在不同浏览器的标准模式与怪异模式下都能保持一致的效果。
```
<div style="height:1px;overflow:hidden;background:red"></div>
```
---

## 24. title与h1的区别、b与strong的区别、i与em的区别？
title属性没有明确意义只表示是个标题，H1则表示层次明确的标题，对页面信息的抓取也有很大的影响；

strong是标明重点内容，有语气加强的含义，使用阅读设备阅读网络时：strong 会重读，而 B 是展示强调内容。

i内容展示为斜体，em表示强调的文本；

Physical Style Elements -- 自然样式标签
b, i, u, s, pre
Semantic Style Elements -- 语义样式标签
strong, em, ins, del, code
应该准确使用语义样式标签, 但不能滥用, 如果不能确定时首选使用自然样式标签。

## 文件上传？ 大文件上传
Html5 File API  
支持文件分块  
大文件分块上传
[File API](https://www.html5rocks.com/zh/tutorials/file/dndfiles/)

## e.target e.srcElement
ie支持e.srcElement, ff支持e.target
解决方案：` var target = e.target || e.srcElement;`

## var ev=window.event||ev的作用
- IE8或IE8以下的浏览器中，事件处理函数中使用的事件对象是window.event。
- IE8以上浏览器或者其他标准浏览器，通常使用给事件处理阐述传递的事件对象。