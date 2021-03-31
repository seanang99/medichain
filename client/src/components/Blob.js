import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import blob from "../image-assets/bg-blob.svg";
import blob2 from "../image-assets/blob.svg";

const useStyles = makeStyles((theme) => ({
  btmBlob: {
    position: "fixed",
    height: 800,
    bottom: -400,
    left: -300,
    zIndex: -999,
  },
  topBlob: {
    position: "fixed",
    height: 800,
    top: -450,
    right: -250,
    zIndex: -999,
  },
  secondaryTopBlob: {
    position: "fixed",
    height: 800,
    top: 200,
    right: 50,
    zIndex: -999,
    height: "100px",
    transform: "rotate(180deg)",
  },
}));

const Blob = () => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <img className={classes.btmBlob} src={blob} alt="bloop" />
      <img className={classes.topBlob} src={blob2} alt="bloop" />
      <img className={classes.secondaryTopBlob} src={blob2} alt="bloop" />
    </React.Fragment>
  );
};

export default Blob;
