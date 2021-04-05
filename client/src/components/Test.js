import React from "react";
import CreateMedicalRecord from "./HealthCareProvider/CreateMedicalRecord";
import SubmitClaim from "./PolicyHolder/SubmitClaim";

import ClaimRecordAccordion from "./Insurer/ClaimRecordAccordian";
import MedicalRecordCard from "./HealthCareProvider/MedicalRecordCard";
import Blob from "./Blob";

const Test = () => {
  const testMedicalCard1 = {
    recordType: "Consultation Report",
    recordDetails: "Emergency Medical Record",
    patientId: "Ong Lai Huat",
    fileURL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  };

  const testMedicalCard2 = {
    recordType: "Consultation Report",
    recordDetails: "Emergency Medical Record",
    patientId: "Ong Lai Huat",
    fileURL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    submitClaim: true,
  };

  const testClaimAccordian = {
    title: "Emergency Surgery Claim 1",
    insurer: "AIA Insurance",
    status: "PROCESSING",
  };

  return (
    <div>
      <Blob />
      <div style={{ maxWidth: "60%" }}>
        {/* <SubmitClaim /> */}
        <MedicalRecordCard {...testMedicalCard1} />
        <MedicalRecordCard {...testMedicalCard2} />
        <ClaimRecordAccordion {...testClaimAccordian} />
      </div>
    </div>
  );
};

export default Test;
