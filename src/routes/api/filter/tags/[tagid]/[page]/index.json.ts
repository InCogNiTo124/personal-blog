import db from '$lib/database';

interface Arguments {
  params: {
    tagid: string;
    page: string;
  };
}

interface Body {
  body: {
    posts: Post[];
    lastPage: boolean;
  };
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({ params }: Arguments): Promise<Body> {
  const { tagid, page } = params;

  let where_condition = 'where post_tags.tag_id = ?';

  if (!Number(tagid)) {
    where_condition = 'where tags.tag_name = ?';
  }

  const posts: Post[] = await db
    .prepare(
      `select posts.title, posts.date, posts.subtitle, posts.show, posts.id
            from post_tags 
            join posts
            on posts.id = post_tags.post_id
            join tags
            on post_tags.tag_id = tags.id
            ${where_condition}
              and posts.show = 1
            order by date desc
            limit 11
            offset ?`
    )
    .all(tagid, 10 * (parseInt(page) - 1));

  posts.forEach((post) => {
    post.tags = db
      .prepare(
        `select tags.tag_name, tags.id
                from post_tags
                join tags
                on post_tags.tag_id = tags.id
                where post_tags.post_id = ?`
      )
      .all(post.id);
  });

  return {
    body: {
      posts: posts.length === 11 ? posts.slice(0, -1) : posts,
      lastPage: posts.length < 11,
    },
  };
}
