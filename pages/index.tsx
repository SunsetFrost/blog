import { FunctionComponent } from "react";
import type { GetStaticProps } from "next";
import fs from "fs";
import matter from "gray-matter";
import { EssayMeta } from "./model/essay";
import EssayCard from "./components/card";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Scrollbar, A11y, Mousewheel } from "swiper";

export interface IProps {
  essays: EssayMeta[];
}

const Home: FunctionComponent<IProps> = ({ essays }) => {
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-cyan-400 to-blue-500 flex">
      <Swiper
        className="p-6 w-3/5 h-2/4 m-auto bg-white rounded-xl shadow-lg flex items-center space-x-4"
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
            {/* <EssayCard essay={essay} /> */}
            {essay.title}
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

export default Home;
