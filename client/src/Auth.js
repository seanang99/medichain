import axios from "axios";

export const medichainClient = axios.create({
  baseURL: "http://localhost:3001",
});

export const emrxClient = axios.create({
  baseURL: "http://localhost:3002",
});

export const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export const setUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const logout = () => {
  localStorage.clear();
};
