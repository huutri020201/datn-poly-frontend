import api from "./axiosClient";

const profileApi = {
  getMyProfile() {
    return api.get("/profiles/me");
  },

  updateMyProfile(data) {
    return api.patch("/profiles/me", data);
  },

  uploadAvatar(file) {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/profiles/me/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // --- SECTION: ADDRESSES ---

  getMyAddresses() {
    return api.get("/profiles/me/addresses");
  },

  createAddress(data) {
    return api.post("/profiles/me/addresses", data);
  },

  updateAddress(id, data) {
    return api.patch(`/profiles/me/addresses/${id}`, data);
  },

  deleteAddress(id) {
    return api.delete(`/profiles/me/addresses/${id}`);
  },

  setDefaultAddress(id) {
    return api.patch(`/profiles/me/addresses/${id}/default`, {});
  },

  getProvinces() {
    return api.get("/geo/provinces");
  },
  getDistricts(provinceCode) {
    return api.get(`/geo/districts/${provinceCode}`);
  },
  getWards(districtCode) {
    return api.get(`/geo/wards/${districtCode}`);
  },

  // --- SECTION: ADMIN/PUBLIC ---

  getPublicProfile(id) {
    return api.get(`/profiles/${id}`);
  },

  // Admin
  updateProfileInternal(id) {
    return api.patch(`/profiles/${id}/internal`, {});
  },
};
export default profileApi;
