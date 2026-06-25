export const dynamic = "force-dynamic";
export const revalidate = 0;

import { unstable_noStore as noStore } from "next/cache";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";

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
              BLOG DETAILS
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
              <Link href="/blog">Blog</Link>
            </li>
            <li>
              <i className="fa-solid fa-chevron-right"></i>
            </li>
            <li>
              <span>{post.title}</span>
            </li>
          </ul>
        </div>
      </div>

      <section className="gt-news-section section-padding fix">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="gt-news-details-post">
                {post.coverImage && (
                  <div className="gt-news-details-image">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                    />
                    <span>{post.category || "General"}</span>
                  </div>
                )}
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
