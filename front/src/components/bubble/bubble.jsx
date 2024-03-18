import ColorConfigModal from "@/components/bubble/colorConfigModal";
import { useState, useRef } from "react";
import { Rnd } from "react-rnd";
import DeleteIcon from "@mui/icons-material/Delete";

import "./styles.css";

const style = {
  position: "absolute",
  border: "1px dashed gray",
  padding: "0.5rem 1rem",
  cursor: "move",
  overflow: "hidden",
  width: "200px",
};

function Bubble({ box, boxes, setBoxes, onDragStop }) {
  const [boxColor, setBoxColor] = useState("#1F1F1F");

  const handleColorSelect = (color) => {
    setBoxColor(color);
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
      prevBoxes.map((prevBox) =>
        prevBox.id === id
          ? {
              ...prevBox,
              width: style.width,
              height: style.height,
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

  const handleDragStop = (e, d) => {
    onDragStop(box.id, d.x, d.y);
  };

  return (
    <Rnd
      key={box.id}
      grid={[50, 50]}
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: boxColor,
        paddingBottom: "23px",
        margin: "20px",
      }}
      default={{
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
      }}
      minWidth={190}
      maxWidth={500}
      minHeight={91}
      maxHeight={160}
      bounds="window"
      onDrag={(e, d) => handleDrag(box.id, e, d)}
      onDragStop={handleDragStop}
      onResizeStop={(e, direction, style, delta) =>
        handleResizeStop(box.id, direction, style, delta)
      }
    >
      <div
        style={{
          width: "100%",
          height: "20px",
          borderRadius: "8px",
          justifyContent: "flex-end",
          display: "flex",
          marginTop: "3px",
        }}
      >
        <DeleteIcon
          fontSize="small"
          style={{ cursor: "pointer" }}
          onClick={() =>
            setBoxes((prevBoxes) => prevBoxes.filter((b) => b.id !== box.id))
          }
        />
        <ColorConfigModal onSelectColor={handleColorSelect} left={box.width} />
      </div>
      <div
        style={{
          width: "100%",
          height: "100%",
          borderBottomLeftRadius: "8px",
          borderBottomRightRadius: "8px",
          overflowY: "auto",
        }}
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            background: "none",
            border: "none",
            outline: "none",
            resize: "none",
            color: "#FFFFFF",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "20px",
          }}
        />
      </div>
    </Rnd>
  );
}

export default Bubble;
