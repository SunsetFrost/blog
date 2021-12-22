import React, { FunctionComponent } from "react";
import Link from "next/link";
import Image from "next/image";

import { EssayMeta } from "../../types/essay";

type Props = {
  title: string;
  description: string;
  slug: string;
  thumbnail: string;
  date: string;
}

const EssayCard = ({ date, title, description, thumbnail, slug }: Props) => {
  return (
    <div className="w-full h-full flex items-center">
      <div className="w-full h-full py-4 lg:m-8 flex flex-col lg:flex-row justify-center items-center">
        <div className="w-4/5 lg:w-2/5">
          <div className="aspect-w-1 aspect-h-1 mb-4 rounded-xl mx-auto bg-gradient-to-br from-cyan-200 to-blue-500 shadow-xl">
            <Image
              className="object-cover object-center opacity-30 w-full h-full rounded-xl"
              src={thumbnail}
              alt=""
              layout='fill'
            />
          </div>
        </div>
        <div className="w-4/5 lg:w-2/5 h-2/5 lg:h-4/5 mx-auto text-center">
          <div className="h-4/5 pb-4 text-ellipsis overflow-hidden">
            <div className="text-base font-medium text-slate-400 mb-4">
              {date}
            </div>
            <div className="text-lg lg:text-xl font-bold mb-6 text-ellipsis overflow-hidden">{title}</div>
            <div className="text-sm text-slate-500 text-left mb-12">
              {description}
            </div>
          </div>
          <div className="h-1/5 mx-6 text-center">
            <Link href={`/essay/${slug}`} passHref>
              <div className="py-2 px-4 rounded-lg shadow-md text-white bg-sky-500 hover:bg-sky-700">
                READ MORE
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EssayCard;
