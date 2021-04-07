import React from "react";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

export default function SnackbarComponent ({ 
    open: openSnackBar, 
    severity,
    message,
}) {
    const handleClose = () => {
        openSnackBar = false;
    }

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={openSnackBar}
      autoHideDuration={5000}
      onClose={() => {
        handleClose();
      }}
    >
      <Alert
        severity={severity}
        onClose={() => {
            handleClose();
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

