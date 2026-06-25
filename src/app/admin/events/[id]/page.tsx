"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface SessionData { id?: string; title: string; startTime: string; endTime: string; room: string; day: number; speakerId: string; }

export default function AdminEventEditPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const isNew = eventId === "new";

  const [loading, setLoading] = useState(false);
  const [organizations, setOrganizations] = useState<{ id: string; name: string }[]>([]);
  const [speakers, setSpeakers] = useState<{ id: string; firstName: string; lastName: string }[]>([]);
  const [form, setForm] = useState({ title: "", slug: "", description: "", shortDescription: "", category: "", coverImage: "", organizationId: "", venueName: "", venueAddress: "", venueCity: "", venueState: "", venueCountry: "", venueZip: "", startDate: "", endDate: "", status: "DRAFT" });
  const [ticketTypes, setTicketTypes] = useState<{ name: string; price: string; quantityLimit: string }[]>([]);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([]);

  useEffect(() => {
    fetch("/api/admin/organizations?all=true").then((r) => r.json()).then((d) => setOrganizations(d.organizations || d || []));
    fetch("/api/admin/speakers").then((r) => r.json()).then((d) => setSpeakers(d.speakers || d || []));
    if (!isNew) fetch(`/api/events/${eventId}`).then((r) => r.json()).then((d) => {
      const e = d.event || d;
      setForm({
        title: e.title || "", slug: e.slug || "", description: e.description || "", shortDescription: e.shortDescription || "",
        category: e.category || "", coverImage: e.coverImage || "", organizationId: e.organizationId || "",
        venueName: e.venue?.name || "", venueAddress: e.venue?.address || "", venueCity: e.venue?.city || "",
        venueState: e.venue?.state || "", venueCountry: e.venue?.country || "", venueZip: e.venue?.zipCode || "",
        startDate: e.startDate ? new Date(e.startDate).toISOString().slice(0, 16) : "", endDate: e.endDate ? new Date(e.endDate).toISOString().slice(0, 16) : "", status: e.status || "DRAFT"
      });
      if (e.ticketTypes) setTicketTypes(e.ticketTypes.map((t: { name: string; price: number; quantityLimit: number }) => ({ name: t.name, price: String(t.price), quantityLimit: String(t.quantityLimit) })));
      if (e.sessions) setSessions(e.sessions.map((s: { id: string; title: string; startTime: string; endTime: string; room: string; day: number; speakerId: string }) => ({ id: s.id, title: s.title || "", startTime: s.startTime ? new Date(s.startTime).toISOString().slice(0, 16) : "", endTime: s.endTime ? new Date(s.endTime).toISOString().slice(0, 16) : "", room: s.room || "", day: s.day || 1, speakerId: s.speakerId || "" })));
      if (e.faqs) setFaqs(e.faqs.map((f: { question: string; answer: string }) => ({ question: f.question, answer: f.answer })));
    });
  }, [eventId, isNew]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const body = { ...form, ticketTypes, sessions, faqs };
    const method = isNew ? "POST" : "PUT";
    const url = isNew ? "/api/admin/events" : `/api/admin/events/${eventId}`;
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    router.push("/admin/events");
    router.refresh();
  }

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="gt-admin-section-title">{isNew ? "Create Event" : "Edit Event"}</h2>
          <p className="gt-admin-section-subtitle">
            <Link href="/admin/events" style={{ color: "#8B5CF6", textDecoration: "none" }}>Events</Link> / {isNew ? "New" : form.title || "Edit"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="gt-admin-card">
              <h3 className="gt-admin-card-title mb-3">Event Details</h3>
              <div className="gt-admin-form-group">
                <label className="gt-admin-label">Title</label>
                <input className="gt-admin-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") })} required />
              </div>
              <div className="gt-admin-form-group">
                <label className="gt-admin-label">Slug</label>
                <input className="gt-admin-input" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
              </div>
              <div className="gt-admin-form-group">
                <label className="gt-admin-label">Description</label>
                <textarea className="gt-admin-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={5} required />
              </div>
              <div className="gt-admin-form-group">
                <label className="gt-admin-label">Short Description</label>
                <input className="gt-admin-input" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} />
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="gt-admin-form-group">
                    <label className="gt-admin-label">Category</label>
                    <input className="gt-admin-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Technology, Design, Music..." />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="gt-admin-form-group">
                    <label className="gt-admin-label">Cover Image URL</label>
                    <input className="gt-admin-input" value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} placeholder="https://images.unsplash.com/photo-..." />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="gt-admin-form-group">
                    <label className="gt-admin-label">Start Date & Time</label>
                    <input type="datetime-local" className="gt-admin-input" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="gt-admin-form-group">
                    <label className="gt-admin-label">End Date & Time</label>
                    <input type="datetime-local" className="gt-admin-input" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
                  </div>
                </div>
              </div>
              <div className="gt-admin-form-group">
                <label className="gt-admin-label">Status</label>
                <select className="gt-admin-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>

            <div className="gt-admin-card mt-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="gt-admin-card-title" style={{ margin: 0 }}>Ticket Types</h3>
                <button type="button" className="gt-admin-btn gt-admin-btn-outline gt-admin-btn-sm" onClick={() => setTicketTypes([...ticketTypes, { name: "", price: "", quantityLimit: "" }])}>
                  <i className="fa-regular fa-plus"></i> Add
                </button>
              </div>
              {ticketTypes.map((t, i) => (
                <div key={i} className="row g-2 mb-3 p-3" style={{ background: "#f8f9fe", borderRadius: "10px" }}>
                  <div className="col-md-4">
                    <input className="gt-admin-input" placeholder="Ticket name" value={t.name} onChange={(e) => { const list = [...ticketTypes]; list[i].name = e.target.value; setTicketTypes(list); }} />
                  </div>
                  <div className="col-md-3">
                    <input className="gt-admin-input" type="number" placeholder="Price" value={t.price} onChange={(e) => { const list = [...ticketTypes]; list[i].price = e.target.value; setTicketTypes(list); }} />
                  </div>
                  <div className="col-md-3">
                    <input className="gt-admin-input" type="number" placeholder="Quantity limit" value={t.quantityLimit} onChange={(e) => { const list = [...ticketTypes]; list[i].quantityLimit = e.target.value; setTicketTypes(list); }} />
                  </div>
                  <div className="col-md-2 d-flex align-items-center">
                    <button type="button" className="gt-admin-btn gt-admin-btn-outline gt-admin-btn-sm" style={{ borderColor: "#EF4444", color: "#EF4444" }} onClick={() => setTicketTypes(ticketTypes.filter((_, idx) => idx !== i))}>
                      <i className="fa-regular fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="gt-admin-card mt-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="gt-admin-card-title" style={{ margin: 0 }}>Schedule Sessions</h3>
                <button type="button" className="gt-admin-btn gt-admin-btn-outline gt-admin-btn-sm" onClick={() => setSessions([...sessions, { title: "", startTime: "", endTime: "", room: "", day: 1, speakerId: "" }])}>
                  <i className="fa-regular fa-plus"></i> Add
                </button>
              </div>
              {sessions.map((s, i) => (
                <div key={i} className="row g-2 mb-3 p-3" style={{ background: "#f8f9fe", borderRadius: "10px" }}>
                  <div className="col-md-4">
                    <input className="gt-admin-input" placeholder="Session title" value={s.title} onChange={(e) => { const list = [...sessions]; list[i].title = e.target.value; setSessions(list); }} />
                  </div>
                  <div className="col-md-2">
                    <input type="datetime-local" className="gt-admin-input" value={s.startTime} onChange={(e) => { const list = [...sessions]; list[i].startTime = e.target.value; setSessions(list); }} />
                  </div>
                  <div className="col-md-2">
                    <input type="datetime-local" className="gt-admin-input" value={s.endTime} onChange={(e) => { const list = [...sessions]; list[i].endTime = e.target.value; setSessions(list); }} />
                  </div>
                  <div className="col-md-2">
                    <select className="gt-admin-select" value={s.speakerId} onChange={(e) => { const list = [...sessions]; list[i].speakerId = e.target.value; setSessions(list); }}>
                      <option value="">No speaker</option>
                      {speakers.map((sp) => <option key={sp.id} value={sp.id}>{sp.firstName} {sp.lastName}</option>)}
                    </select>
                  </div>
                  <div className="col-md-1">
                    <input className="gt-admin-input" type="number" min="1" placeholder="Day" value={s.day} onChange={(e) => { const list = [...sessions]; list[i].day = parseInt(e.target.value) || 1; setSessions(list); }} />
                  </div>
                  <div className="col-md-1 d-flex align-items-center">
                    <button type="button" className="gt-admin-btn gt-admin-btn-outline gt-admin-btn-sm" style={{ borderColor: "#EF4444", color: "#EF4444" }} onClick={() => setSessions(sessions.filter((_, idx) => idx !== i))}>
                      <i className="fa-regular fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="gt-admin-card mt-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="gt-admin-card-title" style={{ margin: 0 }}>FAQs</h3>
                <button type="button" className="gt-admin-btn gt-admin-btn-outline gt-admin-btn-sm" onClick={() => setFaqs([...faqs, { question: "", answer: "" }])}>
                  <i className="fa-regular fa-plus"></i> Add
                </button>
              </div>
              {faqs.map((f, i) => (
                <div key={i} className="row g-2 mb-3 p-3" style={{ background: "#f8f9fe", borderRadius: "10px" }}>
                  <div className="col-md-5">
                    <input className="gt-admin-input" placeholder="Question" value={f.question} onChange={(e) => { const list = [...faqs]; list[i].question = e.target.value; setFaqs(list); }} />
                  </div>
                  <div className="col-md-5">
                    <input className="gt-admin-input" placeholder="Answer" value={f.answer} onChange={(e) => { const list = [...faqs]; list[i].answer = e.target.value; setFaqs(list); }} />
                  </div>
                  <div className="col-md-2 d-flex align-items-center">
                    <button type="button" className="gt-admin-btn gt-admin-btn-outline gt-admin-btn-sm" style={{ borderColor: "#EF4444", color: "#EF4444" }} onClick={() => setFaqs(faqs.filter((_, idx) => idx !== i))}>
                      <i className="fa-regular fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-4">
            <div className="gt-admin-card">
              <h3 className="gt-admin-card-title mb-3">Event Settings</h3>
              <div className="gt-admin-form-group">
                <label className="gt-admin-label">Organization</label>
                <select className="gt-admin-select" value={form.organizationId} onChange={(e) => setForm({ ...form, organizationId: e.target.value })}>
                  <option value="">None</option>
                  {organizations.map((org) => <option key={org.id} value={org.id}>{org.name}</option>)}
                </select>
              </div>

              <h4 style={{ fontSize: "14px", fontWeight: 600, marginTop: "20px", marginBottom: "12px", color: "#555" }}>Venue</h4>
              <div className="gt-admin-form-group">
                <label className="gt-admin-label">Venue Name</label>
                <input className="gt-admin-input" value={form.venueName} onChange={(e) => setForm({ ...form, venueName: e.target.value })} />
              </div>
              <div className="gt-admin-form-group">
                <label className="gt-admin-label">Address</label>
                <input className="gt-admin-input" value={form.venueAddress} onChange={(e) => setForm({ ...form, venueAddress: e.target.value })} />
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="gt-admin-form-group">
                    <label className="gt-admin-label">City</label>
                    <input className="gt-admin-input" value={form.venueCity} onChange={(e) => setForm({ ...form, venueCity: e.target.value })} />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="gt-admin-form-group">
                    <label className="gt-admin-label">State</label>
                    <input className="gt-admin-input" value={form.venueState} onChange={(e) => setForm({ ...form, venueState: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="gt-admin-form-group">
                    <label className="gt-admin-label">Country</label>
                    <input className="gt-admin-input" value={form.venueCountry} onChange={(e) => setForm({ ...form, venueCountry: e.target.value })} />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="gt-admin-form-group">
                    <label className="gt-admin-label">Zip Code</label>
                    <input className="gt-admin-input" value={form.venueZip} onChange={(e) => setForm({ ...form, venueZip: e.target.value })} />
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" className="gt-admin-btn gt-admin-btn-primary w-100 mt-4" disabled={loading} style={{ fontSize: "16px", padding: "14px" }}>
              {loading ? <><i className="fa-solid fa-spinner fa-spin me-2"></i> Saving...</> : <><i className="fa-regular fa-floppy-disk me-2"></i> {isNew ? "Create Event" : "Save Changes"}</>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
