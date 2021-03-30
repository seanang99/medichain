import React from "react";
import MedicalRecordCard from "./MedicalRecordCard";

const Test = () => {
  const testMedicalCard = {
    title: "Emergency Medical Record",
    patientName: "Ong Lai Huat",
    fileURL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  };

  return (
    <React.Fragment>
      <div style={{ maxWidth: "60%" }}>
        <MedicalRecordCard {...testMedicalCard} />
      </div>
    </React.Fragment>
  );
};

export default Test;
