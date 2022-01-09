import db from '$lib/database';

interface Body {
  body: {
    posts: Array<Post>;
  };
}

export async function get(): Promise<Body> {
  const posts: Array<Post> = db.prepare('select * from posts').all();

  return {
    body: {
      posts,
    },
  };
}
