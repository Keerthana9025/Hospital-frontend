import api from "./axios";

export const bookAppointment = (data) =>
  api.post("/appointments", data).then((r) => r.data);

export const getAllAppointments = () =>
  api.get("/appointments").then((r) => r.data);

export const getByPatient = (patientId) =>
  api.get(`/appointments/patient/${patientId}`).then((r) => r.data);

export const getByDoctor = (doctorId) =>
  api.get(`/appointments/doctor/${doctorId}`).then((r) => r.data);

export const updateStatus = (id, status) =>
  api.patch(`/appointments/${id}/status?status=${status}`).then((r) => r.data);

export const addNotes = (id, notes) =>
  api.patch(`/appointments/${id}/notes`, { notes }).then((r) => r.data);

export const cancelAppointment = (id) =>
  api.delete(`/appointments/${id}`).then((r) => r.data);