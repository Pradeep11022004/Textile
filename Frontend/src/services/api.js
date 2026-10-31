
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

async function request(path, options = {}) {
  const { headers, ...restOptions } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...restOptions,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(
      errorMessage || `Request failed: ${response.status}`
    );
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

export const api = {
  // Existing API methods
  get: (path) => request(path),

  post: (path, data) =>
    request(path, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  put: (path, data) =>
    request(path, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (path) =>
    request(path, {
      method: "DELETE",
    }),

  // Wishlist API methods
  wishlist: {
    get: (userId) =>
      request(`/api/wishlist/user/${userId}`),

    add: (userId, productId) =>
      request(`/api/wishlist/user/${userId}/product/${productId}`, {
        method: "POST",
      }),

    remove: (userId, productId) =>
      request(`/api/wishlist/user/${userId}/product/${productId}`, {
        method: "DELETE",
      }),

    check: (userId, productId) =>
      request(`/api/wishlist/user/${userId}/product/${productId}/exists`),
  },
};
