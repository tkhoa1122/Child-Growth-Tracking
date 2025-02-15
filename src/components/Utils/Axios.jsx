import axios from "axios";
const baseUrl = "https://localhost:7190/";

const config = {
  baseURL: baseUrl,
};
const api = axios.create(config);

const handleBefore = (config) => {
  const token = localStorage.getItem("token")?.replaceAll('"', "");
  config.headers["Authorization"] = `Bearer ${token}`;
  return config;
};

api.interceptors.request.use(handleBefore);

export default api;

