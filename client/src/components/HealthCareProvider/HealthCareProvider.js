import React, { useState, useEffect } from "react";
import axios from "axios";
import {} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import Blob from "../Blob";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    width: "100vw",
  },
  paper: {
    margin: theme.spacing(12, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

export default function HealthCareProvider() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Blob />
    </div>
  );
}
