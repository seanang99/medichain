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
      <Grid container spacing={3}>
        <Grid item xs={12} sm={9}>
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
        </Grid>
        <Grid item xs={12} sm={3}>
          <Button
            variant="contained"
            type="submit"
            fullWidth
            className={classes.add}
            color="secondary"
            onClick={() => null}
          >
            Add
          </Button>
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
        <Button
          variant="contained"
          type="submit"
          className={classes.submit}
          color="primary"
        >
          Submit
        </Button>
      </Grid>
    </div>
  );
}
