# Nest Blog
## 简介
项目要点
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

### Tailwind自定义主题
Tailwind默认的行内代码块样式很丑，可以通过自定义主题的方案解决，如下为笔者的自定义主题，读者可根据需求自行扩展。
`tailwind.config.js`
```javascript
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            pre: {
              color: "#2f2f2f",
              backgroundColor: "#2f2f2f",
            },
            "pre code::before": {
              "padding-left": "unset",
            },
            "pre code::after": {
              "padding-right": "unset",
            },
            code: {
              backgroundColor: "#f3f4f6",
              color: "#f59e0b",
              fontWeight: "400",
              "border-radius": "0.25rem",
            },
            "code::before": {
              content: '""',
              "padding-left": "0.25rem",
            },
            "code::after": {
              content: '""',
              "padding-right": "0.25rem",
            },
          },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};

```

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
首页将实现可滑动卡片的效果，每个卡片对应一个博客文章。通过读取本地`posts`中的博客文件动态生成首页博客卡片组。使用Swiper滑动组件实现卡片的滑动效果。

```typescript

const Home: FunctionComponent<IProps> = ({ essays }) => {
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-cyan-400 to-blue-500 flex shadow-xl">
      <Swiper
      className="p-6 w-10/12 lg:w-3/5 h-4/5  lg:h-2/4 m-auto bg-white rounded-xl shadow-lg"
        spaceBetween={30}
        effect="fade"
        loop={true}
        mousewheel={true}
        direction={"vertical"}
        modules={[Pagination, Navigation, Scrollbar, A11y, Mousewheel]}
        pagination={{ clickable: true, type: "bullets" }}
        scrollbar={{ draggable: true }}
        navigation
      >
        {essays.map((essay, index) => (
          <SwiperSlide key={index} className="">
            <EssayCard essay={essay} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const files = fs.readdirSync("posts");

  const posts = files.map((filename) => {
    const markdownWithMeta = fs.readFileSync(`posts/${filename}`).toString();
    const { data } = matter(markdownWithMeta);

    return {
      ...data,
      slug: filename.split(".")[0],
    };
  });

  return {
    props: {
      essays: posts,
    },
  };
};

```

### 首页卡片
卡片中展示博客的元数据，标题，描述，时间等。
```typescript

interface IProps {
  essay: EssayMeta;
}

const EssayCard: FunctionComponent<IProps> = ({ essay }) => {
  return (
    <div className="w-full h-full flex items-center">
      <div className="w-full h-full py-4 lg:m-8 flex flex-col lg:flex-row justify-center items-center">
        <div className="w-4/5 lg:w-2/5">
          <div className="aspect-w-1 aspect-h-1 mb-4 rounded-xl mx-auto bg-gradient-to-br from-cyan-200 to-blue-500 shadow-xl">
            <img
              className="object-cover object-center opacity-30 w-full h-full rounded-xl"
              src={essay.thumbnail}
              alt=""
            />
          </div>
        </div>
        <div className="w-4/5 lg:w-2/5 h-2/5 lg:h-4/5 mx-auto text-center">
          <div className="h-4/5 pb-4 text-ellipsis overflow-hidden">
            <div className="text-base font-medium text-slate-400 mb-4">
              {essay.date}
            </div>
            <div className="text-lg lg:text-xl font-bold mb-6 text-ellipsis overflow-hidden">{essay.title}</div>
            <div className="text-sm text-slate-500 text-left mb-12">
              {essay.description}
            </div>
          </div>
          <div className="h-1/5 mx-6 text-center">
            <Link href={`/essay/${essay.slug}`}>
              <div className="py-2 px-4 rounded-lg shadow-md text-white bg-sky-500 hover:bg-sky-700">
                READ MORE
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
```

## 博客详情页
通过首页点击可进入详情页面，将详情页命名为`[slug].tsx`, NextJS根据`getStaticProps`与`getStaticPaths`两个方法动态生成路由并读取Markdown文件内容。
`[slug].tsx`
```tsx

const Essay: FunctionComponent<IProps> = ({ essay }) => {
  return (
    <div className="flex flex-col align-middle w-screen h-screen">
      <div className="relative w-full h-40 lg:h-80">
        <div className="bg-gradient-to-br from-cyan-200 to-blue-500">
          <img className="w-full h-96 object-cover opacity-30" src={essay.meta.thumbnail} />
        </div>

        <div className="absolute top-0 left-0 w-full">
          <h1 className="text-slate-50 w-4/5 text-center font-bold  text-lg lg:text-3xl mx-auto mt-10 lg:mt-20">{essay.meta.title}</h1>
        </div>
      </div>

      <div className="w-11/12 lg:max-w-6xl -mt-10 z-10 py-8 px-4 lg:px-12 mx-auto bg-white rounded-xl shadow-xl">
        <Markdown content={essay.content} />
      </div>
    </div>
  );
};

export async function getStaticPaths() {
  const files = fs.readdirSync("posts");
  const paths = files.map((file) => ({
    params: {
      slug: file.split(".")[0],
    },
  }));
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ ...ctx }) {
  const { slug } = ctx.params;
  const content = fs.readFileSync(`posts/${slug}.md`).toString();
  const info = matter(content);
  const essay = {
    meta: {
      ...info.data,
      slug,
    },
    content: info.content,
  };

  return {
    props: {
      essay: essay,
    },
  };
}
```

### Markdown组件
Markdown组件通过读取markdown文件的字符内容，将字符格式化为博客样式，默认react markdown不支持TODO，代码高亮等特性，需要通过插件方式扩展其功能。
```tsx

type Props = {
  content: string;
};

const Markdown = ({ content }: Props) => {
  const components: Components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");

      return !inline && match ? (
        <SyntaxHighlighter
          style={materialDark}
          PreTag="div"
          language={match[1]}
          children={String(children).replace(/\n$/, "")}
          {...props}
        />
      ) : (
        <code className={className ? className : ""} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <article className="prose prose-sm  lg:prose-md">
      <ReactMarkdown
        components={components}
        children={content}
        remarkPlugins={[remarkGfm]}
      />
    </article>
  );
};
```

## Deploy
部署可通过传统build+静态部署或者Gitpages的方案解决，笔者推荐使用Vercel，能够实现自动化部署且不同于Github其访问速度良好。

## 结语
项目完整源码地址: [Github](https://github.com/SunsetFrost/blog)  
如本文对您有些许帮助，请Star下！！！