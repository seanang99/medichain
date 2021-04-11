import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import {
  CssBaseline,
  Grid,
  Link,
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Snackbar from "../contexts/SnackbarComponent";

import { emrxClient, setUser } from "../Auth";
import blob1 from "../image-assets/blob1.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: `url(${blob1})`,
    backgroundRepeat: "no-repeat",
    backgroundColor: theme.palette.type === "light" ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: "200vh 200vh",
    backgroundPosition: "right",
  },
  paper: {
    margin: theme.spacing(12, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    background: "#0E4776",
    borderRadius: "20px",
  },
  pageTitle: {
    letterSpacing: "8px",
    color: theme.palette.primary.dark,
  },
  flexGrid: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="#">
        MediChain
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function EMRXLogin() {
  const classes = useStyles();
  //Get context value from snack bar context
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");

  const [errorMessages, setErrorMessages] = useState([""]);

  const history = useHistory();

  const [account, setAccount] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    if (localStorage.getItem("user")) {
      history.push("/emrx/home");
    }
  }, []);

  const login = (e) => {
    e.preventDefault();
    // console.log(account);

    emrxClient
      .post("/medicalInstitutionAccount/login", account)
      .then((res) => {
        setUser(res.data);
        history.push("/emrx/home");
      })
      .catch((error) => {
        let newErrorMessage = [...errorMessages, error.response.data];
        console.log("Error: ", newErrorMessage);
        setMessage("Username or Password is incorrect");
        setSeverity("error");
        setOpenSnackBar(true);
      });
  };

  return (
    <Grid container component="main" className={classes.root}>
      <Snackbar open={openSnackBar} severity={severity} message={message} setOpenSnackBar={setOpenSnackBar} />
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} className={classes.flexGrid}>
        <div className={classes.paper}>
          <Typography variant="h2" className={classes.pageTitle}>
            LOGIN
          </Typography>
          <br />
          <Typography component="h2" variant="subtitle1">
            CENTRAL HEALTHCARE SYSTEM (EMRX)
          </Typography>
          <form className={classes.form} onSubmit={(e) => login(e)}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoFocus
              required
              onChange={(e) =>
                setAccount({
                  ...account,
                  username: e.target.value,
                })
              }
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="password"
              label="Password"
              type="password"
              name="password"
              required
              onChange={(e) =>
                setAccount({
                  ...account,
                  password: e.target.value,
                })
              }
            />
            <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
            <Button
              variant="contained"
              type="submit"
              fullWidth
              color="primary"
              className={classes.submit}
              onClick={(e) => login(e)}
            >
              Sign In
            </Button>
          </form>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot username or password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>

          <Grid container style={{ justifyContent: "flex-end", marginTop: 32 }}>
            <Grid item>
              <Link style={{ textDecoration: "underline" }} href="/medichain/login" variant="body2">
                Wrong portal? Go to Medichain now &gt;
              </Link>
            </Grid>
          </Grid>
          <Box mt={5}>
            <Copyright />
          </Box>
        </div>
      </Grid>
    </Grid>
  );
}
