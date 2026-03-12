import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

// Gắn access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xử lý refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      const res = await axios.post(
        "http://localhost:8080/auth/refresh-token",
        { refreshToken }
      );

      const newAccessToken = res.data.result.accessToken;
      localStorage.setItem("accessToken", newAccessToken);

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accessToken");

//   const publicUrls = [
//     "/auth/login",
//     "/auth/register-email",
//     "/auth/register-phone",
//     "/auth/verify-email",
//     "/auth/verify-phone"
//   ];

//   const isPublic = publicUrls.some(url => config.url.includes(url));

//   if (token && !isPublic) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

export default api;