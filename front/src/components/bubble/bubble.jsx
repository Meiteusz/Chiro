import React, { useState } from "react";
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
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import Tooltip from "@mui/material/Tooltip";

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
  notAuthenticate,
}) {
  const [contextMenu, setContextMenu] = useState(null);
  const [OpenChromePicker, setChromePicker] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleContextMenu = (event) => {
    if (notAuthenticate) {
      return;
    }
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
    if (notAuthenticate) {
      return;
    }

    if (!onSendBubbleToTimeline) return;

    onSendBubbleToTimeline(bubble.i);
    handleCloseContextMenu();
  };

  const handleDoubleClick = () => {
    if (!onDoubleClick) return;

    if (notAuthenticate) {
      return;
    }

    onDoubleClick(bubble.i);
  };

  const handleOnClick = () => {
    const linkRegex = /https?:\/\/[^\s]+/g;
    const match = bubbleCustomProps.title.match(linkRegex);

    if (match && match[0] && isValidUrl(match[0])) {
      const link = match[0];
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
    }
  };

  const extractUrlFromString = (text) => {
    const linkRegex = /(?:https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    const match = text.match(linkRegex);

    if (match && match.length > 0) {
      return match[0];
    }

    return null;
  };

  const isValidUrl = (url) => {
    const regex =
      /^(https?:\/\/)?((([a-zA-Z\d]([a-zA-Z\d-]*[a-zA-Z\d])*)\.)+[a-zA-Z]{2,}|\d{1,3}(\.\d{1,3}){3})(:\d+)?(\/[-a-zA-Z\d%_.~+]*)*(\?[;&a-zA-Z\d%_.~+=-]*)?(#[-a-zA-Z\d_]*)?$/;
    return regex.test(url);
  };

  const handleDeleteBubble = () => {
    if (notAuthenticate) {
      return;
    }

    setChromePicker(false);

    if (!onDelete) return;

    onDelete(bubble.i);
    handleCloseContextMenu();
  };

  const handleColorSelection = (color) => {
    if (notAuthenticate) {
      return;
    }

    if (!onChangeColor) return;

    onChangeColor(bubble.i, color);

    if (!OpenChromePicker) handleCloseContextMenu();
  };

  const handleBubbleNameChange = (event, isLeaving) => {
    setShowTooltip(false);

    if (notAuthenticate) {
      return;
    }

    if (!onChangeTitle) return;

    const newName = event.target.value;
    onChangeTitle(bubble.i, newName, isLeaving);
  };

  const handleBubbleComplete = () => {
    if (notAuthenticate) {
      return;
    }

    if (!onComplete) return;

    onComplete(bubble.i);
    handleCloseContextMenu();
  };

  const handleCloseContextMenu = () => {
    if (notAuthenticate) {
      return;
    }

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
    if (notAuthenticate) {
      return;
    }

    setChromePicker(true);
  };

  return (
    <div
      id={bubble.i}
      className="container-bubble"
      onContextMenu={handleContextMenu}
      style={{
        height: "100%",
        backgroundColor: bubbleCustomProps.color ?? "white",
        border: bubbleCustomProps.trace
          ? "2px dotted #ddd"
          : bubbleCustomProps.isCompleted
          ? "2px solid #27A304"
          : "none",
        opacity: bubbleCustomProps.trace ? "0.7" : "1",
        overflow: "hidden",
      }}
    >
      <input
        autoFocus
        type="text"
        value={bubbleCustomProps.title ?? ""}
        onChange={handleBubbleNameChange}
        onBlur={(event) => handleBubbleNameChange(event, true)}
        onContextMenu={handleContextMenu}
        disabled={canComplete ?? false}
        //onMouseEnter={handleOnClick}
        style={{
          position: "absolute",
          backgroundColor: "transparent",
          border: "none",
          color: isDarkColor(bubbleCustomProps.color) ? "white" : "black",
          width: "100%",
          outline: "none",
          fontSize:
            bubbleCustomProps.type == BoardActionType.Link ? "16px" : "22px",
          textAlign: !isTimeline && "center",
          fontFamily: "Roboto Mono, monospace",
          fontWeight: "bold",
          cursor: "text",
          pointerEvents: isTimeline ? "none" : "",
          padding: "5px",
          fontStyle: showTooltip ? "italic" : "none",
        }}
      />
      {showTooltip && bubbleCustomProps.type == BoardActionType.Link && (
        <a
          href={extractUrlFromString(bubbleCustomProps.title)}
          className="tooltip-link"
          target="_blank"
          rel="noreferrer"
        >
          <span>Seguir o link: </span>
          {extractUrlFromString(bubbleCustomProps.title)}
        </a>
      )}
      <div
        id={bubble.i}
        onContextMenu={handleContextMenu}
        style={{
          backgroundColor: "red",
          height: "100%",
          width: "100%",
          borderTopRightRadius: "5px",
          borderBottomRightRadius: "5px",
          marginLeft: `${delayedTime}px`,
          backgroundColor: delayedTime ? "red" : "transparent",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: delayedTime ? "1px solid black" : "none",
        }}
      >
        {delayedTime > 0 && (
          <Tooltip title="Atraso detectado">
            <WarningAmberIcon
              fontSize="small"
              style={{ marginRight: "15px" }}
            />
          </Tooltip>
        )}
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
                    color={bubbleCustomProps.color ?? "white"}
                    onChange={handleColorSelection}
                  />
                ) : (
                  <Compact
                    color={bubbleCustomProps.color ?? "white"}
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
        <Tooltip title="Concluído">
          <CheckCircleIcon
            fontSize="small"
            style={{ color: "#27A304", marginRight: "15px" }}
          />
        </Tooltip>
      )}
    </div>
  );
}

export default Bubble;
