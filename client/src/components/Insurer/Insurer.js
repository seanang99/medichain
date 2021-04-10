import React, { useState, useEffect, Fragment } from "react";
import { useHistory } from "react-router-dom";
import {
  Divider,
  IconButton,
  Select,
  MenuItem,
  Typography,
} from "@material-ui/core";
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
    margin: theme.spacing(2,0),
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

  const statuses = [
    "ALL",
    "PENDING",
    "PROCESSED",
    "APPROVED",
    "REJECTED",
    "DISBURSED",
  ];
  const [status, setStatus] = useState("ALL");

  const [allClaimRecords, setAllClaimRecords] = useState([]);
  const [selectedClaims, setSelectedClaims] = useState([]);
  const [pendingClaims, setPendingClaims] = useState([]);
  const [processedClaims, setProcessedClaims] = useState([]);
  const [approvedClaims, setApprovedClaims] = useState([]);
  const [rejectedClaims, setRejectedClaims] = useState([]);
  const [disbursedClaims, setDisbursedClaims] = useState([]);

  const sortClaims = async (allClaims) => {
    let pending_Claims = [];
    let processed_Claims = [];
    let rejected_Claims = [];
    let approved_Claims = [];
    let disbursed_Claims = [];

    for (let i = 0; i < allClaims.length; i++) {
      console.log('sort: ', allClaims[i]);
      if (allClaims[i].status === "PENDING") {
        pending_Claims.push(allClaims[i]);
      } else if (allClaims[i].claimStatus === "PROCESSED") {
        processed_Claims.push(allClaims[i]);
      } else if (allClaims[i].claimStatus === "REJECTED") {
        rejected_Claims.push(allClaims[i]);
      } else if (allClaims[i].claimStatus === "APPROVED") {
        approved_Claims.push(allClaims[i]);
      } else if (allClaims[i].claimStatus === "DISBURSED") {
        disbursed_Claims.push(allClaims[i]);
      }
    }
    setPendingClaims(pending_Claims);
    setProcessedClaims(processed_Claims);
    setApprovedClaims(rejected_Claims);
    setRejectedClaims(approved_Claims);
    setDisbursedClaims(disbursed_Claims);
  };

  function handleSelection(value) {
    switch (value) {
      case "ALL":
        setSelectedClaims(allClaimRecords);
        break;
      case "PENDING":
        setSelectedClaims(pendingClaims);
        break;
      case "PROCESSED":
        setSelectedClaims(processedClaims);
        break;
      case "REJECTED":
        setSelectedClaims(rejectedClaims);
        break;
      case "APPROVED":
        setSelectedClaims(approvedClaims);
        break;
      case "DISBURSED":
        setSelectedClaims(disbursedClaims);
        break;
    }
  }

  const getClaims = async () => {
    medichainClient
      .get("claim/getClaims")
      .then((res) => {
        console.log(res.data);
        setAllClaimRecords(res.data);
        setSelectedClaims(res.data);
        sortClaims(res.data);
      })
      .catch((error) => console.log(error.response.data));
  };

  useEffect(() => {
    getClaims();
  }, []);

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
          <Typography
            style={{ justifySelf: "flex-start" }}
            variant="h4"
            color="primary"
          >
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
              <ClaimRecordAccordion key={i} {...record} isInsurer={true} />
            ))}
            <Typography variant="body2" className={classes.footer}>
              {selectedClaims.length} Record(s)
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
