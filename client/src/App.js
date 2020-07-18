import React from 'react';
import { BrowserRouter as Router, Route, Switch, BrowserRouter } from "react-router-dom"
import Navbar from './component/navbar/navbar'
import Home from './component/homepage/homepage'
import Topics from './component/topic/topics'
import NewTopic from './component/topic/newtopic'
import Topic from './component/topic/topic'
import Search from './component/topic/searchResult'
import EditTopic from './component/topic/edittopic'
import NewLocation from './component/location/newlocation'
import Login from './component/auth/login'
import Signup from './component/auth/signup'
import { ProtectedRoute, ProtectedRouteAuth, RouteAdminPermission } from './js/protected.route'
import Queue from './component/topic/queue'
import UserControl from './component/admin/usercontrol';

function App() {
  return (
    <BrowserRouter>
    <div>
      <Router>
        <Navbar />
        <Switch>
          <Route exact path='/topics/search' component={Search} />
          <ProtectedRoute exact path="/topics/queue" component={Queue} />
          <ProtectedRoute exact path='/topics/edit/:id' component={EditTopic} />
          <ProtectedRoute exact path="/topics/add" component={NewTopic} />
          <Route exact path="/topics/:id" component={Topic} />
          <Route exact path="/topics">
            <Topics />
          </Route>
          <RouteAdminPermission exact path="/user" component={UserControl} />
          <RouteAdminPermission exact path="/location/add" component={NewLocation} />
          <ProtectedRouteAuth exact path="/login" component={Login} />
          <ProtectedRouteAuth exact path="/signup" component={Signup} />
          <Route exact path="/" component={Home} />
          <Route path="*" component={() => "Không tìm thấy trang"} />
        </Switch>
      </Router>
    </div>
    </BrowserRouter>
  );
}

export default App;
