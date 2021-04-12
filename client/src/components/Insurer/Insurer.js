import React, { useState, useEffect, Fragment } from "react";
import { useHistory } from "react-router-dom";
import { Divider, IconButton, Select, MenuItem, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { PowerSettingsNew } from "@material-ui/icons";

import Blob from "../Bloop";
import { logout, medichainClient, getUser } from "../../Auth";
import ClaimRecordAccordion from "./ClaimRecordAccordian";
import { SettingsPowerSharp } from "@material-ui/icons";

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
    margin: theme.spacing(2, 0),
  },
  filterStatus: {
    flexGrow: 1,
    marginLeft: "70%",
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
    margin: theme.spacing(2, 0),
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

  const statuses = ["ALL", "PENDING", "PROCESSED", "APPROVED", "REJECTED", "DISBURSED"];
  const [status, setStatus] = useState("ALL");

  const [allClaimRecords, setAllClaimRecords] = useState([]);
  const [selectedClaims, setSelectedClaims] = useState([]);

  function handleSelection(value) {
    setSelectedClaims(allClaimRecords.filter((record) => record.claimStatus === value));
  }

  const getClaims = () => {
    medichainClient
      .get("claim/getClaims")
      .then((res) => {
        console.log(res.data);
        setAllClaimRecords(res.data);
        setSelectedClaims(res.data);
      })
      .catch((error) => console.log(error.response.data));
  };

  useEffect(() => {
    getClaims();
    // console.log(getUser().onChainAccountAddress)
  }, []);

  console.log(allClaimRecords);

  return (
    <div className={classes.root}>
      <div className={classes.header}></div>
      <Typography className={classes.pageTitle} variant="h2" color="primary">
        Welcome back, Insurer
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
          <Select
            className={classes.filterStatus}
            id="filter-select-claim-status"
            variant="outlined"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              handleSelection(e.target.value);
            }}
          >
            {statuses.map((s, i) => (
              <MenuItem key={i} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </div>
        {selectedClaims && selectedClaims.length > 0 ? (
          <Fragment>
            {selectedClaims.slice(0, 4).map((record, i) => (
              <ClaimRecordAccordion key={i} {...record} getClaims={getClaims} isInsurer={true} />
            ))}
            <Typography variant="body2" className={classes.footer}>
              {selectedClaims.slice(0, 4).length} of {allClaimRecords.length} Record(s)
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
