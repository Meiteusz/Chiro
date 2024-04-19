import React, { useState, useRef } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import "./styles.css";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import * as styles from "@/pages/project-board/styles";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenBubble from '@mui/icons-material/FolderOpen';
import Compact from '@uiw/react-color-compact';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const ReactGridLayout = WidthProvider(RGL);

let idCounter = 0;

const getId = () => {
  idCounter++;
  return idCounter.toString();
};

function BubbleNew ({compactType, isHorizontal, stopBubble}){
  const [layout, setLayout] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedBubbleIds, setSelectedBubbleIds] = useState({});
  const [menuBubbleOptions, setMenuBubbleOptions] = useState(null);
  const menuBubbleOptionsOpened = Boolean(menuBubbleOptions);
  const [bubbleColors, setBubbleColors] = useState({});
  const [currentColor, setCurrentColor] = useState("#000000"); // Estado para armazenar a cor atual selecionada
  const [isColorDialogOpen, setIsColorDialogOpen] = useState(false); 
  const [bubbleNames, setBubbleNames] = useState({});

// Função para atualizar o nome da bolha
const handleBubbleNameChange = (event, bubbleId) => {
  const newName = event.target.value;
  setBubbleNames((prevNames) => ({
    ...prevNames,
    [bubbleId]: newName,
  }));
};
  const resizeHandles = isHorizontal ? ['e'] : [''];

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
    setSelectedBubbleIds({ [bubbleId]: true });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleDeleteBubble = (bubbleId) => {
    setLayout((prevLayout) => prevLayout.filter((item) => item.i !== bubbleId));
    handleCloseContextMenu();
  };

  const handleAddBubble = () => {
    const newItem = { x: 0, y: 0,w: 1.0, h: 2.0, i: getId() };
    setLayout((prevLayout) => [...prevLayout, newItem]);
    setBubbleColors((prevColors) => ({
      ...prevColors,
      [newItem.i]: "black",
    }));
    handleCloseMenuBubbleOptions();
  };

  const handleCloseMenu = () => {
    setContextMenu(null);
  };

  const handleColorPickerToggle = () => {
    setIsColorDialogOpen(!isColorDialogOpen); // Altera o estado do diálogo de cores
    handleCloseMenu();
  };

  const handleColorSelection = (color) => {
    setCurrentColor(color.hex); // Atualiza a cor atual selecionada
    // Atualiza automaticamente a cor da bolha selecionada com a cor atual
    Object.keys(selectedBubbleIds).forEach((bubbleId) => {
      setBubbleColors((prevColors) => ({
        ...prevColors,
        [bubbleId]: color.hex,
      }));
    });
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
        compactType={null} // controlar movimento do layout horizontal e vertical
        isDraggable={!stopBubble}
        isResizable={true}
        resizeHandles={resizeHandles}
        items={5}
        margin={[4, 4]}
        rowHeight={30}
      >
        {layout.map((item) => (
          <div
            key={item.i}
            data-grid={item}
            style={{
              backgroundColor: bubbleColors[item.i] || "black",
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
              onChange={(event) => handleBubbleNameChange(event, item.i)}
              onDoubleClick={() => handleDoubleClick(item.i)}
              onContextMenu={(event) => handleContextMenu(event, item.i)}
            />
          </div>
        ))}
      </ReactGridLayout>

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
        }>
          <Compact color={currentColor} onChange={handleColorSelection}/>
          <ListItemIcon>
            <DriveFileRenameOutlineIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{bubbleNames[Object.keys(selectedBubbleIds)[0]]}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleDeleteBubble(Object.keys(selectedBubbleIds)[0])}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Deletar</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleDoubleClick(Object.keys(selectedBubbleIds)[0])}>
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
