import axios from "axios";

const API = axios.create({
  baseURL: `http://localhost:5000/api`,
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem("token")) {
    req.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  }
  return req;
});

// Redirect to login page if token is expired
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const originalRequest = error.config;

      // Prevent infinite loops
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        // If the request is not for the login route, redirect to the login page
        if (
          originalRequest.url !== "/auth/login" &&
          originalRequest.url !== "/auth/signup"
        ) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default API;
