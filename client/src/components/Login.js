import React from "react";
import axios from "axios";
import { CssBaseline, Grid, Link, Box, Typography, Paper, Button, Checkbox, FormControlLabel, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import blob from "../image-assets/blob.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: `url(${blob})`,
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "200vh 200vh",
    backgroundPosition: "right",

  },
  paper: {
    margin: theme.spacing(12,4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    background: "#0E4776",
    borderRadius: '20px',
  },
}));

function Copyright() {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="#">
          MediChain
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

export default function Login() {
  const classes = useStyles();

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} square>
        <div className={classes.paper}>
          <Typography component="h1" variant="h3">
            Login
          </Typography>
          <Typography component="h2" variant="subtitle1">
            CENTRAL HEALTHCARE SYSTEM (EMRX)
          </Typography>
          <form className={classes.form} noValidate>
            <TextField variant="outlined" margin="normal" required fullWidth id="username" label="Username" name="username" autocomplete="email" autoFocus />
            <TextField variant="outlined" margin="normal" required fullWidth id="password" label="Password" type="password" name="password" autocomplete="current-password" />
            <FormControlLabel control={<Checkbox value="remember" color="primary" />}  label="Remember me" />
            <Button variant="contained" type="submit" fullWidth color="primary" className={classes.submit}>Sign In</Button>
            <Grid container>
                <Grid item xs>
                    <Link href="#" variant='body2'>Forgot username or password?</Link>
                </Grid>
                <Grid item>
                    <Link href="#" variant="body2">{"Don't have an account? Sign Up"}</Link>
                </Grid>
            </Grid>
            <Box mt={5}>
                <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
