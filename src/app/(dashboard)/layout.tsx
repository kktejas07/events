import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="gt-admin-wrapper">
      <aside className="gt-admin-sidebar" id="dashboardSidebar">
        <div className="gt-admin-brand">
          <Link href="/" className="d-flex align-items-center gap-2 text-decoration-none">
            <Logo height={28} />
          </Link>
        </div>
        <nav className="gt-admin-nav">
          <Link href="/my-tickets" className="gt-admin-nav-link">
            <i className="fa-regular fa-ticket-simple"></i> <span>My Tickets</span>
          </Link>
          <Link href="/profile" className="gt-admin-nav-link">
            <i className="fa-regular fa-user"></i> <span>Profile</span>
          </Link>
          <Link href="/events" className="gt-admin-nav-link">
            <i className="fa-regular fa-calendar-days"></i> <span>Browse Events</span>
          </Link>
        </nav>
        <div className="gt-admin-signout">
          <Link href="/api/auth/signout" className="gt-admin-signout-btn">
            <i className="fa-regular fa-right-from-bracket"></i> <span>Sign Out</span>
          </Link>
        </div>
      </aside>
      <div className="gt-admin-main">
        <header className="gt-admin-header">
          <div className="gt-admin-header-left">
            <button className="gt-admin-menu-toggle" id="dashboardMenuToggle">
              <i className="fas fa-bars"></i>
            </button>
            <Link href="/" className="gt-admin-header-brand">
              <Logo height={28} />
            </Link>
          </div>
          <div className="gt-admin-header-right">
            <Link href="/" className="gt-admin-header-icon" title="Home">
              <i className="fa-regular fa-house"></i>
            </Link>
            <div className="gt-admin-avatar"><i className="fa-solid fa-user"></i></div>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
