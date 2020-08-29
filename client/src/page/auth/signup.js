import React, { useState } from "react";
import axios from "axios";
import Profile from '../../js/UserProfile'
import auth from '../../js/auth'

const Signup = () => {
  const [Email, setEmail] = useState('')
  const [Username, setUsername] = useState('')
  const [Password, setPassword] = useState('')

  const onSubmit = (e) => {
    e.preventDefault();
    const data = {
      email: Email,
      password: Password,
      username: Username,
    };

    axios.post("/api/auth/register", data).then((res) => {
      if (res.data.success) {
        auth.login(() => {
          window.location = "/login";
        });
      } else {
        alert(res.data.message);
      }
    });
  }

    return (
      <div className="container w-50">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label for="exampleInputEmail1">Email</label>
            <input
              onChange={e => setEmail(e.target.value)}
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
            />
          </div>
          <div className="form-group">
            <label for="exampleInputEmail1">Username</label>
            <input
              onChange={e => setUsername(e.target.value)}
              type="text"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label for="exampleInputPassword1">Mật khẩu</label>
            <input
              onChange={e => setPassword(e.target.value)}
              type="password"
              className="form-control"
              id="exampleInputPassword1"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Đăng ký
          </button>
        </form>
      </div>
    );
}

export default Signup