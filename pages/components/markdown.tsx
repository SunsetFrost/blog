import ReactMarkdown from "react-markdown";
// import { materialLight } from "react-syntax-highlighter/dist/cjs/styles/prism";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { FunctionComponent } from "react";

interface IProps {
  content: string;
}

const Markdown: FunctionComponent<IProps> = ({ content }) => {
  return (
    <ReactMarkdown>{content}</ReactMarkdown>
  )
};

export default Markdown;
