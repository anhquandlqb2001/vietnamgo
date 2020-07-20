import React, { Component } from "react";
import axios from "axios";
import UserProfile from "../../js/UserProfile";
import auth from "../../js/auth";
export default class Login extends Component {
  constructor(props) {
    super(props);

    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      email: "",
      password: "",
    };
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value,
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value,
    });
  }

  onSubmit(e) {
    e.preventDefault();

    const data = {
      email: this.state.email,
      password: this.state.password,
    };

    axios.post("/api/auth/login", data).then((res) => {
      if (res.data.status) {
        UserProfile.setUsername(res.data.user.username);
        UserProfile.setIsLogin(res.data.status);
        UserProfile.setUserRole(res.data.user.role);
        UserProfile.setUserId(res.data.user.id);
        auth.login(() => {
          window.location = "/";
        });
      } else {
        alert(res.data.message);
      }
    });
  }

  render() {
    return (
      <div className="container w-50">
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label for="exampleInputEmail1">Email</label>
            <input
              onChange={this.onChangeEmail}
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
            />
          </div>
          <div className="form-group">
            <label for="exampleInputPassword1">Mật khẩu</label>
            <input
              onChange={this.onChangePassword}
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
  }
}
