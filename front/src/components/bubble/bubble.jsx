import React, { useState } from "react";
import ColorPicker from "@/components/bubble/colorPicker";
import { Rnd } from "react-rnd";
import SettingsIcon from "@mui/icons-material/Settings";
import { TextField } from "@mui/material";

const style = {
  position: "absolute",
  border: "1px dashed gray",
  padding: "0.5rem 1rem",
  cursor: "move",
  overflow: "hidden",
  width: "200px",
};

function Bubble({ box, boxes, setBoxes }) {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [boxColor, setBoxColor] = useState("#DEDEDE");
  const [text, setText] = useState("");

  const handleColorPickerToggle = () => {
    setIsColorPickerOpen(!isColorPickerOpen);
  };

  const handleColorSelect = (color) => {
    setBoxColor(color);
    setIsColorPickerOpen(false);
  };

  const handleDrag = (id, e, d) => {
    const isOverlap = boxes.some(
      (box) =>
        id !== box.id &&
        d.x < box.x + box.width &&
        d.x + boxes.find((b) => b.id === id).width > box.x &&
        d.y < box.y + box.height &&
        d.y + boxes.find((b) => b.id === id).height > box.y
    );

    if (isOverlap) {
      console.log("overlaped");
    }

    setBoxes((prevBoxes) =>
      prevBoxes.map((box) => (box.id === id ? { ...box, x: d.x, y: d.y } : box))
    );
  };

  const handleResizeStop = (id, direction, style, delta) => {
    setBoxes((prevBoxes) =>
      prevBoxes.map((box) =>
        box.id === id
          ? { ...box, width: style.width, height: style.height }
          : box
      )
    );
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  return (
    <Rnd
      key={box.id}
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        backgroundColor: boxColor,
        color: "black",
      }}
      default={{
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
      }}
      minWidth={180}
      maxWidth={500}
      minHeight={70}
      maxHeight={160}
      bounds="parent"
      onDrag={(e, d) => handleDrag(box.id, e, d)}
      onResizeStop={(e, direction, style, delta) =>
        handleResizeStop(box.id, direction, style, delta)
      }
    >
      <TextField
        multiline
        fullWidth
        variant="standard"
        value={text}
        onChange={handleTextChange}
        InputProps={{
          disableUnderline: true,
          style: {
            color: "#FFFFFF",
            textAlign: "center",
            fontWeight: "bold",
          },
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "5px",
          right: "5px",
          cursor: "pointer",
          color: "#FFFF",
          marginLeft: "20px",
        }}
        onClick={handleColorPickerToggle}
      >
        <SettingsIcon />
      </div>
      {isColorPickerOpen && (
        <ColorPicker
          onSelect={handleColorSelect}
          position={{ top: 20, left: style.width }}
        />
      )}
    </Rnd>
  );
}

export default Bubble;
