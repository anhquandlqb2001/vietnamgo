import auth from "./auth";
export const AUTHENTICATE_ERROR = (status) => {
  switch (status) {
    case 401:
      auth.logout(() => {
        window.location = "/login";
      });
      break;
    case 403:
      window.location = "/";
      break;
    default:
      break;
  }
};
