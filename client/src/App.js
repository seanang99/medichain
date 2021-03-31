import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import Login from "./components/Login";
import Test from "./components/Test";
import PrivateRoute from "./components/PrivateRoute";
import HomePage from "./components/HomePage";
import HealthCareProvider from "./components/HealthCareProvider/HealthCareProvider";

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/medichain/login" component={Login} />
        <Route exact path="/emrx/login" component={Login} />
        <Route path="/test" component={Test} />
        <PrivateRoute path="/emrx/home" component={HealthCareProvider} />
        <Route component={HomePage} />
      </Switch>
    );
  }
}

export default App;
