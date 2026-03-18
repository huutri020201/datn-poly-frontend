import { defineStore } from "pinia";
import { login } from "@/api/authApi";
import { jwtDecode } from "jwt-decode";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    accessToken: localStorage.getItem("accessToken") || null,
    refreshToken: localStorage.getItem("refreshToken") || null,
    role: localStorage.getItem("role") || null,
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

        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("role", this.role);
        localStorage.setItem("user", JSON.stringify(this.user)); 

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