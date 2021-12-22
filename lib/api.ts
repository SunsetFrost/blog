
import fs from 'fs'
import { join } from 'path'

const postsDirectory = join(process.cwd(), '_posts')

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export function getPostString(filename: string) {
  return fs.readFileSync(`_posts/${filename}`).toString();
}