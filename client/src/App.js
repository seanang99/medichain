import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import Login from "./components/Login";
import Test from "./components/Test";
import PrivateRoute from "./components/PrivateRoute";

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Login} />
        <PrivateRoute path="/test" component={Test} />
      </Switch>
    );
  }
}

export default App;
