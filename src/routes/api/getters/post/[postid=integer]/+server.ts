import db from '$lib/server/database';
import { json } from '@sveltejs/kit';

interface Arguments {
  params: {
    postid: string;
  };
}

interface Body {
  post: Post;
}

/** @type {import('./$types').RequestHandler} */
export function GET({ params }: Arguments): Response {
  const { postid } = params;

  const post: Post = db
    .prepare('SELECT * FROM posts where id = ?')
    .get(postid);

  const responseData: Body = {
    post,
  };

  return json(responseData);
}
