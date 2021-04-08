import React, { useState, useEffect, Fragment } from "react";
import { useHistory } from "react-router-dom";
import { Divider, IconButton, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { PowerSettingsNew } from "@material-ui/icons";
import Fuse from "fuse.js";

import Blob from "../Bloop";
import { emrxClient, logout, medichainClient } from "../../Auth";
import MedicalRecordCard from "../HealthCareProvider/MedicalRecordCard";
import ClaimRecordAccordion from "../Insurer/ClaimRecordAccordian";

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

const PolicyHolder = () => {
  const classes = useStyles();
  const history = useHistory();

  const [policyHolderId, setPolicyHolderId] = useState("S1234567A");
  const [policyHolderOnChainId, setPolicyHolderOnChainId] = useState("0x87146fEa8AA124C408C440694fBC8CdD91C5738f");

  const [medicalRecords, setMedicalRecords] = useState([]);
  const [claims, setClaims] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [fuse, setFuse] = useState();

  const options = {
    includeScore: true,
    // Search in `author` and in `tags` array
    keys: ["recordDetails", "recordType"],
  };

  const getMedicalRecords = () => {
    emrxClient
      .get("medicalRecord/readMedicalRecordByPatientIdNum/" + policyHolderId)
      .then((res) => {
        setMedicalRecords(res.data);
        setSearchResults(res.data);
        setFuse(new Fuse(res.data, options));
      })
      .catch((error) => console.log(error.response.data));
  };

  const getClaims = () => {
    medichainClient
      .get("claim/getClaims/" + policyHolderOnChainId)
      .then((res) => {
        setClaims(res.data);
      })
      .catch((error) => console.log(error.response.data));
  };

  useEffect(() => {
    getMedicalRecords();
    getClaims();
  }, []);

  const onSearch = (value) => {
    setSearchTerm(value);
    setSearchResults(fuse.search(value));
  };

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
            Claim Records
          </Typography>
        </div>
        {claims && claims.length > 0 ? (
          <Fragment>
            {claims.slice(0, 4).map((record, i) => (
              <ClaimRecordAccordion key={i} {...record} />
            ))}
            <Typography variant="body2" className={classes.footer}>
              {claims.length} Record(s)
            </Typography>
          </Fragment>
        ) : (
          <Typography style={{ margin: "16px" }}>No results</Typography>
        )}

        <Divider style={{ margin: "48px 0 24px" }} />
        <div className={classes.header}>
          <Typography style={{ justifySelf: "flex-start" }} variant="h4" color="primary">
            Medical Records
          </Typography>
          <TextField
            classes={{ root: classes.searchRoot }}
            InputProps={{ classes: { root: classes.searchInput } }}
            variant="outlined"
            margin="dense"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        {medicalRecords && medicalRecords.length > 0 ? (
          <Fragment>
            {searchTerm !== ""
              ? searchResults.slice(0, 5).map((record, i) => <MedicalRecordCard key={i} {...record.item} />)
              : medicalRecords.slice(0, 5).map((record, i) => <MedicalRecordCard key={i} {...record} />)}
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

export default PolicyHolder;
