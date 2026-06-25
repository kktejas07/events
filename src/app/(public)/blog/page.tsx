export const dynamic = "force-dynamic";
export const revalidate = 0;

import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { db } from "@/lib/db";
import { innerPageNewsImage } from "@/lib/theme-images";

export default async function BlogPage() {
  noStore();

  let posts: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    author: string | null;
    category: string | null;
    coverImage: string | null;
    publishedAt: Date | null;
    createdAt: Date;
  }[] = [];

  try {
    posts = await db.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
    });
  } catch (error) {
    console.error("Blog page fetch error:", error);
  }

  const categories = [...new Set(posts.filter((p) => p.category).map((p) => p.category as string))];
  const recentPosts = posts.slice(0, 5);

  return (
    <>
      <Breadcrumb title="LATEST BLOG" />

      {/*
      =============================================
      NEWS / BLOG SECTION
      =============================================
      */}
      <section className="gt-news-section section-padding fix">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="row">
                {posts.length > 0 ? (
                  posts.map((post, i) => (
                    <div
                      key={post.id}
                      className="col-xl-6 col-lg-6 col-md-6 wow fadeInUp"
                      data-wow-delay=".3s"
                    >
                      <div className="gt-news-card-item">
                        <div className="gt-news-image">
                          <img src={innerPageNewsImage(i, post.coverImage)} alt={post.title} />
                          <span>{post.category || "General"}</span>
                        </div>
                        <div className="gt-news-content">
                          <h3>
                            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                          </h3>
                          <p>{post.excerpt || ""}</p>
                        </div>
                        <div className="gt-news-post-item">
                          <div className="post-date">
                            <h5>
                              {post.publishedAt
                                ? new Date(post.publishedAt).getDate()
                                : new Date(post.createdAt).getDate()}
                            </h5>
                            <p>
                              {post.publishedAt
                                ? new Date(post.publishedAt).toLocaleString("default", {
                                    month: "short",
                                  })
                                : new Date(post.createdAt).toLocaleString("default", {
                                    month: "short",
                                  })}
                            </p>
                          </div>
                          <Link href={`/blog/${post.slug}`} className="gt-link-btn">
                            <span className="gt-icon-btn">
                              <i className="fa-solid fa-chevrons-right"></i>
                            </span>
                            <span className="gt-radius-btn">READ MORE</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12 py-5 text-center">
                    <p className="text-white">No blog posts found.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="col-lg-4">
              <div className="gt-sidebar-widget-wrapper">
                <div
                  className="gt-sidebar-widget wow fadeInUp"
                  data-wow-delay=".3s"
                >
                  <form action="/blog" method="GET" className="gt-sidebar-search-form">
                    <input type="text" name="s" placeholder="Search..." />
                    <button type="submit">
                      <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                  </form>
                </div>

                {categories.length > 0 && (
                  <div
                    className="gt-sidebar-widget wow fadeInUp"
                    data-wow-delay=".5s"
                  >
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
                  <div
                    className="gt-sidebar-widget wow fadeInUp"
                    data-wow-delay=".7s"
                  >
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
