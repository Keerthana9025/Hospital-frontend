import { useState } from "react";

const STEPS = [
  {
    id: 1,
    title: "Project setup",
    icon: "⚙️",
    color: "#6366f1",
    summary: "Create React app, install dependencies",
    content: {
      intro: "Create a new React project with Vite and install all required packages.",
      sections: [
        {
          heading: "Create the project",
          code: `npm create vite@latest hospital-frontend -- --template react
cd hospital-frontend
npm install`,
        },
        {
          heading: "Install dependencies",
          code: `npm install axios react-router-dom react-hook-form
npm install @tanstack/react-query
npm install react-hot-toast
npm install date-fns`,
        },
        {
          heading: "Folder structure to create",
          code: `src/
├── api/
│   ├── axios.js          ← base axios config
│   ├── authApi.js
│   ├── doctorApi.js
│   ├── patientApi.js
│   └── appointmentApi.js
├── components/
│   ├── Navbar.jsx
│   ├── PrivateRoute.jsx
│   └── StatusBadge.jsx
├── context/
│   └── AuthContext.jsx
├── pages/
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── DashboardPage.jsx
│   ├── DoctorsPage.jsx
│   ├── PatientsPage.jsx
│   └── AppointmentsPage.jsx
└── main.jsx`,
          lang: "text",
        },
      ],
    },
  },
  {
    id: 2,
    title: "Axios base config",
    icon: "🔌",
    color: "#0ea5e9",
    summary: "Configure API base URL + JWT interceptor",
    content: {
      intro: "Your backend runs on port 8080. Set up axios to automatically attach the JWT token from localStorage on every request.",
      sections: [
        {
          heading: "src/api/axios.js",
          code: `import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

// Global error handling
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;`,
        },
      ],
    },
  },
  {
    id: 3,
    title: "Auth API + context",
    icon: "🔐",
    color: "#f59e0b",
    summary: "Login, register, JWT + role storage",
    content: {
      intro: "Your backend returns { success, token, username } on login. Store the token and expose auth state globally via React context.",
      sections: [
        {
          heading: "src/api/authApi.js",
          code: `import api from "./axios";

// POST /api/auth/register
// Body: { username, password, email, role }
// role must be: "ROLE_ADMIN" | "ROLE_DOCTOR" | "ROLE_PATIENT"
export const register = (data) =>
  api.post("/auth/register", data).then((r) => r.data);

// POST /api/auth/login
// Body: { username, password }
// Returns: { success, token, username }
export const login = (data) =>
  api.post("/auth/login", data).then((r) => r.data);`,
        },
        {
          heading: "src/context/AuthContext.jsx",
          code: `import { createContext, useContext, useState } from "react";
import { login as loginApi, register as registerApi } from "../api/authApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    return token ? { token, username } : null;
  });

  const login = async (username, password) => {
    const data = await loginApi({ username, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);
    setUser({ token: data.token, username: data.username });
    return data;
  };

  const register = async (formData) => {
    return registerApi(formData);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);`,
        },
        {
          heading: "src/components/PrivateRoute.jsx",
          code: `import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}`,
        },
      ],
    },
  },
  {
    id: 4,
    title: "API service files",
    icon: "📡",
    color: "#10b981",
    summary: "Doctors, Patients, Appointments API calls",
    content: {
      intro: "Create one API file per resource. These map directly to your backend controllers.",
      sections: [
        {
          heading: "src/api/doctorApi.js — matches /api/doctors",
          code: `import api from "./axios";

export const getAllDoctors = () =>
  api.get("/doctors").then((r) => r.data);

export const getAvailableDoctors = () =>
  api.get("/doctors/available").then((r) => r.data);

export const getDoctorsBySpecialization = (name) =>
  api.get(\`/doctors/specialization?name=\${name}\`).then((r) => r.data);

export const getDoctorById = (id) =>
  api.get(\`/doctors/\${id}\`).then((r) => r.data);

export const createDoctor = (data) =>
  api.post("/doctors", data).then((r) => r.data);

export const updateDoctor = (id, data) =>
  api.put(\`/doctors/\${id}\`, data).then((r) => r.data);

export const deleteDoctor = (id) =>
  api.delete(\`/doctors/\${id}\`).then((r) => r.data);`,
        },
        {
          heading: "src/api/patientApi.js — matches /api/patients",
          code: `import api from "./axios";

export const getAllPatients = () =>
  api.get("/patients").then((r) => r.data);

export const getPatientById = (id) =>
  api.get(\`/patients/\${id}\`).then((r) => r.data);

export const createPatient = (data) =>
  api.post("/patients", data).then((r) => r.data);

export const updatePatient = (id, data) =>
  api.put(\`/patients/\${id}\`, data).then((r) => r.data);

export const deletePatient = (id) =>
  api.delete(\`/patients/\${id}\`).then((r) => r.data);`,
        },
        {
          heading: "src/api/appointmentApi.js — matches /api/appointments",
          code: `import api from "./axios";

// BookRequest: { patientId, doctorId, appointmentDate, appointmentTime, reason }
// appointmentTime format: "HH:mm:ss"  ← important! Backend uses @JsonFormat
export const bookAppointment = (data) =>
  api.post("/appointments", data).then((r) => r.data);

export const getAllAppointments = () =>
  api.get("/appointments").then((r) => r.data);

export const getAppointmentById = (id) =>
  api.get(\`/appointments/\${id}\`).then((r) => r.data);

export const getAppointmentsByPatient = (patientId) =>
  api.get(\`/appointments/patient/\${patientId}\`).then((r) => r.data);

export const getAppointmentsByDoctor = (doctorId) =>
  api.get(\`/appointments/doctor/\${doctorId}\`).then((r) => r.data);

// status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"
export const updateStatus = (id, status) =>
  api.patch(\`/appointments/\${id}/status?status=\${status}\`).then((r) => r.data);

export const addNotes = (id, notes) =>
  api.patch(\`/appointments/\${id}/notes\`, { notes }).then((r) => r.data);

export const cancelAppointment = (id) =>
  api.delete(\`/appointments/\${id}\`).then((r) => r.data);`,
        },
      ],
    },
  },
  {
    id: 5,
    title: "Router + main setup",
    icon: "🗺️",
    color: "#8b5cf6",
    summary: "React Router with protected routes",
    content: {
      intro: "Wire up all routes. Auth pages are public. All dashboard routes require login.",
      sections: [
        {
          heading: "src/main.jsx",
          code: `import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <App />
          <Toaster position="top-right" />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);`,
        },
        {
          heading: "src/App.jsx",
          code: `import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import DoctorsPage from "./pages/DoctorsPage";
import PatientsPage from "./pages/PatientsPage";
import AppointmentsPage from "./pages/AppointmentsPage";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected */}
        <Route path="/" element={
          <PrivateRoute><DashboardPage /></PrivateRoute>
        } />
        <Route path="/doctors" element={
          <PrivateRoute><DoctorsPage /></PrivateRoute>
        } />
        <Route path="/patients" element={
          <PrivateRoute><PatientsPage /></PrivateRoute>
        } />
        <Route path="/appointments" element={
          <PrivateRoute><AppointmentsPage /></PrivateRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}`,
        },
      ],
    },
  },
  {
    id: 6,
    title: "Login & Register pages",
    icon: "🧑‍💻",
    color: "#ef4444",
    summary: "Forms with react-hook-form + JWT store",
    content: {
      intro: "Build login and register forms. The register form needs a role dropdown with exactly the values your backend expects.",
      sections: [
        {
          heading: "src/pages/LoginPage.jsx",
          code: `import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await login(data.username, data.password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", padding: "0 16px" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Username</label>
          <input {...register("username", { required: "Required" })} />
          {errors.username && <span>{errors.username.message}</span>}
        </div>
        <div>
          <label>Password</label>
          <input type="password" {...register("password", { required: "Required" })} />
          {errors.password && <span>{errors.password.message}</span>}
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}`,
        },
        {
          heading: "src/pages/RegisterPage.jsx — role values must match backend enum",
          code: `import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

// Backend User.Role enum values: ROLE_ADMIN | ROLE_DOCTOR | ROLE_PATIENT
const ROLES = [
  { value: "ROLE_PATIENT", label: "Patient" },
  { value: "ROLE_DOCTOR", label: "Doctor" },
  { value: "ROLE_ADMIN", label: "Admin" },
];

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
    <div style={{ maxWidth: 400, margin: "80px auto", padding: "0 16px" }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Username</label>
          <input {...register("username", { required: "Required" })} />
        </div>
        <div>
          <label>Email</label>
          <input type="email" {...register("email", { required: "Required" })} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" {...register("password", { required: "Required" })} />
        </div>
        <div>
          <label>Role</label>
          <select {...register("role", { required: "Required" })}>
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={isSubmitting}>Register</button>
      </form>
    </div>
  );
}`,
        },
      ],
    },
  },
  {
    id: 7,
    title: "Doctors page",
    icon: "👨‍⚕️",
    color: "#06b6d4",
    summary: "List, filter by specialization, add/delete",
    content: {
      intro: "Use React Query to fetch and cache doctors. Your backend has a /available and /specialization?name= filter endpoint — use them.",
      sections: [
        {
          heading: "src/pages/DoctorsPage.jsx",
          code: `import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  getAllDoctors,
  getAvailableDoctors,
  getDoctorsBySpecialization,
  createDoctor,
  deleteDoctor,
} from "../api/doctorApi";

export default function DoctorsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all"); // "all" | "available"
  const [specSearch, setSpecSearch] = useState("");

  // Query: all doctors
  const { data: doctors = [], isLoading } = useQuery({
    queryKey: ["doctors", filter, specSearch],
    queryFn: () => {
      if (specSearch) return getDoctorsBySpecialization(specSearch);
      if (filter === "available") return getAvailableDoctors();
      return getAllDoctors();
    },
  });

  // Mutation: create
  const { register, handleSubmit, reset } = useForm();
  const createMutation = useMutation({
    mutationFn: createDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries(["doctors"]);
      toast.success("Doctor added!");
      reset();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Error"),
  });

  // Mutation: delete
  const deleteMutation = useMutation({
    mutationFn: deleteDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries(["doctors"]);
      toast.success("Doctor removed");
    },
  });

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h2>Doctors</h2>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("available")}>Available only</button>
        <input
          placeholder="Filter by specialization..."
          value={specSearch}
          onChange={(e) => setSpecSearch(e.target.value)}
        />
      </div>

      {/* Add form */}
      <form onSubmit={handleSubmit((d) => createMutation.mutate(d))}
        style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        <input placeholder="Name *" {...register("name", { required: true })} />
        <input placeholder="Specialization *" {...register("specialization", { required: true })} />
        <input type="email" placeholder="Email *" {...register("email", { required: true })} />
        <input placeholder="Phone" {...register("phone")} />
        <input type="number" placeholder="Experience (yrs)" {...register("experience")} />
        <button type="submit">+ Add Doctor</button>
      </form>

      {/* List */}
      {isLoading ? <p>Loading...</p> : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Name</th><th>Specialization</th><th>Email</th>
              <th>Exp.</th><th>Available</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.name}</td>
                <td>{doc.specialization}</td>
                <td>{doc.email}</td>
                <td>{doc.experience} yrs</td>
                <td>{doc.available ? "✅" : "❌"}</td>
                <td>
                  <button onClick={() => deleteMutation.mutate(doc.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}`,
        },
      ],
    },
  },
  {
    id: 8,
    title: "Appointments page",
    icon: "📅",
    color: "#f97316",
    summary: "Book, list, update status, add notes",
    content: {
      intro: "This is the core page. Pay attention to the time format — your backend uses @JsonFormat(pattern = \"HH:mm:ss\"), so you must send time as \"09:00:00\", not \"09:00\".",
      sections: [
        {
          heading: "Key: time format — must be HH:mm:ss",
          code: `// Convert HTML time input (HH:mm) to backend format (HH:mm:ss)
const toBackendTime = (timeStr) => timeStr + ":00"; // "09:30" → "09:30:00"

// In your form submission:
const onSubmit = (data) => {
  bookAppointment({
    ...data,
    appointmentTime: toBackendTime(data.appointmentTime),
  });
};`,
        },
        {
          heading: "src/pages/AppointmentsPage.jsx",
          code: `import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  getAllAppointments,
  bookAppointment,
  updateStatus,
  cancelAppointment,
  addNotes,
} from "../api/appointmentApi";
import { getAllDoctors } from "../api/doctorApi";
import { getAllPatients } from "../api/patientApi";

// Status badge colors
const STATUS_COLORS = {
  PENDING:   "#f59e0b",
  CONFIRMED: "#10b981",
  CANCELLED: "#ef4444",
  COMPLETED: "#6366f1",
};

export default function AppointmentsPage() {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: getAllAppointments,
  });

  const { data: doctors = [] } = useQuery({
    queryKey: ["doctors"],
    queryFn: getAllDoctors,
  });

  const { data: patients = [] } = useQuery({
    queryKey: ["patients"],
    queryFn: getAllPatients,
  });

  const bookMutation = useMutation({
    mutationFn: bookAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries(["appointments"]);
      toast.success("Appointment booked!");
      reset();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Booking failed"),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["appointments"]);
      toast.success("Status updated");
    },
  });

  const cancelMutation = useMutation({
    mutationFn: cancelAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries(["appointments"]);
      toast.success("Appointment cancelled");
    },
  });

  const onSubmit = (data) => {
    bookMutation.mutate({
      patientId: Number(data.patientId),
      doctorId: Number(data.doctorId),
      appointmentDate: data.appointmentDate,
      appointmentTime: data.appointmentTime + ":00", // HH:mm → HH:mm:ss
      reason: data.reason,
    });
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
      <h2>Appointments</h2>

      {/* Book form */}
      <form onSubmit={handleSubmit(onSubmit)}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}>
        <select {...register("patientId", { required: true })}>
          <option value="">-- Select patient --</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <select {...register("doctorId", { required: true })}>
          <option value="">-- Select doctor --</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>{d.name} — {d.specialization}</option>
          ))}
        </select>
        <input type="date" {...register("appointmentDate", { required: true })} />
        <input type="time" {...register("appointmentTime", { required: true })} />
        <input placeholder="Reason..." {...register("reason")}
          style={{ gridColumn: "1 / -1" }} />
        <button type="submit" style={{ gridColumn: "1 / -1" }}>
          Book Appointment
        </button>
      </form>

      {/* List */}
      {isLoading ? <p>Loading...</p> : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th>
              <th>Reason</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.id}>
                <td>{appt.patient?.name}</td>
                <td>{appt.doctor?.name}</td>
                <td>{appt.appointmentDate}</td>
                <td>{appt.appointmentTime}</td>
                <td>{appt.reason}</td>
                <td>
                  <span style={{
                    background: STATUS_COLORS[appt.status] + "33",
                    color: STATUS_COLORS[appt.status],
                    padding: "2px 8px",
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 600,
                  }}>
                    {appt.status}
                  </span>
                </td>
                <td style={{ display: "flex", gap: 4 }}>
                  <select
                    defaultValue={appt.status}
                    onChange={(e) => statusMutation.mutate({ id: appt.id, status: e.target.value })}>
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirm</option>
                    <option value="COMPLETED">Complete</option>
                    <option value="CANCELLED">Cancel</option>
                  </select>
                  <button onClick={() => cancelMutation.mutate(appt.id)}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}`,
        },
      ],
    },
  },
  {
    id: 9,
    title: "CORS fix",
    icon: "🚧",
    color: "#dc2626",
    summary: "Backend must allow frontend origin",
    content: {
      intro: "Your React app runs on port 5173 (Vite default). Your Spring Boot backend must allow this origin, otherwise all API calls will be blocked by the browser.",
      sections: [
        {
          heading: "Add to SecurityConfig.java — before your existing filterChain bean",
          code: `@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("http://localhost:5173"));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
}`,
        },
        {
          heading: "Then update filterChain to enable CORS",
          code: `return http
    .csrf(csrf -> csrf.disable())
    .cors(cors -> cors.configurationSource(corsConfigurationSource())) // ← add this line
    .authorizeHttpRequests(auth -> auth
        // ... rest of your existing config
    )
    .build();`,
        },
      ],
    },
  },
  {
    id: 10,
    title: "Run & test",
    icon: "🚀",
    color: "#84cc16",
    summary: "Start both servers, verify end-to-end",
    content: {
      intro: "Start backend first, then frontend. Test the full flow in order.",
      sections: [
        {
          heading: "Start the servers",
          code: `# Terminal 1 — Backend (your Spring Boot project)
cd hospital
./mvnw spring-boot:run
# → Running on http://localhost:8080

# Terminal 2 — Frontend
cd hospital-frontend
npm run dev
# → Running on http://localhost:5173`,
          lang: "bash",
        },
        {
          heading: "Test checklist — do this in order",
          code: `1. Register a user (role: ROLE_PATIENT)
2. Login → check token stored in localStorage
3. Open Doctors page → list should load (if no doctors, add one)
4. Open Patients page → add a patient
5. Open Appointments page → book appointment
   → select patient + doctor
   → pick date and time
   → submit
6. Change appointment status using the dropdown
7. Logout → verify redirect to /login
8. Try accessing /appointments directly → should redirect to /login`,
          lang: "text",
        },
        {
          heading: "Common errors and fixes",
          code: `❌ CORS error in browser console
   → Add CORS config to SecurityConfig.java (Step 9)

❌ 401 Unauthorized on all requests
   → Token not being sent — check axios.js interceptor

❌ 403 Forbidden
   → Role mismatch. Check User.Role enum:
     Backend expects "ROLE_ADMIN", "ROLE_DOCTOR", "ROLE_PATIENT"
     Your register form must send exactly these values

❌ 400 Bad Request on appointment booking
   → Time format wrong. Must send "09:30:00", not "09:30"
   → Add ":00" to the time input value before sending

❌ 500 on login
   → Database not running or credentials wrong in application.properties
   → Check: spring.datasource.url=jdbc:postgresql://localhost:5433/hospital_db`,
          lang: "text",
        },
      ],
    },
  },
];

