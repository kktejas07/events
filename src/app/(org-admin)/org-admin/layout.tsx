import Link from "next/link";
import "../../admin/admin.css";
import { Logo } from "@/components/ui/logo";

const sidebarLinks = [
  { href: "/org-admin", label: "Dashboard", icon: "fa-grip" },
  { href: "/org-admin/events", label: "Events", icon: "fa-calendar-days" },
  { href: "/org-admin/tickets", label: "Tickets", icon: "fa-ticket-simple" },
  { href: "/org-admin/orders", label: "Orders", icon: "fa-cart-shopping" },
  { href: "/org-admin/scanners", label: "Scanner Users", icon: "fa-qrcode" },
  { href: "/org-admin/settings", label: "Settings", icon: "fa-gear" },
];

export default function OrgAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="gt-admin-wrapper">
      <aside className="gt-admin-sidebar" id="orgAdminSidebar">
        <div className="gt-admin-brand">
          <Link href="/" className="d-flex align-items-center gap-2 text-decoration-none">
            <Logo height={32} />
            <span className="text-white fw-bold fs-5">Org Admin</span>
          </Link>
        </div>
        <nav className="gt-admin-nav">
          {sidebarLinks.map((link) => (
            <Link key={link.href} href={link.href} className="gt-admin-nav-link">
              <i className={`fa-regular ${link.icon}`}></i>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
        <div className="gt-admin-signout">
          <Link href="/api/auth/signout" className="gt-admin-signout-btn">
            <i className="fa-regular fa-right-from-bracket"></i>
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      <div className="gt-admin-main">
        <header className="gt-admin-header">
          <div className="gt-admin-header-left">
            <button className="gt-admin-menu-toggle" id="orgAdminMenuToggle">
              <i className="fas fa-bars"></i>
            </button>
            <Link href="/" className="gt-admin-header-brand">
              <Logo height={28} />
            </Link>
          </div>
          <div className="gt-admin-header-right">
            <Link href="/" className="gt-admin-header-icon" title="View Site">
              <i className="fa-regular fa-arrow-up-right-from-square"></i>
            </Link>
            <Link href="/org-admin/settings" className="gt-admin-header-icon" title="Settings">
              <i className="fa-regular fa-gear"></i>
            </Link>
            <div className="gt-admin-avatar">
              <i className="fa-solid fa-user"></i>
            </div>
          </div>
        </header>
        <main className="gt-admin-content">{children}</main>
      </div>
    </div>
  );
}
