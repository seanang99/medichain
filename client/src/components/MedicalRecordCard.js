import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Card, CardContent, Typography } from "@material-ui/core";
import { Folder, GetApp } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1, 0),
    border: "1px solid #C4C4C4",
    boxShadow: "none",
  },
  cardContent: {
    display: "flex",
    padding: theme.spacing(2),
    "&:last-child": {
      padding: theme.spacing(2),
    },
  },
  flexItem: {
    flexGrow: 1,
  },
  button: {
    textTransform: "none",
    color: theme.palette.orange,
    marginBottom: theme.spacing(1),
  },
  column: {
    display: "flex",
    flexDirection: "column",
  },
}));

const MedicalRecordCard = ({ title, patientName, fileURL, submitClaim }) => {
  const classes = useStyles();

  return (
    <Card classes={{ root: classes.root }}>
      <CardContent className={classes.cardContent}>
        <div className={classes.flexItem}>
          <Typography variant="h6" color="primary">
            {title}
          </Typography>
          <Typography variant="body2">
            Patient: <span style={{ color: "#676767" }}>{patientName}</span>
          </Typography>
        </div>
        <div className={classes.column}>
          <Button
            disableRipple
            classes={{ root: classes.button }}
            endIcon={<GetApp fontSize="inherit" />}
            href={fileURL}
            target="_blank"
            referrerPolicy="no-referrer"
          >
            Download File
          </Button>
          {submitClaim && (
            <Button variant="contained" color="primary" style={{ borderRadius: 15 }} endIcon={<Folder />}>
              Submit Claim
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

MedicalRecordCard.propTypes = {
  title: PropTypes.string.isRequired,
  patientName: PropTypes.string.isRequired,
  fileURL: PropTypes.string.isRequired,
};

export default MedicalRecordCard;
