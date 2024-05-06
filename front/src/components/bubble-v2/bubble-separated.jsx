import React, { useState, useEffect } from "react";

import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenBubble from "@mui/icons-material/FolderOpen";
import Compact from "@uiw/react-color-compact";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

function BubbleSeparated({
  bubble,
  bubbleCustomProps,
  setBubble,
  onChangeColor,
  onChangeTitle,
}) {
  const [contextMenu, setContextMenu] = useState(null);
  const [selectecBubbleId, setSelectedBubbleId] = useState(null);

  const handleContextMenu = (event, bubbleId) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });

    setSelectedBubbleId(bubbleId);
  };

  const startEditing = () => {
    handleCloseContextMenu();
  };

  const handleDoubleClick = () => {
    const url = `http://localhost:3000/project-board?bubbleProjectId=${bubble.i}`;
    window.location.href = url;
  };

  const handleDeleteBubble = () => {
    setBubble((prevLayout) => prevLayout.filter((item) => item.i !== bubble.i));
  };

  const handleColorSelection = (color, bubbleId) => {
    onChangeColor(selectecBubbleId, color);
    handleCloseContextMenu();
  };

  const handleBubbleNameChange = (event, bubbleId) => {
    const newName = event.target.value;
    onChangeTitle(selectecBubbleId, newName);
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
      onContextMenu={(event) => handleContextMenu(event, bubble.i)}
      onDoubleClick={handleDoubleClick}
    >
      <input
        autofocus
        type="text"
        value={bubbleCustomProps.title ?? ""}
        onChange={handleBubbleNameChange}
        onContextMenu={(event) => handleContextMenu(event, bubble.i)}
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
            onChange={(color) => handleColorSelection(color, bubble.i)}
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

export default BubbleSeparated;
