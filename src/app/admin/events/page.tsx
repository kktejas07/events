"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<{ id: string; title: string; slug: string; status: string; startDate: string; _count: { tickets: number } }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/events").then((r) => r.json()).then((d) => { setEvents(d.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const statusBadge = (s: string) => ({ PUBLISHED: "success", DRAFT: "warning", CANCELLED: "danger", COMPLETED: "info" }[s] || "neutral");

  async function deleteEvent(id: string, title: string) {
    if (!window.confirm(`Delete "${title}"?`)) return;
    await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="gt-admin-section-title">Events</h2>
          <p className="gt-admin-section-subtitle">Manage all events</p>
        </div>
        <Link href="/admin/events/new" className="gt-admin-btn gt-admin-btn-primary">
          <i className="fa-regular fa-plus"></i> Create Event
        </Link>
      </div>

      <div className="gt-admin-card">
        {loading ? (
          <div className="text-center py-5"><i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "24px", color: "#8B5CF6" }}></i></div>
        ) : events.length === 0 ? (
          <div className="gt-admin-empty">
            <i className="fa-regular fa-calendar-plus"></i>
            <h3>No events found</h3>
            <p>Create your first event to get started.</p>
            <Link href="/admin/events/new" className="gt-admin-btn gt-admin-btn-primary">
              <i className="fa-regular fa-plus"></i> Create Event
            </Link>
          </div>
        ) : (
          <table className="gt-admin-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Status</th>
                <th>Date</th>
                <th>Tickets</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td><strong>{event.title}</strong></td>
                  <td><span className={`gt-admin-badge ${statusBadge(event.status)}`}>{event.status}</span></td>
                  <td>{new Date(event.startDate).toLocaleDateString()}</td>
                  <td>{event._count?.tickets || 0}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link href={`/admin/events/${event.id}`} className="gt-admin-btn gt-admin-btn-outline gt-admin-btn-sm">
                        <i className="fa-regular fa-pen-to-square"></i> Edit
                      </Link>
                      <button onClick={() => deleteEvent(event.id, event.title)} className="gt-admin-btn gt-admin-btn-outline gt-admin-btn-sm" style={{ borderColor: "#EF4444", color: "#EF4444" }}>
                        <i className="fa-regular fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
