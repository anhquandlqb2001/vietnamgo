import auth  from "./auth";
export const AUTHENTICATE_ERROR = (status) => {
  if (status === 401 || status === 403) {
    localStorage.clear();
    auth.logout(() => {
      // window.location = "/login";
    });
  }
};
