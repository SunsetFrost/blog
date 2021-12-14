import { FunctionComponent } from 'react';
import Image from 'next/image';
import { GetStaticPaths, GetStaticProps } from 'next';
import fs from 'fs'
import matter from 'gray-matter';
import { EssayInfo } from '../model/essay';
import Markdown from '../components/markdown';
import styles from './essay.module.scss';

interface IProps {
  essay: EssayInfo;
}

const Essay: FunctionComponent<IProps> = ({ essay }) => {
  return (<div className={styles.article}>
    <div className={styles.thumbnail}>
      <img src={essay.meta.thumbnail} />

      <div className={styles.title}>
        <h1>{essay.meta.title}</h1>
      </div>
    </div>

    <div className={styles.content}>
      <Markdown content={essay.content} />
    </div>
  </div>)
}

export async function getStaticPaths() {
  const files = fs.readdirSync("posts");
  const paths = files.map(file => (
    {
      params: {
        slug: file.split('.')[0]
      }
    }
  ))
  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ ...ctx }) {
  const { slug } = ctx.params;
  const content = fs.readFileSync(`posts/${slug}.md`).toString();
  const info = matter(content);
  const essay = {
    meta: {
      ...info.data,
      slug,
    },
    content: info.content,
  }

  return {
    props: {
      essay: essay
    }
  }
}

export default Essay;