import React, { useState } from "react";
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
}));

export default function SubmitClaim() {
  const classes = useStyles();

  const [patientAddress, setPatientAddress] = useState("");
  const [totalAmt, setTotalAmt] = useState(0);
  const [medicalRecordsId, setMedicalRecordsId] = useState([]);

  // Get Medical Records
  const [medicalRecords, setMedicalRecords] = useState([]);

  const numOfMedicalRecords = 0;

  return (
    <div className={classes.root}>
      <Paper elevation={3} className={classes.paper}>
        <Typography component="h1" variant="h6" classes={classes.pageTitle}>
          Submit a Claim
        </Typography>
        {/* use .map */}
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
        <Button variant="contained" type="submit" className={classes.upload}>
          Submit
        </Button>
    
      </Paper>
    </div>
  );
}
