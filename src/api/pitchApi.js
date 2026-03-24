import api from "@/api/axios";

export const getAllPitches = () => {
  return api.get("/pitches"); 
};
export const createBooking = (bookingData) => {
  return api.post("/bookings", bookingData);
};

export const getAllBookingsAdmin = () => {
  return api.get("/admin/bookings"); 
};

export const updateBookingStatus = (id, newStatus) => {
  return api.put(`/admin/bookings/${id}/status`, null, {
    params: { status: newStatus }
  });
};

export const deleteBooking = (id) => {
  return api.delete(`/admin/bookings/${id}`);
};


export const getMyBookingHistory = () => {
  return api.get("/bookings/my-bookings");
};

export const getBookingDetail = (id) => {
  return api.get(`/bookings/${id}`);
};


export const createPitch = (pitchData) => {
  return api.post("/pitches", pitchData);
};


export const updatePitch = (id, pitchData) => {
  return api.put(`/pitches/${id}`, pitchData);
};


export const deletePitch = (id) => {
  return api.delete(`/pitches/${id}`);
};