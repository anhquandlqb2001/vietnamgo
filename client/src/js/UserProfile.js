var UserProfile = (function() {

  var getUsername = function() {
    return localStorage.getItem('username')   // Or pull this from cookie/localStorage
  };

  var setUsername = function(username) {
    // Also set this in cookie/localStorage
    localStorage.setItem('username', username)
  };

  var getUserId = function() {
    return localStorage.getItem('id')
  }

  var setUserId = function(id) {
    localStorage.setItem('id', id)
  }

  var isLogin = function() {
    return localStorage.getItem('islogin')
  }

  var setIsLogin = function(bool) {
    localStorage.setItem('islogin', bool)
  }

  var setUserRole = function(role) {
    localStorage.setItem('role', role)
  }

  var getUserRole = function() {
    return localStorage.getItem('role')
  }

  var setAccessToken = function(token) {
    localStorage.setItem('token', token)
  }

  var getAccessToken = function() {
    return localStorage.getItem('token')
  }

  return {
    getUsername: getUsername,
    setUsername: setUsername,
    getUserId: getUserId,
    setUserId: setUserId,
    isLogin: isLogin,
    setIsLogin: setIsLogin,
    getUserRole: getUserRole,
    setUserRole: setUserRole,
    getAccessToken: getAccessToken,
    setAccessToken: setAccessToken
  }

})();

class Profile {
  getUsername() {
    return localStorage.getItem('username')   // Or pull this from cookie/localStorage
  };
  setUsername = function(username) {
    // Also set this in cookie/localStorage
    localStorage.setItem('username', username)
  };

  getUserId() {
    return localStorage.getItem('id')
  }

  setUserId(id) {
    localStorage.setItem('id', id)
  }

  isLogin() {
    return localStorage.getItem('islogin')
  }

  setIsLogin(bool) {
    localStorage.setItem('islogin', bool)
  }

  setUserRole(role) {
    localStorage.setItem('role', role)
  }

  getUserRole() {
    return localStorage.getItem('role')
  }

  setAccessToken(token) {
    localStorage.setItem('token', token)
  }

  getAccessToken() {
    return localStorage.getItem('token')
  }
}

export default new Profile();