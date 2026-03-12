import axios from "axios"

const API = "http://localhost:8080/products"

const authHeader = () => ({
  Authorization: "Bearer " + localStorage.getItem("accessToken")
})

export const getAllProducts = () => {
  return axios.get(API, { headers: authHeader() })
}

export const getAllCategories = () => {
  return axios.get("http://localhost:8080/categories", { headers: authHeader() })
}
export const getAllBrands = () => {
  return axios.get("http://localhost:8080/brands", { headers: authHeader() })
}

export const getProductDetail = (id) => {
  return axios.get(`${API}/${id}`, { headers: authHeader() })
}

export const createProduct = (data) => {
  return axios.post(API, data, { headers: authHeader() })
}

export const updateProduct = (id, data) => {
  return axios.put(`${API}/${id}`, data, { headers: authHeader() })
}

export const deleteProduct = (id) => {
  return axios.delete(`${API}/${id}`, { headers: authHeader() })
}