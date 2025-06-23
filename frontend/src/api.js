import axios from "axios";

const API_BASE = "http://localhost:8081/api";

// Patients
export const getUsers = () => axios.get(`${API_BASE}/patients`);
export const getUserById = (id) => axios.get(`${API_BASE}/patients/${id}`);
export const addUser = (data) => axios.post(`${API_BASE}/patients`, data);
export const updateUser = (id, data) => axios.put(`${API_BASE}/patients/${id}`, data);
export const deleteUser = (id) => axios.delete(`${API_BASE}/patients/${id}`);

// Doctors
export const getStaff = () => axios.get(`${API_BASE}/doctors`);
export const getStaffById = (id) => axios.get(`${API_BASE}/doctors/${id}`);
export const addStaff = (data) => axios.post(`${API_BASE}/doctors`, data);
export const updateStaff = (id, data) => axios.put(`${API_BASE}/doctors/${id}`, data);
export const deleteStaff = (id) => axios.delete(`${API_BASE}/doctors/${id}`);

// Appointments
export const getMeetings = () => axios.get(`${API_BASE}/appointments`);
export const getMeetingById = (id) => axios.get(`${API_BASE}/appointments/${id}`);
export const addMeeting = (data) => axios.post(`${API_BASE}/appointments`, data);
export const updateMeeting = (id, data) => axios.put(`${API_BASE}/appointments/${id}`, data);
export const deleteMeeting = (id) => axios.delete(`${API_BASE}/appointments/${id}`);
