"use client";

import React, { useState } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";

import Navbar from "@/components/navbar";
import Bubble from "@/components/bubble-v2/bubble";
import * as styles from "@/pages/project-board/styles";

import "./styles.css";
import "@/app/globals.css";

const ReactGridLayout = WidthProvider(RGL);

let idCounter = 0;

const getId = () => {
  idCounter++;
  return idCounter.toString();
};

const ProjectBoard = () => {
  const [layout, setLayout] = useState([]);
  const [layoutCustomProps, setLayoutCustomProps] = useState([]);

  const handleAddBubble = () => {
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
      //startsDate: null,
      //endsDate: null,
      //trace: false,
    };

    setLayout((prevLayout) => [...prevLayout, newItem]);
    setLayoutCustomProps((prevCustomProps) => [
      ...prevCustomProps,
      newCustomProps,
    ]);
  };

  const handleChangeColor = (id, color) => {
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
    const url = `http://localhost:3000/project-board?bubbleProjectId=${id}`;
    window.location.href = url;
  };

  const handleDeleteBubble = (id) => {
    setLayout((prevLayout) => prevLayout.filter((item) => item.i !== id));
  };

  return (
    <div>
      <Navbar projectName="Gerenciador de projetos" />
      <IconButton style={styles.addBubble} onClick={handleAddBubble}>
        <AddIcon />
      </IconButton>
      <div>
        <ReactGridLayout
          style={{
            height: "100%",
          }}
          onLayoutChange={(newLayout) => setLayout(newLayout)}
          layout={layout}
          compactType={null}
          isResizable={true}
          margin={[1, 1]}
          rowHeight={25}
          preventCollision={true}
        >
          {layout.map((bubble) => (
            <div
              key={bubble.i}
              className="container-bubble"
              style={{
                backgroundColor:
                  (layoutCustomProps &&
                    layoutCustomProps.find((x) => x.bubbleId === bubble.i)
                      .color) ??
                  "black",
              }}
            >
              <Bubble
                bubble={bubble}
                bubbleCustomProps={
                  layoutCustomProps &&
                  layoutCustomProps.find((x) => x.bubbleId === bubble.i)
                }
                onChangeColor={handleChangeColor}
                onChangeTitle={handleChangeTitle}
                onDoubleClick={handleDoubleClick}
                onDelete={handleDeleteBubble}
              />
            </div>
          ))}
        </ReactGridLayout>
      </div>
    </div>
  );
};

export default ProjectBoard;
