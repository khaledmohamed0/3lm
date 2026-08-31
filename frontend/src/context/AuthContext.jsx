import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Loader2 } from "lucide-react"; // 👈 استيراد الـ Spinner

import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // GET CURRENT USER
  // =========================================================
  const fetchUser = async () => {
    try {
      const response = await api.get("/auth/me/");

      setUser(response.data);

      return response.data;
    } catch (error) {
      console.error("Failed to fetch user profile:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
      }

      return null;
    }
  };

  // =========================================================
  // LOGIN
  // =========================================================
  const login = async (username, password) => {
    try {
      const response = await api.post("/auth/login/", {
        username,
        password,
      });

      console.log("Login response:", response.data);

      const accessToken =
        response.data.access ||
        response.data.access_token;

      const refreshToken =
        response.data.refresh ||
        response.data.refresh_token;

      if (!accessToken) {
        throw new Error("No access token returned from server.");
      }

      // Save tokens
      localStorage.setItem(
        "access_token",
        accessToken
      );

      if (refreshToken) {
        localStorage.setItem(
          "refresh_token",
          refreshToken
        );
      }

      // Get current user after successful login
      const userResponse = await api.get("/auth/me/");

      setUser(userResponse.data);

      return userResponse.data;

    } catch (error) {
      console.error("Login failed:", error);

      throw error;
    }
  };

  // =========================================================
  // LOGOUT
  // =========================================================
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    setUser(null);
  };

  // =========================================================
  // CHECK LOGIN WHEN APP STARTS
  // =========================================================
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("access_token");

      // No token = user is not logged in
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      await fetchUser();

      setLoading(false);
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,

        // Important
        login,
        logout,
        fetchUser,
      }}
    >
      {loading ? (
        <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-[#00406E] animate-spin" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

// =========================================================
// USE AUTH
// =========================================================
export function useAuth() {
  return useContext(AuthContext);
}