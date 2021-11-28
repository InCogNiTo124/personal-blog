<script lang="ts" context="module">
	import 
type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ page, fetch }) => {
		const res = await fetch(`/posts/${page.params.postid}.json`);
		const { post } = await res.json();
		if (post) {
			return {
				props: {
					post
				}
			};
		}
	};
</script>

<script>
	export let post;
</script>

<h1>{post.title}</h1>

<div bind:innerHTML={post.content} contenteditable="false" />