import axios from "axios";

const BASE_URL = "http://localhost:8080/api/admin/stats";

const authHeader = () => {
  const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
  return { Authorization: "Bearer " + token };
};

export const getDashboardStats = () => {
  return axios.get(`${BASE_URL}/dashboard`, { headers: authHeader() });
};