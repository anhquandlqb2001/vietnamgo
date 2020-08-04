import React, { Component } from "react";
import axios from "axios";
import UserProfile from '../../js/UserProfile'
import auth from '../../js/auth'

export default class Signup extends Component {
  constructor(props) {
    super(props);

    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      email: "",
      username: "",
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

  onChangeUsername(e) {
    this.setState({
      username: e.target.value,
    });
  }

  onSubmit(e) {
    e.preventDefault();
    const data = {
      email: this.state.email,
      password: this.state.password,
      username: this.state.username,
    };

    axios.post("/api/auth/register", data).then((res) => {
      if (res.data.status) {
        UserProfile.setUsername(res.data.userPackage.username);
        UserProfile.setIsLogin(res.data.status);
        UserProfile.setUserRole(res.data.userPackage.role);
        UserProfile.setUserId(res.data.userPackage.id);
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
            <label for="exampleInputEmail1">Username</label>
            <input
              onChange={this.onChangeUsername}
              type="text"
              className="form-control"
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
            Đăng ký
          </button>
        </form>
      </div>
    );
  }
}
