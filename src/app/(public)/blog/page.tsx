export const dynamic = "force-dynamic";
export const revalidate = 0;

import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { db } from "@/lib/db";

const fallbackBlogImages = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
  "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&q=80",
  "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&q=80",
  "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80",
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80",
];

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
      {/*
      =============================================
      BREADCRUMB SECTION
      =============================================
      */}
      <div className="gt-breadcrumb-wrapper fix">
        <div className="gt-top-shape">
          <img src="/assets/img/inner-page/breadcrumb/bg-shape.png" alt="img" />
        </div>
        <div className="gt-line-shape">
          <img src="/assets/img/inner-page/breadcrumb/line-shape.png" alt="img" />
        </div>
        <div className="gt-arrow-shape float-bob-y">
          <img src="/assets/img/inner-page/breadcrumb/arrow.png" alt="img" />
        </div>
        <div
          className="gt-page-heading bg-cover"
          style={{ backgroundImage: "url(/assets/img/inner-page/breadcrumb/bg.png)" }}
        >
          <div className="gt-breadcrumb-sub-title">
            <h1 className="wow fadeInUp" data-wow-delay=".3s">
              LATEST BLOG
            </h1>
          </div>
          <ul className="gt-breadcrumb-items wow fadeInUp" data-wow-delay=".5s">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <i className="fa-solid fa-chevron-right"></i>
            </li>
            <li>
              <span>LATEST BLOG</span>
            </li>
          </ul>
        </div>
      </div>

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
                          <img
                            src={
                              post.coverImage || fallbackBlogImages[i % fallbackBlogImages.length]
                            }
                            alt={post.title}
                          />
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
                          <img
                            src={
                              rp.coverImage ||
                              "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&q=80"
                            }
                            alt={rp.title}
                          />
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
