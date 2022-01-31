import db from '$lib/database';

interface Body {
  body: {
    tags: string[];
  };
}

export async function get({ params }): Promise<Body> {
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

  return {
    body: {
      tags,
    },
  };
}
