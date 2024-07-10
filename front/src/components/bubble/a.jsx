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
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import Tooltip from "@mui/material/Tooltip";

import "./styles.css";
import "@/app/globals.css";

function Bubble({
  bubble,
  bubbleCustomProps,
  onChangeColor,
  onChangeTitle,
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
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipLink, setTooltipLink] = useState("");
  const [fullLink, setFullLink] = useState("");

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

  const handleDoubleClick = () => {
    if (!onDoubleClick) return;

    onDoubleClick(bubble.i);
  };

  const handleOnClick = () => {
    const linkRegex = /https?:\/\/[^\s]+/g;
    const match = bubbleCustomProps.title.match(linkRegex);

    if (match && match[0] && isValidUrl(match[0])) {
      const link = match[0];
      const domain = formatLinkText(link);
      setTooltipLink(domain);
      setFullLink(link); // armazena a URL completa
      console.log(extractUrlFromString(link));
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 4000); // Tooltip will disappear after 4 seconds
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
    console.log("link:", regex);
    return regex.test(url);
  };

  const formatLinkText = (url) => {
    let formattedText = url;

    // Remove o protocolo "https://"
    if (formattedText.startsWith("https://")) {
      formattedText = formattedText.slice(8);
    } else if (formattedText.startsWith("http://")) {
      formattedText = formattedText.slice(7);
    }

    // Remove "www."
    formattedText = formattedText.replace("www.", "");

    // Remove qualquer caminho após o domínio (ex: /path/to/page)
    const index = formattedText.indexOf("/");
    if (index !== -1) {
      formattedText = formattedText.slice(0, index);
    }

    // Remove qualquer parâmetro de query string
    const queryIndex = formattedText.indexOf("?");
    if (queryIndex !== -1) {
      formattedText = formattedText.slice(0, queryIndex);
    }

    // Pega o domínio sem o TLD (ex: youtube)
    const domainParts = formattedText.split(".");
    if (domainParts.length > 2) {
      formattedText = domainParts.slice(-2, -1)[0];
    } else {
      formattedText = domainParts[0];
    }

    return formattedText;
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
    setShowTooltip(false);

    if (!onChangeTitle) return;

    const newName = event.target.value;
    onChangeTitle(bubble.i, newName);
  };

  const handleBubbleComplete = () => {
    if (!onComplete) return;

    onComplete();
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
      onClick={handleOnClick}
      style={{
        height: "100%",
        backgroundColor: bubbleCustomProps.color ?? "black",
        border: bubbleCustomProps.trace
          ? "2px dotted #ddd"
          : bubbleCustomProps.isCompleted
          ? "2px solid #27A304"
          : "none",
        opacity: bubbleCustomProps.trace ? "0.7" : "1",
      }}
    >
      <input
        autoFocus
        type="text"
        value={bubbleCustomProps.title ?? ""}
        onChange={handleBubbleNameChange}
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
          textDecoration: showTooltip ? "underline" : "none",
        }}
      />
      {showTooltip && (
        <a
          href={extractUrlFromString(bubbleCustomProps.title)}
          className="tooltip-link"
        >
          Seguir o link :{extractUrlFromString(bubbleCustomProps.title)}
        </a>
      )}

      <link rel="pingback" href="http://www.example.com/xmlrpc.php" />
      <div
        id={bubble.i}
        onContextMenu={handleContextMenu}
        onClick={bubbleCustomProps.link ? handleLinkClick : undefined}
        onDoubleClick={handleOnClick}
        style={{
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
        {delayedTime && (
          <Tooltip title="Atraso detectado">
            <WarningAmberIcon
              style={{
                color: "black",
                fontSize: "20px",
                position: "absolute",
                right: "25px",
                top: "5px",
                borderRadius: "50%",
              }}
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
