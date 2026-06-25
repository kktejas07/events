import Link from "next/link";
import { Fragment } from "react";
import { themeAssets } from "@/lib/theme-images";

type BreadcrumbCrumb = { label: string; href?: string };

export function Breadcrumb({
  title,
  label,
  crumbs,
}: {
  title: string;
  label?: string;
  crumbs?: BreadcrumbCrumb[];
}) {
  const trail = crumbs ?? [{ label: label || title }];

  return (
    <div className="gt-breadcrumb-wrapper fix">
      <div className="gt-top-shape">
        <img src={themeAssets.breadcrumb.shape} alt="" />
      </div>
      <div className="gt-line-shape">
        <img src={themeAssets.breadcrumb.line} alt="" />
      </div>
      <div className="gt-arrow-shape float-bob-y">
        <img src={themeAssets.breadcrumb.arrow} alt="" />
      </div>
      <div className="container-fluid">
        <div
          className="gt-page-heading bg-cover"
          style={{ backgroundImage: `url(${themeAssets.breadcrumb.bg})` }}
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
            {trail.map((crumb, i) => (
              <Fragment key={`${crumb.label}-${i}`}>
                <li>
                  <i className="fa-solid fa-chevron-right"></i>
                </li>
                <li>
                  {crumb.href ? (
                    <Link href={crumb.href}>{crumb.label}</Link>
                  ) : (
                    <span>{crumb.label}</span>
                  )}
                </li>
              </Fragment>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
