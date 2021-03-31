import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ render, path, ...rest }) => {
  return localStorage.getItem("user") ? <Route path={path} render={render} {...rest} /> : <Redirect to="/" />;
};

export default PrivateRoute;
