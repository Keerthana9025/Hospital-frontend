import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { role: "ROLE_PATIENT" },
  });

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      toast.success("Registered! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={{ maxWidth: 380, margin: "60px auto", padding: "0 16px" }}>
      <h2 style={{ marginBottom: 24 }}>Create Account</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 5, fontSize: 13 }}>Username</label>
          <input
            {...register("username", { required: true })}
            style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc" }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 5, fontSize: 13 }}>Email</label>
          <input
            type="email"
            {...register("email", { required: true })}
            style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc" }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 5, fontSize: 13 }}>Password</label>
          <input
            type="password"
            {...register("password", { required: true })}
            style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc" }}
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", marginBottom: 5, fontSize: 13 }}>Role</label>
          <select
            {...register("role", { required: true })}
            style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc" }}
          >
            <option value="ROLE_PATIENT">Patient</option>
            <option value="ROLE_DOCTOR">Doctor</option>
            <option value="ROLE_ADMIN">Admin</option>
          </select>
        </div>
        <button type="submit" disabled={isSubmitting} style={{
          width: "100%", padding: "10px", background: "#2563eb",
          color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14,
        }}>
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>
      <p style={{ marginTop: 16, fontSize: 13 }}>
        Have account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}