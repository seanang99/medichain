import React from "react";

import ClaimRecordAccordion from "./ClaimRecordAccordian";
import MedicalRecordCard from "./MedicalRecordCard";

const Test = () => {
  const testMedicalCard1 = {
    title: "Emergency Medical Record",
    patientName: "Ong Lai Huat",
    fileURL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  };

  const testMedicalCard2 = {
    title: "Emergency Medical Record",
    patientName: "Ong Lai Huat",
    fileURL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    submitClaim: true,
  };

  const testClaimAccordian = {
    title: "Emergency Surgery Claim 1",
    insurer: "AIA Insurance",
    status: "PROCESSING",
  };

  return (
    <React.Fragment>
      <div style={{ maxWidth: "60%" }}>
        <MedicalRecordCard {...testMedicalCard1} />
        <MedicalRecordCard {...testMedicalCard2} />
        <ClaimRecordAccordion {...testClaimAccordian} />
      </div>
    </React.Fragment>
  );
};

export default Test;
