import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Card, CardContent, Typography } from "@material-ui/core";
import { GetApp } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2, 0),
    border: "1px solid #C4C4C4",
    boxShadow: "none",
  },
  cardContent: {
    display: "flex",
  },
  flexItem: {
    flexGrow: 1,
  },
  button: {
    textTransform: "none",
    color: theme.palette.orange,
  },
}));

const MedicalRecordCard = ({ title, patientName, fileURL }) => {
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
        <div>
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
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalRecordCard;
