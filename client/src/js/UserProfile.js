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

  return {
    getUsername: getUsername,
    setUsername: setUsername,
    getUserId: getUserId,
    setUserId: setUserId,
    isLogin: isLogin,
    setIsLogin: setIsLogin,
    getUserRole: getUserRole,
    setUserRole: setUserRole
  }

})();

export default UserProfile;