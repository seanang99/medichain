import React, { useState, useEffect } from "react";
// import axios from "axios";
import { IconButton, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { AddCircle, AirlineSeatLegroomExtraSharp } from "@material-ui/icons";

import Blob from "../Blob";
import { emrxClient } from "../../Auth";
import MedicalRecordCard from "../MedicalRecordCard";

const useStyles = makeStyles((theme) => ({
  root: {
    maxHeight: "100vh",
  },
  pageTitle: {
    margin: theme.spacing(6),
  },
  container: {
    margin: theme.spacing(6),
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  searchRoot: {
    flexGrow: 1,
    marginLeft: "50%",
  },
  searchInput: {
    backgroundColor: "#FFF",
  },
  icon: {
    marginLeft: theme.spacing(1),
    padding: theme.spacing(1),
  },
}));

const HealthCareProvider = () => {
  const classes = useStyles();

  const [medicalRecords, setMedicalRecords] = useState(
    Array(4).fill({
      recordType: "Consultation Report",
      recordDetails: "Emergency Medical Record",
      patientId: "Ong Lai Huat",
      fileURL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    })
  );

  useEffect(() => {
    emrxClient
      .get("medicalRecord/readAllMedicalRecord/60634ef35bffa016189f33ec")
      .then((res) => {
        setMedicalRecords(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className={classes.root}>
      <Typography className={classes.pageTitle} variant="h2" color="primary">
        Welcome back, mate
      </Typography>
      <div className={classes.container}>
        <div className={classes.header}>
          <Typography style={{ justifySelf: "flex-start" }} variant="h4" color="primary">
            Medical Records
          </Typography>
          <IconButton className={classes.icon} edge="end" color="primary">
            <AddCircle />
          </IconButton>
          <TextField
            classes={{ root: classes.searchRoot }}
            InputProps={{ classes: { root: classes.searchInput } }}
            variant="outlined"
            margin="dense"
            placeholder="Search"
          />
        </div>
        {medicalRecords && medicalRecords.length > 0
          ? medicalRecords.map((record) => <MedicalRecordCard {...record} />)
          : "No results"}
      </div>
      <Blob />
    </div>
  );
};

export default HealthCareProvider;
