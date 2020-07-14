
class Auth {
  constructor() {
    this.authenticated = false;
  }

  login(cb) {
    
    this.authenticated = true;
    cb();
  }

  logout(cb) {
    this.authenticated = false;
    cb();
  }

  isAuthenticated() {
    return this.authenticated;
  }

  isCreator(role) {
    return role==='creator'
  }

  isAdmin(role) {
    return role==='admin'
  }
}

export default new Auth()