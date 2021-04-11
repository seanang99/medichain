import React, { useState, useContext } from "react";
import { Grid, TextField, Typography, Button, InputAdornment } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { emrxClient } from "../../Auth";
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
  pageTitle: {
    color: theme.palette.primary.dark,
  },
  upload: {
    textTransform: "none",
    margin: theme.spacing(2, 0),
    minWidth: "200px",
  },
}));

export default function CreateMedicalRecord(props) {
  const classes = useStyles();

  const { setRecordCreationDialogOpen } = props;

  //Get context value from snack bar context
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");

  // Attribute of medical records
  const [patientId, setPatientId] = useState("");
  const [healthcareProviderId, setHealthCareProviderId] = useState("");
  const [recordType, setRecordType] = useState("");
  const [recordDetails, setrRecordDetails] = useState("");
  const [totalAmt, setTotalAmt] = useState(0);
  const [fileURL, setFileURL] = useState("");

  const [errorMessages, setErrorMessages] = useState([""]);

  const medicalRecord = {
    identificationNum: patientId,
    recordType: recordType,
    recordDetails: recordDetails,
    totalAmt: totalAmt,
    fileUrl: fileURL,
  };
  const createNewMedicalRecord = () => {
    console.log(medicalRecord);
    emrxClient
      .post("medicalRecord/createMedicalRecord", medicalRecord)
      .then((res) => {
        console.log(res.data);
        setMessage("Medical Record created successfully!");
        setSeverity("success");
        setOpenSnackBar(true);
        setPatientId("");
        setHealthCareProviderId("");
        setRecordType("");
        setrRecordDetails("");
        setTotalAmt(null);
        setFileURL("");
      })
      .catch((error) => {
        let newErrorMessage = [...errorMessages, error.response.data];
        setMessage(newErrorMessage);
        setSeverity("error");
        setOpenSnackBar(true);
      })
      .then(() => {
        setRecordCreationDialogOpen(false);
      });
  };

  return (
    <div className={classes.root}>
      <Snackbar open={openSnackBar} severity={severity} message={message} setOpenSnackBar={setOpenSnackBar} />
      <Typography component="h1" variant="h6" className={classes.pageTitle}>
        New Medical Record
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            margin="normal"
            id="patientId"
            name="patientId"
            label="Patient ID"
            fullWidth
            onChange={(e) => setPatientId(e.target.value)}
          />
          {/* Is this a dropdown?  */}
          <TextField
            variant="outlined"
            margin="normal"
            id="recordType"
            name="recordTitle"
            label="Record Title"
            fullWidth
            onChange={(e) => setRecordType(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="recordDetails"
            name="recordDetails"
            label="Record Details"
            multiline
            rows={4}
            onChange={(e) => setrRecordDetails(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            type="number"
            id="totalAmt"
            name="totalAmt"
            label="Amount"
            fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
              inputProps: { min: 0.0 },
            }}
            onChange={(e) => setTotalAmt(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="fileUrl"
            name="fileUrl"
            label="File URL"
            onChange={(e) => setFileURL(e.target.value)}
          />
          <Grid container justify="flex-end">
            <Button
              variant="contained"
              type="submit"
              className={classes.upload}
              color="primary"
              onClick={() => createNewMedicalRecord()}
            >
              Upload
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
