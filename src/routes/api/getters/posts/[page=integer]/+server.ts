import db from '$lib/server/database';
import { json } from '@sveltejs/kit';

interface Params {
  params: {
    page: string;
  };
}

interface Body {
  posts: Post[];
  lastPage: boolean;
}

/** @type {import('./$types').RequestHandler} */
export function GET({ params: { page } }: Params): Response {
  const posts: Post[] = db
    .prepare(
      `select * from posts
        where show = 1
        order by date desc
        limit 11
        offset ?`
    )
    .all(10 * (parseInt(page) - 1));

  const responseData: Body = {
    posts: posts.length === 11 ? posts.slice(0, -1) : posts,
    lastPage: posts.length < 11,
  };
  
  return json(responseData);
}
