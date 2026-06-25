export const dynamic = "force-dynamic";
export const revalidate = 0;

import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { db } from "@/lib/db";
import { speakerImage, innerPageNewsImage, themeAssets } from "@/lib/theme-images";

export default async function SpeakersPage() {
  noStore();

  let speakers: {
    id: string;
    firstName: string;
    lastName: string;
    title: string | null;
    company: string | null;
    photoUrl: string | null;
    twitterUrl: string | null;
    linkedinUrl: string | null;
  }[] = [];

  let latestPosts: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    category: string | null;
    coverImage: string | null;
    publishedAt: Date | null;
  }[] = [];

  try {
    speakers = await db.speaker.findMany({
      orderBy: { createdAt: "asc" },
    });
    latestPosts = await db.blogPost.findMany({
      where: { published: true },
      take: 3,
      orderBy: { publishedAt: "desc" },
    });
  } catch (error) {
    console.error("Speakers page fetch error:", error);
  }

  const leftSpeakers = speakers.slice(0, 4);
  const rightSpeaker = speakers.length > 4 ? speakers[4] : null;
  const extraSpeakers = speakers.slice(5);

  return (
    <>
      <Breadcrumb title="OUR SPEAKERS" />

      <section className="gt-speaker-section section-padding">
        <div className="container">
          <div className="gt-speaker-wrapper">
            <div className="row g-4">
              <div className="col-lg-6">
                <div className="row g-4">
                  {leftSpeakers.map((sp, i) => (
                    <div
                      key={sp.id}
                      className="col-lg-6 col-md-6 wow fadeInUp"
                      data-wow-delay={`.${3 + (i % 4) * 2}s`}
                    >
                      <div className="gt-speaker-item">
                        <div className="gt-speaker-image">
                          <img
                            src={speakerImage(i, sp.photoUrl)}
                            alt={`${sp.firstName} ${sp.lastName}`}
                          />
                          <span className="gt-button-text">
                            <a
                              href="https://www.youtube.com/watch?v=Cn4G2lZ_g2I"
                              className="video-btn video-popup"
                            >
                              <i className="fa-solid fa-play"></i>
                            </a>
                            <span className="d-line ms-2">play intro</span>
                          </span>
                          <div className="gt-speaker-content">
                            <h3>
                              <a href="#">
                                {sp.firstName} {sp.lastName}
                              </a>
                            </h3>
                            <p>
                              {sp.title || "Speaker"}, <span>{sp.company || ""}</span>
                            </p>
                            <div className="gt-social-icon d-flex align-items-center">
                              <a href="#">
                                <i className="fab fa-facebook-f"></i>
                              </a>
                              <a href={sp.twitterUrl || "#"}>
                                <i className="fab fa-twitter"></i>
                              </a>
                              <a href={sp.linkedinUrl || "#"}>
                                <i className="fa-brands fa-linkedin-in"></i>
                              </a>
                              <a href="#">
                                <i className="fa-brands fa-instagram"></i>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {rightSpeaker && (
                <div className="col-lg-6">
                  <div className="gt-speaker-item">
                    <div className="gt-speaker-image gt-style-2">
                      <img
                        src={speakerImage(4, rightSpeaker.photoUrl)}
                        alt={`${rightSpeaker.firstName} ${rightSpeaker.lastName}`}
                      />
                      <span className="gt-button-text">
                        <a
                          href="https://www.youtube.com/watch?v=Cn4G2lZ_g2I"
                          className="video-btn video-popup"
                        >
                          <i className="fa-solid fa-play"></i>
                        </a>
                        <span className="d-line ms-2">play intro</span>
                      </span>
                      <div className="gt-speaker-content">
                        <h3>
                          <a href="#">
                            {rightSpeaker.firstName} {rightSpeaker.lastName}
                          </a>
                        </h3>
                        <p>
                          {rightSpeaker.title || "Speaker"},{" "}
                          <span>{rightSpeaker.company || ""}</span>
                        </p>
                        <div className="gt-social-icon d-flex align-items-center">
                          <a href="#">
                            <i className="fab fa-facebook-f"></i>
                          </a>
                          <a href={rightSpeaker.twitterUrl || "#"}>
                            <i className="fab fa-twitter"></i>
                          </a>
                          <a href={rightSpeaker.linkedinUrl || "#"}>
                            <i className="fa-brands fa-linkedin-in"></i>
                          </a>
                          <a href="#">
                            <i className="fa-brands fa-instagram"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {extraSpeakers.length > 0 && (
              <div className="row g-4 mt-4">
                {extraSpeakers.map((sp, i) => (
                  <div
                    key={sp.id}
                    className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp"
                    data-wow-delay={`.${3 + (i % 4) * 2}s`}
                  >
                    <div className="gt-speaker-item">
                      <div className="gt-speaker-image">
                        <img
                            src={speakerImage(i % 6, sp.photoUrl)}
                          alt={`${sp.firstName} ${sp.lastName}`}
                        />
                        <span className="gt-button-text">
                          <a
                            href="https://www.youtube.com/watch?v=Cn4G2lZ_g2I"
                            className="video-btn video-popup"
                          >
                            <i className="fa-solid fa-play"></i>
                          </a>
                          <span className="d-line ms-2">play intro</span>
                        </span>
                        <div className="gt-speaker-content">
                          <h3>
                            <a href="#">
                              {sp.firstName} {sp.lastName}
                            </a>
                          </h3>
                          <p>
                            {sp.title || "Speaker"}, <span>{sp.company || ""}</span>
                          </p>
                          <div className="gt-social-icon d-flex align-items-center">
                            <a href="#">
                              <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href={sp.twitterUrl || "#"}>
                              <i className="fab fa-twitter"></i>
                            </a>
                            <a href={sp.linkedinUrl || "#"}>
                              <i className="fa-brands fa-linkedin-in"></i>
                            </a>
                            <a href="#">
                              <i className="fa-brands fa-instagram"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="gt-marquee-section-2 section-padding fix pt-0">
        <div className="mycustom-marque">
          <div className="scrolling-wrap gt-style-inner">
            <div className="comm">
              <div></div>
              <div className="cmn-textslide">
                <img src={themeAssets.marquee.icon} alt="img" /> marketing
              </div>
              <div className="cmn-textslide">
                <img src={themeAssets.marquee.icon} alt="img" /> BUSINESS
              </div>
              <div className="cmn-textslide">
                <img src={themeAssets.marquee.icon} alt="img" /> branding
              </div>
            </div>
            <div className="comm">
              <div></div>
              <div className="cmn-textslide">
                <img src={themeAssets.marquee.icon} alt="img" /> marketing
              </div>
              <div className="cmn-textslide">
                <img src={themeAssets.marquee.icon} alt="img" /> BUSINESS
              </div>
              <div className="cmn-textslide">
                <img src={themeAssets.marquee.icon} alt="img" /> branding
              </div>
            </div>
            <div className="comm">
              <div></div>
              <div className="cmn-textslide">
                <img src={themeAssets.marquee.icon} alt="img" /> marketing
              </div>
              <div className="cmn-textslide">
                <img src={themeAssets.marquee.icon} alt="img" /> BUSINESS
              </div>
              <div className="cmn-textslide">
                <img src={themeAssets.marquee.icon} alt="img" /> branding
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="gt-news-section-2 section-padding fix pt-0">
        <div className="container">
          <div className="gt-section-title mb-0 text-center">
            <span className="gt-sub-title wow fadeInUp">events news</span>
            <h2 className="wow fadeInUp" data-wow-delay=".3s">
              Our trending news
            </h2>
          </div>
          <div className="row">
            {latestPosts.length > 0
              ? latestPosts.map((post, i) => (
                  <div
                    key={post.id}
                    className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp"
                    data-wow-delay={`.${3 + i * 2}s`}
                  >
                    <div className="gt-news-card-item">
                      <div className="gt-news-image">
                        <img
                          src={innerPageNewsImage(i, post.coverImage)}
                          alt={post.title}
                        />
                        <span>{post.category || "General"}</span>
                      </div>
                      <div className="gt-news-content">
                        <h3>
                          <a href={`/blog/${post.slug}`}>{post.title}</a>
                        </h3>
                        <p>
                          {post.excerpt ||
                            "Stay updated with the latest from our events and community."}
                        </p>
                      </div>
                      <div className="gt-news-post-item">
                        <div className="post-date">
                          <h5>{post.publishedAt ? new Date(post.publishedAt).getDate() : "20"}</h5>
                          <p>
                            {post.publishedAt
                              ? new Date(post.publishedAt).toLocaleString("default", {
                                  month: "short",
                                })
                              : "apr"}
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
              : [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp"
                    data-wow-delay={`.${3 + i * 2}s`}
                  >
                    <div className="gt-news-card-item">
                      <div className="gt-news-image">
                        <img
                          src={innerPageNewsImage(i - 1)}
                          alt="img"
                        />
                        <span>Corporate</span>
                      </div>
                      <div className="gt-news-content">
                        <h3>
                          <a href="/blog">Consectetur adipisicing elit, sed do eiusmod tempor</a>
                        </h3>
                        <p>
                          lipsum to our Business & Startup hub, where innovation meets ingenuity!
                        </p>
                      </div>
                      <div className="gt-news-post-item">
                        <div className="post-date">
                          <h5>{10 + i * 5}</h5>
                          <p>april</p>
                        </div>
                        <Link href="/blog" className="gt-link-btn">
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
