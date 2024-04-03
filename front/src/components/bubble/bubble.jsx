import Menu from "@mui/material/Menu";
import Paper from "@mui/material/Paper";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import DeleteIcon from "@mui/icons-material/Delete";
import { Rnd } from "react-rnd";
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

  const [contextMenu, setContextMenu] = useState(null);

  const handleOpenMenuButtons = (event) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null
    );
  };

  const handleCloseMenu = () => {
    setContextMenu(null);
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

  const [textFieldFocus, setTextFieldFocus] = useState(false);

  return (
    <Rnd
      ref={bubbleRef}
      key={box.id}
      dragGrid={box.grid}
      //dragGrid={[50, 50]}
      style={{
        border: box.borderTeste ? "5px dotted #ddd" : "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: box.color ?? "#1F1F1F",
        margin: "20px",
        opacity: box.borderTeste ? "0.7" : "1",
      }}
      default={{
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
      }}
      dragAxis={box.startsDate && box.endsDate ? "x" : "both"}
      minWidth={190}
      maxWidth={500}
      minHeight={70}
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
            top: box.height ? box.height + 8 : 78,
            //left: box.width,
            //marginLeft: "20px",
          }}
        >
          <TwitterPicker onChange={handleChangeComplete} />
        </div>
      )}
      <div
        onDoubleClick={() => setTextFieldFocus(true)}
        style={{
          width: "100%",
          height: "100%",
          borderBottomLeftRadius: "8px",
          borderBottomRightRadius: "8px",
        }}
      >
        <textarea
          autoFocus={textFieldFocus}
          value={box.content ?? ""}
          onChange={handleChange}
          onMouseDown={(e) => {
            //setTextFieldFocus(!textFieldFocus);
          }}
          onMouseLeave={(e) => {
            //e.stopPropagation();
            //setTextFieldFocus(!textFieldFocus);
          }}
          style={{
            width: "100%",
            height: "100%",
            background: "none",
            border: "none",
            outline: "none",
            resize: "none",
            color: "#FFFFFF",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "20px",
            //cursor: (textFieldFocus ? "text" : "move") ?? "move",
          }}
        />
      </div>

      <Paper sx={{ width: 320, maxWidth: "100%" }}>
        <Menu
          anchorEl={contextMenu}
          open={contextMenu !== null}
          onClose={handleCloseMenu}
          anchorReference="anchorPosition"
          anchorPosition={
            contextMenu !== null
              ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
              : undefined
          }
        >
          <MenuItem onClick={handleColorPickerToggle}>
            <ListItemIcon>
              <ColorLensIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Cor</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() =>
              setBoxes((prevBoxes) => prevBoxes.filter((b) => b.id !== box.id))
            }
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Deletar</ListItemText>
          </MenuItem>
        </Menu>
      </Paper>
    </Rnd>
  );
}

export default Bubble;
