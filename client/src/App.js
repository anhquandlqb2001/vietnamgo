import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  BrowserRouter,
} from "react-router-dom";
import Navbar from "./page/navbar/navbar";
import Home from "./page/homepage/homepage";
import Topics from "./page/topic/topics";
import NewTopic from "./page/topic/newtopic";
import Topic from "./page/topic/topic";
import Search from "./page/topic/searchResult";
import EditTopic from "./page/topic/edittopic";
import NewLocation from "./page/location/newlocation";
import Login from "./page/auth/login";
import Signup from "./page/auth/signup";
import {
  ProtectedRoute,
  ProtectedRouteAuth,
  RouteAdminPermission,
} from "./js/protected.route";
import Queue from "./page/admin/queue";
import UserControl from "./page/admin/usercontrol";
import Control from "./page/admin/control";
import User from "./page/user/control";
import ChangeBackround from "./page/admin/changebackground";
import TopicPublished from "./page/user/topicpublished";

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
