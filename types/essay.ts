export type EssayMeta = {
  title: string;
  description: string;
  slug: string;
  thumbnail: string;
  date: string;
}

export type EssayInfo = {
  meta: EssayMeta;
  content: string;
}
