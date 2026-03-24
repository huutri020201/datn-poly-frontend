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
        role: decoded.scope
      };
      return data; 

    } catch (error) {
      throw error; 
    } finally {
      this.loading = false;
    }
  },

    logout() {
      this.accessToken = null;
      this.refreshToken = null;
      this.role = null;

      localStorage.clear();
    }
  },
});