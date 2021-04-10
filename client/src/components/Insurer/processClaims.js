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
  InputAdornment,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { getUser, medichainClient } from "../../Auth";
import Snackbar from "../../contexts/SnackbarComponent";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2vw",
    display: "float",
  },
  header: {
    color: theme.palette.primary.dark,
    margin: theme.spacing(2,0),
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

export default function ProcessClaims({ claimId: claimId }) {
  const classes = useStyles();

  //Get context value from snack bar context
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState([""]);

  const [remarks, setRemarks] = useState("");
  const [medicalAmount, setMedicalAmount] = useState(0);
  const [claimAmount, setClaimAmount] = useState(0);
  const [policyNumber, setPolicyNumber] = useState("");

  const claimInformation = {
    claimId: claimId,
    onChainAccountAddress: getUser().onChainAccountAddress,
    claimAmount: claimAmount,
    remarks: remarks,
    policyNumber: policyNumber,
  };

  const createClaimNotes = async () => {
    await medichainClient
      .post("claim/processClaim", claimInformation)
      .then((res) => {
        console.log(res.data);
        setMessage("Claim Rejected!");
        setSeverity("success");
        setOpenSnackBar(true);
        setRemarks("");
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
      <Typography className={classes.header} variant="h6">{"Insurer Notes"}</Typography>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <TextField
            variant="filled"
            id="claimId"
            name="claimId"
            label="Claim Id"
            value={claimId}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            variant="outlined"
            id="policyNumber"
            name="policyNumber"
            label="Policy Number"
            value={policyNumber}
            fullWidth
            onChange={(e) => setPolicyNumber(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            variant="outlined"
            id="medicalAmount"
            name="medicalAmount"
            label="Proposed Amount"
            value={medicalAmount}
            fullWidth
            InputProps={{
              readOnly: true,
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            variant="outlined"
            id="claimAmount"
            name="claimAmount"
            label="Claim Amount"
            type="number"
            value={claimAmount}
            fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
              inputProps: { min: 0.0 },
            }}
            onChange={(e) => setClaimAmount(e.target.value)}
          />
        </Grid>
      </Grid>
      <TextField
        variant="outlined"
        margin="normal"
        id="remarks"
        name="remarks"
        label="Remarks"
        placeholder="Please add remarks and assessment notes of the claim"
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
          onClick={() => createClaimNotes()}
        >
          Add Remarks
        </Button>
      </Box>
    </div>
  );
}
