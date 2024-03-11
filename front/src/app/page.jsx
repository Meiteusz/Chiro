"use client";

import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import Box from "@/components/Box";
import Calendar from "@/components/calendar";

import "./globals.css";

export default function Home() {
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
    margin: "100px 100px",
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
      <div style={topRowStyle}>
        <IconButton style={addButtonStyle} onClick={addBox}>
          <AddIcon />
        </IconButton>
        {boxes.map((box) => (
          <Box key={box.id} box={box} boxes={boxes} setBoxes={setBoxes} />
        ))}
      </div>
      <div style={middleRowStyle}>
        <Calendar />
      </div>
      <div style={rowStyle}></div>
    </div>
  );
}
