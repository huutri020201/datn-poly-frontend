import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080", // Bỏ /api nếu BE của bạn dùng prefix khác, hoặc giữ nguyên tùy cấu trúc
});

// 1. Request Interceptor: Luôn lấy token mới nhất từ bộ nhớ
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Response Interceptor: Xử lý khi Token hết hạn
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 (Hết hạn token) và chưa thử refresh lần nào
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken") || sessionStorage.getItem("refreshToken");

        if (!refreshToken) throw new Error("No refresh token");

        // Gọi API refresh token (Sử dụng axios gốc để tránh lặp vô tận)
        const res = await axios.post("http://localhost:8080/identity/refresh-token", {
          refreshToken: refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = res.data.result;

        // Kiểm tra xem đang lưu ở đâu (Local hay Session) để cập nhật đúng chỗ
        const isRemember = localStorage.getItem("rememberMe") === "true";
        const storage = isRemember ? localStorage : sessionStorage;

        storage.setItem("accessToken", accessToken);
        storage.setItem("refreshToken", newRefreshToken);

        // Cập nhật lại header và thực hiện lại request ban đầu
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        // Nếu refresh token cũng hết hạn -> Xóa hết và về Login
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;