import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import EMRXLogin from "./components/EMRXLogin";
import MedichainLogin from "./components/MedichainLogin";
import Test from "./components/Test";
import PrivateRoute from "./components/PrivateRoute";
import HomePage from "./components/HomePage";
import HealthCareProvider from "./components/HealthCareProvider/HealthCareProvider";

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/medichain/login" component={MedichainLogin} />
        <Route exact path="/emrx/login" component={EMRXLogin} />
        <Route path="/test" component={Test} />
        <PrivateRoute path="/emrx/home" component={HealthCareProvider} />
        <Route component={HomePage} />
      </Switch>
    );
  }
}

export default App;
