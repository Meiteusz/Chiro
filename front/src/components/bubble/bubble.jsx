import React, { useState, useEffect, useRef } from "react";
import ColorConfigModal from "@/components/bubble/colorConfigModal";
import DeleteIcon from "@mui/icons-material/Delete";
import { Rnd } from "react-rnd";

import "./styles.css";

function Bubble({ refFromChild, box, boxes, setBoxes, onDragStop }) {
  const bubbleRef = useRef();

  useEffect(() => {
    refFromChild(bubbleRef);
  }, []);

  const handleColorSelect = (color) => {
    setBoxes((prevBoxes) =>
      prevBoxes.map((prevBox) =>
        prevBox.id === box.id
          ? {
              ...prevBox,
              color: color,
            }
          : prevBox
      )
    );
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

  const handleChange = (event) => {
    setBoxes((prevBoxes) =>
      prevBoxes.map((prevBox) =>
        prevBox.id === box.id
          ? {
              ...prevBox,
              content: event.target.value,
            }
          : prevBox
      )
    );
  };

  const handleDragStop = (e, d) => {
    onDragStop(box.id, d.x, d.y);
  };

  const handleDragStart = (e, d) => {
    // Talvez com o método onDragStart do react-rnd a gente consiga salvar
    // a posição atual da bubble para caso tenha cancelamento de data, ela volta para a posição que estava
  };

  return (
    <Rnd
      ref={bubbleRef}
      key={box.id}
      //dragGrid={[50, 50]}
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: box.color ?? "#1F1F1F",
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
          value={box.content ?? ""}
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
