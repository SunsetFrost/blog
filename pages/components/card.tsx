import React, { FunctionComponent } from "react";
import Link from "next/link";
import Image from "next/image";

import { EssayMeta } from "../model/essay";

interface IProps {
  essay: EssayMeta;
}

const EssayCard: FunctionComponent<IProps> = ({ essay }) => {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex flex-col">
        <div className="w-60 h-60 rounded-xl my-6 mx-auto bg-gradient-to-br from-cyan-200 to-blue-500 shadow-xl">
          <img
            className="object-cover opacity-30 w-full h-full rounded-xl"
            src={essay.thumbnail}
            alt=""
          />
        </div>
        <div className="w-4/5 mx-auto text-center">
          <div className="text-base font-medium text-slate-400 mb-4">{essay.date}</div>
          <div className="text-xl font-bold mb-6">{essay.title}</div>
          <div className="text-sm text-slate-500 text-left mb-12">{essay.description}</div>
          <Link href={`/essay/${essay.slug}`}>
            <div className="py-2 px-4 rounded-lg shadow-md text-white bg-sky-500 hover:bg-sky-700">READ MORE</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EssayCard;
