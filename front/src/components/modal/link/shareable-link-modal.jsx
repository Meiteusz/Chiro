import React, { useState, useRef } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import { Modal, Box, Button, Typography } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

import "./styles.css";

function ShareableLinkModal({ open, url, setOpen }) {
  const handleClose = () => setOpen(false);
  const textFieldRef = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleCopy = () => {
    if (url) {
      navigator.clipboard.writeText(url);
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 1000);
    }
  };

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
          top: "45%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 550,
          bgcolor: "#D6DBDC",
          color: "#1C1C1C",
          boxShadow: 24,
          p: 4,
          borderRadius: "10px",
          padding: "2.5rem",
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <h3
            style={{
              fontWeight: "700",
              fontSize: "1.313rem",
              lineHeight: "130%",
              margin: "0",
            }}
          >
            Link compartilhável
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-end",
              gap: ".75rem",
            }}
          >
            <div className="divtes">
              <input
                type="text"
                className="teste"
                label="Link"
                disabled
                fullWidth
                value={url}
                inputRef={textFieldRef}
              />
            </div>
            <Tooltip
              placement="top"
              open={showTooltip}
              title="Copiado!"
              componentsProps={{
                tooltip: {
                  sx: {
                    backgroundColor: "#22B14C",
                    margin: 0,
                  },
                },
              }}
              slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, -5],
                      },
                    },
                  ],
                },
              }}
            >
              <button className="custom-button" onClick={handleCopy}>
                <ContentCopyIcon
                  fontSize="small"
                  sx={{ fontSize: "15px", marginRight: "5px" }}
                />
                Copiar link
              </button>
            </Tooltip>
          </div>
          <div
            style={{
              borderTop: "1px solid #1C1C1C",
              padding: ".5rem .5rem 0",
              fontWeight: "500",
              fontSize: ".75rem",
              lineHeight: "150%",
            }}
          >
            <span style={{ fontSize: "15px" }}>⚠️</span>
            <span>
              Este link permite que outros visualizem o projeto em modo de
              leitura, sem a possibilidade de edição.
            </span>
          </div>
        </div>
      </Box>
    </Modal>
  );
}

export default ShareableLinkModal;
