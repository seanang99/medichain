import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stepper,
  Typography,
  Step,
  StepLabel,
  TextField,
  Button,
  Box,
  Dialog,
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import ProcessClaims from "./ProcessClaims";
import ApproveRejectDialog from "./ApproveRejectDialog";
import { getUser } from "../../Auth";

const useStyles = makeStyles((theme) => ({
  accordionSummary: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  accordionDetails: {
    flexDirection: "column",
  },
  stepperContainer: {
    display: "flex",
    justifyContent: "center",
  },
  stepper: {
    width: "80%",
  },
  actionPanel: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: theme.spacing(2),
  },
}));

const ClaimRecordAccordion = ({
  title,
  status,
  insurer,
  remarks,
  isInsurer: isInsurer,
}) => {
  const classes = useStyles();
  const steps = ["PENDING", "PROCESSING", "APPROVED", "DISBURSED"];

  const [openAddRemarksDialog, setOpenAddRemarksDialog] = useState(false);
  const [openEndorseClaimsDialog, setOpenEndorseClaimsDialog] = useState(false);
  const policyHolderId = getUser().identificationNum;

  return (
    <div>
      <Accordion>
        <AccordionSummary
          classes={{
            content: classes.accordionSummary,
          }}
          expandIcon={<ExpandMore />}
        >
          <Typography variant="h6" color="primary">
            {title}
          </Typography>
          <Typography variant="body2">
            Status: <span style={{ color: "#676767" }}>{status}</span>
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetails}>
          <Typography variant="body2">
            Insurer: <span style={{ color: "#676767" }}>{insurer}</span>
          </Typography>
          <div className={classes.stepperContainer}>
            <Stepper
              classes={{ root: classes.stepper }}
              activeStep={steps.indexOf(status)}
              alternativeLabel
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </div>
          <div>
            <TextField
              variant="outlined"
              id="claimRemarks"
              name="claimRemarks"
              label="Claim Remarks"
              value={remarks}
              fullWidth
              multiline
              rows={4}
              InputProps={{
                readOnly: true,
              }}
            />{" "}
          </div>
          {isInsurer ? (
            <Box className={classes.actionPanel}>
              {/* check for claim status */}
              {status === "PENDING" ? (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setOpenAddRemarksDialog(true)}
                >
                  Add Remarks
                </Button>
              ) : status === "PROCESSING" ? (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setOpenEndorseClaimsDialog(true)}
                >
                  Endorse
                </Button>
              ) : status === "APPROVED" ? (
                <Button variant="outlined" color="primary">
                  Disburse
                </Button>
              ) : (
                <></>
              )}
            </Box>
          ) : (
            <></>
          )}
        </AccordionDetails>
      </Accordion>
      <Dialog
        fullWidth
        open={openAddRemarksDialog}
        onClose={() => setOpenAddRemarksDialog(false)}
        aria-labelledby="add-claim-remarks"
      >
        <ProcessClaims />
      </Dialog>
      <Dialog
        fullWidth
        open={openEndorseClaimsDialog}
        onClose={() => setOpenEndorseClaimsDialog(false)}
        aria-labelledby="add-claim-endorsement"
      >
        <ApproveRejectDialog policyHolderId={policyHolderId} />
      </Dialog>
    </div>
  );
};

ClaimRecordAccordion.propTypes = {
  title: PropTypes.string.isRequired,
};

export default ClaimRecordAccordion;
