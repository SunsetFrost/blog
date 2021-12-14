import ReactMarkdown from "react-markdown";
import { materialDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

import { FunctionComponent } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";

type Props = {
  content: string;
};

const Markdown = ({ content }: Props) => {
  const components = {
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
    <div className="markdown-body">
      <ReactMarkdown
        components={components}
        children={content}
        remarkPlugins={[remarkGfm]}
      />
    </div>
  );
};

export default Markdown;
