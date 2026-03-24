import { defineStore } from "pinia";
import { login } from "@/api/authApi";
import { jwtDecode } from "jwt-decode";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken") || null,
    refreshToken: localStorage.getItem("refreshToken") || sessionStorage.getItem("refreshToken") || null,
    role: localStorage.getItem("role") || sessionStorage.getItem("role") || null,
    user: JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "null"),
    loading: false,
  }),

  actions: {
    async loginUser(payload) {
      this.loading = true;
      try {
        const res = await login(payload);
        const data = res.data.result;

        this.accessToken = data.accessToken;
        this.refreshToken = data.refreshToken;

        const decoded = jwtDecode(data.accessToken);
        this.role = decoded.scope;
        this.user = {
          id: decoded.sub,
          role: decoded.scope,
          username: payload.username // Có thể lưu thêm username
        };

        return data;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Hàm này giúp đồng bộ lại Store khi Token được refresh thành công từ Interceptor
    refreshState(newAccessToken, newRefreshToken) {
      this.accessToken = newAccessToken;
      this.refreshToken = newRefreshToken;
    },

    logout() {
      this.accessToken = null;
      this.refreshToken = null;
      this.role = null;
      this.user = null;
      localStorage.clear();
      sessionStorage.clear();
    }
  },
});