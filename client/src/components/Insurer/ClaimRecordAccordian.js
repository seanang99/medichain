import React, { useState, useEffect } from "react";
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
import MedicalRecordSummary from "./MedicalRecordSummary";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1, 0),
  },
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
  },
  muiLink: {
    margin: theme.spacing(1),
    "&:hover": {
      cursor: "pointer",
    },
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
  claimant,
  claimAmount,
  medicalAmount,
  getClaims,
  policyNumber,
  medicalRecords,
}) => {
  const classes = useStyles();
  const steps = ["PENDING", "PROCESSED", "APPROVED", "DISBURSED"];

  const [openAddRemarksDialog, setOpenAddRemarksDialog] = useState(false);
  const [openEndorseClaimsDialog, setOpenEndorseClaimsDialog] = useState(false);
  const [openDisburseClaimDialog, setOpenDisburseClaimDialog] = useState(false);
  const [openMedicalRecord, setOpenMedicalRecord] = useState(false);
  const [selectedMedicalRecord, setSelectedMedicalRecord] = useState();

  const [verifier, setVerifier] = useState("");
  const [verifierRemarks, setVerifierRemarks] = useState("");
  const [endorser, setEndorser] = useState("");
  const [endorserRemarks, setEndorserRemarks] = useState("");
  const [disburser, setDisburser] = useState("");
  const [disburserRemarks, setDisburserRemarks] = useState("");

  const unpackRemarks = (unfilteredRemarks) => {
    //Get Verifier
    if (unfilteredRemarks.length === 1) {
      setVerifier(unfilteredRemarks[0].account);
      setVerifierRemarks(unfilteredRemarks[0].remark);
    }
    if (unfilteredRemarks.length === 2) {
      //Get Endorser
      setVerifier(unfilteredRemarks[0].account);
      setVerifierRemarks(unfilteredRemarks[0].remark);
      setEndorser(unfilteredRemarks[1].account);
      setEndorserRemarks(unfilteredRemarks[1].remark);
    }
    if (unfilteredRemarks.length === 3) {
      //Get Endorser
      setVerifier(unfilteredRemarks[0].account);
      setVerifierRemarks(unfilteredRemarks[0].remark);
      setEndorser(unfilteredRemarks[1].account);
      setEndorserRemarks(unfilteredRemarks[1].remark);
      setDisburser(unfilteredRemarks[2].account);
      setDisburserRemarks(unfilteredRemarks[2].remark);
    }
  };

  useEffect(() => {
    unpackRemarks(remarks);
  }, [remarks]);

  const handleSelectMedicalRecord = (id) => {
    console.log(id);
    setSelectedMedicalRecord(
      medicalRecords.filter((record) => record !== null).find((record) => record._id && record._id === id)
    );
    setOpenMedicalRecord(true);
  };

  return (
    <div className={classes.root}>
      <Accordion TransitionProps={{ unmountOnExit: true }}>
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
            Policy: <span style={{ color: "#676767" }}>{policyNumber}</span>
          </Typography>
          <Typography variant="body2">
            Claim Amount: <span style={{ color: "#676767" }}>S${claimAmount}</span>
          </Typography>
          <Typography variant="body2">
            Submitted Medical Amount: <span style={{ color: "#676767" }}>S${medicalAmount}</span>
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
            {claimStatus != "PENDING" ? (
              <div>
                <Typography name="verifier-label" variant="h6">
                  Verifier Remarks
                </Typography>
                <Typography name="verifier-label" variant="body1">
                  Verifier: {verifier}
                </Typography>
                <Typography name="verifier-remarks" variant="body1">
                  Remarks: {verifierRemarks}
                </Typography>
              </div>
            ) : (
              <></>
            )}
            {claimStatus === "APPROVED" || claimStatus === "REJECTED" || claimStatus === "DISBURSED" ? (
              <div>
                <Typography name="verifier-label" variant="h6">
                  Endorser Remarks
                </Typography>
                <Typography name="verifier-label" variant="body1">
                  Endorser: {endorser}
                </Typography>
                <Typography name="verifier-remarks" variant="body1">
                  Remarks: {endorserRemarks}
                </Typography>
              </div>
            ) : (
              <></>
            )}
            {claimStatus === "DISBURSED" ? (
              <div>
                <Typography name="verifier-label" variant="h6">
                  Disburser Remarks
                </Typography>
                <Typography name="verifier-label" variant="body1">
                  Disburser: {disburser}
                </Typography>
                <Typography name="verifier-remarks" variant="body1">
                  Remarks: {disburserRemarks}
                </Typography>
              </div>
            ) : (
              <></>
            )}
          </div>
          <div style={{ margin: "16px 0 8px" }}>
            <Typography variant="body2">Linked Medical Records:</Typography>
            {medicalRecordRefIds &&
              medicalRecordRefIds.map((record) => (
                <Link className={classes.muiLink} onClick={() => handleSelectMedicalRecord(record)}>
                  • {record}
                </Link>
              ))}
          </div>
          {isInsurer ? (
            <Box className={classes.actionPanel}>
              {/* check for claim status */}
              {claimStatus === "PENDING" ? (
                <Button variant="outlined" color="primary" onClick={() => setOpenAddRemarksDialog(true)}>
                  Add Remarks
                </Button>
              ) : claimStatus === "PROCESSED" ? (
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
        onExit={() => {
          getClaims();
          unpackRemarks(remarks);
        }}
        aria-labelledby="add-claim-remarks"
      >
        <ProcessClaims
          claimId={claimId}
          medicalAmount={medicalAmount}
          setOpenAddRemarksDialog={setOpenAddRemarksDialog}
        />
      </Dialog>
      <Dialog
        fullWidth
        open={openEndorseClaimsDialog}
        onClose={() => setOpenEndorseClaimsDialog(false)}
        onExit={() => {
          getClaims();
          unpackRemarks(remarks);
        }}
        aria-labelledby="add-claim-endorsement"
      >
        <ApproveRejectDialog
          claimId={claimId}
          policyHolderOnChainAddress={claimant}
          setOpenEndorseClaimsDialog={setOpenEndorseClaimsDialog}
        />
      </Dialog>
      <Dialog
        fullWidth
        open={openDisburseClaimDialog}
        onClose={() => setOpenDisburseClaimDialog(false)}
        onExit={() => {
          getClaims();
          unpackRemarks(remarks);
        }}
        aria-labelledby="disburse-claims"
      >
        <DisburseClaim
          claimId={claimId}
          policyHolderOnChainAddress={claimant}
          claimAmount={medicalAmount}
          setOpenDisburseClaimDialog={setOpenDisburseClaimDialog}
        />
      </Dialog>

      {selectedMedicalRecord && (
        <Dialog
          fullWidth
          open={openMedicalRecord}
          onClose={() => setOpenMedicalRecord(false)}
          onExit={() => setSelectedMedicalRecord()}
        >
          <MedicalRecordSummary selectedMedicalRecord={selectedMedicalRecord} />
        </Dialog>
      )}
    </div>
  );
};

ClaimRecordAccordion.propTypes = {
  claimStatus: PropTypes.string.isRequired,
};

export default ClaimRecordAccordion;
