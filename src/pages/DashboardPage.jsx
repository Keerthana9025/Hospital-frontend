import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div style={{ paddingTop: 40 }}>
      <h2>Welcome, {user?.username}!</h2>
      <p style={{ color: "#64748b", marginTop: 8 }}>
        Use the navigation above to manage doctors, patients, and appointments.
      </p>
      <div style={{ display: "flex", gap: 16, marginTop: 32 }}>
        {[
          { label: "Doctors", path: "/doctors", color: "#2563eb" },
          { label: "Patients", path: "/patients", color: "#16a34a" },
          { label: "Appointments", path: "/appointments", color: "#9333ea" },
        ].map((card) => (
          <a key={card.path} href={card.path} style={{
            display: "block", padding: "24px 32px",
            background: card.color, color: "#fff",
            borderRadius: 10, textDecoration: "none",
            fontWeight: 600, fontSize: 15,
          }}>
            {card.label}
          </a>
        ))}
      </div>
    </div>
  );
}