import { json } from '@sveltejs/kit';

interface Body {
  tagName: string;
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }): Promise<Response> {
  const { tagid } = params;

  const responseData: Body = await fetch(`http://blog-db/tags/${tagid}`).then(res => res.json());

  return json(responseData);
}
