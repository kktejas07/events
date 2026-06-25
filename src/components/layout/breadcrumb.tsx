import Link from "next/link";

export function Breadcrumb({ title, label }: { title: string; label?: string }) {
  return (
    <div className="gt-breadcrumb-wrapper fix">
      <div className="gt-top-shape">
        <img src="/assets/img/inner-page/breadcrumb/bg-shape.png" alt="" />
      </div>
      <div className="gt-line-shape">
        <img src="/assets/img/inner-page/breadcrumb/line-shape.png" alt="" />
      </div>
      <div className="gt-arrow-shape float-bob-y">
        <img src="/assets/img/inner-page/breadcrumb/arrow.png" alt="" />
      </div>
      <div
        className="gt-page-heading bg-cover"
        style={{ backgroundImage: "url(/assets/img/inner-page/breadcrumb/bg.png)" }}
      >
        <div className="gt-breadcrumb-sub-title">
          <h1 className="wow fadeInUp" data-wow-delay=".3s">
            {title}
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
            <span>{label || title}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
