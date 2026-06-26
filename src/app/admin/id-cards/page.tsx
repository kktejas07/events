"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface IdCardUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
}

interface IdCard {
  id: string;
  userId: string;
  type: "EMPLOYEE" | "VISITOR" | "VOLUNTEER" | "CONTRACTOR";
  idNumber: string;
  designation: string | null;
  department: string | null;
  photoUrl: string | null;
  qrToken: string;
  isActive: boolean;
  issuedAt: string;
  expiresAt: string | null;
  user: IdCardUser;
}

interface UserResult {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

const typeColors: Record<string, string> = {
  EMPLOYEE: "#3B82F6",
  VISITOR: "#10B981",
  VOLUNTEER: "#8B5CF6",
  CONTRACTOR: "#F97316",
};

const typeBgColors: Record<string, string> = {
  EMPLOYEE: "rgba(59, 130, 246, 0.1)",
  VISITOR: "rgba(16, 185, 129, 0.1)",
  VOLUNTEER: "rgba(139, 92, 246, 0.1)",
  CONTRACTOR: "rgba(249, 115, 22, 0.1)",
};

export default function AdminIdCardsPage() {
  const [idCards, setIdCards] = useState<IdCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [userSearch, setUserSearch] = useState("");
  const [userResults, setUserResults] = useState<UserResult[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");
  const [formType, setFormType] = useState("EMPLOYEE");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");

  const fetchIdCards = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      if (search) params.set("q", search);
      if (typeFilter) params.set("type", typeFilter);
      const res = await fetch(`/api/admin/id-cards?${params}`);
      const d = await res.json();
      if (d.success) {
        setIdCards(d.data);
        setTotal(d.meta.total);
        setTotalPages(d.meta.totalPages);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [page, search, typeFilter]);

  useEffect(() => { fetchIdCards(); }, [fetchIdCards]);

  useEffect(() => { setPage(1); }, [search, typeFilter]);

  const searchUsers = async () => {
    if (!userSearch.trim()) return;
    try {
      const res = await fetch("/api/admin/users?limit=100");
      const d = await res.json();
      if (d.success) {
        const q = userSearch.toLowerCase();
        setUserResults(
          d.data.filter(
            (u: UserResult) =>
              u.email.toLowerCase().includes(q) ||
              (u.firstName && u.firstName.toLowerCase().includes(q)) ||
              (u.lastName && u.lastName.toLowerCase().includes(q))
          )
        );
      }
    } catch {
      // silent
    }
  };

  const selectUser = (u: UserResult) => {
    setSelectedUserId(u.id);
    setSelectedUserName(`${u.firstName || ""} ${u.lastName || ""} (${u.email})`);
    setUserResults([]);
    setUserSearch("");
  };

  const openModal = () => {
    setShowModal(true);
    setSelectedUserId("");
    setSelectedUserName("");
    setUserSearch("");
    setUserResults([]);
    setFormType("EMPLOYEE");
    setDesignation("");
    setDepartment("");
  };

  const closeModal = () => setShowModal(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/id-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUserId,
          type: formType,
          designation: designation || undefined,
          department: department || undefined,
        }),
      });
      const d = await res.json();
      if (d.success) {
        closeModal();
        fetchIdCards();
      } else {
        alert(d.error || "Failed to create ID card");
      }
    } catch {
      alert("Failed to create ID card");
    } finally {
      setSubmitting(false);
    }
  };

  async function deactivateCard(id: string, idNumber: string) {
    if (!window.confirm(`Deactivate ID card ${idNumber}?`)) return;
    try {
      const res = await fetch(`/api/admin/id-cards/${id}`, { method: "DELETE" });
      const d = await res.json();
      if (d.success) {
        setIdCards((prev) => prev.map((c) => (c.id === id ? { ...c, isActive: false } : c)));
      }
    } catch {
      // silent
    }
  }

  const typeBadge = (type: string) => (
    <span className="gt-admin-badge" style={{ background: typeBgColors[type] || "rgba(100, 116, 139, 0.1)", color: typeColors[type] || "#475569" }}>
      {type}
    </span>
  );

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="gt-admin-section-title">ID Cards</h2>
          <p className="gt-admin-section-subtitle">Manage ID cards for employees, visitors, volunteers, and contractors</p>
        </div>
        <button onClick={openModal} className="gt-admin-btn gt-admin-btn-primary">
          <i className="fa-regular fa-plus"></i> Issue New Card
        </button>
      </div>

      <div className="gt-admin-card" style={{ marginBottom: "16px" }}>
        <div className="gt-admin-inline-form">
          <div className="gt-admin-form-group" style={{ flex: 2 }}>
            <label className="gt-admin-label">Search</label>
            <input className="gt-admin-input" placeholder="Search by name or ID number..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="gt-admin-form-group" style={{ flex: 1 }}>
            <label className="gt-admin-label">Type</label>
            <select className="gt-admin-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="">All Types</option>
              <option value="EMPLOYEE">EMPLOYEE</option>
              <option value="VISITOR">VISITOR</option>
              <option value="VOLUNTEER">VOLUNTEER</option>
              <option value="CONTRACTOR">CONTRACTOR</option>
            </select>
          </div>
        </div>
      </div>

      <div className="gt-admin-card">
        {loading ? (
          <div className="text-center py-5"><i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "24px", color: "#8B5CF6" }}></i></div>
        ) : idCards.length === 0 ? (
          <div className="gt-admin-empty">
            <i className="fa-regular fa-id-card"></i>
            <h3>No ID cards found</h3>
            <p>Issue your first ID card to get started.</p>
            <button onClick={openModal} className="gt-admin-btn gt-admin-btn-primary">
              <i className="fa-regular fa-plus"></i> Issue New Card
            </button>
          </div>
        ) : (
          <>
            <table className="gt-admin-table">
              <thead>
                <tr>
                  <th>ID Number</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Designation</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {idCards.map((card) => (
                  <tr key={card.id}>
                    <td><strong>{card.idNumber}</strong></td>
                    <td>
                      <strong>{card.user.firstName} {card.user.lastName}</strong>
                      <br /><small style={{ color: "#888" }}>{card.user.email}</small>
                    </td>
                    <td>{typeBadge(card.type)}</td>
                    <td>{card.designation || "-"}</td>
                    <td>{card.department || "-"}</td>
                    <td>
                      <span className={`gt-admin-badge ${card.isActive ? "success" : "danger"}`}>
                        {card.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link href={`/admin/id-cards/${card.id}`} className="gt-admin-btn gt-admin-btn-outline gt-admin-btn-sm">
                          <i className="fa-regular fa-eye"></i>
                        </Link>
                        <a href={`/api/admin/id-cards/${card.id}/pdf`} className="gt-admin-btn gt-admin-btn-outline gt-admin-btn-sm" target="_blank" rel="noopener noreferrer">
                          <i className="fa-regular fa-file-pdf"></i>
                        </a>
                        {card.isActive && (
                          <button onClick={() => deactivateCard(card.id, card.idNumber)} className="gt-admin-btn gt-admin-btn-outline gt-admin-btn-sm" style={{ borderColor: "#EF4444", color: "#EF4444" }}>
                            <i className="fa-regular fa-ban"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="d-flex align-items-center justify-content-between mt-4">
                <small style={{ color: "#888" }}>Showing {idCards.length} of {total} cards</small>
                <div className="d-flex gap-2">
                  <button className="gt-admin-btn gt-admin-btn-outline gt-admin-btn-sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                    <i className="fa-regular fa-chevron-left"></i> Previous
                  </button>
                  <button className="gt-admin-btn gt-admin-btn-outline gt-admin-btn-sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                    Next <i className="fa-regular fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} onClick={closeModal} />
          <div style={{ position: "relative", background: "#fff", borderRadius: "16px", width: "100%", maxWidth: "500px", maxHeight: "90vh", overflow: "auto", padding: "32px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#1a1a2e", margin: 0 }}>
                <i className="fa-regular fa-id-card" style={{ marginRight: "8px", color: "#1539EE" }}></i>
                Issue New ID Card
              </h3>
              <button onClick={closeModal} style={{ background: "none", border: "none", fontSize: "20px", color: "#888", cursor: "pointer", padding: "4px 8px", borderRadius: "8px" }}>
                <i className="fa-regular fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {!selectedUserId ? (
                <div className="gt-admin-form-group">
                  <label className="gt-admin-label">Find User</label>
                  <div className="d-flex gap-2">
                    <input className="gt-admin-input" placeholder="Search by email or name..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), searchUsers())} />
                    <button type="button" onClick={searchUsers} className="gt-admin-btn gt-admin-btn-outline gt-admin-btn-sm" style={{ whiteSpace: "nowrap" }}>
                      <i className="fa-regular fa-search"></i>
                    </button>
                  </div>
                  {userResults.length > 0 && (
                    <div style={{ marginTop: "8px", border: "1px solid #e5e7eb", borderRadius: "10px", maxHeight: "200px", overflow: "auto" }}>
                      {userResults.map((u) => (
                        <div
                          key={u.id}
                          onClick={() => selectUser(u)}
                          style={{ padding: "10px 14px", cursor: "pointer", borderBottom: "1px solid #f0f0f0", fontSize: "14px", color: "#333" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#f8f9fe")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                        >
                          <strong>{u.firstName} {u.lastName}</strong>
                          <br /><small style={{ color: "#888" }}>{u.email}</small>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="gt-admin-form-group">
                  <label className="gt-admin-label">Selected User</label>
                  <div className="d-flex align-items-center justify-content-between" style={{ padding: "10px 14px", background: "rgba(21, 57, 238, 0.05)", borderRadius: "10px", border: "1px solid rgba(21, 57, 238, 0.2)" }}>
                    <span style={{ fontSize: "14px", color: "#333" }}>
                      <i className="fa-regular fa-user" style={{ marginRight: "8px", color: "#1539EE" }}></i>
                      {selectedUserName}
                    </span>
                    <button type="button" onClick={() => { setSelectedUserId(""); setSelectedUserName(""); }} style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", padding: "4px", fontSize: "16px" }}>
                      <i className="fa-regular fa-xmark"></i>
                    </button>
                  </div>
                </div>
              )}

              <div className="gt-admin-form-group">
                <label className="gt-admin-label">Type</label>
                <select className="gt-admin-select" value={formType} onChange={(e) => setFormType(e.target.value)}>
                  <option value="EMPLOYEE">Employee</option>
                  <option value="VISITOR">Visitor</option>
                  <option value="VOLUNTEER">Volunteer</option>
                  <option value="CONTRACTOR">Contractor</option>
                </select>
              </div>

              <div className="gt-admin-form-group">
                <label className="gt-admin-label">Designation</label>
                <input className="gt-admin-input" placeholder="e.g. Software Engineer" value={designation} onChange={(e) => setDesignation(e.target.value)} />
              </div>

              <div className="gt-admin-form-group">
                <label className="gt-admin-label">Department</label>
                <input className="gt-admin-input" placeholder="e.g. Engineering" value={department} onChange={(e) => setDepartment(e.target.value)} />
              </div>

              <div className="d-flex gap-2 justify-content-end mt-4">
                <button type="button" onClick={closeModal} className="gt-admin-btn gt-admin-btn-outline">Cancel</button>
                <button type="submit" className="gt-admin-btn gt-admin-btn-primary" disabled={!selectedUserId || submitting}>
                  {submitting ? <><i className="fa-solid fa-spinner fa-spin"></i> Issuing...</> : <><i className="fa-regular fa-check"></i> Issue Card</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
