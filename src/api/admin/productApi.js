import axios from "axios";

const BASE_URL = "http://localhost:8080";
const API_PRODUCTS = `${BASE_URL}/products`;
const API_BRANDS = `${BASE_URL}/brands`;
const API_CATEGORIES = `${BASE_URL}/categories`;

const authHeader = () => {
  const token =
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken");
  return {
    Authorization: "Bearer " + token,
  };
};

// ================= PRODUCT API =================
export const getAllProducts = (filters = {}) => {
  return axios.get(API_PRODUCTS, {
    params: filters, // Axios tự động nối thành ?keyword=...&brandId=...
    headers: authHeader(),
  });
};

export const getProductDetail = (id) => {
  return axios.get(`${API_PRODUCTS}/${id}`, { headers: authHeader() });
};

export const createProduct = (data) => {
  return axios.post(API_PRODUCTS, data, { headers: authHeader() });
};

export const updateProduct = (id, data) => {
  return axios.put(`${API_PRODUCTS}/${id}`, data, { headers: authHeader() });
};

export const deleteProduct = (id) => {
  return axios.delete(`${API_PRODUCTS}/${id}`, { headers: authHeader() });
};

// ================= BRAND API (BỔ SUNG) =================
export const getAllBrands = () => {
  return axios.get(API_BRANDS, { headers: authHeader() });
};

export const createBrand = (data) => {
  return axios.post(API_BRANDS, data, { headers: authHeader() });
};

export const updateBrand = (id, data) => {
  return axios.put(`${API_BRANDS}/${id}`, data, { headers: authHeader() });
};

export const deleteBrand = (id) => {
  return axios.delete(`${API_BRANDS}/${id}`, { headers: authHeader() });
};

// ================= CATEGORY API (BỔ SUNG) =================
export const getAllCategories = () => {
  return axios.get(API_CATEGORIES, { headers: authHeader() });
};

export const createCategory = (data) => {
  return axios.post(API_CATEGORIES, data, { headers: authHeader() });
};

export const updateCategory = (id, data) => {
  return axios.put(`${API_CATEGORIES}/${id}`, data, { headers: authHeader() });
};

export const deleteCategory = (id) => {
  return axios.delete(`${API_CATEGORIES}/${id}`, { headers: authHeader() });
};
