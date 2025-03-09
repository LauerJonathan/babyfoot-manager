export const authService = {
  isAuthenticated() {
    //return !!localStorage.getItem("admin_token");
    return true;
  },

  setToken(token) {
    localStorage.setItem("admin_token", token);
  },

  getToken() {
    return localStorage.getItem("admin_token");
  },

  logout() {
    localStorage.removeItem("admin_token");
  },
};
