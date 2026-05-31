import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={{
      background: "#1e293b",
      padding: "12px 24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 0,
    }}>
      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        <span style={{ color: "#fff", fontWeight: 600, fontSize: 16 }}>
          Hospital
        </span>
        {user && (
          <>
            <Link to="/" style={{ color: "#94a3b8", textDecoration: "none", fontSize: 14 }}>Dashboard</Link>
            <Link to="/doctors" style={{ color: "#94a3b8", textDecoration: "none", fontSize: 14 }}>Doctors</Link>
            <Link to="/patients" style={{ color: "#94a3b8", textDecoration: "none", fontSize: 14 }}>Patients</Link>
            <Link to="/appointments" style={{ color: "#94a3b8", textDecoration: "none", fontSize: 14 }}>Appointments</Link>
          </>
        )}
      </div>
      <div>
        {user ? (
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ color: "#94a3b8", fontSize: 13 }}>Hi, {user.username}</span>
            <button onClick={handleLogout} style={{
              background: "#ef4444", color: "#fff", border: "none",
              padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13,
            }}>Logout</button>
          </div>
        ) : (
          <Link to="/login" style={{ color: "#94a3b8", textDecoration: "none", fontSize: 14 }}>Login</Link>
        )}
      </div>
    </nav>
  );
}