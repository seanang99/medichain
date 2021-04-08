import React, { useState, useEffect } from "react";
import { Grid, Typography, TextField, InputAdornment, Button, Card, CardContent, IconButton } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import { emrxClient, medichainClient } from "../../Auth";
import CancelIcon from "@material-ui/icons/Cancel";
import Snackbar from "../../contexts/SnackbarComponent";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2vw",
    display: "float",
  },
  paper: {
    padding: theme.spacing(2),
    alignItems: "center",
  },
  add: {
    textTransform: "none",
    margin: theme.spacing(2, 0),
    minWidth: "10vw",
  },
  submit: {
    textTransform: "none",
    margin: theme.spacing(2, 0),
    minWidth: "10vw",
  },
  cardRoot: {
    margin: theme.spacing(1, 0),
    border: "1px solid #C4C4C4",
    boxShadow: "none",
  },
  cardContent: {
    display: "flex",
    padding: theme.spacing(2),
    "&:last-child": {
      padding: theme.spacing(2),
    },
  },
  flexItem: {
    flexGrow: 1,
  },
  column: {
    display: "flex",
    flexDirection: "column",
  },
}));

export default function SubmitClaim() {
  const classes = useStyles();

  //Get context value from snack bar context
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState([""]);

  const [patientIdentification, setPatientIdentification] = useState("S1234567A");
  const [onChainAccountAddress, setOnChainAccountAddress] = useState("0xD76236d0bB257111b4AFD1A541b097073C5bC5BB");
  const [totalAmt, setTotalAmt] = useState(0);
  const [medicalRecordsId, setMedicalRecordsId] = useState([]);
  const [selectedMedicalRecords, setSelectedMedicalRecords] = useState([]);

  const [options, setOptions] = useState([]);

  const [allMedicalRecords, setAllMedicalRecords] = useState([]);
  const getMedicalRecords = async () => {
    emrxClient
      .get("medicalRecord/readMedicalRecordByPatientIdNum/S1234567A")
      .then((res) => {
        setAllMedicalRecords(res.data);
        setOptions(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addMedicalRecord = (medicalRecord) => {
    if (medicalRecord != null) {
      let currRecord = selectedMedicalRecords;
      let currRecord_id = medicalRecordsId;
      currRecord.push(medicalRecord);
      currRecord_id.push(medicalRecord._id);
      setSelectedMedicalRecords(currRecord);
      setMedicalRecordsId(currRecord_id);
      recalibrateOptions(currRecord);
      calculateTotalAmount(currRecord);
    }
  };

  const removeMedicalRecord = (medicalRecord) => {
    let currRecord = selectedMedicalRecords;
    let currRecord_id = medicalRecordsId;
    for (var i = 0; i < currRecord.length; i++) {
      if (currRecord[i] == medicalRecord) {
        currRecord.splice(i, 1);
        currRecord_id.splice(i, 1);
      }
    }
    setSelectedMedicalRecords(currRecord);
    setMedicalRecordsId(currRecord_id);
    recalibrateOptions(currRecord);
    calculateTotalAmount(currRecord);
  };

  const recalibrateOptions = (selectedMR) => {
    let _options = [];
    for (var i = 0; i < allMedicalRecords.length; i++) {
      if (!selectedMR.includes(allMedicalRecords[i])) {
        _options.push(allMedicalRecords[i]);
      }
    }
    setOptions(_options);
  };

  const calculateTotalAmount = (selectedMR) => {
    let tempAmt = 0;
    for (let idx in selectedMR) {
      tempAmt += selectedMR[idx].totalAmt;
    }
    return setTotalAmt(tempAmt);
  };

  const availableOptions = {
    options: options,
    getOptionLabel: (option) => option.recordType,
  };

  const claim = {
    onChainAccountAddress: onChainAccountAddress,
    medicalAmount: totalAmt,
    medicalRecordRefIds: medicalRecordsId,
    identificationNum: patientIdentification,
  };

  //Submit claim
  const createClaim = async () => {
    console.log(claim);
    await medichainClient
      .post("/claim/submitClaim", claim)
      .then((res) => {
        console.log(res.data);
        setMessage("Claim filed successfully!");
        setSeverity("success");
        setOpenSnackBar(true);
        setMedicalRecordsId([]);
        setSelectedMedicalRecords([]);
      })
      .catch((error) => {
        let newErrorMessage = [...errorMessages, error.response.data];
        setMessage(newErrorMessage);
        setSeverity("error");
        setOpenSnackBar(true);
      });
  };

  useEffect(() => {
    getMedicalRecords();
  }, [selectedMedicalRecords]);

  return (
    <div className={classes.root}>
      <Snackbar open={openSnackBar} severity={severity} message={message} setOpenSnackBar={setOpenSnackBar} />
      <Typography component="h1" variant="h6" classes={classes.pageTitle}>
        Submit a Claim
      </Typography>
      {selectedMedicalRecords && selectedMedicalRecords.length > 0 ? (
        selectedMedicalRecords.map((record, i) => (
          <Card key={i} className={classes.cardRoot}>
            <CardContent className={classes.cardContent}>
              <div className={classes.flexItem}>
                <Typography variant="h6">{record.recordType}</Typography>
                <Typography variant="body1">{record.recordDetails}</Typography>
              </div>
              <div className={classes.column}>
                <IconButton aria-label="remove medical record" onClick={() => removeMedicalRecord(record)}>
                  <CancelIcon />
                </IconButton>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography>No medical record added</Typography>
      )}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Autocomplete
            {...availableOptions}
            fullWidth
            id="newMR_autocomplete"
            key="newMR_autocomplete"
            filterSelectedOptions
            renderInput={(params) => (
              <TextField {...params} variant="outlined" labels="Medical Record" placeholder="Add Medical Record" />
            )}
            onChange={(event, value) => {
              addMedicalRecord(value);
            }}
          />
        </Grid>
      </Grid>

      <TextField
        variant="outlined"
        margin="normal"
        type="number"
        id="totalAmt"
        name="totalAmt"
        label="Amount"
        value={totalAmt}
        fullWidth
        readOnly
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
          inputProps: { min: 0.0 },
        }}
      />
      <Grid container justify="flex-end">
        <Button variant="contained" className={classes.submit} color="primary" onClick={() => createClaim()}>
          Submit
        </Button>
      </Grid>
    </div>
  );
}
