import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Grid,
  Typography,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  InputAdornment,
  Button,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import { emrxClient } from "../../Auth";
import { set } from "mongoose";
import MedicalRecordCard from "../MedicalRecordCard";

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
}));

export default function SubmitClaim() {
  const classes = useStyles();

  const [patientAddress, setPatientAddress] = useState("");
  const [totalAmt, setTotalAmt] = useState(0);
  const [medicalRecordsId, setMedicalRecordsId] = useState([]);
  const [selectedMedicalRecords, setSelectedMedicalRecords] = useState([]);

  const [allMedicalRecords, setAllMedicalRecords] = useState([]);
  const getMedicalRecords = async () => {
    emrxClient
      .get("medicalRecord/readAllMedicalRecord/60634ef35bffa016189f33ec")
      .then((res) => {
        console.log(res.data);
        setAllMedicalRecords(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addMedicalRecord = (medicalRecord) => {
    let currRecord = selectedMedicalRecords;
    currRecord.append(medicalRecord);
    setSelectedMedicalRecords(currRecord);
    calculateTotalAmount(currRecord);
  };

  const removeMedicalRecord = (medicalRecord) => {
    let currRecord = selectedMedicalRecords;
    for (var i = 0; i < currRecord.length; i++) {
      if (currRecord[i] == medicalRecord) {
        currRecord.splice(i, 1);
      }
    }
    setSelectedMedicalRecords(currRecord);
    calculateTotalAmount(currRecord);
  };

  const calculateTotalAmount = (selectedMR) => {
    let tempAmt = 0;
    for (let idx in selectedMR) {
      tempAmt += selectedMR[idx].totalAmt;
    }
    return setTotalAmt(tempAmt);
  };

  const availableOptions = {
    options: allMedicalRecords,
    getOptionLabel: (option) => option.recordType,
  };

  //Submit claim
  const createClaim = async () => {
    emrxClient
      .get("url", medicalRecordsId, patientAddress)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getMedicalRecords();
  }, []);

  return (
    <div className={classes.root}>
      <Paper elevation={3} className={classes.paper}>
        <Typography component="h1" variant="h6" classes={classes.pageTitle}>
          Submit a Claim
        </Typography>

        {selectedMedicalRecords && selectedMedicalRecords.length > 0 ? (
          selectedMedicalRecords.map((record, i) => (
            <MedicalRecordCard key-={i} {...record} />
          ))
        ) : (
          <Typography>No medical record added</Typography>
        )}

        <Autocomplete
          {...availableOptions}
          fullWidth
          id="newMR_autocomplete"
          key="newMR_autocomplete"
          filterSelectedOptÎions
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              labels="Medical Record"
              placeholder="Add Medical Record"
            />
          )}
          onChange={(e) => addMedicalRecord(e.target.value)}
        />

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
        <Button variant="contained" type="submit" className={classes.upload}>
          Submit
        </Button>
      </Paper>
    </div>
  );
}
