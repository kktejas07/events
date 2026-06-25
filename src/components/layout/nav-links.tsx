"use client";

import { usePathname } from "next/navigation";
import { navItemIsActive, publicNav, type NavItem } from "@/lib/site-nav";

function NavSubmenu({ items }: { items: NavItem[] }) {
  return (
    <ul className="submenu">
      {items.map((child) => (
        <li key={child.href} className={child.children?.length ? "has-dropdown" : undefined}>
          <a href={child.href}>
            {child.label}
            {child.children?.length ? (
              <>
                {" "}
                <i className="fas fa-angle-right"></i>
              </>
            ) : null}
          </a>
          {child.children?.length ? <NavSubmenu items={child.children} /> : null}
        </li>
      ))}
    </ul>
  );
}

export function NavLinks({ isHome }: { isHome: boolean }) {
  const pathname = usePathname();

  return (
    <ul>
      {publicNav.map((item) => {
        const active = navItemIsActive(pathname, item);
        const hasChildren = Boolean(item.children?.length);

        return (
          <li
            key={item.href}
            className={`${hasChildren ? "has-dropdown" : ""}${active ? " active" : ""}`}
          >
            <a href={item.href} className={isHome && item.href === "/" ? "border-none" : undefined}>
              {item.label}
            </a>
            {hasChildren && item.children ? <NavSubmenu items={item.children} /> : null}
          </li>
        );
      })}
    </ul>
  );
}
