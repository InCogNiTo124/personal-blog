import db from '$lib/database';

interface Body {
	body: {
		posts: Array<Post>;
	};
}

export async function get(): Promise<Body> {
	const posts: Array<Post> = db.prepare('select * from posts').all();

	posts.forEach((post) => {
		post.content = JSON.parse(post.content);
	});

	return {
		body: {
			posts
		}
	};
}
