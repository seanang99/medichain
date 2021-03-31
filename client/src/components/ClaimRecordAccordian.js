import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Accordion, AccordionDetails, AccordionSummary, Stepper, Typography, Step, StepLabel } from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";

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
}));

const ClaimRecordAccordion = ({ title, status, insurer }) => {
  const classes = useStyles();
  const steps = ["PENDING", "PROCESSING", "APPROVED", "DISBURSED"];

  return (
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
          <Stepper classes={{ root: classes.stepper }} activeStep={steps.indexOf(status)} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

ClaimRecordAccordion.propTypes = {
  title: PropTypes.string.isRequired,
};

export default ClaimRecordAccordion;
