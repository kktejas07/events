export const dynamic = "force-dynamic";
export const revalidate = 0;

import { unstable_noStore as noStore } from "next/cache";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { db } from "@/lib/db";
import { innerPageNewsImage } from "@/lib/theme-images";

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  noStore();

  const { slug } = params;

  const post = await db.blogPost.findUnique({
    where: { slug },
  });

  if (!post || !post.published) {
    notFound();
  }

  const recentPosts = await db.blogPost.findMany({
    where: { published: true, id: { not: post.id } },
    take: 5,
    orderBy: { publishedAt: "desc" },
  });

  const allPosts = await db.blogPost.findMany({
    where: { published: true },
    select: { category: true },
  });
  const categories = [
    ...new Set(allPosts.filter((p) => p.category).map((p) => p.category as string)),
  ];

  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <>
      <Breadcrumb
        title="BLOG DETAILS"
        crumbs={[
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]}
      />

      <section className="gt-news-section section-padding fix">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="gt-news-details-post">
                <div className="gt-news-details-image">
                  <img src={innerPageNewsImage(0, post.coverImage)} alt={post.title} />
                  <span>{post.category || "General"}</span>
                </div>
                <div className="gt-news-details-content">
                  <h2>{post.title}</h2>
                  {post.author && (
                    <h5>By {post.author} &mdash; {publishedDate}</h5>
                  )}
                  <div
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="gt-sidebar-widget-wrapper">
                <div className="gt-sidebar-widget wow fadeInUp" data-wow-delay=".3s">
                  <form action="/blog" method="GET" className="gt-sidebar-search-form">
                    <input type="text" name="s" placeholder="Search..." />
                    <button type="submit">
                      <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                  </form>
                </div>

                {categories.length > 0 && (
                  <div className="gt-sidebar-widget wow fadeInUp" data-wow-delay=".5s">
                    <h4 className="gt-sidebar-widget-title">Categories</h4>
                    <ul className="gt-sidebar-category-list">
                      {categories.map((cat) => (
                        <li key={cat}>
                          <a href={`/blog?category=${encodeURIComponent(cat)}`}>{cat}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {recentPosts.length > 0 && (
                  <div className="gt-sidebar-widget wow fadeInUp" data-wow-delay=".7s">
                    <h4 className="gt-sidebar-widget-title">Recent Posts</h4>
                    {recentPosts.map((rp) => (
                      <div key={rp.id} className="gt-sidebar-recent-post">
                        <div className="gt-sidebar-recent-image">
                          <img src={innerPageNewsImage(recentPosts.indexOf(rp), rp.coverImage)} alt={rp.title} />
                        </div>
                        <div className="gt-sidebar-recent-content">
                          <h6>
                            <Link href={`/blog/${rp.slug}`}>{rp.title}</Link>
                          </h6>
                          <span>
                            {rp.publishedAt
                              ? new Date(rp.publishedAt).toLocaleDateString("en-US", {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : ""}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
