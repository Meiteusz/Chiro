import React, { useEffect, useState } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import DeleteIcon from "@mui/icons-material/Delete";
import Compact from "@uiw/react-color-compact";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import "./styles.css";
import "@/app/globals.css";

const ReactGridLayout = WidthProvider(RGL);

// Esse componente é o layout completo juntamente com o componente que faz a bubble, vamo fazer algum jeito para separar isso

// props da bubble

// x: posicao horizontal
// y: posicao vertical
// w: largura
// h: altura
// i: key da bubble (id)
// static: pode movimentar/redimensionar ou nao
// minH / maxH: altura minima / maxima
// minW / maxW: largura minima / maxima

// props custom da bubble

// bubbleId: referencia para uma bubble,
// title: título da bubble,
// color: cor da bubble,
// startsDate: data de inicio da bubble,
// endsDate: data de término da bubble,
// trace: é copia de bubble que ja foi pra timeline?,

function BubbleTask({
  isHorizontal,
  stopBubble,
  layout,
  setLayout,
  cols,
  margin,
  onDragStop,
  onResizeStart,
  onResizeStop,
  onDragStart,
  onDrop,
  onChangeColor,
  onChangeTitle,
  onLayoutChange,
  layoutProps,
  maxRows,
  rowHeight,
}) {
  const [contextMenu, setContextMenu] = useState(null);
  const [selectecBubbleId, setSelectedBubbleId] = useState(null);

  const startEditing = () => {
    handleCloseContextMenu();
  };

  const handleContextMenu = (event, bubbleId) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
    setSelectedBubbleId(bubbleId);
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleDeleteBubble = (bubbleId) => {
    setLayout((prevLayout) =>
      prevLayout.filter((item) => item.i !== selectecBubbleId)
    );
    handleCloseContextMenu();
  };

  const handleColorSelection = (color, bubbleId) => {
    onChangeColor(selectecBubbleId, color);
    handleCloseContextMenu();
  };

  const handleBubbleNameChange = (event, bubbleId) => {
    const newName = event.target.value;
    onChangeTitle(selectecBubbleId, newName);
  };

  const isDarkColor = (color) => {
    if (!color) return false;

    const [r, g, b] = color.match(/\w\w/g).map((x) => parseInt(x, 16));
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
  };

  return (
    <div>
      <div
      //style={{
      //  backgroundColor: "transparent",
      //  width: "100%",
      //  height: "500px",
      //  backgroundImage:
      //    "repeating-linear-gradient(#ccc 0 1px, transparent 1px 100%), repeating-linear-gradient(90deg, #ccc 0 1px, transparent 1px 100%)",
      //  backgroundSize: "80px 50px", // matriz
      //}}
      >
        <ReactGridLayout
          style={{
            height: "100%",
          }}
          onDragStop={onDragStop}
          onResizeStart={onResizeStart}
          onResizeStop={onResizeStop}
          onDragStart={onDragStart}
          onDrop={onDrop}
          onLayoutChange={onLayoutChange}
          layout={layout}
          compactType={null}
          isDraggable={!stopBubble}
          isResizable={true}
          resizeHandles={isHorizontal ? ["e"] : [""]}
          items={5}
          margin={margin ?? [1, 1]}
          containerPadding={[0, 0]}
          rowHeight={rowHeight ?? 25}
          maxRows={maxRows ?? 46}
          preventCollision={true}
          cols={cols}
        >
          {layout.map((item) => (
            <div
              id={item.i}
              key={item.i}
              data-grid={item}
              style={{
                backgroundColor:
                  (layoutProps &&
                    layoutProps.find((x) => x.bubbleId === item.i).color) ??
                  "black",
                borderRadius: "5px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "1px",
                //overflow: "auto",
                cursor: "grab",
                //border: `1px solid`,
                zIndex: "999",
                opacity:
                  (layoutProps &&
                  layoutProps.find((x) => x.bubbleId === item.i).trace
                    ? "0.7"
                    : "1") ?? "1",
                border:
                  layoutProps &&
                  layoutProps.find((x) => x.bubbleId === item.i).trace
                    ? "5px dotted #ddd"
                    : "1px solid",
              }}
              onContextMenu={(event) => handleContextMenu(event, item.i)}
            >
              <input
                autofocus
                type="text"
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  color: isDarkColor(
                    layoutProps &&
                      layoutProps.find((x) => x.bubbleId === item.i).color
                  )
                    ? "white"
                    : "black",
                  textAlign: "center",
                  width: "100%",
                  outline: "none",
                  fontSize: "22px",
                  fontFamily: "Roboto Mono, monospace",
                  fontWeight: "bold",
                  cursor: "text",
                }}
                value={
                  (layoutProps &&
                    layoutProps.find((x) => x.bubbleId === item.i).title) ??
                  ""
                }
                onChange={(event) => handleBubbleNameChange(event, item.i)}
                onContextMenu={(event) => handleContextMenu(event, item.i)}
                onClick={() => setSelectedBubbleId(item.i)}
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
                    color={
                      layoutProps &&
                      layoutProps.find((x) => x.bubbleId === item.i).color
                    }
                    onChange={(color) => handleColorSelection(color, item.i)}
                  />
                </MenuItem>
                <MenuItem onClick={startEditing}>
                  <ListItemIcon>
                    <DriveFileRenameOutlineIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>
                    {layoutProps &&
                      layoutProps.find((x) => x.bubbleId === item.i).title}
                  </ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleDeleteBubble(item.i)}>
                  <ListItemIcon>
                    <DeleteIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Deletar</ListItemText>
                </MenuItem>
              </Menu>
            </div>
          ))}
        </ReactGridLayout>
      </div>
    </div>
  );
}

export default BubbleTask;
