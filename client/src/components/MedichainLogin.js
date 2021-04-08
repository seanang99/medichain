import React, { useState } from "react";
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
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { medichainClient, setUser } from "../Auth";
import blob1 from "../image-assets/bg-blob.svg";
import Snackbar from "../contexts/SnackbarComponent";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: `url(${blob1})`,
    backgroundRepeat: "no-repeat",
    backgroundColor: theme.palette.type === "light" ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: "200vh 200vh",
    backgroundPosition: "left",
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
    borderRadius: "20px",
    color: "#FFF",
  },
  pageTitle: {
    letterSpacing: "8px",
    color: theme.palette.secondary.main,
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

export default function Login() {
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
  const [userType, setUserType] = useState("policyholder");

  const login = (e) => {
    e.preventDefault();
    medichainClient
      .post("/account/login", account)
      .then((res) => {
        setUser(res.data);
        if (userType === "policyholder") {
          if (res.data.identificationNum) {
            history.push("/medichain/policyholder");
          } else {
            setMessage("Wrong user type");
            setSeverity("Error");
            setOpenSnackBar(true);
          }
        } else if (userType === "insurer") {
          if (!res.data.identificationNum) {
            history.push("/medichain/insurer");
          } else {
            setMessage("Wrong user type");
            setSeverity("Error");
            setOpenSnackBar(true);
          }
        }
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
      <Snackbar open={openSnackBar} setOpenSnackBar={setOpenSnackBar} severity={severity} message={message} />
      <CssBaseline />
      <Grid item xs={12} sm={9} md={6} className={classes.flexGrid}>
        <div className={classes.paper}>
          <Typography variant="h2" className={classes.pageTitle}>
            LOGIN
          </Typography>
          <Typography component="h2" variant="subtitle1">
            MEDICHAIN
          </Typography>
          <br />
          <form className={classes.form} onSubmit={(e) => login(e)}>
            <FormControl component="fieldset">
              <FormLabel component="legend" color="secondary">
                Are you a:
              </FormLabel>
              <RadioGroup
                row
                aria-label="user-type"
                name="user-type"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
              >
                <FormControlLabel value="policyholder" control={<Radio />} label="Policy Holder" />
                <FormControlLabel value="insurer" control={<Radio />} label="Insurer" />
              </RadioGroup>
            </FormControl>
            <TextField
              variant="outlined"
              color="secondary"
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
              color="secondary"
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
            <FormControlLabel control={<Checkbox value="remember" color="secondary" />} label="Remember me" />
            <Button
              variant="contained"
              type="submit"
              fullWidth
              color="secondary"
              className={classes.submit}
              onClick={(e) => login(e)}
            >
              Sign In
            </Button>
          </form>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2" color="secondary">
                Forgot username or password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2" color="secondary">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
          <Box mt={5}>
            <Copyright />
          </Box>
        </div>
      </Grid>
      <Grid item xs={false} sm={3} md={6} className={classes.image} />
    </Grid>
  );
}
