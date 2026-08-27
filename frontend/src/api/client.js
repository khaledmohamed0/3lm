const BASE_URL = "https://loda2007.pythonanywhere.com/api/auth";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("access_token");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.detail || Object.values(data || {})[0]?.[0] || "حصل خطأ، حاول تاني";
    throw new Error(message);
  }

  return data;
}

export default request;