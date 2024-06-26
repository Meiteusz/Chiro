import { Grid } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import ClassicButton from "@/components/ui/buttons";

import "./styles.css";

function StartEndDateModal({
  open,
  onConfirm,
  startdate,
  setStartDate,
  endDate,
  setEndDate,
  boardActionId
}) {
  const handleConfirm = () => {
    onConfirm(boardActionId);
  };

  return (
    <Modal
      keepMounted
      open={open}
      //onClose={handleCloseStartEndDateModal}
    >
      <Box className="date-modal">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={6} columns={16}>
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
          <ClassicButton onClick={handleConfirm} title="Confirmar" />
        </div>
      </Box>
    </Modal>
  );
}

export default StartEndDateModal;
