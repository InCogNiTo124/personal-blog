import { json } from '@sveltejs/kit';

interface Body {
  tags: string[];
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }): Promise<Response> {
  const { postid } = params;

  const responseData: Body = await fetch(`http://blog-db/posts/${postid}/tags`).then(res => res.json());
  // console.log(responseData);

  return json(responseData);
}
