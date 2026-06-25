/** Public site navigation — matches Pixvent index-3 pages we actually ship. */

export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

export const publicNav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Pages",
    href: "/about",
    children: [
      { label: "Sponsor", href: "/sponsor" },
      { label: "Our Pricing", href: "/pricing" },
    ],
  },
  { label: "Event", href: "/events" },
  { label: "Speaker", href: "/speakers" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
];

export function navIsActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function navItemIsActive(pathname: string, item: NavItem): boolean {
  if (navIsActive(pathname, item.href)) return true;
  return item.children?.some((child) => navIsActive(pathname, child.href)) ?? false;
}
