import { Routes, Route, Navigate } from "react-router-dom";
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
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px" }}>
        <Routes>
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/" element={
            <PrivateRoute><DashboardPage /></PrivateRoute>
          }/>
          <Route path="/doctors" element={
            <PrivateRoute><DoctorsPage /></PrivateRoute>
          }/>
          <Route path="/patients" element={
            <PrivateRoute><PatientsPage /></PrivateRoute>
          }/>
          <Route path="/appointments" element={
            <PrivateRoute><AppointmentsPage /></PrivateRoute>
          }/>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}