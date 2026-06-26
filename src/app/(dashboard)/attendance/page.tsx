export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

function formatDuration(ms: number): string {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export default async function AttendancePage() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return null;

  const records = await db.attendance.findMany({
    where: { userId },
    include: { event: true },
    orderBy: { checkIn: "desc" },
  });

  return (
    <div className="gt-admin-content">
      <h2 className="gt-admin-section-title">My Attendance</h2>
      <p className="gt-admin-section-subtitle">Your check-in and check-out history</p>

      {records.length === 0 ? (
        <div className="gt-admin-card">
          <div className="gt-admin-empty">
            <i className="fa-regular fa-calendar-check"></i>
            <h3>No attendance records</h3>
            <p>Your attendance history will appear here once you check in to an event.</p>
          </div>
        </div>
      ) : (
        <div className="gt-admin-table-wrap">
          <table className="gt-admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Event</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Duration</th>
                <th>Method</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => {
                const checkIn = new Date(record.checkIn);
                const checkOut = record.checkOut ? new Date(record.checkOut) : null;
                const duration = checkOut ? checkOut.getTime() - checkIn.getTime() : null;

                return (
                  <tr key={record.id}>
                    <td>
                      <span style={{ fontWeight: 500 }}>
                        {checkIn.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </td>
                    <td>{record.event?.title || "—"}</td>
                    <td>
                      {checkIn.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td>
                      {checkOut
                        ? checkOut.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </td>
                    <td>{duration ? formatDuration(duration) : "—"}</td>
                    <td>
                      <span
                        className={`gt-admin-badge ${
                          record.method === "SCAN" ? "success" : "neutral"
                        }`}
                        style={{ textTransform: "capitalize" }}
                      >
                        {record.method?.toLowerCase() || "manual"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
