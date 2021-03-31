import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Card, CardContent, CardHeader, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    width: "100vw",
    height: "100vh",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e6e6e6",
  },
  cardRoot: {
    padding: theme.spacing(3),
  },
  button: {
    minWidth: "200px",
    padding: theme.spacing(2),
    margin: theme.spacing(0, 1),
    color: "#FFF",
  },
}));

const HomePage = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Card classes={{ root: classes.cardRoot }}>
        <CardContent>
          <Typography variant="h6">Select Portal:</Typography>
        </CardContent>
        <CardContent>
          <Button classes={{ root: classes.button }} variant="contained" color="primary" href="emrx/login">
            EMRX
          </Button>
          <Button classes={{ root: classes.button }} variant="contained" color="secondary" href="medichain/login">
            Medichain
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;
