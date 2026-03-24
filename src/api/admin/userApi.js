import axios from "axios"

const API = "http://localhost:8080/users"

const authHeader = () => {
  const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
  return {
    Authorization: "Bearer " + token
  };
}

export const getAllUsers = () => {
  return axios.get(API, { headers: authHeader() })
}

export const getUserDetail = (id) => {
  return axios.get(`${API}/${id}`, { headers: authHeader() })
}

export const createUser = (data) => {
  return axios.post(API, data, { headers: authHeader() })
}

export const updateUser = (id, data) => {
  return axios.put(`${API}/${id}`, data, { headers: authHeader() })
}

export const deleteUser = (id) => {
  return axios.delete(`${API}/${id}`, { headers: authHeader() })
}