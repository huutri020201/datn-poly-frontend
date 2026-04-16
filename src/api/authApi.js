import api from "./axiosClient";

const authApi = {
  // --- HỆ THỐNG ---
  login(data) {
    return api.post("/auth/login", data);
  },

  logout(token) {
    return api.post("/auth/logout", { token });
  },

  refresh(refreshToken) {
    return api.post("/auth/refresh-token", { refreshToken });
  },

  register(data) {
    return api.post("/auth/register", data);
  },

  // --- XÁC THỰC CHUNG (Dùng cho cả Register & Forgot Password) ---
  verify(data) {
    return api.post("/auth/verify", data);
  },

  resend(data) {
    return api.post("/auth/resend", data);
  },

  findAccount(identifier) {
    return api.post("/auth/forgot-password/find-account", {
      identifier: identifier,
    });
  },

  sendOtpForReset(data) {
    return api.post("/auth/forgot-password/send-otp", data);
  },

  resetPassword(data) {
    return api.post("/auth/forgot-password/reset", data);
  },
};

export default authApi;
