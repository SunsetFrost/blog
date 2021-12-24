import Link from "next/link";
import Image from "next/image";

type Props = {
  title: string;
  description: string;
  slug: string;
  thumbnail: string;
  date: string;
};

const EssayCard = ({ date, title, description, thumbnail, slug }: Props) => {
  return (
    <div className="w-full h-full flex items-center">
      <div className="w-full h-full lg:m-8 flex flex-col lg:flex-row justify-center items-center">
        <div className="w-48 max-w-full max-h-2/5 lg:w-2/5 p-4">
          <div className="aspect-w-1 aspect-h-1 rounded-xl mx-auto bg-gradient-to-br from-cyan-200 to-blue-500 shadow-xl">
            <Image
              className="w-full h-full object-cover object-center opacity-30 rounded-xl"
              src={thumbnail}
              alt=""
              layout="fill"
            />
          </div>
        </div>
        <div className="w-full lg:w-2/5 h-3/5 lg:h-4/5 px-8 py-4 text-center">
          <div className="h-4/5 pb-4 text-ellipsis overflow-hidden">
            <div className="text-base font-medium text-slate-400 mb-4">
              {date}
            </div>
            <div className="text-lg lg:text-xl font-bold mb-4 text-ellipsis overflow-hidden">
              {title}
            </div>
            <div className="mb-2 lg:mb-12 text-sm text-slate-500  text-ellipsis text-left overflow-hidden whitespace-pre-wrap">
              {description}
            </div>
          </div>
          <div className="h-1/5 text-center">
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
