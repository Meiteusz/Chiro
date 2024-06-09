"use client";

import React, { useState } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import AddIcon from "@mui/icons-material/Add";

import Navbar from "@/components/navbar";
import Bubble from "@/components/bubble/bubble";

import "@/app/globals.css";
import "./styles.css";

const ReactGridLayout = WidthProvider(RGL);

let idCounter = 0;

const getId = () => {
  idCounter++;
  return idCounter.toString();
};

const ProjectBoard = () => {
  const [layout, setLayout] = useState([]);
  const [layoutCustomProps, setLayoutCustomProps] = useState([]);
  const [canDragBubbles, setCanDragBubbles] = useState(true);

  const handleAddBubble = () => {
    // Chamada do endpoint

    const newItem = {
      x: 3,
      y: 5,
      w: 2,
      h: 3,
      i: getId(),
      minH: 2,
      maxH: 7,
      minW: 2,
      maxW: 5,
    };

    const newCustomProps = {
      bubbleId: newItem.i,
      title: "",
      color: "black",
    };

    setLayout((prevLayout) => [...prevLayout, newItem]);
    setLayoutCustomProps((prevCustomProps) => [
      ...prevCustomProps,
      newCustomProps,
    ]);
  };

  const handleDeleteBubble = (id) => {
    // Chamada do endpoint

    setLayout((prevLayout) => prevLayout.filter((item) => item.i !== id));
  };

  const handleChangeColor = (id, color) => {
    // Chamada do endpoint

    setLayoutCustomProps((prevBubble) =>
      prevBubble.map((prevBox) =>
        prevBox.bubbleId === id
          ? {
              ...prevBox,
              color: color.hex,
            }
          : prevBox
      )
    );
  };

  const handleChangeTitle = (id, content) => {
    // Chamada do endpoint

    setLayoutCustomProps((prevBubble) =>
      prevBubble.map((prevBox) =>
        prevBox.bubbleId === id
          ? {
              ...prevBox,
              title: content,
            }
          : prevBox
      )
    );
  };

  const handleDoubleClick = (id) => {
    // Chamada do endpoint

    const url = `http://localhost:3000/project-board?bubbleProjectId=${id}`;
    window.location.href = url;
  };

  const onBubbleDragStop = (e) => {
    // Chamada do endpoint
  };

  const onBubbleResizeStop = (e) => {
    // Chamada do endpoint
  };

  return (
    <div>
      <Navbar projectName="Projetos" />
      <button className="add-bubble" onClick={handleAddBubble}>
        <AddIcon />
      </button>
      <div>
        <ReactGridLayout
          className="container-layout"
          onLayoutChange={(newLayout) => setLayout(newLayout)}
          layout={layout}
          compactType={null}
          isResizable={true}
          isDraggable={canDragBubbles}
          margin={[1, 1]}
          rowHeight={25}
          preventCollision={true}
          onDragStop={onBubbleDragStop}
          onResizeStop={onBubbleResizeStop}
        >
          {layout.map((bubble) => (
            <div
              className="container-bubble"
              key={bubble.i}
              style={{
                backgroundColor:
                  (layoutCustomProps &&
                    layoutCustomProps.find((x) => x.bubbleId === bubble.i)
                      .color) ??
                  "black",
              }}
            >
              <Bubble
                canOpen
                canChangeColor
                canDelete
                bubble={bubble}
                bubbleCustomProps={
                  layoutCustomProps &&
                  layoutCustomProps.find((x) => x.bubbleId === bubble.i)
                }
                onChangeColor={handleChangeColor}
                onChangeTitle={handleChangeTitle}
                onDoubleClick={handleDoubleClick}
                onDelete={handleDeleteBubble}
                canDrag={setCanDragBubbles}
              />
            </div>
          ))}
        </ReactGridLayout>
      </div>
    </div>
  );
};

export default ProjectBoard;
