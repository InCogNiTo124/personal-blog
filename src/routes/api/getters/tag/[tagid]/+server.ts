import db from '$lib/server/database';
import { json } from '@sveltejs/kit';

interface Body {
  tagName: string;
}

/** @type {import('./$types').RequestHandler} */
export function GET({ params }): Response {
  const { tagid } = params;

  const { tag_name: tagName } = db
    .prepare('select tag_name from tags where id = ?')
    .get(tagid);

  const responseData: Body = {
    tagName,
  };

  return json(responseData);
}
