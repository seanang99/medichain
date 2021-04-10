import React, { useState } from "react";
import CreateMedicalRecord from "./HealthCareProvider/CreateMedicalRecord";
import SubmitClaim from "./PolicyHolder/SubmitClaim";

import ClaimRecordAccordion from "./Insurer/ClaimRecordAccordian";
import MedicalRecordCard from "./HealthCareProvider/MedicalRecordCard";
import Blob from "./Blob";
import ApproveRejectDialog from "./Insurer/ApproveRejectDialog";
import ProcessClaims from "./Insurer/ProcessClaims";

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
    remarks: "If someone or something causes inconvenience, they cause problems or difficulties. We apologize for any inconvenience caused during the repairs. The practical inconveniences of long hair are negligible. If someone inconveniences you, they cause problems or difficulties for you.",
    isInsurer: true,
  };

  const [open, setOpen] = useState(false);

  return (
    <div>
      <Blob />
      <div style={{ maxWidth: "60%" }}>
        {/* <SubmitClaim /> */}
        <MedicalRecordCard {...testMedicalCard1} />
        <MedicalRecordCard {...testMedicalCard2} />
        <ClaimRecordAccordion {...testClaimAccordian} />
        {/* <ApproveRejectDialog policyHolderId={"S1234567A"}/> */}
        {/* <ProcessClaims /> */}
      </div>
    </div>
  );
};

export default Test;
