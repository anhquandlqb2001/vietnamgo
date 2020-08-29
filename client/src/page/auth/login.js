import React, { useState, useContext } from "react";
import axios from "axios";
import Profile from "../../js/UserProfile";
import auth from "../../js/auth";
const Login = () => {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();

    const data = {
      email: Email,
      password: Password,
    };
    axios.post("/api/auth/login", data).then((res) => {
      if (res.data.success) {
        Profile.setUsername(res.data.user.username);
        Profile.setIsLogin(res.data.success);
        Profile.setUserRole(res.data.user.role);
        Profile.setUserId(res.data.user.userID);
        Profile.setAccessToken(res.data.accessToken)
        auth.login(() => {
          window.location = "/";
        });
      } else {
        alert(res.data.message);
      }
    });    
  };
  return (
    <div className="container w-50">
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Email</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Mật khẩu</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="form-control"
            id="exampleInputPassword1"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Đăng nhập
        </button>
      </form>
    </div>
  );
};

export default Login;
