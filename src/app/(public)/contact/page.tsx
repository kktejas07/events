export const dynamic = "force-dynamic";
export const revalidate = 0;

import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { db } from "@/lib/db";

export default async function ContactPage() {
  noStore();

  let contactContent: Record<string, unknown> = {};

  try {
    const row = await db.siteContent.findFirst({ where: { section: "contact-page" } });
    if (row?.data) contactContent = row.data as Record<string, unknown>;
  } catch (error) {
    console.error("Contact page fetch error:", error);
  }

  const phones = (contactContent.phones as { label: string }[]) || [];
  const address =
    (contactContent.address as string) || "43 Sardinella, 3nd Land Walk, Orchard view, London, UK";
  const emails = (contactContent.emails as { label: string }[]) || [];
  const mapUrl = (contactContent.mapUrl as string) || "";

  return (
    <>
      <Breadcrumb title="CONTACT US" />

      <section className="gt-contact-section section-padding fix">
        <div className="container">
          <div className="gt-contact-us-wrapper">
            <div className="row g-4">
              <div className="col-lg-4">
                <div className="gt-contact-us-box">
                  <div className="gt-icon">
                    <i className="fa-solid fa-phone"></i>
                  </div>
                  <div className="gt-contact-us-content">
                    <span>Phone No</span>
                    <h5>
                      {phones.length > 0 ? (
                        phones.map((p, i) => (
                          <span key={i}>
                            <a href={`tel:${p.label.replace(/\s/g, "")}`}>{p.label}</a>
                            {i < phones.length - 1 && <br />}
                          </span>
                        ))
                      ) : (
                        <>
                          <a href="tel:+88012342700">+880 123 427 00</a> <br />
                          <a href="tel:+00093880912">+000 938 809 12</a>
                        </>
                      )}
                    </h5>
                  </div>
                </div>
                <div className="gt-contact-us-box">
                  <div className="gt-icon">
                    <i className="fa-solid fa-location-dot"></i>
                  </div>
                  <div className="gt-contact-us-content">
                    <span>Location</span>
                    <h5>
                      {address.split(",").map((part: string, i: number, arr: string[]) => (
                        <span key={i}>
                          {part}
                          {i < arr.length - 1 ? (
                            <>
                              ,<br />
                            </>
                          ) : (
                            ""
                          )}
                        </span>
                      ))}
                    </h5>
                  </div>
                </div>
                <div className="gt-contact-us-box mb-0">
                  <div className="gt-icon">
                    <i className="fa-solid fa-square-chevron-down"></i>
                  </div>
                  <div className="gt-contact-us-content">
                    <span>Email Address</span>
                    <h5>
                      {emails.length > 0 ? (
                        emails.map((e, i) => (
                          <span key={i}>
                            <a href={`mailto:${e.label}`}>{e.label}</a>
                            {i < emails.length - 1 && <br />}
                          </span>
                        ))
                      ) : (
                        <>
                          <a href="mailto:supportinfo@gmail.com">supportinfo@gmail.com</a> <br />
                          <a href="mailto:arluxhotelinfo.com">arluxhotelinfo.com</a>
                        </>
                      )}
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-lg-8">
                <div className="gt-comment-form-wrap">
                  <h3>Send Us Message</h3>
                  <p>
                    There will be no publication of your email address. Required fields are
                    indicated with a *.
                  </p>
                  <form action="/api/contact" method="POST">
                    <div className="row g-4">
                      <div className="col-lg-6">
                        <div className="form-clt">
                          <span>Your Name</span>
                          <input type="text" name="name" id="name" placeholder="Your Name" />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="form-clt">
                          <span>Your Email</span>
                          <input type="email" name="email" id="email6" placeholder="Your Email" />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="form-clt">
                          <span>write message</span>
                          <textarea
                            name="message"
                            id="message"
                            placeholder="Type your message"
                          ></textarea>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <button type="submit" className="gt-theme-btn">
                          post comments
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        {mapUrl && (
          <div className="container mt-5">
            <div className="gt-map-wrapper">
              <iframe
                src={mapUrl}
                width="100%"
                height="400"
                style={{ border: 0, borderRadius: "20px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Event Location"
              />
            </div>
          </div>
        )}
      </section>
    </>
  );
}
