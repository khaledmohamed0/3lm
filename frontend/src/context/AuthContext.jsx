import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("access_token")
  );
  const [loading, setLoading] = useState(true);

  const getCurrentUser = async (token = accessToken) => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/auth/me/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      // لو الـ Token طلع منتهي أو 401 بنمسحه من غير ما نعلق الـ App
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setAccessToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login/", {
        username,
        password,
      });

      const { access, refresh } = response.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      setAccessToken(access);
      await getCurrentUser(access);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    setAccessToken(null);
    setUser(null);
    setLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      getCurrentUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    accessToken,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* 👈 دي بتمنع الشاشة البيضاء لحد ما الـ auth يجهز */}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}