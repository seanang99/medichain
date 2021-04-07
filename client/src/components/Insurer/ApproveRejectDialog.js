import React, { useState } from "react";
import {
  Box, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Snackbar from "../../contexts/SnackbarComponent";
import { medichainClient } from "../../Auth";
import { CloseIcon } from "@material-ui/icons/Close";
import { Typography } from "@material-ui/core";
import { Paper } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    padding: "2vw",
    display: "float",
  },
  paper: {
    padding: theme.spacing(2),
  },
  title:{
    margin: theme.spacing(2,0),
  },
  actionPanel:{
      display:"flex",
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
      <Paper className={classes.paper}>
        <Typography className={classes.title} variant="h6">Are you sure?</Typography>
        <Typography variant="body1">
          You are about to endorse the Claims for Policy Holder {policyHolderId}
          . This action cannot be undone and will be logged in the blockchain.
        </Typography>
        <Box className={classes.actionPanel}>
        <Button className={classes.button_margin} variant="contained" color="primary">
          Disagree
        </Button>
        <Button variant="contained" color="primary" autoFocus>
          Approve
        </Button>
        </Box>
      </Paper>
    </div>
  );
}
