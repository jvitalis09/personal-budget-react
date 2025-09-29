import axios from "axios";

const client = axios.create({
  baseURL: import.meta?.env?.VITE_API_URL || process.env.REACT_APP_API_URL || "http://localhost:3001",
  timeout: 10_000,
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("[API ERROR]", err?.response || err.message);
    return Promise.reject(err);
  }
);

export default client;
