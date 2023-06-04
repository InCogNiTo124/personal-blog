//import db from '$lib/server/database';
import { json } from '@sveltejs/kit';

interface Arguments {
  params: {
    tagid: string;
    page: string;
  };
}

interface Body {
  posts: Post[];
  lastPage: boolean;
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }: Arguments): Promise<Response>{
  const { tagid, page } = params;

  //let where_condition = 'where post_tags.tag_id = ?';

  //if (!Number(tagid)) {
  //  where_condition = 'where tags.tag_name = ?';
  //}

  //const posts: Post[] = db
  //  .prepare(
  //    `select posts.title, posts.date, posts.subtitle, posts.show, posts.id
  //          from post_tags 
  //          join posts
  //          on posts.id = post_tags.post_id
  //          join tags
  //          on post_tags.tag_id = tags.id
  //          ${where_condition}
  //            and posts.show = 1
  //          order by date desc
  //          limit 11
  //          offset ?`
  //  )
  //  .all(tagid, 10 * (parseInt(page) - 1));

  const posts: Post[] = await fetch(`http://blog-db/filter/tags/${tagid}?page=${page}`).then((res) => res.json());
  for (const post of posts) {
    post.tags = await fetch(`http://blog-db/posts/${post.id}/tags`).then((res) => res.json()).then((tags) => {console.log(tags.tags); return tags.tags});
  }

  const responseData: Body = {
    posts: posts.length === 11 ? posts.slice(0, -1) : posts,
    lastPage: posts.length < 11,
  };
  return json(responseData);
}
