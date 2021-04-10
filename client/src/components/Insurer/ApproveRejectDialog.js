import React, { useState } from "react";
import PropTypes from "prop-types";
import { Typography, Box, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Snackbar from "../../contexts/SnackbarComponent";
import { medichainClient } from "../../Auth";

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
    justifyContent: "flex-end",
    marginTop: theme.spacing(2),
  },
  button_margin: {
    marginRight: theme.spacing(2),
  },
}));

export default function ApproveRejectDialog({
  policyHolderId: policyHolderId,
}) {
  const classes = useStyles();

  //Get context value from snack bar context
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState([""]);

  const approveClaim = async () => {
    await medichainClient
      .post("url")
      .then((res) => {
        console.log(res.data);
        setMessage("Claim Approved!");
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

  const rejectClaim = async () => {
    await medichainClient
      .post("url")
      .then((res) => {
        console.log(res.data);
        setMessage("Claim Rejected!");
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

  return (
    <div className={classes.root}>
      <Snackbar open={openSnackBar} severity={severity} message={message} />
      <Typography className={classes.title} variant="h6">
        Are you sure?
      </Typography>
      <Typography variant="body1">
        You are about to endorse the Claims for Policy Holder {policyHolderId}.
        This action cannot be undone and will be logged in the blockchain.
      </Typography>
      <Box className={classes.actionPanel}>
        <Button
          className={classes.button_margin}
          variant="contained"
          color="primary"
          autoFocus
          onClick={() => approveClaim()}
        >
          Approve
        </Button>
        <Button variant="outlined" onClick={() => rejectClaim()}>
          Reject
        </Button>
      </Box>
    </div>
  );
};

ApproveRejectDialog.propTypes = {
  policyHolderId: PropTypes.string.isRequired,
};
