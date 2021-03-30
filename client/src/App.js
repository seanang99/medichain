import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import Login from "./components/LoginPage";
import Test from "./components/Test";

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/test" component={Test} />
      </Switch>
    );
  }
}

export default App;
