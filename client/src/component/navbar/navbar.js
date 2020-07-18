import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import UserProfile from '../../js/UserProfile'
import '../style.css'
import auth from '../../js/auth'
export default class Navbar extends Component {
  logout() {
    localStorage.clear()
    window.location.reload(true);
    auth.logout(() => {
      window.location = '/'
    })
  // window.location = '/'
  }
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/">VNGO</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item active">
              <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/topics">Bài viết</Link>
            </li>

            <li className="nav-item">
              <div className="btn-group dropleft">
                <button type="button" className="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {UserProfile.getUsername() != null ? UserProfile.getUsername() : 'Tài khoản'}
                </button>
                <div className="dropdown-menu">
                    {auth.isAdmin(UserProfile.getUserRole())
                    ? <div style={{display: 'contents'}}>
                          <Link className="dropdown-item" to="/location/add">Thêm địa điểm</Link>
                          <Link className="dropdown-item" to="/topics/queue">Duyệt bài</Link>
                          <Link className="dropdown-item" to="/user">Quản lí thành viên</Link>
                      </div>
                    : auth.isCreator(UserProfile.getUserRole())
                    ? 
                        <Link className="dropdown-item" to="/topics/queue">Duyệt bài</Link>
                    : ''}
                    {UserProfile.isLogin() ?
                    <div className="haslogin-container">
                      <button className="dropdown-item btn btn-danger" onClick={this.logout}>Đăng xuất</button>
                    </div> : <div className="haslogout-container">
                      <Link className="dropdown-item" to="/login">Đăng nhập</Link>
                    
                      <Link className="dropdown-item" to="/signup">Đăng ký</Link>
                   </div>}
                </div>
              </div>
            </li>
            
          </ul>
        </div>
      </nav>
    )
  }
}