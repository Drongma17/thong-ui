import { faL } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Cookies from "js-cookie";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
  withCredentials: false,
});

apiClient.interceptors.request.use(
  async (config) => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken) {
      config.headers.Authorization = `Bearer ${jwtToken}`;
    }

    const safeMethods = ["GET", "HEAD", "OPTIONS"];
    if (!safeMethods.includes(config.method.toUpperCase())) {
      let csrfToken = Cookies.get("XSRF-TOKEN");
      if (!csrfToken) {
        await axios.get(`${import.meta.env.VITE_API_BASE_URL}/csrf-token`, {
          withCredentials: false,
        });
        csrfToken = Cookies.get("XSRF-TOKEN");
        if (!csrfToken) {
          throw new Error("Failed to retrieves CSRF token from cookies");
        }
      }
      config.headers["X-XSRF-TOKEN"];
    }
    return config;
  },
  (error) => Promise.reject(error)
);


apiClient.interceptors.response.use(
    (response) => response,
    async (error) =>{
        if(error.response && error.response.status ===401){
            const jwtToken = localStorage.getItem("jwtToken");
            if(jwtToken){
                localStorage.removeItem("jwtToken");
                window.location.href = "/login"
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;