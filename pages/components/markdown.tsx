import ReactMarkdown from "react-markdown";
import { Components } from 'react-markdown/lib/ast-to-react'
import { materialDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";

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

export default Markdown;
