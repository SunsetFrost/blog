---
title: NestJS + Markdown + Typescript搭建极简个人博客
description: NextJS是基于React的框架，支持SSR等特性，本文使用NextJS和Markdown搭建极简个人博客
thumbnail: /images/2021-12-14.jpg
date: 14 December 2021
categories: IT
---

# NestJS + Markdown + Typescript 搭建极简个人博客
NextJS是基于React的框架，支持SSR等特性，本文使用NextJS和Markdown搭建极简个人博客

## 创建nextjs项目
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

## Deploy
vercel
