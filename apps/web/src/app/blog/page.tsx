import type { Metadata } from "next";
import Link from "next/link";
import { basehub } from "basehub";

export const revalidate = 60;
export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  const { weatherIoBlog } = await basehub().query({
    weatherIoBlog: {
      _title: true,
      title: true,
      subtitle: true,
    },
  });

  return {
    title: weatherIoBlog._title,
    description: weatherIoBlog.subtitle,
    // etc...
  };
}

const BlogPage = async () => {
  const { weatherIoBlog } = await basehub({ next: { revalidate: 60 } }).query({
    weatherIoBlog: {
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
    <div className="container">
      <div>{weatherIoBlog.subtitle}</div>
      <ul>
        {weatherIoBlog.blogPosts.items.map((post) => {
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
