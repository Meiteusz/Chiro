import React, { useEffect, useState } from "react";
import { ChromePicker } from "react-color";
import { BoardActionType } from "@/utils/constants";

import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenBubble from "@mui/icons-material/FolderOpen";
import Compact from "@uiw/react-color-compact";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ScheduleSendIcon from "@mui/icons-material/ScheduleSend";

import "./styles.css";
import "@/app/globals.css";

function Bubble({
  bubble,
  bubbleCustomProps,
  onChangeColor,
  onChangeTitle,
  onSendBubbleToTimeline,
  onDoubleClick,
  onDelete,
  onComplete,
  canDrag,
  canOpen,
  canDelete,
  canComplete,
  delayedTime,
  isTimeline,
}) {
  const [contextMenu, setContextMenu] = useState(null);
  const [OpenChromePicker, setChromePicker] = useState(false);

  const handleContextMenu = (event) => {
    event.preventDefault();

    if (
      event.target.id === bubble.i ||
      event.target.parentElement.id === bubble.i
    ) {
      setContextMenu({
        mouseX: event.clientX - 2,
        mouseY: event.clientY - 4,
      });
      setChromePicker(false);
      canDrag(false);
    } else {
      handleCloseContextMenu();
    }
  };

  const handleSendBubbleToTimeline = () => {
    if (!onSendBubbleToTimeline) return;

    onSendBubbleToTimeline(bubble.i);
    handleCloseContextMenu();
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

  const handleBubbleNameChange = (event, isLeaving) => {
    if (!onChangeTitle) return;

    const newName = event.target.value;
    onChangeTitle(bubble.i, newName, isLeaving);
  };

  const handleBubbleComplete = () => {
    if (!onComplete) return;

    onComplete(bubble.i);
    handleCloseContextMenu();
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
    canDrag(true);
  };

  const isDarkColor = (color) => {
    if (!color) return false;

    if (color === "#000000" || color === "black") return true;

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
      className="container-bubble"
      onContextMenu={handleContextMenu}
      style={{
        height: "100%",
        backgroundColor: bubbleCustomProps.color ?? "black",
        border: bubbleCustomProps.trace
          ? "2px dotted #ddd"
          : bubbleCustomProps.isCompleted
          ? "2px solid #27A304"
          : "none",
        opacity: bubbleCustomProps.trace ? "0.7" : "1",
        overflow: "hidden",
      }}
    >
      {bubbleCustomProps.type == BoardActionType.Link ? (
        <a
          className="cancelSelectorName"
          href={bubbleCustomProps.title}
          target="_blank"
          rel="noreferrer"
        >
          <span
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: isDarkColor(bubbleCustomProps.color) ? "white" : "black",
              fontSize: "18px",
              fontFamily: "Roboto Mono, monospace",
              fontStyle: "italic",
              cursor: "pointer",
              pointerEvents: isTimeline ? "none" : "",
              textDecorationLine: "underline",
            }}
          >
            {bubbleCustomProps.title ?? ""}
          </span>
        </a>
      ) : (
        <input
          autoFocus
          type="text"
          value={bubbleCustomProps.title ?? ""}
          onChange={handleBubbleNameChange}
          onBlur={(event) => handleBubbleNameChange(event, true)}
          onContextMenu={handleContextMenu}
          disabled={canComplete ?? false}
          style={{
            position: "absolute",
            backgroundColor: "transparent",
            border: "none",
            color: isDarkColor(bubbleCustomProps.color) ? "white" : "black",
            width: "100%",
            outline: "none",
            fontSize: "22px",
            textAlign: !isTimeline && "center",
            fontFamily: "Roboto Mono, monospace",
            fontWeight: "bold",
            cursor: "text",
            pointerEvents: isTimeline ? "none" : "",
            padding: "5px",
          }}
        />
      )}
      <div
        onContextMenu={handleContextMenu}
        onDoubleClick={handleDoubleClick}
        style={{
          backgroundColor: "red",
          height: "100%",
          width: "100%",
          borderTopRightRadius: "5px",
          borderBottomRightRadius: "5px",
          marginLeft: `${delayedTime}px`,
          backgroundColor: delayedTime ? "red" : "transparent",
        }}
      >
        {!bubbleCustomProps.isCompleted && (
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
            {!canComplete && (
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
            )}
            {!bubbleCustomProps.trace &&
              !isTimeline &&
              bubbleCustomProps.type != undefined && (
                <MenuItem onClick={handleSendBubbleToTimeline}>
                  <ListItemIcon>
                    <ScheduleSendIcon
                      fontSize="small"
                      style={{ color: "#24B84F" }}
                    />
                  </ListItemIcon>
                  <ListItemText>Timeline</ListItemText>
                </MenuItem>
              )}
            {canOpen && (
              <MenuItem
                disabled={!bubbleCustomProps.title}
                onClick={handleDoubleClick}
              >
                <ListItemIcon>
                  <OpenBubble fontSize="small" />
                </ListItemIcon>
                <ListItemText>Abrir</ListItemText>
              </MenuItem>
            )}
            {!OpenChromePicker && !canComplete && (
              <MenuItem onClick={handleOpenSettingColor}>
                <ListItemIcon>
                  <SettingsSuggestIcon
                    fontSize="small"
                    style={{ color: "#00A2E8" }}
                  />
                </ListItemIcon>
                <ListItemText>Configuração de cores</ListItemText>
              </MenuItem>
            )}
            {canDelete && (
              <MenuItem onClick={handleDeleteBubble}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" style={{ color: "#DB1A21" }} />
                </ListItemIcon>
                <ListItemText>Deletar</ListItemText>
              </MenuItem>
            )}
            {canComplete && (
              <MenuItem onClick={handleBubbleComplete}>
                <ListItemIcon>
                  <CheckBoxIcon fontSize="small" style={{ color: "#27A304" }} />
                </ListItemIcon>
                <ListItemText>Concluir</ListItemText>
              </MenuItem>
            )}
          </Menu>
        )}
      </div>
      {bubbleCustomProps.isCompleted && (
        <CheckCircleIcon
          fontSize="small"
          style={{ color: "#27A304", marginRight: "15px" }}
        />
      )}
    </div>
  );
}

export default Bubble;
