import axios from "axios";

const api = axios.create({
  baseURL: "http://SEU_IP",
});

export default api;
