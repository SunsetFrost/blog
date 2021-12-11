import { FunctionComponent } from "react";
import type { GetStaticProps } from "next";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import fs from "fs";
import matter from "gray-matter";
import { Layout, Menu, Breadcrumb, Button } from "antd";
import { DesktopOutlined, PieChartOutlined } from "@ant-design/icons";
import { EssayMeta } from "./model/essay";
import EssayCard from "./components/card";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import { type } from "os";

export interface IProps {
  essays: EssayMeta[];
}

const Home: FunctionComponent<IProps> = ({ essays }) => {
  return (
    <div className="blog-container">
      <Swiper
        className="blog-slider"
        spaceBetween={30}
        effect="fade"
        loop={true}
        mousewheel={true}
        direction={'vertical'}
        modules={[Pagination]}
        pagination={{ clickable: true, type: 'bullets' }}
      >
        <SwiperSlide className="blog-slider__item">
          <div className="blog-slider__img">
            <Image
              width={300}
              height={300}
              className="test-img"
              src="https://res.cloudinary.com/muhammederdem/image/upload/q_60/v1535759872/kuldar-kalvik-799168-unsplash.webp"
              alt=""
            />
          </div>
          <div className="blog-slider__content">
            <span className="blog-slider__code">26 December 2019</span>
            <div className="blog-slider__title">Lorem Ipsum Dolor</div>
            <div className="blog-slider__text">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Recusandae voluptate repellendus magni illo ea animi?{" "}
            </div>
            <a href="#" className="blog-slider__button">
              READ MORE
            </a>
          </div>
        </SwiperSlide>
        <SwiperSlide className="blog-slider__item swiper-slide">
          <div className="blog-slider__img">
            <Image
              width={300}
              height={300}
              src="https://res.cloudinary.com/muhammederdem/image/upload/q_60/v1535759871/jason-leung-798979-unsplash.webp"
              alt=""
            />
          </div>
          <div className="blog-slider__content">
            <span className="blog-slider__code">26 December 2019</span>
            <div className="blog-slider__title">Lorem Ipsum Dolor2</div>
            <div className="blog-slider__text">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Recusandae voluptate repellendus magni illo ea animi?
            </div>
            <a href="#" className="blog-slider__button">
              READ MORE
            </a>
          </div>
        </SwiperSlide>
        <SwiperSlide className="blog-slider__item swiper-slide">
          <div className="blog-slider__img">
            <Image
              width={300}
              height={300}
              src="https://res.cloudinary.com/muhammederdem/image/upload/q_60/v1535759871/alessandro-capuzzi-799180-unsplash.webp"
              alt=""
            />
          </div>
          <div className="blog-slider__content">
            <span className="blog-slider__code">26 December 2019</span>
            <div className="blog-slider__title">Lorem Ipsum Dolor</div>
            <div className="blog-slider__text">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Recusandae voluptate repellendus magni illo ea animi?
            </div>
            <a href="#" className="blog-slider__button">
              READ MORE
            </a>
          </div>
        </SwiperSlide>
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
