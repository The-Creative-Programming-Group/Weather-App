import type { Metadata } from "next";
import Link from "next/link";
import { basehub } from "basehub";
import { RichText } from "basehub/react";

export const revalidate = 60;
export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  const { blogIndex } = await basehub().query({
    blogIndex: {
      _title: true,
      title: true,
      subtitle: true,
    },
  });

  return {
    title: blogIndex._title,
    description: blogIndex.subtitle,
    // etc...
  };
}

const BlogPage = async () => {
  const { blogIndex } = await basehub({ next: { revalidate: 60 } }).query({
    blogIndex: {
      title: true,
      subtitle: true,
      blogPosts: {
        items: {
          _id: true,
          _title: true,
          _slug: true,
        },
      },
    },
  });

  return (
    <div>
      <h1>{blogIndex.title}</h1>
      <div>{blogIndex.subtitle}</div>
      <ul>
        {blogIndex.blogPosts.items.map((post) => {
          return (
            <li key={post._id}>
              <Link href={`/blog/${post._slug}`}>{post._title}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default BlogPage;
