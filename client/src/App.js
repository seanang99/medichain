import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Login from "./components/Login";
import LoginPage from "./components/LoginPage"
import Test from "./components/Test";
import PrivateRoute from "./components/MediChainRoute";

class App extends Component {
  render() {
    return (
      // From Tze Ming
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/test" component={Test} />
      </Switch>

      // <BrowserRouter>
      //   <Switch>
      //     <Route path='/' component={Login} />

      //     {/* Add the rest of the routing here */}

      //   </Switch>
      // </BrowserRouter>
      // <PrivateRoute />
      // <div className="App">
      //   <h1>Good to Go!</h1>
      //   <p>Your Truffle Box is installed and ready.</p>
      //   <h2>Smart Contract Example</h2>
      //   <p>
      //     If your contracts compiled and migrated successfully, below will show
      //     a stored value of 5 (by default).
      //   </p>
      //   <p>
      //     Try changing the value stored on <strong>line 40</strong> of App.js.
      //   </p>
      //   <div>The stored value is: {this.state.storageValue}</div>
      // </div>
    );
  }
}

export default App;
