import React, { useState, Fragment } from "react";
import { useHistory } from "react-router-dom";
import { Divider, IconButton, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { PowerSettingsNew } from "@material-ui/icons";

import Blob from "../Bloop";
import { logout } from "../../Auth";
import MedicalRecordCard from "../HealthCareProvider/MedicalRecordCard";

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

const Insurer = () => {
  const classes = useStyles();
  const history = useHistory();

  const [medicalRecords, setMedicalRecords] = useState([]);

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
            history.push("/medichain/login");
          }}
        >
          <PowerSettingsNew />
        </IconButton>
      </Typography>
      <div className={classes.container}>
        <div className={classes.header}>
          <Typography style={{ justifySelf: "flex-start" }} variant="h4" color="primary">
            Pending Claim Records
          </Typography>
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

      <Blob />
    </div>
  );
};

export default Insurer;
