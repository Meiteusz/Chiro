import ColorConfigModal from "@/components/bubble/colorConfigModal";
import DeleteIcon from "@mui/icons-material/Delete";
import { Rnd } from "react-rnd";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import SettingsIcon from "@mui/icons-material/Settings";
import { useRef, useEffect, useState } from "react";
import { TwitterPicker } from "react-color";

import "./styles.css";

function Bubble({ bubbleRef, box, boxes, setBoxes, onDragStop }) {
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
    setBoxes((prevBoxes) =>
      prevBoxes.map((prevBox) =>
        prevBox.id === box.id
          ? {
              ...prevBox,
              lastPositionX: d.x,
              lastPositionY: d.y,
            }
          : prevBox
      )
    );
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleOpenMenuButtons = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const pickerRef = useRef();
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const handleColorPickerToggle = () => {
    setIsColorPickerOpen(!isColorPickerOpen);
    handleCloseMenu();
  };

  const handleClickOutside = (event) => {
    if (pickerRef.current && !pickerRef.current.contains(event.target)) {
      setIsColorPickerOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChangeComplete = (color) => {
    handleColorSelect(color.hex);
    setIsColorPickerOpen(false);
  };

  return (
    <Rnd
      ref={bubbleRef}
      key={box.id}
      dragGrid={box.grid}
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
      minHeight={60}
      maxHeight={160}
      bounds="window"
      onDrag={(e, d) => handleDrag(box.id, e, d)}
      onDragStop={handleDragStop}
      onDragStart={handleDragStart}
      onResizeStop={(e, direction, style, delta) =>
        handleResizeStop(box.id, direction, style, delta)
      }
      onContextMenu={(e) => {
        e.preventDefault();
        handleOpenMenuButtons(e);
      }}
    >
      {isColorPickerOpen && (
        <div
          ref={pickerRef}
          style={{
            position: "absolute",
            top: 0,
            left: box.width,
            marginLeft: "20px",
          }}
        >
          <TwitterPicker onChange={handleChangeComplete} />
        </div>
      )}
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
      <Menu anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu}>
        <MenuItem
          onClick={() =>
            setBoxes((prevBoxes) => prevBoxes.filter((b) => b.id !== box.id))
          }
        >
          Deletar
        </MenuItem>
        <MenuItem onClick={handleColorPickerToggle}>Cor</MenuItem>
      </Menu>
    </Rnd>
  );
}

export default Bubble;
