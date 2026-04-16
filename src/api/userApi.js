import api from "./axiosClient";

const userApi = {
  getAllUsers() {
    return api.get("/users");
  },

  createUser(data) {
    return api.post("/users", data);
  },

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

  updateUser(id, data) {
    return api.put(`/users/${id}`, data);
  },

  deleteUser(id) {
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
};

export default userApi;
