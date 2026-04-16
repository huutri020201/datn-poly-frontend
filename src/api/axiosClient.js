import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:8080",
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => {
    if (response.data && response.data.result !== undefined) {
      return response.data.result;
    }
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    const errData = error.response?.data || error;

    const url = originalRequest.url || "";
    const isPublicApi =
      url.includes("login") ||
      url.includes("register") ||
      url.includes("forgot-password") ||
      url.includes("verify") ||
      url.includes("resend-otp");

    if (isPublicApi) {
      return Promise.reject(errData);
    }

    const errCode = error.response?.data?.code;
    const isAuthError =
      errCode === 1202 || errCode === 1009 || error.response?.status === 401;

    if (isAuthError && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken =
          localStorage.getItem("refreshToken") ||
          sessionStorage.getItem("refreshToken");

        if (!refreshToken) throw new Error("No refresh token available");

        const res = await axios.post(
          "http://localhost:8080/auth/refresh-token",
          { refreshToken: refreshToken },
        );

        const { accessToken, refreshToken: newRefreshToken } = res.data.result;

        const storage = localStorage.getItem("accessToken")
          ? localStorage
          : sessionStorage;

        storage.setItem("accessToken", accessToken);
        storage.setItem("refreshToken", newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/login?session=expired";
        return Promise.reject(refreshError);
        // if (!isPublicApi) {
        //   localStorage.clear();
        //   sessionStorage.clear();
        //   window.location.href = "/login?session=expired";
        //   return Promise.reject(refreshError);
        // }
      }
    }

    // return Promise.reject(error.response?.data || error);
    return Promise.reject(errData);
  },
);

export default api;
