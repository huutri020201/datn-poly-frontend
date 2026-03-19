import api from "@/api/axios";

export const getAllPitches = () => {
  return api.get("/pitches"); 
};
export const createBooking = (bookingData) => {
  return api.post("/bookings", bookingData);
};