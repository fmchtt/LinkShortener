import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/",
  headers: {
    Authorization: localStorage.getItem("token")
      ? `Bearer ${localStorage.getItem("token")}`
      : null,
  },
});

export default http;
