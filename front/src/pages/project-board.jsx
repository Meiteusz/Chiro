"use client";

import React, { useState, useEffect, useRef } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Bubble from "@/components/bubble/bubble";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Grid } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { usePost } from "@/services/api-methods";
import { ENDPOINTS } from "@/services/endpoints";

import "../app/globals.css";
import ClassicButton from "@/components/ui/buttons";

// CSS - Passar para arquivo

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  height: "100vh",
};

const rowStyle = {
  display: "flex",
  flex: 1,
  border: "1px solid white",
};

const topRowStyle = {
  ...rowStyle,
  position: "relative",
  display: "block",
  flex: 1,
};

const middleRowStyle = {
  ...rowStyle,
  flex: 0.05,
};

const bottomRowStyle = {
  ...rowStyle,
};

const addButtonStyle = {
  margin: "0 30px",
  marginTop: "30px",
  padding: "25px",
  borderRadius: "50%",
  backgroundColor: "#2196f3",
  color: "#fff",
};

const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 380,
  bgcolor: "background.paper",
  color: "#1F1F1F",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  padding: "30px 20px 30px 30px",
  borderRadius: "10px",
};

//

function ProjectBoard() {
  //const { isLoading, data, execute } = usePost(ENDPOINTS.controller.metodo, {
  //  prop1: "valor",
  //  prop2: "valor",
  //});

  const [bubbles, setBubbles] = useState([]);
  const [selectedIdBubble, setSelectedIdBubble] = useState(null);
  const [isBubbleInRow, setIsBubbleInRow] = useState(false);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentStartsDate, setCurrentStartsDate] = useState(null);
  const [currentEndsDate, setCurrentEndsDate] = useState(null);
  const openMenu = Boolean(anchorEl);
  const bubbleRefs = useRef([]);

  const handleOpen = () => setOpen(true);

  const addBox = () => {
    // y = vertical
    // x = horizontal

    // Bubble valores default
    const newBubbleRef = React.createRef();
    setBubbles((prevbubbles) => [
      ...prevbubbles,
      {
        id: new Date().getTime(),
        content: "",
        color: "#1F1F1F",
        x: 300,
        y: 20,
        width: 190,
        height: 91,
        startsDate: null,
        endsDate: null,
        lastPositionX: 300,
        lastPositionY: 20,
      },
    ]);
    bubbleRefs.current.push(newBubbleRef);
  };

  const onBubbleDragStop = (id, x, y) => {
    const rowDiv = document.getElementById("bottomRowStyle");
    if (rowDiv) {
      const rowRect = rowDiv.getBoundingClientRect();
      const buffer = 65;
      if (
        x >= rowRect.left - buffer &&
        x <= rowRect.right + buffer &&
        y >= rowRect.top - buffer &&
        y <= rowRect.bottom + buffer
      ) {
        setIsBubbleInRow(true);
        handleOpen();
        setSelectedIdBubble(id);
      } else {
        setIsBubbleInRow(false);
      }
    }
  };

  const handleSubmit = () => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };

    if (
      !currentStartsDate ||
      isNaN(new Date(currentStartsDate)) ||
      !currentEndsDate ||
      isNaN(new Date(currentEndsDate))
    ) {
      const bubbleIndex = bubbles.findIndex(
        (bubble) => bubble.id === selectedIdBubble
      );

      if (bubbleIndex !== -1) {
        const bubbleRef = bubbleRefs.current[bubbleIndex];
        if (bubbleRef && bubbleRef.current) {
          bubbleRef.current.updatePosition({
            x:
              bubbles.find((x) => x.id === selectedIdBubble).lastPositionX ??
              300,
            y:
              bubbles.find((x) => x.id === selectedIdBubble).lastPositionY ??
              20,
          });
        }
      }

      setBubbles((prevBoxes) =>
        prevBoxes.map((box) =>
          box.id === selectedIdBubble
            ? {
                ...box,
                x:
                  bubbles.find((x) => x.id === selectedIdBubble)
                    .lastPositionX ?? 300,
                y:
                  bubbles.find((x) => x.id === selectedIdBubble)
                    .lastPositionY ?? 20,
              }
            : box
        )
      );
    }

    setBubbles((prevBubbles) =>
      prevBubbles.map((prevBubble) =>
        prevBubble.id === selectedIdBubble
          ? {
              ...prevBubble,
              startsDate: new Date(currentStartsDate),
              endsDate: new Date(currentEndsDate),
            }
          : prevBubble
      )
    );

    const selectedBubbleInfo = bubbles.find((x) => x.id === selectedIdBubble);

    console.log(
      `Informações da bolha: ${JSON.stringify(
        selectedBubbleInfo
      )}\nAtividade definida para começar ${new Date(
        currentStartsDate
      ).toLocaleDateString("pt-BR", options)} e terminar ${new Date(
        currentEndsDate
      ).toLocaleDateString("pt-BR", options)}`
    );

    setCurrentStartsDate(null);
    setCurrentEndsDate(null);
    handleClose();
  };

  const handleClose = (event, reason) => {
    if (!reason) {
      setOpen(false);
      return;
    }

    let startsDate = bubbles.find((x) => x.id === selectedIdBubble).startsDate;
    let endsDate = bubbles.find((x) => x.id === selectedIdBubble).endsDate;

    if (
      !startsDate ||
      isNaN(new Date(startsDate)) ||
      !endsDate ||
      isNaN(new Date(endsDate))
    ) {
      const bubbleIndex = bubbles.findIndex(
        (bubble) => bubble.id === selectedIdBubble
      );

      if (bubbleIndex !== -1) {
        const bubbleRef = bubbleRefs.current[bubbleIndex];
        if (bubbleRef && bubbleRef.current) {
          bubbleRef.current.updatePosition({
            x:
              bubbles.find((x) => x.id === selectedIdBubble).lastPositionX ??
              300,
            y:
              bubbles.find((x) => x.id === selectedIdBubble).lastPositionY ??
              20,
          });
        }
      }

      setBubbles((prevBoxes) =>
        prevBoxes.map((box) =>
          box.id === selectedIdBubble
            ? {
                ...box,
                x:
                  bubbles.find((x) => x.id === selectedIdBubble)
                    .lastPositionX ?? 300,
                y:
                  bubbles.find((x) => x.id === selectedIdBubble)
                    .lastPositionY ?? 20,
              }
            : box
        )
      );

      setCurrentStartsDate(null);
      setCurrentEndsDate(null);
    }

    setOpen(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const ModalComponente = () => {
    return (
      <Modal keepMounted open={open} onClose={handleClose}>
        <Box sx={styleModal}>
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
                  value={currentStartsDate}
                  onChange={(value) => setCurrentStartsDate(value)}
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
                  value={currentEndsDate}
                  onChange={(value) => setCurrentEndsDate(value)}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "30px",
            }}
          >
            <ClassicButton onClick={handleSubmit} title="Confirmar" />
          </div>
        </Box>
      </Modal>
    );
  };

  return (
    <div style={containerStyle}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleClick}
          >
            <MenuIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu}>
            <MenuItem onClick={() => window.location.replace("/")}>
              Novo Projeto
            </MenuItem>
            <MenuItem onClick={() => window.location.replace("/")}>
              Ver Projetos
            </MenuItem>
            <MenuItem onClick={handleCloseMenu}>Criar Link</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <div style={topRowStyle}>
        <ModalComponente />
        <IconButton style={addButtonStyle} onClick={addBox}>
          <AddIcon />
        </IconButton>
        {bubbles.map((box, index) => (
          <Bubble
            bubbleRef={bubbleRefs.current[index]}
            key={box.id}
            box={box}
            boxes={bubbles}
            setBoxes={setBubbles}
            onDragStop={onBubbleDragStop}
          />
        ))}
      </div>
      {/* 
      <div style={middleRowStyle}>
        <Timeline 
      </div>
        */}
      <div id="bottomRowStyle" style={bottomRowStyle}></div>
    </div>
  );
}

export default ProjectBoard;
