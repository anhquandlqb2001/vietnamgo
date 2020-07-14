import React from 'react';
import { BrowserRouter as Router, Route, Switch, BrowserRouter } from "react-router-dom"
import Navbar from './component/navbar.component'
import Home from './component/homepage.component'
import Topics from './component/topic/topics.component'
import NewTopic from './component/topic/newtopic.component'
import Topic from './component/topic/topic.component'
import Search from './component/topic/search.component'
import EditTopic from './component/topic/edittopic.component'
import NewLocation from './component/location/newlocation.component'
import Login from './component/login.component'
import Signup from './component/signup.component'
import { ProtectedRoute, ProtectedRouteAuth, RouteAdminPermission } from './protected.route'
import Queue from './component/queue.component'
import UserControl from './component/usercontrol.component';

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
          <RouteAdminPermission exact path="/api/user" component={UserControl} />
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
