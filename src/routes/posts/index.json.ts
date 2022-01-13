import db from '$lib/database';

interface Body {
  body: {
    posts: Array<Post>;
  };
}

export async function get(): Promise<Body> {
  const posts: Array<Post> = db.prepare('select * from posts order by date desc limit 10').all();

  return {
    body: {
      posts,
    },
  };
}
