import React, { Fragment } from "react";
import { Button, DialogActions, DialogContent, DialogTitle, Divider, Typography } from "@material-ui/core";

import { formatDateStringWithYear } from "../../utils";

const MedicalRecordSummary = ({ selectedMedicalRecord }) => {
  console.log(selectedMedicalRecord);

  if (!selectedMedicalRecord) {
    return;
  }

  return (
    <Fragment>
      <DialogTitle>{selectedMedicalRecord.recordType}</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          <b>Date uploaded:</b> {formatDateStringWithYear(selectedMedicalRecord.createdAt)}
        </Typography>
        <Typography variant="body1">
          <b>Patient Name:</b> {selectedMedicalRecord.patientId.firstName} {selectedMedicalRecord.patientId.lastName}
        </Typography>
        <Typography variant="body1">
          <b>Patient ID:</b> {selectedMedicalRecord.patientId.identificationNum}
        </Typography>
        <Divider style={{ margin: "8px 0" }} />
        <Typography variant="body1">
          <b>Description:</b>
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {selectedMedicalRecord.recordDetails}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button href={selectedMedicalRecord.fileUrl} target="_blank" color="primary">
          View File
        </Button>
      </DialogActions>
    </Fragment>
  );
};

export default MedicalRecordSummary;
