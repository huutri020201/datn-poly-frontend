import api from "./axios"; 

export const getAllPromotions = () => api.get("/admin/promotions");
export const createPromotion = (data) => api.post("/admin/promotions", data);
export const updatePromotion = (id, data) => api.put(`/admin/promotions/${id}`, data);
export const deletePromotion = (id) => api.delete(`/admin/promotions/${id}`);