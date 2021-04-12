import React, { useState, useEffect, Fragment } from "react";
import { useHistory } from "react-router-dom";
import { Dialog, IconButton, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { AddCircle, PowerSettingsNew } from "@material-ui/icons";
import Fuse from "fuse.js";

import Blob from "../Blob";
import { emrxClient, logout, getUser } from "../../Auth";
import MedicalRecordCard from "./MedicalRecordCard";
import CreateMedicalRecord from "./CreateMedicalRecord";
import Snackbar from "../../contexts/SnackbarComponent";

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

  //Get context value from snack bar context
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");

  const [user, setUser] = useState();
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [recordCreationDialogOpen, setRecordCreationDialogOpen] = useState(false);

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
      .get("/medicalRecord/readAllMedicalRecord/")
      .then((res) => {
        setMedicalRecords(res.data);
        setSearchResults(res.data);
        setFuse(new Fuse(res.data, options));
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    setUser(getUser());
    getMedicalRecords();
  }, []);

  const onSearch = (value) => {
    setSearchTerm(value);
    setSearchResults(fuse.search(value));
  };

  return (
    <div className={classes.root}>
      <Snackbar open={openSnackBar} severity={severity} message={message} setOpenSnackBar={setOpenSnackBar} />
      <div className={classes.header}></div>
      <Typography className={classes.pageTitle} variant="h2" color="primary">
        Welcome back, {user && `${user.firstName} ${user.lastName}`}
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
            ƒ
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

      <Dialog
        open={recordCreationDialogOpen}
        onClose={() => setRecordCreationDialogOpen(false)}
        aria-labelledby="record-creation"
        onExit={() => getMedicalRecords()}
      >
        <CreateMedicalRecord
          setRecordCreationDialogOpen={setRecordCreationDialogOpen}
          setMessage={setMessage}
          setSeverity={setSeverity}
          setOpenSnackBar={setOpenSnackBar}
        />
      </Dialog>

      <Blob />
    </div>
  );
};

export default HealthCareProvider;
