---
title: NestJS + Markdown + Tailwind搭建极简个人博客
description: NextJS是基于React的框架，支持SSR等特性，本文使用NextJS+Markdown+Tailwind+Typescript搭建极简个人博客
thumbnail: /images/2021-12-14.jpg
date: 14 December 2021
categories: IT
---
## 简介
本文将介绍
- NextJS + React Markdown
- Tailwind
- 读取本地Markdown文件夹生成博客首页
- 读取Markdown文件内容生成博客详情页
## 创建Nextjs项目
```bash
# with yarn
yarn create next-app blog --typescript
# with npm
npx create-next-app blog --ts
```

### markdown包
```bash
# with yarn
yarn add gray-matter react-markdown react-syntax-highlighter
yarn add @types/react-syntax-highlighter --dev
# with npm
npm install gray-matter react-markdown react-syntax-highlighter
npm install  @types/react-syntax-highlighter --save-dev
```

### react markdown
react markdown本身支持基本语法，需要代码高亮和TODO List等功能需要安装插件。
- react-syntax-highlighter    
  语法高亮支持
- remark-gfm     
  TODO List等功能支持

## Tailwind
安装`Tailwind`
```bash
yarn add  -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

配置`Taiwind`  
`tailwind.config.js`
```js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```
`global.scss`
```scss
@tailwind base;
@tailwind components;
@tailwind utilities;
```

配置完成后即可在Next项目中使用`Tailwind Css`了

eg:
```tsx
export default function Home() {
  return (
    <h1 className="text-3xl font-bold underline">
      Hello world!
    </h1>
  )
}
```
### Vscode Tailwind插件不生效问题
安装插件后发现智能提示并没有生效，解决方案如下
> In vscode - extensions - Tailwin CSS Intellisense. Click on the settings button ("manage").  
Find Tailwind CSS - Include languages
Click 'edit in settings.json'  
add
"tailwindCSS.includeLanguages": { "plaintext": "javascript" }

### MarkDown Heading样式不生效
markdown配置完成预览时发现Heading样式没有生效，试了很多办法，包括react-markdown更换为mdx也没有生效。最后发现是tailwind的问题，如下为官网说明
> Headings are unstyled  
All heading elements are completely unstyled by default, and have the same font-size and font-weight as normal text.

可知Tailwind默认将Heading样式均设置为了普通文字样式，因此需要自行配置Heading样式，或者采用Tailwind提供的`@tailwindcss/typography`插件。

### 

## 博客数据Model定义
将博客数据分为元数据与正文，元数据包含博文标题，创作日期等信息；正文对应Markdown字符串。
```typescript
interface EssayMeta {
  title: string;
  description: string;
  slug: string;
  thumbnail: string;
  date: string;
}

interface EssayInfo {
  meta: EssayMeta;
  content: string;
}

export type {
  EssayMeta,
  EssayInfo,
}
```

## 博客首页
通过读取本地`posts`中的博客文件动态生成首页博客目录

## 博客详情页

### Markdown组件

## Deploy
vercel

## 总结
