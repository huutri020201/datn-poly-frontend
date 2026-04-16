import { defineStore } from "pinia";
import authApi from "@/api/authApi";
import api from "@/api/axiosClient";
import { jwtDecode } from "jwt-decode";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken:
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken") ||
      null,
    refreshToken:
      localStorage.getItem("refreshToken") ||
      sessionStorage.getItem("refreshToken") ||
      null,
    role:
      localStorage.getItem("role") || sessionStorage.getItem("role") || null,
    user: JSON.parse(
      localStorage.getItem("user") || sessionStorage.getItem("user") || "null",
    ),
    loading: false,
  }),

  getters: {
    isLoggedIn: (state) => !!state.accessToken,
    isAdmin: (state) => state.role?.includes("ROLE_ADMIN"),
  },

  actions: {
    async handleLoginSuccess(authResponse, rememberMe = false) {
      try {
        const { accessToken, refreshToken, ...userInfo } = authResponse;

        // 1. Giải mã token để lấy role (scope) và thời hạn
        const decoded = jwtDecode(accessToken);

        // 2. Cập nhật State
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.role = decoded.scope;
        this.user = {
          id: userInfo.userId || decoded.sub,
          email: userInfo.email,
          phone: userInfo.phone,
          status: userInfo.status,
          ...userInfo,
        };

        // 3. Xử lý Storage (Dọn dẹp cả 2 bên trước khi lưu mới)
        [localStorage, sessionStorage].forEach((s) => {
          s.removeItem("accessToken");
          s.removeItem("refreshToken");
          s.removeItem("role");
          s.removeItem("user");
        });

        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("accessToken", this.accessToken);
        storage.setItem("refreshToken", this.refreshToken);
        storage.setItem("role", this.role);
        storage.setItem("user", JSON.stringify(this.user));

        // 4. Lấy thêm thông tin chi tiết (nếu cần như avatar, address...)
        await this.fetchProfile();
      } catch (err) {
        console.error("Store: Lỗi handleLoginSuccess:", err);
        throw err;
      }
    },

    async loginUser(payload, rememberMe = false) {
      this.loading = true;
      try {
        const res = await authApi.login(payload);
        // Lưu ý: res.result vì axiosClient của mày đã bóc tách
        await this.handleLoginSuccess(res.result || res, rememberMe);
        return res.result || res;
      } finally {
        this.loading = false;
      }
    },

    async fetchProfile() {
      if (!this.accessToken) return;
      try {
        const res = await api.get("/profiles/me");
        this.user = { ...this.user, ...res };
        const storage = localStorage.getItem("accessToken")
          ? localStorage
          : sessionStorage;
        storage.setItem("user", JSON.stringify(this.user));

        console.log("Cập nhật profile thành công vào storage");
      } catch (error) {
        console.error("Lỗi lấy profile:", error);
      }
    },

    async logout() {
      try {
        if (this.accessToken) {
          await authApi.logout(this.accessToken);
        }
      } catch (e) {
        console.warn("Logout BE failed or token expired");
      } finally {
        this.$reset();
        const keysToRemove = ["accessToken", "refreshToken", "role", "user"];
        keysToRemove.forEach((key) => {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        });
        window.location.href = "/login?logout=success";
      }
    },

    refreshState(newAccessToken, newRefreshToken) {
      this.accessToken = newAccessToken;
      this.refreshToken = newRefreshToken;

      const storage = localStorage.getItem("accessToken")
        ? localStorage
        : sessionStorage;
      storage.setItem("accessToken", newAccessToken);
      storage.setItem("refreshToken", newRefreshToken);
    },
  },
});
