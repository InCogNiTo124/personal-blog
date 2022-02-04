import db from '$lib/database';

interface Params {
  params: {
    page: string;
  };
}

interface Body {
  body: {
    posts: Post[];
    lastPage: boolean;
  };
}

export async function get({ params: { page } }: Params): Promise<Body> {
  const posts: Post[] = db
    .prepare(
      `select * from posts
        where show = 1
        order by date desc
        limit 11
        offset ?`
    )
    .all(10 * (parseInt(page) - 1));

  return {
    body: {
      posts: posts.length === 11 ? posts.slice(0, -1) : posts,
      lastPage: posts.length < 11,
    },
  };
}
