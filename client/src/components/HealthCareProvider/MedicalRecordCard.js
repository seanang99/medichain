import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Card, CardContent, Typography, Dialog } from "@material-ui/core";
import { Folder, GetApp } from "@material-ui/icons";

import SubmitClaim from "../PolicyHolder/SubmitClaim";

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

const MedicalRecordCard = ({
  recordType,
  recordDetails,
  patientId,
  fileUrl,
  submitClaim,
}) => {
  const classes = useStyles();

  const [openSubmitClaimDialog, setOpenSubmitClaimDialog] = useState(false);

  return (
    <Card classes={{ root: classes.root }}>
      <CardContent className={classes.cardContent}>
        <div className={classes.flexItem}>
          <Typography variant="h6" color="primary">
            {recordType}
          </Typography>
          <Typography
            style={{ color: "#1e1e1e", margin: "2px 0 8px" }}
            variant="body1"
          >
            {recordDetails}
          </Typography>
          <Typography variant="body2">
            Patient: <span style={{ color: "#676767" }}>{patientId.identificationNum}</span>
          </Typography>
        </div>
        <div className={classes.column}>
          <Button
            disableRipple
            classes={{ root: classes.button }}
            endIcon={<GetApp fontSize="inherit" />}
            href={fileUrl}
            target="_blank"
            referrerPolicy="no-referrer"
          >
            Download File
          </Button>
          {submitClaim && (
            <Button
              variant="contained"
              color="primary"
              style={{ borderRadius: 15 }}
              endIcon={<Folder />}
              onClick={()=> setOpenSubmitClaimDialog(true)}
            >
              Submit Claim
            </Button>
          )}
          <Dialog
            fullWidth
            open={openSubmitClaimDialog}
            onClose={() => setOpenSubmitClaimDialog(false)}
            aria-labelledby="claim-creation"
          >
            <SubmitClaim />
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

MedicalRecordCard.propTypes = {
  fileUrl: PropTypes.string.isRequired,
};

export default MedicalRecordCard;
