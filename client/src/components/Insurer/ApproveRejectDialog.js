import React, { useState } from "react";
import PropTypes from "prop-types";
import { Typography, Box, Button, TextField } from "@material-ui/core";
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
    justifyContent: "flex-end",
    marginTop: theme.spacing(2),
  },
  button_margin: {
    marginRight: theme.spacing(2),
  },
}));

export default function ApproveRejectDialog({ claimId, policyHolderOnChainAddress, setOpenEndorseClaimsDialog }) {
  const classes = useStyles();

  //Get context value from snack bar context
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState([""]);

  const [remarks, setRemarks] = useState("");

  const claim = {
    claimId: claimId,
    onChainAccountAddress: getUser().onChainAccountAddress,
    remarks: remarks,
  };

  const approveClaim = async () => {
    await medichainClient
      .post("claim/approveClaim", claim)
      .then((res) => {
        console.log(res.data);
        setMessage("Claim Approved!");
        setSeverity("success");
        setOpenSnackBar(true);
        setRemarks("");
        setOpenEndorseClaimsDialog(false);
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
      .post("claim/rejectClaim", claim)
      .then((res) => {
        console.log(res.data);
        setMessage("Claim Rejected!");
        setSeverity("success");
        setOpenSnackBar(true);
        setRemarks("");
        setOpenEndorseClaimsDialog(false);
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
      <Snackbar open={openSnackBar} severity={severity} message={message} setOpenSnackBar={setOpenSnackBar} />
      <Typography className={classes.title} variant="h6">
        Are you sure?
      </Typography>
      <Typography variant="body1">
        You are about to endorse claim {claimId} for Policy Holder {policyHolderOnChainAddress}. This action cannot be
        undone and will be logged in the blockchain.
      </Typography>
      <TextField
        variant="outlined"
        margin="normal"
        id="remarks"
        name="remarks"
        label="Remarks"
        placeholder="Please add remarks stating the reason for approval or rejection"
        value={remarks}
        multiline
        rows={4}
        fullWidth
        onChange={(e) => setRemarks(e.target.value)}
      />
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
}

ApproveRejectDialog.propTypes = {
  policyHolderOnChainAddress: PropTypes.string.isRequired,
  claimId: PropTypes.string.isRequired,
};
