import db from '$lib/database';

interface Body {
  body: {
    posts: Post[];
  };
}

export async function get(): Promise<Body> {
  const posts: Post[] = db.prepare('select * from posts order by date desc limit 10').all();

  return {
    body: {
      posts,
    },
  };
}
