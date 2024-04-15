"use client";

import React, { useState, useRef } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import "./styles.css";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import Navbar from "@/components/navbar";
import * as styles from "@/pages/project-board/styles";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenBubble from '@mui/icons-material/FolderOpen';

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const ReactGridLayout = WidthProvider(RGL);

let idCounter = 0;

const getId = () => {
  idCounter++;
  return idCounter.toString();
};

const BubbleNew = () => {
  const [layout, setLayout] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedBubbleId, setSelectedBubbleId] = useState(null);
  const pickerRef = useRef();
  const [textFieldFocus, setTextFieldFocus] = useState(false);
  const [menuBubbleOptions, setMenuBubbleOptions] = useState(null);
  const menuBubbleOptionsOpened = Boolean(menuBubbleOptions);
  
  const handleOpenMenuBubbleOptions = (event) => {
    setMenuBubbleOptions(event.currentTarget);
  };

  const handleCloseMenuBubbleOptions = () => {
    setMenuBubbleOptions(null);
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
    setLayout((prevLayout) => prevLayout.filter((item) => item.i !== bubbleId));
    handleCloseContextMenu();
  };

  const handleAddBubble = () => {
    const newItem = { x: 0, y: 0, w: 1.0, h: 2.0, i: getId() };
    setLayout((prevLayout) => [...prevLayout, newItem]);
    handleCloseMenuBubbleOptions();
  };

  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);


  const handleCloseMenu = () => {
    setContextMenu(null);
  };


  const handleColorPickerToggle = () => {
    //Implementar color
    setIsColorPickerOpen(!isColorPickerOpen);
    handleCloseMenu();
  };
  
  const redirectToPage = (bubbleId) => {
    const url = `http://localhost:3000/project-board?bubbleProjectId=${bubbleId}`;
    window.location.href = url;
  };

  const handleDoubleClick = (bubbleId) => {
    redirectToPage(bubbleId);
  };


  return (
      <div>
        <IconButton style={styles.addBubble}>
        <AddIcon />
      </IconButton>
      <IconButton
          style={styles.addBubble}
          onClick={handleOpenMenuBubbleOptions}
        >
          <AddIcon />
        </IconButton>
        <Menu
          anchorEl={menuBubbleOptions}
          open={menuBubbleOptionsOpened}
          onClose={handleCloseMenuBubbleOptions}
        >
          <MenuItem onClick={handleAddBubble}>Novo projeto</MenuItem> 
        </Menu>      
          <ReactGridLayout
            style={{ width: '94%', height: '80%' }} 
            onLayoutChange={(newLayout) => setLayout(newLayout)}
            layout={layout}
            isDraggable={true}
            compactType={null}
            isResizable={true}
            items={5}
            margin={[4, 4]}
            rowHeight={30}
          >
            {layout.map((item) => (
              <div
                key={item.i}
                data-grid={item}
                style={{
                  backgroundColor: "black",
                  borderRadius: "10px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "1px",
                  overflow: "auto",
                }}
                onContextMenu={(event) => handleContextMenu(event, item.i)}
                onDoubleClick={() => handleDoubleClick(item.i)}
              >
                <input
                  type="text"
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: "white",
                    textAlign: "center",
                    width: "100%",
                    outline: "none",
                    fontSize: "22px",
                    fontFamily: "Arial, sans-serif",
                    fontWeight: "bold",
                  }}
                  onDoubleClick={() => handleDoubleClick(item.i)}
                  onContextMenu={(event) => handleContextMenu(event, item.i)}
                />
              </div>
            ))}
          </ReactGridLayout>
      {isColorPickerOpen && (
        <div
          ref={pickerRef}
          style={{
            position: "absolute",
          }}
        >
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
      </div>
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
        <MenuItem onClick={handleColorPickerToggle}>
          <ListItemIcon>
            <ColorLensIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Cor</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleDeleteBubble(selectedBubbleId)}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Deletar</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleDoubleClick(selectedBubbleId)}>
          <ListItemIcon>
            <OpenBubble fontSize="small" />
          </ListItemIcon>
          <ListItemText>Abrir</ListItemText>
        </MenuItem>
      </Menu>        
        </div>       
  );
};

export default BubbleNew;
