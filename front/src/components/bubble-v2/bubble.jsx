import React, { useState } from "react";
import { ChromePicker } from "react-color";

import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenBubble from "@mui/icons-material/FolderOpen";
import Compact from "@uiw/react-color-compact";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";

import "./styles.css";
import "@/app/globals.css";

function Bubble({
  bubble,
  bubbleCustomProps,
  onChangeColor,
  onChangeTitle,
  onDoubleClick,
  onDelete,
  canDrag,
}) {
  const [contextMenu, setContextMenu] = useState(null);
  const [OpenChromePicker, setChromePicker] = useState(false);

  const handleContextMenu = (event) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
    setChromePicker(false);
    canDrag(false);
  };

  const handleDoubleClick = () => {
    if (!onDoubleClick) return;

    onDoubleClick(bubble.i);
  };

  const handleDeleteBubble = () => {
    setChromePicker(false);

    if (!onDelete) return;

    onDelete(bubble.i);
    handleCloseContextMenu();
  };

  const handleColorSelection = (color) => {
    if (!onChangeColor) return;

    onChangeColor(bubble.i, color);

    if (!OpenChromePicker) handleCloseContextMenu();
  };

  const handleBubbleNameChange = (event) => {
    if (!onChangeTitle) return;

    const newName = event.target.value;
    onChangeTitle(bubble.i, newName);
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
    canDrag(true);
  };

  const isDarkColor = (color) => {
    if (!color) return false;

    const [r, g, b] = color.match(/\w\w/g).map((x) => parseInt(x, 16));
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
  };

  const handleOpenSettingColor = () => {
    setChromePicker(true);
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
          {OpenChromePicker ? (
            <ChromePicker
              disableAlpha={true}
              color={bubbleCustomProps.color ?? "black"}
              onChange={handleColorSelection}
            />
          ) : (
            <Compact
              color={bubbleCustomProps.color ?? "black"}
              onChange={handleColorSelection}
            />
          )}
        </MenuItem>
        <MenuItem
          disabled={!bubbleCustomProps.title}
          onClick={handleDoubleClick}
        >
          <ListItemIcon>
            <OpenBubble fontSize="small" />
          </ListItemIcon>
          <ListItemText>Abrir</ListItemText>
        </MenuItem>
        {!OpenChromePicker && (
          <MenuItem onClick={handleOpenSettingColor}>
            <ListItemIcon>
              <SettingsSuggestIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Configuração de cores</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={handleDeleteBubble}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Deletar</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
}

export default Bubble;
