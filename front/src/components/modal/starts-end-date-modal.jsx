import React, { useEffect } from "react";
import { Grid } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import ClassicButton from "@/components/ui/buttons";

import "./styles.css";

function StartEndDateModal({
  open,
  onConfirm,
  onClose,
  startdate,
  setStartDate,
  endDate,
  setEndDate,
}) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <Modal keepMounted open={open} onClose={onClose}>
      <Box className="date-modal">
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={3} columns={16}>
            <Grid item xs={8}>
              <label
                style={{
                  fontSize: "15px",
                  fontWeight: "500",
                }}
              >
                Data Início
              </label>
              <DatePicker
                sx={{ marginTop: "5px" }}
                slotProps={{ textField: { variant: "standard" } }}
                format="DD/MM/YYYY"
                value={startdate}
                onChange={(value) => setStartDate(value)}
              />
            </Grid>
            <Grid item xs={8}>
              <label style={{ fontSize: "15px", fontWeight: "500" }}>
                Data Término
              </label>
              <DatePicker
                sx={{ marginTop: "5px" }}
                slotProps={{ textField: { variant: "standard" } }}
                format="DD/MM/YYYY"
                value={endDate}
                onChange={(value) => setEndDate(value)}
              />
            </Grid>
          </Grid>
        </LocalizationProvider>
        <div className="container-confirm">
          <ClassicButton onClick={onConfirm} title="Confirmar" />
        </div>
      </Box>
    </Modal>
  );
}

export default StartEndDateModal;
