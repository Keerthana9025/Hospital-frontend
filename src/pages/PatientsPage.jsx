import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { getAllPatients, createPatient, deletePatient } from "../api/patientApi";

export default function PatientsPage() {
  const qc = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  const { data: patients = [], isLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: getAllPatients,
  });

  const addMutation = useMutation({
    mutationFn: createPatient,
    onSuccess: () => { qc.invalidateQueries(["patients"]); toast.success("Patient added"); reset(); },
    onError: (e) => toast.error(e.response?.data?.message || "Failed"),
  });

  const delMutation = useMutation({
    mutationFn: deletePatient,
    onSuccess: () => { qc.invalidateQueries(["patients"]); toast.success("Patient deleted"); },
  });

  return (
    <div style={{ paddingTop: 32 }}>
      <h2 style={{ marginBottom: 20 }}>Patients</h2>

      <form onSubmit={handleSubmit((d) => addMutation.mutate(d))}
        style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        <input placeholder="Name *" {...register("name", { required: true })}
          style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc" }} />
        <input type="email" placeholder="Email *" {...register("email", { required: true })}
          style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc" }} />
        <input placeholder="Phone" {...register("phone")}
          style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc" }} />
        <input type="date" placeholder="Date of Birth" {...register("dateOfBirth")}
          style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc" }} />
        <input placeholder="Blood Group" {...register("bloodGroup")}
          style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc", width: 110 }} />
        <input placeholder="Address" {...register("address")}
          style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc" }} />
        <button type="submit" style={{
          padding: "8px 16px", background: "#16a34a", color: "#fff",
          border: "none", borderRadius: 6, cursor: "pointer",
        }}>+ Add Patient</button>
      </form>

      {isLoading ? <p>Loading...</p> : (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f1f5f9" }}>
              {["Name", "Email", "Phone", "Date of Birth", "Blood Group", "Action"]
                .map(h => <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600 }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {patients.map(p => (
              <tr key={p.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "10px 12px" }}>{p.name}</td>
                <td style={{ padding: "10px 12px" }}>{p.email}</td>
                <td style={{ padding: "10px 12px" }}>{p.phone}</td>
                <td style={{ padding: "10px 12px" }}>{p.dateOfBirth}</td>
                <td style={{ padding: "10px 12px" }}>{p.bloodGroup}</td>
                <td style={{ padding: "10px 12px" }}>
                  <button onClick={() => delMutation.mutate(p.id)} style={{
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