
/**
 * Check if the admin is authenticated
 */
export const isAdminAuthenticated = (): boolean => {
  return sessionStorage.getItem("adminAuthenticated") === "true";
};

/**
 * Logout the admin
 */
export const logoutAdmin = (): void => {
  sessionStorage.removeItem("adminAuthenticated");
};
