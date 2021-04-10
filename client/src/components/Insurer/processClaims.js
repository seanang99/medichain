import React, { useState } from "react";
import {
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  Box,
  MenuItem,
  Select,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { medichainClient } from "../../Auth";
import Snackbar from "../../contexts/SnackbarComponent";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2vw", 
    display: "float",
  },
  pageTitle: {
    color: theme.palette.primary.dark,
  },
  actionPanel: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: theme.spacing(2),
  },
  marginRight: {
    marginRight: theme.spacing(1),
  },
}));

export default function ProcessClaims() {
  const classes = useStyles();

  //Get context value from snack bar context
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState([""]);

  const [claimId, setClaimId] = useState("");
  const [remarks, setRemarks] = useState("");
  const [claimStatus, setClaimStatus] = useState("");

  const claimInformation = {
    claimId: claimId,
    insurerOnChainId: "",
    remarks: remarks,
  };

  const createClaimNotes = async () => {
    await medichainClient
      .post("url" + claimId, claimInformation)
      .then((res) => {
        console.log(res.data);
        setMessage("Claim Rejected!");
        setSeverity("success");
        setOpenSnackBar(true);
        setRemarks("");
        setClaimStatus("");
      })
      .catch((error) => {
        let newErrorMessage = [...errorMessages, error.response.data];
        setMessage(newErrorMessage);
        setSeverity("error");
        setOpenSnackBar(true);
      });
  };

  const getClaimInformation = async () => {
    await medichainClient
      .get("url")
      .then((res) => {
        setClaimId(res.data.claimId);
        setClaimStatus(res.data.claimStatus);
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
      <Typography variant="h6">{"Insurer Notes"}</Typography>
      <TextField
        variant="outlined"
        id="claimId"
        name="claimId"
        label="Claim Id"
        value={claimId}
        fullWidth
        InputProps={{
          readOnly: true,
        }}
      />
      <TextField
        variant="outlined"
        margin="normal"
        id="remarks"
        name="remarks"
        label="Remarks"
        placeholder="Add Remarks"
        value={remarks}
        multiline
        rows={4}
        fullWidth
        onChange={(e) => setRemarks(e.target.value)}
      />

      <Box className={classes.actionPanel}>
        <Button
          variant="contained"
          color="primary"
          autoFocus
        >
          Add Remarks
        </Button>
      </Box>
    </div>
  );
}
