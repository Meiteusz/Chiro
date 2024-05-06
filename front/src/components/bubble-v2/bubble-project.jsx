import React, { useState } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
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

const ReactGridLayout = WidthProvider(RGL);

function BubbleProject({
  stopBubble,
  layout,
  setLayout,
  onDragStop,
  onChangeColor,
  onChangeTitle,
  onLayoutChange,
}) {
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedBubbleIds, setSelectedBubbleIds] = useState({});
  const [bubbleColors, setBubbleColors] = useState({});
  const [currentColor, setCurrentColor] = useState("#000000");
  const [bubbleNames, setBubbleNames] = useState({});

  const startEditing = () => {
    handleCloseContextMenu();
  };

  const handleContextMenu = (event, bubbleId) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
    setSelectedBubbleIds({ [bubbleId]: true });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleDeleteBubble = (bubbleId) => {
    setLayout((prevLayout) => prevLayout.filter((item) => item.i !== bubbleId));
    handleCloseContextMenu();
  };

  const handleColorSelection = (color) => {
    setCurrentColor(color.hex);
    Object.keys(selectedBubbleIds).forEach((bubbleId) => {
      setBubbleColors((prevColors) => ({
        ...prevColors,
        [bubbleId]: color.hex,
      }));
    });
    handleCloseContextMenu();
  };

  const redirectToPage = (bubbleId) => {
    const url = `http://localhost:3000/project-board?bubbleProjectId=${bubbleId}`;
    window.location.href = url;
  };

  const handleDoubleClick = (bubbleId) => {
    redirectToPage(bubbleId);
  };

  const handleBubbleNameChange = (event, bubbleId) => {
    const newName = event.target.value;
    setBubbleNames((prevNames) => ({
      ...prevNames,
      [bubbleId]: newName,
    }));
  };

  const isDarkColor = (color) => {
    const [r, g, b] = color.match(/\w\w/g).map((x) => parseInt(x, 16));
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
  };

  return (
    <div>
      <ReactGridLayout
        style={{
          height: "100%",
        }}
        onLayoutChange={(newLayout) => setLayout(newLayout)}
        onDragStop={onDragStop}
        layout={layout}
        compactType={null}
        isDraggable={!stopBubble}
        isResizable={true}
        items={5}
        margin={[1, 1]}
        rowHeight={25}
        maxRows={46}
        preventCollision={true}
        cols={24}
      >
        {layout.map((item) => (
          <div
            id={item.i}
            key={item.i}
            data-grid={item}
            style={{
              backgroundColor: bubbleColors[item.i] || "black",
              borderRadius: "5px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "1px",
              overflow: "auto",
              cursor: "grab",
              border: `1px solid`,
              zIndex: "999",
            }}
            onContextMenu={(event) => handleContextMenu(event, item.i)}
            onDoubleClick={() => handleDoubleClick(item.i)}
          >
            <input
              autofocus
              type="text"
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: isDarkColor(currentColor) ? "white" : "black",
                textAlign: "center",
                width: "100%",
                outline: "none",
                fontSize: "22px",
                fontFamily: "Roboto Mono, monospace",
                fontWeight: "bold",
                cursor: "text",
              }}
              onChange={(event) => handleBubbleNameChange(event, item.i)}
              onContextMenu={(event) => handleContextMenu(event, item.i)}
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
                <Compact color={currentColor} onChange={handleColorSelection} />
              </MenuItem>
              <MenuItem onClick={startEditing}>
                <ListItemIcon>
                  <DriveFileRenameOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>
                  {bubbleNames[Object.keys(selectedBubbleIds)[0]]}
                </ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() =>
                  handleDeleteBubble(Object.keys(selectedBubbleIds)[0])
                }
              >
                <ListItemIcon>
                  <DeleteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Deletar</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() =>
                  handleDoubleClick(Object.keys(selectedBubbleIds)[0])
                }
              >
                <ListItemIcon>
                  <OpenBubble fontSize="small" />
                </ListItemIcon>
                <ListItemText>Abrir</ListItemText>
              </MenuItem>
            </Menu>
          </div>
        ))}
      </ReactGridLayout>
    </div>
  );
}

export default BubbleProject;
