"use client";

import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import MenuIcon from "@mui/icons-material/Menu";

import Bubble from "@/components/bubble/bubble";
import Timeline from "@/components/timeline";

import "../app/globals.css";

function MainBoard() {
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

  const addButtonStyle = {
    margin: "0 30px",
    marginTop: "30px",
    padding: "25px",
    borderRadius: "50%",
    backgroundColor: "#2196f3",
    color: "#fff",
  };

  const [boxes, setBoxes] = useState([]);

  const addBox = () => {
    const lastBox = boxes[boxes.length - 1];
    const initialTop = lastBox ? lastBox.y + lastBox.height : 0;

    setBoxes((prevBoxes) => [
      ...prevBoxes,
      {
        id: new Date().getTime(),
        x: 300,
        y: initialTop,
        width: 180,
        height: 70,
      },
    ]);
  };

  return (
    <div style={containerStyle}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div style={topRowStyle}>
        <IconButton style={addButtonStyle} onClick={addBox}>
          <AddIcon />
        </IconButton>
        {boxes.map((box) => (
          <Bubble key={box.id} box={box} boxes={boxes} setBoxes={setBoxes} />
        ))}
      </div>

      <div style={middleRowStyle}>
        <Timeline />
      </div>

      <div style={rowStyle}></div>
    </div>
  );
}

export default MainBoard;
