import React, { useEffect, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import dayjs from "dayjs";

import "./styles.css";

function StartEndDateModal({
  open,
  onConfirm,
  onClose,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  boardActionId,
}) {
  const [invalidStartDate, setInvalidStartDate] = useState(false);
  const [invalidEndDate, setInvalidEndDate] = useState(false);

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

  const handleConfirm = () => {
    const currentYear = dayjs().year();

    const isStartDateValid =
      startDate && dayjs(startDate).year() >= currentYear;
    const isEndDateValid =
      endDate &&
      dayjs(endDate).year() >= currentYear &&
      (dayjs(startDate).isBefore(dayjs(endDate)) ||
        dayjs(startDate).isSame(dayjs(endDate)));

    if (!isStartDateValid) {
      setInvalidStartDate(true);
      return;
    }

    if (!isEndDateValid) {
      setInvalidEndDate(true);
      return;
    }

    if (isStartDateValid && isEndDateValid) {
      onConfirm(boardActionId);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 450,
          bgcolor: "#D6DBDC",
          boxShadow: 24,
          padding: "30px 30px 15px 30px",
          borderRadius: "8px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div
              style={{
                display: "flex",
                gap: "40px",
              }}
            >
              <div>
                <DatePicker
                  slotProps={{
                    textField: { variant: "standard" },
                  }}
                  format="DD/MM/YYYY"
                  label="Data de Início"
                  value={startDate}
                  onChange={(value) => setStartDate(value)}
                />
                {invalidStartDate && (
                  <span style={{ color: "red", fontSize: "13px" }}>
                    Data inválida
                  </span>
                )}
              </div>
              <div>
                <DatePicker
                  slotProps={{ textField: { variant: "standard" } }}
                  format="DD/MM/YYYY"
                  label="Data de Término"
                  value={endDate}
                  onChange={(value) => setEndDate(value)}
                />
                {invalidEndDate && (
                  <span style={{ color: "red", fontSize: "13px" }}>
                    Data inválida
                  </span>
                )}
              </div>
            </div>
          </LocalizationProvider>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "30px",
            }}
          >
            <button className="bnt-confirm" onClick={handleConfirm}>
              Confirmar
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
}

export default StartEndDateModal;
