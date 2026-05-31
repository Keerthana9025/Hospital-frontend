import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async ({ username, password }) => {
    try {
      await login(username, password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: 380, margin: "80px auto", padding: "0 16px" }}>
      <h2 style={{ marginBottom: 24 }}>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", marginBottom: 5, fontSize: 13 }}>Username</label>
          <input
            {...register("username", { required: "Username is required" })}
            style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc" }}
            placeholder="Enter username"
          />
          {errors.username && <span style={{ color: "red", fontSize: 12 }}>{errors.username.message}</span>}
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", marginBottom: 5, fontSize: 13 }}>Password</label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc" }}
            placeholder="Enter password"
          />
          {errors.password && <span style={{ color: "red", fontSize: 12 }}>{errors.password.message}</span>}
        </div>
        <button type="submit" disabled={isSubmitting} style={{
          width: "100%", padding: "10px", background: "#2563eb",
          color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14,
        }}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
      <p style={{ marginTop: 16, fontSize: 13 }}>
        No account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}