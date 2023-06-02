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
export async function GET({ params }: Arguments): Promise<Response> {
  const { postid } = params;
  const responseData: Body = await fetch(`http://blog-db/posts/${postid}`).then(res => res.json());
  return json(responseData);
}
