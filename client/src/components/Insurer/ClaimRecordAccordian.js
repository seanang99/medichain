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
  Link,
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import ProcessClaims from "./ProcessClaims";
import ApproveRejectDialog from "./ApproveRejectDialog";
import DisburseClaim from "./DisburseClaim";

import { getUser } from "../../Auth";
import { formatDateString } from "../../utils";

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
  claimId,
  claimDate,
  claimStatus,
  token,
  medicalRecordRefIds,
  remarks,
  isInsurer,
  policyHolderId,
  medicalAmount,
}) => {
  const classes = useStyles();
  const steps = ["PENDING", "PROCESSING", "APPROVED", "DISBURSED"];

  const [openAddRemarksDialog, setOpenAddRemarksDialog] = useState(false);
  const [openEndorseClaimsDialog, setOpenEndorseClaimsDialog] = useState(false);
  const [openDisburseClaimDialog, setOpenDisburseClaimDialog] = useState(false);

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
            Claim submitted {formatDateString(claimDate)}
          </Typography>
          <Typography variant="body2">
            Status: <span style={{ color: "#676767" }}>{claimStatus}</span>
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetails}>
          <Typography variant="body2">
            Claim Amount: <span style={{ color: "#676767" }}>S${medicalAmount}</span>
          </Typography>
          <Typography variant="body2">
            Token: <span style={{ color: "#676767" }}>{token}</span>
          </Typography>
          <div className={classes.stepperContainer}>
            <Stepper classes={{ root: classes.stepper }} activeStep={steps.indexOf(claimStatus)} alternativeLabel>
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
              InputLabelProps={{ shrink: true }}
            />
          </div>
          <div style={{ margin: "16px 0 8px" }}>
            <Typography variant="body2">Linked Medical Records:</Typography>
            {medicalRecordRefIds &&
              medicalRecordRefIds.map((record) => <Link style={{ marginLeft: 8 }}>• {record}</Link>)}
          </div>
          {isInsurer ? (
            <Box className={classes.actionPanel}>
              {/* check for claim status */}
              {claimStatus === "PENDING" ? (
                <Button variant="outlined" color="primary" onClick={() => setOpenAddRemarksDialog(true)}>
                  Add Remarks
                </Button>
              ) : claimStatus === "PROCESSING" ? (
                <Button variant="outlined" color="primary" onClick={() => setOpenEndorseClaimsDialog(true)}>
                  Endorse
                </Button>
              ) : claimStatus === "APPROVED" ? (
                <Button variant="outlined" color="primary" onClick={() => setOpenDisburseClaimDialog(true)}>
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
        <ProcessClaims claimId={claimId} />
      </Dialog>
      <Dialog
        fullWidth
        open={openEndorseClaimsDialog}
        onClose={() => setOpenEndorseClaimsDialog(false)}
        aria-labelledby="add-claim-endorsement"
      >
        <ApproveRejectDialog claimId={claimId} policyHolderId={policyHolderId} />
      </Dialog>
      <Dialog
        fullWidth
        open={openDisburseClaimDialog}
        onClose={() => setOpenDisburseClaimDialog(false)}
        aria-labelledby="disburse-claims"
      >
        <DisburseClaim claimId={claimId} policyHolderId={policyHolderId} claimAmount={medicalAmount} />
      </Dialog>
    </div>
  );
};

ClaimRecordAccordion.propTypes = {
  claimStatus: PropTypes.string.isRequired,
};

export default ClaimRecordAccordion;
