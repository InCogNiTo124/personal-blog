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
