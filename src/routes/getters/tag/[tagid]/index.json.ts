import db from '$lib/database';

interface Body {
  body: {
    tagName: string;
  };
}

export async function get({ params }): Promise<Body> {
  const { tagid } = params;

  const { tag_name: tagName } = db.prepare('select tag_name from tags where id = ?').get(tagid);

  return {
    body: {
      tagName,
    },
  };
}
