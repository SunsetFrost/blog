import { FunctionComponent } from "react";
import type { GetStaticProps } from "next";
import Head from "next/head";
import matter from "gray-matter";
import { Pagination, Navigation, Scrollbar, A11y, Mousewheel } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import { getPostSlugs, getPostString } from "../lib/api";
import { EssayMeta } from "../types/essay";
import EssayCard from "./components/card";
import Meta from "./components/meta";

export interface IProps {
  essays: EssayMeta[];
}

const Home: FunctionComponent<IProps> = ({ essays }) => {
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-cyan-400 to-blue-500 flex shadow-xl">
      <Meta />
      <Head>
        <title>Sunset Frost Blog</title>
        <meta property="og:title" content="Sunset Frost Blog" />
        <meta
          property="og:description"
          content="Sunset Frost's Blog. Life needs to have some meaning."
        />
        <meta property="og:url" content="https://sunsetfrost.art/" />
        <meta property="og:type" content="website" />
      </Head>
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
            <EssayCard
              date={essay.date}
              title={essay.title}
              description={essay.description}
              thumbnail={essay.thumbnail}
              slug={essay.slug}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const files = getPostSlugs();

  const posts = files.map((filename) => {
    const markdownWithMeta = getPostString(filename);
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

export default Home;
