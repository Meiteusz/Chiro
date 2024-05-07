import React, { useState } from "react";

import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenBubble from "@mui/icons-material/FolderOpen";
import Compact from "@uiw/react-color-compact";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import "./styles.css";
import "@/app/globals.css";

function Bubble({
  bubble,
  bubbleCustomProps,
  onChangeColor,
  onChangeTitle,
  onDoubleClick,
  onDelete,
}) {
  const [contextMenu, setContextMenu] = useState(null);

  const handleContextMenu = (event) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };

  const startEditing = () => {
    handleCloseContextMenu();
  };

  const handleDoubleClick = () => {
    onDoubleClick(bubble.i);
  };

  const handleDeleteBubble = () => {
    onDelete(bubble.i);
  };

  const handleColorSelection = (color) => {
    onChangeColor(bubble.i, color);
    handleCloseContextMenu();
  };

  const handleBubbleNameChange = (event) => {
    const newName = event.target.value;
    onChangeTitle(bubble.i, newName);
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const isDarkColor = (color) => {
    if (!color) return false;

    const [r, g, b] = color.match(/\w\w/g).map((x) => parseInt(x, 16));
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
  };

  return (
    <div
      id={bubble.i}
      data-grid={bubble}
      onContextMenu={handleContextMenu}
      onDoubleClick={handleDoubleClick}
    >
      <input
        autofocus
        type="text"
        value={bubbleCustomProps.title ?? ""}
        onChange={handleBubbleNameChange}
        onContextMenu={handleContextMenu}
        style={{
          backgroundColor: "transparent",
          border: "none",
          color: isDarkColor(bubbleCustomProps.color) ? "white" : "black",
          textAlign: "center",
          width: "100%",
          outline: "none",
          fontSize: "22px",
          fontFamily: "Roboto Mono, monospace",
          fontWeight: "bold",
          cursor: "text",
        }}
      />
      <Menu
        anchorEl={contextMenu}
        open={contextMenu !== null}
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem
          anchorEl={contextMenu}
          open={contextMenu !== null}
          onClose={handleCloseContextMenu}
          anchorReference="anchorPosition"
          anchorPosition={
            contextMenu !== null
              ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
              : undefined
          }
        >
          <Compact
            color={bubbleCustomProps.color ?? "black"}
            onChange={handleColorSelection}
          />
        </MenuItem>
        <MenuItem onClick={startEditing}>
          <ListItemIcon>
            <DriveFileRenameOutlineIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{bubbleCustomProps.title}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteBubble}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Deletar</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDoubleClick}>
          <ListItemIcon>
            <OpenBubble fontSize="small" />
          </ListItemIcon>
          <ListItemText>Abrir</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
}

export default Bubble;
