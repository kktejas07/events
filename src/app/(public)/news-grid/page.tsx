export const dynamic = "force-dynamic";
export const revalidate = 0;

import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { db } from "@/lib/db";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { innerPageNewsImage } from "@/lib/theme-images";

export default async function NewsGridPage() {
  noStore();

  let posts: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    category: string | null;
    coverImage: string | null;
    publishedAt: Date | null;
  }[] = [];

  try {
    posts = await db.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
    });
  } catch (error) {
    console.error("News grid fetch error:", error);
  }

  const displayPosts =
    posts.length > 0
      ? posts
      : Array.from({ length: 6 }, (_, i) => ({
          id: String(i),
          title: "Design conference insights and creative industry trends",
          slug: "blog",
          excerpt: "Stay updated with the latest from our design conference community.",
          category: "Corporate",
          coverImage: innerPageNewsImage(i),
          publishedAt: new Date(2025, 2, 11 + i),
        }));

  return (
    <>
      <Breadcrumb title="BLOG GRID" label="BLOG GRID" />

      <section className="gt-news-grid-section section-padding fix">
        <div className="container">
          <div className="row g-4">
            {displayPosts.map((post, i) => (
              <div
                key={post.id}
                className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp"
                data-wow-delay={`.${2 + (i % 3) * 2}s`}
              >
                <div className="gt-news-card-item">
                  <div className="gt-news-image">
                    <img src={innerPageNewsImage(i, post.coverImage)} alt={post.title} />
                    <span>{post.category || "Corporate"}</span>
                  </div>
                  <div className="gt-news-content">
                    <h3>
                      <Link href={post.slug === "blog" ? "/blog" : `/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>
                    <p>{post.excerpt || "Conference news and updates."}</p>
                  </div>
                  <div className="gt-news-post-item">
                    <div className="post-date">
                      <h5>{post.publishedAt ? post.publishedAt.getDate() : 20}</h5>
                      <p>
                        {post.publishedAt
                          ? post.publishedAt.toLocaleString("default", { month: "short" })
                          : "apr"}
                      </p>
                    </div>
                    <Link
                      href={post.slug === "blog" ? "/blog" : `/blog/${post.slug}`}
                      className="gt-link-btn"
                    >
                      <span className="gt-icon-btn">
                        <i className="fa-solid fa-chevrons-right"></i>
                      </span>
                      <span className="gt-radius-btn">READ MORE</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
