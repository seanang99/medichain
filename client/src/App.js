import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import Login from "./components/Login";
// import PrivateRoute from "./components/MediChainRoute";
import Test from "./components/Test";

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/test" component={Test} />
      </Switch>
      // <PrivateRoute />
    );
  }
}

export default App;
