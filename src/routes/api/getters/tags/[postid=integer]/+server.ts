import db from '$lib/server/database';
import { json } from '@sveltejs/kit';

interface Body {
  tags: string[];
}

/** @type {import('./$types').RequestHandler} */
export function GET({ params }): Response {
  const { postid } = params;

  const tags = db
    .prepare(
      `select tags.tag_name, tags.id
              from post_tags
              join tags
              on post_tags.tag_id = tags.id
              where post_tags.post_id = ?`
    )
    .all(postid);

  const responseData: Body = {
    tags,
  };

  return json(responseData);
}
