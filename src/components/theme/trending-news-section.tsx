import Link from "next/link";
import { innerPageNewsImage } from "@/lib/theme-images";

export interface NewsPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  category?: string | null;
  coverImage?: string | null;
  publishedAt?: Date | string | null;
}

const fallbackPosts: NewsPostItem[] = [
  {
    id: "1",
    title: "Consectetur adipisicing elit, sed do eiusmod tempor",
    slug: "blog",
    excerpt:
      "lipsum to our Business & Startup hub, where innovation meets ingenuity! We are a communi of forward-thinking entrepreneurs",
    category: "Corporate",
    publishedAt: new Date(2025, 3, 30),
  },
  {
    id: "2",
    title: "Consectetur adipisicing elit, sed do eiusmod tempor",
    slug: "blog",
    excerpt:
      "lipsum to our Business & Startup hub, where innovation meets ingenuity! We are a communi of forward-thinking entrepreneurs",
    category: "Corporate",
    publishedAt: new Date(2025, 3, 30),
  },
  {
    id: "3",
    title: "Consectetur adipisicing elit, sed do eiusmod tempor",
    slug: "blog",
    excerpt:
      "lipsum to our Business & Startup hub, where innovation meets ingenuity! We are a communi of forward-thinking entrepreneurs",
    category: "Corporate",
    publishedAt: new Date(2025, 3, 30),
  },
];

export function TrendingNewsSection({ posts }: { posts?: NewsPostItem[] }) {
  const display = posts && posts.length > 0 ? posts.slice(0, 3) : fallbackPosts;

  return (
    <section className="gt-news-section-2 section-padding fix">
      <div className="container">
        <div className="gt-section-title text-center">
          <span className="gt-sub-title wow fadeInUp">events news</span>
          <h2 className="wow fadeInUp" data-wow-delay=".3s">
            Our trending news
          </h2>
        </div>
        <div className="row">
          {display.map((post, i) => {
            const date = post.publishedAt ? new Date(post.publishedAt) : new Date(2025, 3, 30);
            const href = post.slug === "blog" ? "/blog" : `/blog/${post.slug}`;

            return (
              <div
                key={post.id}
                className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp"
                data-wow-delay={`.${3 + i * 2}s`}
              >
                <div className="gt-news-card-item">
                  <div className="gt-news-image">
                    <img src={innerPageNewsImage(i, post.coverImage)} alt={post.title} />
                    <span>{post.category || "Corporate"}</span>
                  </div>
                  <div className="gt-news-content">
                    <h3>
                      <Link href={href}>{post.title}</Link>
                    </h3>
                    <p>{post.excerpt || "Conference news and updates."}</p>
                  </div>
                  <div className="gt-news-post-item">
                    <div className="post-date">
                      <h5>{date.getDate()}</h5>
                      <p>{date.toLocaleString("default", { month: "short" })}</p>
                    </div>
                    <Link href={href} className="gt-link-btn">
                      <span className="gt-icon-btn">
                        <i className="fa-solid fa-chevrons-right"></i>
                      </span>
                      <span className="gt-radius-btn">READ MORE</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
