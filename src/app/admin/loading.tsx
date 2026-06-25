export default function AdminLoading() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", background: "#f8f9fe" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "40px", height: "40px", margin: "0 auto", border: "3px solid #e5e7eb", borderTopColor: "#1539EE", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <p style={{ marginTop: "16px", color: "#888", fontSize: "14px" }}>Loading...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
