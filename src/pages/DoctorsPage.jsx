import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { getAllDoctors, getAvailableDoctors, createDoctor, deleteDoctor } from "../api/doctorApi";

export default function DoctorsPage() {
  const qc = useQueryClient();
  const [showAvailable, setShowAvailable] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const { data: doctors = [], isLoading } = useQuery({
    queryKey: ["doctors", showAvailable],
    queryFn: showAvailable ? getAvailableDoctors : getAllDoctors,
  });

  const addMutation = useMutation({
    mutationFn: createDoctor,
    onSuccess: () => { qc.invalidateQueries(["doctors"]); toast.success("Doctor added"); reset(); },
    onError: (e) => toast.error(e.response?.data?.message || "Failed"),
  });

  const delMutation = useMutation({
    mutationFn: deleteDoctor,
    onSuccess: () => { qc.invalidateQueries(["doctors"]); toast.success("Doctor deleted"); },
  });

  return (
    <div style={{ paddingTop: 32 }}>
      <h2 style={{ marginBottom: 20 }}>Doctors</h2>

      <form onSubmit={handleSubmit((d) => addMutation.mutate(d))}
        style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        <input placeholder="Name *" {...register("name", { required: true })}
          style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc" }} />
        <input placeholder="Specialization *" {...register("specialization", { required: true })}
          style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc" }} />
        <input type="email" placeholder="Email *" {...register("email", { required: true })}
          style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc" }} />
        <input placeholder="Phone" {...register("phone")}
          style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc" }} />
        <input type="number" placeholder="Experience (yrs)" {...register("experience")}
          style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc", width: 140 }} />
        <button type="submit" style={{
          padding: "8px 16px", background: "#2563eb", color: "#fff",
          border: "none", borderRadius: 6, cursor: "pointer",
        }}>+ Add Doctor</button>
      </form>

      <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
        <button onClick={() => setShowAvailable(false)} style={{
          padding: "6px 14px", borderRadius: 6, border: "1px solid #ccc",
          background: !showAvailable ? "#1e293b" : "#fff",
          color: !showAvailable ? "#fff" : "#333", cursor: "pointer",
        }}>All Doctors</button>
        <button onClick={() => setShowAvailable(true)} style={{
          padding: "6px 14px", borderRadius: 6, border: "1px solid #ccc",
          background: showAvailable ? "#1e293b" : "#fff",
          color: showAvailable ? "#fff" : "#333", cursor: "pointer",
        }}>Available Only</button>
      </div>

      {isLoading ? <p>Loading...</p> : (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f1f5f9" }}>
              {["Name", "Specialization", "Email", "Phone", "Experience", "Available", "Action"]
                .map(h => <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600 }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {doctors.map(doc => (
              <tr key={doc.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "10px 12px" }}>{doc.name}</td>
                <td style={{ padding: "10px 12px" }}>{doc.specialization}</td>
                <td style={{ padding: "10px 12px" }}>{doc.email}</td>
                <td style={{ padding: "10px 12px" }}>{doc.phone}</td>
                <td style={{ padding: "10px 12px" }}>{doc.experience} yrs</td>
                <td style={{ padding: "10px 12px" }}>
                  <span style={{ color: doc.available ? "green" : "red", fontWeight: 500 }}>
                    {doc.available ? "Yes" : "No"}
                  </span>
                </td>
                <td style={{ padding: "10px 12px" }}>
                  <button onClick={() => delMutation.mutate(doc.id)} style={{
                    background: "#ef4444", color: "#fff", border: "none",
                    padding: "4px 10px", borderRadius: 4, cursor: "pointer", fontSize: 12,
                  }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}