import api from "./axios";

export const getAllDoctors = () =>
  api.get("/doctors").then((r) => r.data);

export const getAvailableDoctors = () =>
  api.get("/doctors/available").then((r) => r.data);

export const getDoctorsBySpecialization = (name) =>
  api.get(`/doctors/specialization?name=${name}`).then((r) => r.data);

export const createDoctor = (data) =>
  api.post("/doctors", data).then((r) => r.data);

export const updateDoctor = (id, data) =>
  api.put(`/doctors/${id}`, data).then((r) => r.data);

export const deleteDoctor = (id) =>
  api.delete(`/doctors/${id}`).then((r) => r.data);