import React from "react";
// import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";

import blob1 from "../assets/blob1.svg";
import { Button, TextField, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100vh",
    width: "100%",
  },
  right: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "calc(0.4 * 100vw)",
    [theme.breakpoints.down("sm")]: {
      marginLeft: "auto",
    },
  },
  blob: {
    position: "fixed",
    minHeight: "1500px",
    height: "200%",
    right: "calc(0.4 * 100vw)",
    top: -350,
    transform: "rotate(90deg)",
  },
  pageTitle: {
    letterSpacing: "8px",
    color: theme.palette.primary.dark,
  },
  textField: {
    width: "30%",
    minWidth: "350px",
  },
  button: {
    margin: theme.spacing(2),
    width: "30%",
    minWidth: "350px",
    borderRadius: "20px",
  },
  anchor: {
    color: theme.palette.primary.main,
  },
}));

const LoginPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <img className={classes.blob} src={blob1} alt="bloop" />
      <div className={classes.right}>
        <Typography variant="h2" className={classes.pageTitle}>
          LOGIN
        </Typography>
        <Typography style={{ fontWeight: 500, marginBottom: 16 }} variant="body1">
          CENTRAL HEALTHCARE SYSTEM (<i>EMRX</i>)
        </Typography>
        <TextField className={classes.textField} label="Username" variant="outlined" margin="dense" />
        <TextField className={classes.textField} label="Password" type="password" variant="outlined" margin="dense" />
        <Button className={classes.button} variant="contained" color="primary">
          Sign In
        </Button>
        <a className={classes.anchor} href="#">
          Forgot Password?
        </a>
      </div>
    </div>
  );
};

export default LoginPage;
