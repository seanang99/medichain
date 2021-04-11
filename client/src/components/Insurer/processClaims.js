import React, { useState } from "react";
import {
  Button,
  Grid,
  TextField,
  Typography,
  Box,
  MenuItem,
  Select,
  InputAdornment,
  InputLabel,
  FormControl,
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
    margin: theme.spacing(2, 0),
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

export default function ProcessClaims({
  claimId: claimId,
  medicalAmount: medicalAmount,
}) {
  const classes = useStyles();

  //Get context value from snack bar context
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState([""]);

  const [remarks, setRemarks] = useState("");
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
    console.log("id ", getUser().onChainAccountAddress);
    await medichainClient
      .post("claim/processClaim", claimInformation)
      .then((res) => {
        console.log(res.data);
        setMessage("Claim Processed!");
        setSeverity("success");
        setOpenSnackBar(true);
        setClaimAmount("");
        setPolicyNumber("");
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
      <Snackbar
        open={openSnackBar}
        severity={severity}
        message={message}
        setOpenSnackBar={setOpenSnackBar}
      />
      <Typography className={classes.header} variant="h6">
        {"Insurer Notes"}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={3}>
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
        <Grid item xs={9}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="select-policy-label">Policy</InputLabel>
            <Select
              variant="outlined"
              labelId="select-policy-label"
              id="select-policy"
              label="Policy"
              autoWidth
              value={policyNumber}
              onChange={(e) => setPolicyNumber(e.target.value)}
            >
              <MenuItem value={"HealthShield Gold Max | PN34512"}>
                HealthShield Gold Max | PN34512
              </MenuItem>
              <MenuItem value={"MUM2BABY Choices | PN12690"}>
                MUM2BABY Choices | PN12690
              </MenuItem>
              <MenuItem value={"HOSPITAL INCOME | PN23499"}>
                HOSPITAL INCOME | PN23499
              </MenuItem>
            </Select>
          </FormControl>
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
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
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
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
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
