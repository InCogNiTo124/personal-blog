import { json } from '@sveltejs/kit';

interface Body {
  tags: string[];
}

/** @type {import('./$types').RequestHandler} */
// export async function GET({ params }): Promise<Response> {
//   const { postid } = params;
//   // page = 1+

//   // const responseData: Body = {
//     // posts: posts.length === 11 ? posts.slice(0, -1) : posts,
//     // lastPage: posts.length < 11,
//   // };
//   
//   return json(responseData);
// }

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }): Promise<Response> {
  const { postid } = params;

  // const tags = db
  //   .prepare(
  //     `select tags.tag_name, tags.id
  //             from post_tags
  //             join tags
  //             on post_tags.tag_id = tags.id
  //             where post_tags.post_id = ?`
  //   )
  //   .all(postid);

  const responseData: Body = await fetch(`http://blog-db/posts/${postid}/tags`).then(res => res.json());
  // console.log(responseData);

  return json(responseData);
}
