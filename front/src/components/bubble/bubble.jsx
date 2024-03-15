import React, { useState, useRef } from "react";
import ColorPicker from "@/components/bubble/colorPicker";
import { Rnd } from "react-rnd";
import SettingsIcon from "@mui/icons-material/Settings";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";

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
    // Calcula a altura mínima necessária com base no conteúdo do TextField
    const textField = document.getElementById(`textfield-${id}`);
    const textHeight = textField ? textField.scrollHeight : 0;
    const minHeight = Math.max(70, textHeight + 20); // 20 é uma folga para garantir que o texto não fique espremido

    setBoxes((prevBoxes) =>
      prevBoxes.map((prevBox) =>
        prevBox.id === id
          ? {
              ...prevBox,
              width: style.width,
              height: Math.max(style.height, minHeight),
            }
          : prevBox
      )
    );
  };

  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  const handleChange = (event) => {
    setText(event.target.value);
    // Ajusta a altura da textarea conforme o conteúdo
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;

    setBoxes((prevBoxes) =>
      prevBoxes.map((prevBox) =>
        prevBox.id === box.id
          ? {
              ...prevBox,
              height: textareaRef.current.style.height,
            }
          : prevBox
      )
    );
  };
  // onMouseDown={(e) => e.stopPropagation()}  <- FAZ O  CANCELAMENTO DO DRAG NA TEXTFIELD

  return (
    <Rnd
      key={box.id}
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        backgroundColor: boxColor,
        color: "black",
        display: "inline-block",
        padding: "10px 40px 0px 10px",
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
      <textarea
        ref={textareaRef}
        variant="standard"
        value={text}
        onChange={handleChange}
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          background: "none",
          minHeight: "50px",
          border: "none",
          outline: "none",
          //marginLeft: "15px",
          //marginRight: "30px",
          resize: "none",
          overflow: "hidden",
          color: "#FFFFFF",
          textAlign: "center",
          fontWeight: "bold",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "5px",
          right: "5px",
          cursor: "pointer",
          color: "#FFFF",
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
