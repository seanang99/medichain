import React, { useState, useEffect, Fragment } from "react";
import { useHistory } from "react-router-dom";
import { Dialog, IconButton, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { AddCircle, PowerSettingsNew } from "@material-ui/icons";

import Blob from "../Blob";
import { emrxClient, logout } from "../../Auth";
import MedicalRecordCard from "../MedicalRecordCard";
import CreateMedicalRecord from "./CreateMedicalRecord";

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
  footer: {
    width: "100%",
    textAlign: "right",
    color: theme.palette.grey[800],
  },
  logout: {
    color: theme.palette.error.main,
    margin: theme.spacing(0, 1),
    "&:hover": {
      backgroundColor: "rgba(244, 67, 54, 0.4)",
    },
  },
}));

const HealthCareProvider = () => {
  const classes = useStyles();
  const history = useHistory();

  const [medicalRecords, setMedicalRecords] = useState([]);
  const [recordCreationDialogOpen, setRecordCreationDialogOpen] = useState(false);

  useEffect(() => {
    emrxClient
      .get("medicalRecord/readMedicalRecordByPatientIdNum/S1234567A")
      .then((res) => {
        // console.log(res.data);
        setMedicalRecords(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.header}></div>
      <Typography className={classes.pageTitle} variant="h2" color="primary">
        Welcome back, mate
        <IconButton
          className={classes.logout}
          edge="end"
          onClick={() => {
            logout();
            history.push("/emrx/login");
          }}
        >
          <PowerSettingsNew />
        </IconButton>
      </Typography>
      <div className={classes.container}>
        <div className={classes.header}>
          <Typography style={{ justifySelf: "flex-start" }} variant="h4" color="primary">
            Medical Records
          </Typography>
          <IconButton
            className={classes.icon}
            edge="end"
            color="primary"
            onClick={() => setRecordCreationDialogOpen(true)}
          >
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
        {medicalRecords && medicalRecords.length > 0 ? (
          <Fragment>
            {medicalRecords.slice(0, 4).map((record, i) => (
              <MedicalRecordCard key={i} {...record} />
            ))}
            <Typography variant="body2" className={classes.footer}>
              {medicalRecords.length} Record(s)
            </Typography>
          </Fragment>
        ) : (
          <Typography style={{ margin: "16px" }}>No results</Typography>
        )}
      </div>

      <Dialog
        open={recordCreationDialogOpen}
        onClose={() => setRecordCreationDialogOpen(false)}
        aria-labelledby="record-creation"
      >
        <CreateMedicalRecord />
      </Dialog>

      <Blob />
    </div>
  );
};

export default HealthCareProvider;
