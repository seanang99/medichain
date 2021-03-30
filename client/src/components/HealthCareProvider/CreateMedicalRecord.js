import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Grid,
  Paper,
  OutlinedInput,
  TextField,
  Typography,
  Button,
  InputAdornment,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    padding: "2vw",
    display: "float",
  },
  paper: {
    padding: theme.spacing(2),
    alignItems: "center",
  },
  pageTitle: {
    letterSpacing: "8px",
    color: theme.palette.primary.dark,
  },
  upload: {
      backgroundColor: "#75C4E0",
  }
}));

export default function CreateMedicalRecord() {
  const classes = useStyles();

  // Attribute of medical records
  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [healthcareProviderId, setHealthCareProviderId] = useState("");
  const [recordType, setRecordType] = useState("");
  const [recordDetails, setrRecordDetails] = useState("");
  const [totalAmt, setTotalAmt] = useState(0);
  const [fileURL, setFileURL] = useState("");

  // Uploading Files

  const medicalRecord = {
    patientName: patientName,
    patientId: patientId,
    healthcareProviderId: healthcareProviderId,
    recordType: recordType,
    recordDetails: recordDetails,
    totalAmt: totalAmt,
    fileURL: fileURL,
  };
  const createNewMedicalRecord = (e) => {
    e.preventDefault();

    axios
      .post("url", medicalRecord)
      .then((res) => {
        var record = res.data;
        setPatientName("");
        setPatientId("");
        setHealthCareProviderId("");
        setRecordType("");
        setrRecordDetails("");
        setTotalAmt(null);
        setFileURL("");
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  return (
    <div className={classes.root}>
      <Paper elevation={3} className={classes.paper}>
        <Typography component="h1" variant="h6" classes={classes.pageTitle}>
          New Medical Record
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              margin="normal"
              id="patientName"
              name="patientName"
              label="Patient Name"
              fullWidth
              autoFocus
              onChange={(e) => setPatientName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              margin="normal"
              id="patientId"
              name="patientId"
              label="Patient ID"
              fullWidth
              onChange={(e) => setPatientId(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            {/* Is this a dropdown?  */}
            <TextField
              variant="outlined"
              margin="normal"
              id="recordType"
              name="recordType"
              label="Record Type"
              fullWidth
              onChange={(e) => setRecordType(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              margin="normal"
              type="number"
              id="totalAmt"
              name="totalAmt"
              label="Amount"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
                inputProps: { min: 0.0 },
              }}
              onChange={(e) => setTotalAmt(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
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
              fullWidth
              id="fileUrl"
              name="fileUrl"
              label="File URL"
              onChange={(e) => setFileURL(e.target.value)}
            />
            <Grid container justify="flex-end">
              <Button variant="contained" type="submit" className={classes.upload}>
                Upload
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}
