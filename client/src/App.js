import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import Test from "./components/Test";

class App extends Component {
  render() {
    return (
      <Switch>
        <Route path="/test" component={Test} />
      </Switch>
    );
  }
}

export default App;
