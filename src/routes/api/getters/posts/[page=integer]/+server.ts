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
export async function GET({ params: { page } }: Params): Promise<Response> {
  //const posts: Post[] = db
  //  .prepare(
  //    `select * from posts
  //      where show = 1
  //      order by date desc
  //      limit 11
  //      offset ?`
  //  )
  //  .all(10 * (parseInt(page) - 1));

  const posts: Post[] = await fetch(`http://blog-db/posts/${page}`).then(res => res.json());
  const responseData: Body = {
    posts: posts.length === 11 ? posts.slice(0, -1) : posts,
    lastPage: posts.length < 11,
  };
  
  return json(responseData);
}
