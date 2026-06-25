import Link from "next/link";
import "./admin.css";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: "fa-grip" },
  { href: "/admin/events", label: "Events", icon: "fa-calendar-days" },
  { href: "/admin/tickets", label: "Tickets", icon: "fa-ticket-simple" },
  { href: "/admin/orders", label: "Orders", icon: "fa-cart-shopping" },
  { href: "/admin/organizations", label: "Organizations", icon: "fa-building" },
  { href: "/admin/landing", label: "Landing Page", icon: "fa-globe" },
  { href: "/admin/blog", label: "Blog", icon: "fa-file-lines" },
  { href: "/admin/sponsors", label: "Sponsors", icon: "fa-chart-simple" },
  { href: "/admin/users", label: "Users & Roles", icon: "fa-users" },
  { href: "/admin/scan", label: "Scan Tickets", icon: "fa-qrcode" },
  { href: "/admin/emails", label: "Email Templates", icon: "fa-envelope" },
  { href: "/admin/settings/email", label: "Email Provider", icon: "fa-envelopes-bulk" },
  { href: "/admin/settings", label: "Settings", icon: "fa-gear" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="gt-admin-wrapper">
      <aside className="gt-admin-sidebar" id="adminSidebar">
        <div className="gt-admin-brand">
          <Link href="/" className="d-flex align-items-center gap-2 text-decoration-none">
            <img src="/assets/img/logo/white-logo.svg" alt="logo" style={{ height: "32px" }} />
            <span className="text-white fw-bold fs-5">Admin</span>
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
            <button className="gt-admin-menu-toggle" id="adminMenuToggle">
              <i className="fas fa-bars"></i>
            </button>
            <Link href="/" className="gt-admin-header-brand">
              <img src="/assets/img/logo/blue-logo.svg" alt="logo" style={{ height: "28px" }} />
            </Link>
          </div>
          <div className="gt-admin-header-right">
            <Link href="/" className="gt-admin-header-icon" title="View Site">
              <i className="fa-regular fa-arrow-up-right-from-square"></i>
            </Link>
            <Link href="/admin/settings" className="gt-admin-header-icon" title="Settings">
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
