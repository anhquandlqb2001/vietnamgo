import React from "react";
import { Link } from "react-router-dom";
import UserProfile from "../../js/UserProfile";
import "../style.css";
import auth from "../../js/auth";
const Navbar = () => {
  const Logout = () => {
    localStorage.clear();
    window.location.reload(true);
    auth.logout(() => {
      window.location = "/";
    });
  }
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/">
          VNGO
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home <span className="sr-only">(current)</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/topics">
                Bài viết
              </Link>
            </li>

            {auth.isAdmin(UserProfile.getUserRole()) ? (
              <div style={{ display: "contents" }}>
                <Link className="nav-link" to="/admin/location/add">
                  Quản lý
                </Link>
              </div>
            ) : auth.isCreator(UserProfile.getUserRole()) ? (
              <div style={{ display: "contents" }}>
                <Link className="nav-link" to="/user/topics/queue">
                Cá nhân
                </Link>
              </div>
            ) : (
              ""
            )}
            {UserProfile.isLogin() ? (
              <div className="haslogin-container">
                <button
                  className="nav-link btn btn-danger"
                  onClick={Logout}
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="haslogout-container">
                <Link className="nav-link" to="/login">
                  Đăng nhập
                </Link>

                <Link className="nav-link" to="/signup">
                  Đăng ký
                </Link>
              </div>
            )}
          </ul>
        </div>
      </nav>
    );
}

export default Navbar