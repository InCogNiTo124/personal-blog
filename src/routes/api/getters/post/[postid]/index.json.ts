import db from '$lib/database';

interface Arguments {
  params: {
    postid: string;
  };
}

interface Body {
  body: { post: Post };
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({ params }: Arguments): Promise<Body> {
  const { postid } = params;

  const post: Post = await db.prepare('SELECT * FROM posts where id = ?').get(postid);

  return {
    body: {
      post,
    },
  };
}
