"use client";

import React, { useState, useRef } from "react";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Bubble from "@/components/bubble/bubble";
import ClassicButton from "@/components/ui/buttons";
import Navbar from "@/components/navbar";
import Timeline from "@/components/timeline";
import * as styles from "@/pages/project-board/styles";
import { Grid } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import "@/app/globals.css";

function ProjectBoard() {
  const [bubbles, setBubbles] = useState([]);
  const [selectedIdBubble, setSelectedIdBubble] = useState(null);
  const [dateModalOpened, setDateModalOpened] = useState(false);
  const [currentStartsDate, setCurrentStartsDate] = useState(null);
  const [currentEndsDate, setCurrentEndsDate] = useState(null);
  const [menuBubbleOptions, setMenuBubbleOptions] = useState(null);
  const bubbleRefs = useRef([]);
  const menuBubbleOptionsOpened = Boolean(menuBubbleOptions);

  const handleOpenMenuBubbleOptions = (event) => {
    setMenuBubbleOptions(event.currentTarget);
  };

  const handleCloseMenuBubbleOptions = () => {
    setMenuBubbleOptions(null);
  };

  const handleAddBubble = () => {
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
        height: 70,
        // propriedades abaixo nao vao para a requisição
        startsDate: null,
        endsDate: null,
        lastPositionX: 300,
        lastPositionY: 20,
        grid: null,
        borderTeste: false,
      },
    ]);
    bubbleRefs.current.push(newBubbleRef);
    handleCloseMenuBubbleOptions();
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
        setDateModalOpened(true);
        setSelectedIdBubble(id);
        setBubbles((prevBubbles) =>
          prevBubbles.map((prevBubble) =>
            prevBubble.id === selectedIdBubble
              ? {
                  ...prevBubble,
                  grid: [67, 60],
                }
              : prevBubble
          )
        );
      } else {
        setBubbles((prevBubbles) =>
          prevBubbles.map((prevBubble) =>
            prevBubble.id === selectedIdBubble
              ? {
                  ...prevBubble,
                  grid: null,
                }
              : prevBubble
          )
        );
      }
    }
  };

  const handleConfirmStartEndDate = () => {
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

    // Ao passar a bubble para a timeline, a bubble será duplica
    setBubbles((prevbubbles) => [
      ...prevbubbles,
      {
        id: new Date().getTime(),
        content: "",
        color: "#1F1F1F",
        x: selectedBubbleInfo.lastPositionX,
        y: selectedBubbleInfo.lastPositionY,
        width: 190,
        height: 70,
        // propriedades abaixo nao vao para a requisição
        startsDate: null,
        endsDate: null,
        lastPositionX: selectedBubbleInfo.lastPositionX,
        lastPositionY: selectedBubbleInfo.lastPositionY,
        grid: null,
        borderTeste: true,
      },
    ]);

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
    handleCloseStartEndDateModal();
  };

  const handleCloseStartEndDateModal = (event, reason) => {
    if (!reason) {
      setDateModalOpened(false);
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

    setDateModalOpened(false);
  };

  const StartsEndDateModal = () => {
    return (
      <Modal
        keepMounted
        open={dateModalOpened}
        onClose={handleCloseStartEndDateModal}
      >
        <Box sx={styles.dateModal}>
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
            <ClassicButton
              onClick={handleConfirmStartEndDate}
              title="Confirmar"
            />
          </div>
        </Box>
      </Modal>
    );
  };

  const divStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(4, 67px)",
    gridTemplateRows: "repeat(3, 40px)",
  };

  const cellStyle = {
    backgroundColor: "transparent",
    border: "1px solid black",
  };

  return (
    <div style={styles.containerBoards}>
      <Navbar />
      <div style={styles.topBoard}>
        <StartsEndDateModal />
        <IconButton
          style={styles.addBubble}
          onClick={handleOpenMenuBubbleOptions}
        >
          <AddIcon />
        </IconButton>
        <Menu
          anchorEl={menuBubbleOptions}
          open={menuBubbleOptionsOpened}
          onClose={handleCloseMenuBubbleOptions}
        >
          <MenuItem onClick={handleAddBubble}>Tarefa</MenuItem>
          <MenuItem onClick={handleAddBubble}>Player</MenuItem>
          <MenuItem onClick={handleAddBubble}>Link</MenuItem>
        </Menu>
        {bubbles.map((box, index) => (
          <Bubble
            grid={box.grid}
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
        <div style={styles.timeLine}>
        <Timeline />
      </div>
        */}
      <div id="bottomRowStyle" style={styles.bottomBoard}>
        <div style={divStyle}>
          <div style={cellStyle}></div>
          <div style={cellStyle}></div>
          <div style={cellStyle}></div>
          <div style={cellStyle}></div>
        </div>
        <div style={divStyle}>
          <div style={cellStyle}></div>
          <div style={cellStyle}></div>
          <div style={cellStyle}></div>
          <div style={cellStyle}></div>
        </div>
        <div style={divStyle}>
          <div style={cellStyle}></div>
          <div style={cellStyle}></div>
          <div style={cellStyle}></div>
          <div style={cellStyle}></div>
        </div>
        <div style={divStyle}>
          <div style={cellStyle}></div>
          <div style={cellStyle}></div>
          <div style={cellStyle}></div>
          <div style={cellStyle}></div>
        </div>
        <div style={divStyle}>
          <div style={cellStyle}></div>
          <div style={cellStyle}></div>
          <div style={cellStyle}></div>
          <div style={cellStyle}></div>
        </div>
        <div style={divStyle}>
          <div style={cellStyle}></div>
          <div style={cellStyle}></div>
          <div style={cellStyle}></div>
          <div style={cellStyle}></div>
        </div>
      </div>
    </div>
  );
}

export default ProjectBoard;
