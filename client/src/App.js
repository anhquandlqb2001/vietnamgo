import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  BrowserRouter,
} from "react-router-dom";
import Navbar from "./component/navbar/navbar";
import Home from "./component/homepage/homepage";
import Topics from "./component/topic/topics";
import NewTopic from "./component/topic/newtopic";
import Topic from "./component/topic/topic";
import Search from "./component/topic/searchResult";
import EditTopic from "./component/topic/edittopic";
import NewLocation from "./component/location/newlocation";
import Login from "./component/auth/login";
import Signup from "./component/auth/signup";
import {
  ProtectedRoute,
  ProtectedRouteAuth,
  RouteAdminPermission,
} from "./js/protected.route";
import Queue from "./component/admin/queue";
import UserControl from "./component/admin/usercontrol";
import Control from "./component/admin/control";
import User from "./component/user/control";
import ChangeBackround from "./component/admin/changebackground";
import TopicPublished from "./component/user/topicpublished";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Router>
          <Navbar />
          <Switch>
            <Route exact path="/topics/search" component={Search} />
            <ProtectedRoute
              exact
              path="/topics/edit/:id"
              component={EditTopic}
            />
            <Route exact path="/topics/:id" component={Topic} />
            <Route exact path="/topics">
              <Topics />
            </Route>
            <ProtectedRoute path="/user">
              <div className="d-flex mx-1 mx-md-4">
                <ProtectedRoute component={User} />
                <div
                  className="mt-5 m-md-auto"
                  style={{ flex: 1, maxWidth: "1000px" }}
                >
                  <ProtectedRoute
                    exact
                    path="/user/topics/add"
                    component={NewTopic}
                  />
                  <ProtectedRoute
                    exact
                    path="/user/topics/queue"
                    component={Queue}
                  />
                  <ProtectedRoute
                    exact
                    path="/user/topics/published"
                    component={TopicPublished}
                  />
                </div>
              </div>
            </ProtectedRoute>
            <RouteAdminPermission path="/admin">
              <div className="d-flex mx-1 mx-md-4">
                <RouteAdminPermission component={Control} />
                <div
                  className="mt-5 m-md-auto"
                  style={{ flex: 1, maxWidth: "1000px" }}
                >
                  <RouteAdminPermission
                    exact
                    path="/admin/topics/add"
                    component={NewTopic}
                  />
                  <RouteAdminPermission
                    exact
                    path="/admin/topics/queue"
                    component={Queue}
                  />
                  <RouteAdminPermission
                    exact
                    path="/admin/location/add"
                    component={NewLocation}
                  />
                  <RouteAdminPermission
                    exact
                    path="/admin/user"
                    component={UserControl}
                  />
                  <RouteAdminPermission
                    exact
                    path="/admin/background"
                    component={ChangeBackround}
                  />
                </div>
              </div>
            </RouteAdminPermission>
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
