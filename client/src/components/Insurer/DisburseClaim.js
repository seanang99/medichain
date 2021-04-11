import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import clsx from "clsx";
import PropTypes from "prop-types";
import {
  Typography,
  Box,
  Button,
  CircularProgress,
  Fab,
} from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import CheckIcon from "@material-ui/icons/Check";
import MoneyIcon from "@material-ui/icons/AttachMoney";
import { makeStyles } from "@material-ui/core/styles";
import Snackbar from "../../contexts/SnackbarComponent";
import { getUser, medichainClient } from "../../Auth";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2vw",
    display: "float",
  },
  title: {
    margin: theme.spacing(2, 0),
  },
  actionPanel: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: theme.spacing(2),
  },
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
  buttonSuccess: {
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
    },
  },
  fabProgress: {
    color: green[500],
    position: "absolute",
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

export default function DisburseClaim({
  claimId: claimId,
  claimAmount: claimAmount,
  policyHolderOnChainAddress: policyHolderOnChainAddress,
}) {
  const classes = useStyles();

  //Get context value from snack bar context
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState([""]);

  const claim = {
    claimId: claimId,
    onChainAccountAddress: getUser().onChainAccountAddress,
  };

  const disburseClaim = async () => {
    await medichainClient
      .post("url", claim)
      .then((res) => {
        console.log(res.data);
        setMessage("Claim Disbursed!");
        setSeverity("success");
        setOpenSnackBar(true);
      })
      .catch((error) => {
        let newErrorMessage = [...errorMessages, error.response.data];
        setMessage(newErrorMessage);
        setSeverity("error");
        setOpenSnackBar(true);
      });
  };

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const timer = React.useRef();

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  const history = useHistory();

  const handleButtonClick = () => {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      timer.current = window.setTimeout(() => {
        setSuccess(true);
        setLoading(false);
        window.location.reload();
        // disburseClaim();
      }, 2000);
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  return (
    <div className={classes.root}>
      <Snackbar
        open={openSnackBar}
        severity={severity}
        message={message}
        setOpenSnackBar={setOpenSnackBar}
      />
      <Typography variant="body1">
        {`We are disbursing $ ${claimAmount} of Claim ${claimId} to Policy Holder 
        ${policyHolderOnChainAddress}. This action cannot be undone and will be logged in the
        blockchain.`}
      </Typography>
      <Box className={classes.actionPanel}>
        <div className={classes.wrapper}>
          <Fab
            aria-label="save"
            color="primary"
            className={buttonClassname}
            onClick={handleButtonClick}
          >
            {success ? <CheckIcon /> : <MoneyIcon />}
          </Fab>
          {loading && (
            <CircularProgress size={68} className={classes.fabProgress} />
          )}
        </div>
        <div className={classes.wrapper}>
          <Button
            variant="contained"
            color="primary"
            autoFocus
            className={buttonClassname}
            disabled={loading}
            onClick={handleButtonClick}
          >
            Disburse Claim
          </Button>
          {loading && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </div>
      </Box>
    </div>
  );
}

DisburseClaim.propTypes = {
  policyHolderOnChainAddress: PropTypes.string.isRequired,
  claimId: PropTypes.string.isRequired,
};
