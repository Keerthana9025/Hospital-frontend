
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { getAllAppointments, bookAppointment, updateStatus, cancelAppointment } from "../api/appointmentApi";
import { getAllDoctors } from "../api/doctorApi";
import { getAllPatients } from "../api/patientApi";

const STATUS_STYLE = {
  PENDING:   { background: "#fef3c7", color: "#92400e" },
  CONFIRMED: { background: "#d1fae5", color: "#065f46" },
  CANCELLED: { background: "#fee2e2", color: "#991b1b" },
  COMPLETED: { background: "#ede9fe", color: "#4c1d95" },
};

export default function AppointmentsPage() {
  const qc = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: getAllAppointments,
  });
  const { data: doctors = [] } = useQuery({ queryKey: ["doctors"], queryFn: getAllDoctors });
  const { data: patients = [] } = useQuery({ queryKey: ["patients"], queryFn: getAllPatients });

  const bookMutation = useMutation({
    mutationFn: bookAppointment,
    onSuccess: () => { qc.invalidateQueries(["appointments"]); toast.success("Appointment booked!"); reset(); },
    onError: (e) => toast.error(e.response?.data?.message || "Booking failed"),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateStatus(id, status),
    onSuccess: () => { qc.invalidateQueries(["appointments"]); toast.success("Status updated"); },
  });

  const onSubmit = (data) => {
    bookMutation.mutate({
      patientId: Number(data.patientId),
      doctorId: Number(data.doctorId),
      appointmentDate: data.appointmentDate,
      appointmentTime: data.appointmentTime + ":00",
      reason: data.reason,
    });
  };

  return (
    <div style={{ paddingTop: 32 }}>
      <h2 style={{ marginBottom: 20 }}>Appointments</h2>

      <div style={{
        background: "#f8fafc", padding: 20, borderRadius: 10,
        border: "1px solid #e2e8f0", marginBottom: 28,
      }}>
        <h3 style={{ fontSize: 15, marginBottom: 16 }}>Book New Appointment</h3>
        <form onSubmit={handleSubmit(onSubmit)}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, marginBottom: 4 }}>Patient</label>
            <select {...register("patientId", { required: true })}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc" }}>
              <option value="">-- Select Patient --</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, marginBottom: 4 }}>Doctor</label>
            <select {...register("doctorId", { required: true })}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc" }}>
              <option value="">-- Select Doctor --</option>
              {doctors.map(d => <option key={d.id} value={d.id}>{d.name} — {d.specialization}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, marginBottom: 4 }}>Date</label>
            <input type="date" {...register("appointmentDate", { required: true })}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, marginBottom: 4 }}>Time</label>
            <input type="time" {...register("appointmentTime", { required: true })}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc" }} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ display: "block", fontSize: 12, marginBottom: 4 }}>Reason</label>
            <input placeholder="Reason for visit" {...register("reason")}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc" }} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <button type="submit" style={{
              width: "100%", padding: 10, background: "#9333ea",
              color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14,
            }}>Book Appointment</button>
          </div>
        </form>
      </div>

      {isLoading ? <p>Loading...</p> : (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f1f5f9" }}>
              {["Patient", "Doctor", "Date", "Time", "Reason", "Status", "Update Status", "Action"]
                .map(h => <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600 }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {appointments.map(a => (
              <tr key={a.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "10px 12px" }}>{a.patient?.name}</td>
                <td style={{ padding: "10px 12px" }}>{a.doctor?.name}</td>
                <td style={{ padding: "10px 12px" }}>{a.appointmentDate}</td>
                <td style={{ padding: "10px 12px" }}>{a.appointmentTime}</td>
                <td style={{ padding: "10px 12px" }}>{a.reason}</td>
                <td style={{ padding: "10px 12px" }}>
                  <span style={{
                    ...STATUS_STYLE[a.status],
                    padding: "3px 8px", borderRadius: 4,
                    fontSize: 11, fontWeight: 600,
                  }}>{a.status}</span>
                </td>
                <td style={{ padding: "10px 12px" }}>
                  <select
                    defaultValue={a.status}
                    onChange={(e) => statusMutation.mutate({ id: a.id, status: e.target.value })}
                    style={{ fontSize: 12, padding: "4px 8px", borderRadius: 4, border: "1px solid #ccc" }}>
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </td>
                <td style={{ padding: "10px 12px" }}>
                  <button
                    onClick={() => cancelAppointment(a.id).then(() => {
                      qc.invalidateQueries(["appointments"]);
                      toast.success("Cancelled");
                    })}
                    style={{
                      background: "#ef4444", color: "#fff", border: "none",
                      padding: "4px 10px", borderRadius: 4, cursor: "pointer", fontSize: 12,
                    }}>Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}