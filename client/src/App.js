import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import EMRXLogin from "./components/EMRXLogin";
import MedichainLogin from "./components/MedichainLogin";
import Test from "./components/Test";
import PrivateRoute from "./components/PrivateRoute";
import HomePage from "./components/HomePage";
import HealthCareProvider from "./components/HealthCareProvider/HealthCareProvider";
import PolicyHolder from "./components/PolicyHolder/PolicyHolder";
import Insurer from "./components/Insurer/Insurer";

class App extends Component {
  render() {
    return (
        <Switch>
          <Route exact path="/medichain/login" component={MedichainLogin} />
          <Route exact path="/emrx/login" component={EMRXLogin} />
          <Route path="/test" component={Test} />
          <PrivateRoute path="/emrx/home" component={HealthCareProvider} />
          <PrivateRoute
            path="/medichain/policyHolder"
            component={PolicyHolder}
          />
          <PrivateRoute path="/medichain/insurer" component={Insurer} />
          <Route component={HomePage} />
        </Switch>
    );
  }
}

export default App;
