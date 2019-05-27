import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route path="/" exact component={Dashboard} />
        <Route path="/login" exact component={Login} />
      </Switch>
    );
  }
}

export default Routes;
