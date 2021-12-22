import { FunctionComponent } from "react";
import Image from "next/image";
import fs from "fs";
import matter from "gray-matter";
import { getPostSlugs, getPostString } from "../../lib/api";
import { EssayInfo } from "../../types/essay";
import Markdown from "../components/markdown";

interface IProps {
  essay: EssayInfo;
}

const Essay: FunctionComponent<IProps> = ({ essay }) => {
  return (
    <div className="flex flex-col align-middle w-screen h-screen">
      <div className="relative w-screen h-40 lg:h-80">
        <div className="w-full h-full bg-gradient-to-br from-cyan-200 to-blue-500">
          <Image
            className="object-cover object-center opacity-30"
            src={essay.meta.thumbnail}
            alt="blog tumbnail"
            layout="fill"
          />
        </div>

        <div className="absolute top-0 left-0 w-full">
          <h1 className="text-slate-50 w-4/5 text-center font-bold  text-lg lg:text-3xl mx-auto mt-10 lg:mt-20">
            {essay.meta.title}
          </h1>
        </div>
      </div>

      <div className="w-11/12 lg:max-w-6xl -mt-10 z-10 py-8 px-4 lg:px-12 mx-auto bg-white rounded-xl shadow-xl">
        <Markdown content={essay.content} />
      </div>
    </div>
  );
};

export async function getStaticPaths() {
  const files = getPostSlugs();
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
  const filename = `${slug}.md`;
  const content = getPostString(filename);
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