export default function HospitalFrontendGuide() {
  const [activeStep, setActiveStep] = useState(1);
  const [activeSection, setActiveSection] = useState(0);
  const [copied, setCopied] = useState(null);

  const step = STEPS.find((s) => s.id === activeStep);

  const copyCode = (code, idx) => {
    navigator.clipboard.writeText(code);
    setCopied(idx);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div style={{
      fontFamily: "'IBM Plex Mono', 'Fira Code', monospace",
      display: "flex",
      minHeight: "100vh",
      background: "var(--color-background-tertiary)",
      fontSize: 14,
    }}>
      {/* Sidebar */}
      <aside style={{
        width: 240,
        background: "var(--color-background-secondary)",
        borderRight: "1px solid var(--color-border-tertiary)",
        padding: "20px 0",
        flexShrink: 0,
        overflowY: "auto",
      }}>
        <div style={{
          padding: "0 16px 16px",
          borderBottom: "1px solid var(--color-border-tertiary)",
          marginBottom: 8,
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-tertiary)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Hospital Frontend
          </div>
          <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 2 }}>
            Spring Boot + React guide
          </div>
        </div>
        {STEPS.map((s) => (
          <button
            key={s.id}
            onClick={() => { setActiveStep(s.id); setActiveSection(0); }}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              width: "100%",
              padding: "10px 16px",
              background: activeStep === s.id ? s.color + "18" : "transparent",
              border: "none",
              borderLeft: activeStep === s.id ? `3px solid ${s.color}` : "3px solid transparent",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.15s",
            }}
          >
            <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{s.icon}</span>
            <div>
              <div style={{
                fontSize: 12,
                fontWeight: 600,
                color: activeStep === s.id ? s.color : "var(--color-text-primary)",
                fontFamily: "var(--font-sans)",
              }}>
                {s.id}. {s.title}
              </div>
              <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", fontFamily: "var(--font-sans)", marginTop: 2 }}>
                {s.summary}
              </div>
            </div>
          </button>
        ))}
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{
              background: step.color + "22",
              color: step.color,
              border: `1px solid ${step.color}44`,
              borderRadius: 6,
              padding: "2px 10px",
              fontSize: 11,
              fontWeight: 700,
              fontFamily: "var(--font-sans)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}>
              Step {step.id} / {STEPS.length}
            </span>
          </div>
          <h1 style={{
            fontSize: 22,
            fontWeight: 600,
            color: "var(--color-text-primary)",
            margin: 0,
            fontFamily: "var(--font-sans)",
          }}>
            {step.icon} {step.title}
          </h1>
          <p style={{
            color: "var(--color-text-secondary)",
            marginTop: 8,
            fontFamily: "var(--font-sans)",
            lineHeight: 1.6,
            fontSize: 14,
          }}>
            {step.content.intro}
          </p>
        </div>

        {/* Section tabs */}
        {step.content.sections.length > 1 && (
          <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
            {step.content.sections.map((sec, i) => (
              <button
                key={i}
                onClick={() => setActiveSection(i)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 6,
                  border: `1px solid ${activeSection === i ? step.color : "var(--color-border-tertiary)"}`,
                  background: activeSection === i ? step.color + "18" : "transparent",
                  color: activeSection === i ? step.color : "var(--color-text-secondary)",
                  cursor: "pointer",
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: "var(--font-sans)",
                  transition: "all 0.15s",
                }}
              >
                {i + 1}. {sec.heading.split(" ")[0]} {sec.heading.split(" ")[1] || ""}
              </button>
            ))}
          </div>
        )}

        {/* Code sections */}
        {step.content.sections.map((sec, i) => (
          <div key={i} style={{ display: i === activeSection || step.content.sections.length === 1 ? "block" : "none" }}>
            <div style={{
              background: "var(--color-background-secondary)",
              border: "1px solid var(--color-border-tertiary)",
              borderRadius: 10,
              overflow: "hidden",
              marginBottom: 20,
            }}>
              {/* Code block header */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 16px",
                borderBottom: "1px solid var(--color-border-tertiary)",
                background: "var(--color-background-primary)",
              }}>
                <span style={{
                  fontSize: 12,
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 500,
                }}>
                  {sec.heading}
                </span>
                <button
                  onClick={() => copyCode(sec.code, `${step.id}-${i}`)}
                  style={{
                    background: copied === `${step.id}-${i}` ? step.color + "22" : "transparent",
                    border: `1px solid ${copied === `${step.id}-${i}` ? step.color : "var(--color-border-secondary)"}`,
                    borderRadius: 5,
                    color: copied === `${step.id}-${i}` ? step.color : "var(--color-text-tertiary)",
                    cursor: "pointer",
                    fontSize: 11,
                    padding: "3px 10px",
                    fontFamily: "var(--font-sans)",
                    transition: "all 0.15s",
                  }}
                >
                  {copied === `${step.id}-${i}` ? "✓ Copied" : "Copy"}
                </button>
              </div>
              {/* Code */}
              <pre style={{
                margin: 0,
                padding: "16px 20px",
                overflowX: "auto",
                fontSize: 12.5,
                lineHeight: 1.65,
                color: "var(--color-text-primary)",
                fontFamily: "'IBM Plex Mono', 'Fira Code', 'Cascadia Code', monospace",
              }}>
                <code>{sec.code}</code>
              </pre>
            </div>
          </div>
        ))}

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32, paddingTop: 20, borderTop: "1px solid var(--color-border-tertiary)" }}>
          <button
            onClick={() => { setActiveStep(Math.max(1, activeStep - 1)); setActiveSection(0); }}
            disabled={activeStep === 1}
            style={{
              padding: "8px 20px",
              borderRadius: 7,
              border: "1px solid var(--color-border-secondary)",
              background: "transparent",
              color: "var(--color-text-secondary)",
              cursor: activeStep === 1 ? "not-allowed" : "pointer",
              opacity: activeStep === 1 ? 0.4 : 1,
              fontFamily: "var(--font-sans)",
              fontSize: 13,
            }}
          >
            ← Previous
          </button>

          <span style={{ color: "var(--color-text-tertiary)", fontFamily: "var(--font-sans)", fontSize: 12, alignSelf: "center" }}>
            {activeStep} / {STEPS.length}
          </span>

          <button
            onClick={() => { setActiveStep(Math.min(STEPS.length, activeStep + 1)); setActiveSection(0); }}
            disabled={activeStep === STEPS.length}
            style={{
              padding: "8px 20px",
              borderRadius: 7,
              border: `1px solid ${step.color}`,
              background: step.color,
              color: "#fff",
              cursor: activeStep === STEPS.length ? "not-allowed" : "pointer",
              opacity: activeStep === STEPS.length ? 0.4 : 1,
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Next →
          </button>
        </div>
      </main>
    </div>
  );
}
