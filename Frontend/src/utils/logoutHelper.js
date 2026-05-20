// logoutHelper.js
let logoutHandler = null;

// Set the logout function from AuthContext
export const setLogoutHandler = fn => {
  logoutHandler = fn;
};

// Call this function when you need to logout globally
export const triggerLogout = () => {
  if (logoutHandler) logoutHandler();
};
