import { FunctionComponent } from "react";
import type { GetStaticProps } from "next";
import Head from "next/head";
import matter from "gray-matter";
import { Pagination, Navigation, Scrollbar, A11y, Mousewheel } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";

import { getPostSlugs, getPostString } from "../lib/api";
import { EssayMeta } from "../types/essay";
import EssayCard from "./components/card";
import Meta from "./components/meta";
// import Canvas from "./components/triangle";
import Canvas from "./components/heart";

export interface IProps {
  essays: EssayMeta[];
}

const Home: FunctionComponent<IProps> = ({ essays }) => {
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex shadow-xl">
      <Meta />
      <Head>
        <title>Sunset Frost Blog</title>
        <meta property="og:title" content="Sunset Frost Blog" />
        <meta
          property="og:description"
          content="Sunset Frost's Blog. Life needs to have some meaning."
        />
        <meta property="og:url" content="https://sunsetfrost.com/" />
        <meta property="og:type" content="website" />
      </Head>
      <Image
        className="w-full h-full object-cover object-center opacity-10 rounded-xl"
        src="/images/valentine.png"
        alt=""
        layout="fill"
      />
      <div className="container mx-auto">
        {/* <div className="flex flex-col"> */}
        {/* <div className="flex-auto"> */}
        <div className="text-2xl font-bold text-white text-center p-12">
          致我最可爱的美少女🐷
        </div>
        {/* </div> */}
        {/* <div className="flex-auto w-8 h-32"> */}
        <Canvas />
        {/* </div> */}
        {/* </div> */}
      </div>
      {/* <Swiper
        className="p-6 w-10/12 lg:w-3/5 h-3/4 lg:h-2/4 m-auto bg-white rounded-xl shadow-lg"
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
      </Swiper> */}
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
