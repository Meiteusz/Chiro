import { Modal, Box } from "@mui/material";

import "./styles.css";

function DeleteDialog({ open, handleClose, handleConfirm }) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 450,
          bgcolor: "#D6DBDC",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          textAlign: "center",
          padding: "10px",
        }}
      >
        <div className="icon-container">
          <img src="/icons/warning-icon.svg" alt="Warning" className="icon" />
        </div>
        <h2 className="modal-title">Tem certeza?</h2>
        <p className="modal-description">
          Esta ação é irreversível. O projeto e suas bolhas serão excluídos.
        </p>
        <div className="button-container">
          <button className="base-btn cancel" onClick={handleClose}>
            Cancelar
          </button>
          <button className="base-btn delete" onClick={handleConfirm}>
            Deletar
          </button>
        </div>
      </Box>
    </Modal>
  );
}

export default DeleteDialog;
