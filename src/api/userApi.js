import api from "./axiosClient";

const userApi = {
  updateIdentity(data) {
    return api.patch("/users/identity", data);
  },

  deleteMyAccount() {
    return api.delete("/users/me");
  },

  getMyInfo() {
    return api.get("/users/my-info");
  },

  changePassword(data) {
    return api.patch("/users/my-password", data);
  },

  restoreMyAccount() {
    return api.post("/users/my-restore");
  },

  // --- SECTION: ADMIN QUẢN LÝ ---

  getAdminUserList(params) {
    return api.get("/users", { params });
  },

  createUser(data) {
    return api.post("/users", data);
  },

  updateAdminProfile(id, data) {
    return api.put(`/profiles/${id}`, data);
  },

  getAdminProfileDetail(id) {
    return api.get(`/profiles/${id}`);
  },

  updateAdminUser(id, data) {
    const url = `/users/${id}`;
    return api.put(url, data);
  },

  softDeleteUser(id) {
    return api.delete(`/users/${id}`);
  },

  getUserAdminDetail(id) {
    return api.get(`/users/${id}/admin-detail`);
  },

  adminRestoreUser(id) {
    return api.post(`/users/${id}/admin-restore`);
  },

  banUser(id, reasonData) {
    return api.post(`/users/${id}/ban`, reasonData);
  },

  unbanUser(id) {
    return api.post(`/users/${id}/unban`);
  },

  bulkUpdateStatus: (payload) => {
    return api.patch("/users/bulk-status", payload);
  },

  bulkSendNotification: (payload) => {
    return api.post("/users/bulk-notify", payload);
  },
};

export default userApi;
