interface EssayMeta {
  title: string;
  description: string;
  slug: string;
  thumbnail: string;
  date: string;
}

interface EssayInfo {
  meta: EssayMeta;
  content: string;
}

export type {
  EssayMeta,
  EssayInfo,
}