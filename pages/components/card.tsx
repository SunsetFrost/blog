import React, { FunctionComponent } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "antd";
import { SwiperSlide } from "swiper/react";
import { EssayMeta } from "../model/essay";
import styles from './card.module.scss';

interface IProps {
  essay: EssayMeta;
}

const EssayCard: FunctionComponent<IProps> = ({ essay }) => {
  return (
    <div className={styles.item}>
      <div className={styles.img}>
        <Image width={300} height={300} src={essay.thumbnail} alt="" />
      </div>
      <div className={styles.content}>
        <span className={styles.code}>{essay.date}</span>
        <div className={styles.title}>{essay.title}</div>
        <div className={styles.text}>{essay.description}</div>
        <Link href={`/essay/${essay.slug}`}>
          <div className={styles.button}>READ MORE</div>
        </Link>
      </div>
    </div>
  );
};

export default EssayCard;
