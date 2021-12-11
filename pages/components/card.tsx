import React, { FunctionComponent } from "react";
import Link from "next/link";
import { Card } from "antd";
import { EssayMeta } from "../model/essay";

interface IProps {
  essay: EssayMeta;
}

const { Meta } = Card;

const EssayCard: FunctionComponent<IProps> = ({ essay }) => {
  console.log("data", essay);
  return (
  <Link href={`/essay/${essay.slug}`}>
    <Card
      style={{ width: 300, height: 500 }}
      hoverable
      cover={<img alt="example" src={essay.thumbnail} />}
    >
      <Meta title={essay.title} description={essay.description} />
    </Card>
  
  </Link>
  );
};

export default EssayCard;
