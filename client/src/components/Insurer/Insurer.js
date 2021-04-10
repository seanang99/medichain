import React, { useState, useEffect, Fragment } from "react";
import { useHistory } from "react-router-dom";
import { Divider, IconButton, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { PowerSettingsNew } from "@material-ui/icons";

import Blob from "../Bloop";
import { logout, medichainClient, getUser} from "../../Auth";
import ClaimRecordAccordion from "./ClaimRecordAccordian";

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

  const [claimRecords, setClaimRecords] = useState([]);
  const [insurerId, setInsurerId] = useState("");
  const [insurerOnChainId, setInsurerOnChainId] = useState("");


  const getClaims = async () => {
    medichainClient
      .get("claim/getClaims/" + insurerOnChainId)
      .then((res) => {
        setClaimRecords(res.data);
      })
      .catch((error) => console.log(error.response.data));
  };
  
  useEffect(() => {
    const user = getUser();
    console.log(user);
    setInsurerId(user.identificationNum);
    setInsurerOnChainId(user.onChainAccountAddress);
    
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
          <Typography style={{ justifySelf: "flex-start" }} variant="h4" color="primary">
            Pending Claim Records
          </Typography>
        </div>
        {claimRecords && claimRecords.length > 0 ? (
          <Fragment>
            {claimRecords.slice(0, 4).map((record, i) => (
              <ClaimRecordAccordion key={i} {...record} />
            ))}
            <Typography variant="body2" className={classes.footer}>
              {claimRecords.length} Record(s)
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
