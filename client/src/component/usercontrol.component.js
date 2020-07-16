import React, { useState, useEffect } from "react";
import axios from "axios";
import auth from "../auth";

function UserControl() {
  const [users, setUsers] = useState([]);
  const [windowWidth, setWindowWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(null);

  useEffect(() => {
    getUserData();
  });

  const getUserData = () => {
    axios.get("/api/user").then((res) => {
      setUsers(res.data);
    });
  };

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
  }, [windowWidth]);

  const updateDimensions = () => {
    let width = typeof window !== "undefined" ? window.innerWidth : 0;
    setWindowWidth(width);
    if (windowWidth < 576) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  const userData = users.map((user) => {
    if (!isMobile) {
      return (
        <li className="list-group-item d-flex justify-content-between">
          <div>
            <div className="d-flex">
              Tên tài khoản:<p className="text-primary ml-1">{user.username}</p>
            </div>
            <div>
              {auth.isCreator(user.role) ? (
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => roleDown(user._id)}
                >
                  Gỡ quyền đăng bài
                </button>
              ) : auth.isAdmin(user.role) ? (
                ""
              ) : (
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => roleUp(user._id)}
                >
                  Thêm quyền đăng bài
                </button>
              )}
            </div>
          </div>
          <div className="text-right">
            <p>Email: {user.email}</p>
            <p>{user.role}</p>
          </div>
        </li>
      );
    } else {
      return (
        <li className="list-group-item">
          <div className="d-flex">
            Tên tài khoản:{" "}
            <p className="text-primary d-block">&nbsp;{user.username}</p>
          </div>
          <p>Email: {user.email}</p>
          <p>{user.role}</p>
          {auth.isCreator(user.role) ? (
            <button
              className="btn btn-sm btn-danger"
              onClick={() => roleDown(user._id)}
            >
              Gỡ quyền đăng bài
            </button>
          ) : auth.isAdmin(user.role) ? (
            ""
          ) : (
            <button
              className="btn btn-sm btn-success"
              onClick={() => roleUp(user._id)}
            >
              Thêm quyền đăng bài
            </button>
          )}
        </li>
      );
    }
  });

  const roleUp = (id) => {
    axios.get("/api/user/up", { params: { id: id } });
  };

  const roleDown = (id) => {
    axios.get("/api/user/down", { params: { id: id } });
  };

  return <ul className="list-group">{userData}</ul>;
}

export default UserControl;