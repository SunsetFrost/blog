interface EssayMeta {
  title: string;
  description: string;
  slug: string;
  thumbnail: string;
}

interface EssayInfo {
  meta: EssayMeta;
  content: string;
}

export type {
  EssayMeta,
  EssayInfo,
}