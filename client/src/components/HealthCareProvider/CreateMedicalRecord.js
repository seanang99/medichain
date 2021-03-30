import React, { useState, useEffect} from 'react'
import axios from "axios";
import { } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    root:{
      height: '100vh',
    },
    paper: {
      margin: theme.spacing(12, 4),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    upload: {
        backgroundColor: "75C4E0",
    }
    
  }));

export default function CreateMedicalRecord() {

    const classes = useStyles();

    // Attribute of medical records
    const [patientName, setPatientName] = useState("");
    const [patientId, setPatientId] = useState("");
    const [healthcareProviderId, setHealthCareProviderId] = useState("");
    const [recordType, setRecordType] = useState("");
    const [recordDetails, setrRcordDetails] = useState("");
    const [totalAmt, setTotalAmt] = useState(0);
    const [fileURL, setFileURl] = useState("");

    // Uploading Files


    const createNewMedicalRecord = (e) => {
        e.preventDefault();

        axios
        .post("url", medicalRecord)
        .then((res) => {
            var record = res.data
            setPatientName("");
            setPatientId("");
            setHealthCareProviderId("");
            setRecordType("");
            setrRcordDetails("");
            setTotalAmt(null);
            setFileURl("");
        })
        .catch((error) => {
            console.log(error.response.data);
        });
    }

    return (
        <div>
            
        </div>
    )
}
