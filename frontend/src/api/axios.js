import axios from "axios";

const api = axios.create({
  baseURL: "https://loda2007.pythonanywhere.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// =====================================================
// REQUEST INTERCEPTOR
// Add access token automatically
// =====================================================

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =====================================================
// RESPONSE INTERCEPTOR
// Refresh access token when it expires
// =====================================================

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    // ---------------------------------------------------
    // Only handle 401
    // ---------------------------------------------------

    if (
      error.response?.status !== 401 ||
      originalRequest?._retry
    ) {
      return Promise.reject(error);
    }

    // ---------------------------------------------------
    // Get refresh token
    // ---------------------------------------------------

    const refreshToken =
      localStorage.getItem("refresh_token");

    if (!refreshToken) {
      return Promise.reject(error);
    }

    // ---------------------------------------------------
    // If another request is already refreshing
    // ---------------------------------------------------

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve,
          reject,
        });
      }).then((newAccessToken) => {
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // -------------------------------------------------
      // Request new access token
      // -------------------------------------------------

      const response = await axios.post(
        "https://loda2007.pythonanywhere.com/api/auth/token/refresh/",
        {
          refresh: refreshToken,
        }
      );

      const newAccessToken =
        response.data.access;

      // -------------------------------------------------
      // Save new access token
      // -------------------------------------------------

      localStorage.setItem(
        "access_token",
        newAccessToken
      );

      // -------------------------------------------------
      // Resolve queued requests
      // -------------------------------------------------

      processQueue(
        null,
        newAccessToken
      );

      // -------------------------------------------------
      // Retry original request
      // -------------------------------------------------

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(originalRequest);

    } catch (refreshError) {

      // -------------------------------------------------
      // Refresh token itself expired
      // User must login again
      // -------------------------------------------------

      processQueue(
        refreshError,
        null
      );

      localStorage.removeItem(
        "access_token"
      );

      localStorage.removeItem(
        "refresh_token"
      );

      localStorage.removeItem(
        "user"
      );

      window.location.href = "/login";

      return Promise.reject(
        refreshError
      );

    } finally {
      isRefreshing = false;
    }
  }
);

export default api;