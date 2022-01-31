/// <reference types="@sveltejs/kit" />

interface Post {
  id: number;
  date: string;
  title: string;
  subtitle: string;
  content: string;
  tags: Tag[];
}

interface Tag {
  id: number;
  tag_name: string;
}
