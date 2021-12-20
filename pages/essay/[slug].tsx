import { FunctionComponent } from "react";
import Image from "next/image";
import { GetStaticPaths, GetStaticProps } from "next";
import fs from "fs";
import matter from "gray-matter";
import { EssayInfo } from "../model/essay";
import Markdown from "../components/markdown";

interface IProps {
  essay: EssayInfo;
}

const Essay: FunctionComponent<IProps> = ({ essay }) => {
  return (
    <div className="flex flex-col align-middle w-screen h-screen">
      <div className="relative w-full">
        <div className="bg-gradient-to-br from-cyan-200 to-blue-500">
          <img className="object-cover opacity-30" src={essay.meta.thumbnail} />
        </div>

        <div className="absolute top-0 left-0 w-full">
          <h1 className="text-white w-3/5 text-center font-bold text-xl mx-auto mt-10">{essay.meta.title}</h1>
        </div>
      </div>

      <div className="w-11/12 -mt-10 z-10 py-8 px-4 mx-auto bg-white rounded-xl shadow-xl">
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

export default Essay;
