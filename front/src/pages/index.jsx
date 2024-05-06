"use client";

import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";

import Navbar from "@/components/navbar";
import BubbleProject from "@/components/bubble-v2/bubble-project";
import * as styles from "@/pages/project-board/styles";

import "@/app/globals.css";
import BubbleSeparated from "@/components/bubble-v2/bubble-separated";

import RGL, { WidthProvider } from "react-grid-layout";

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
      startsDate: null,
      endsDate: null,
      trace: false,
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
          {layout.map((bubble, index) => (
            <div
              key={bubble.i}
              style={{
                backgroundColor:
                  (layoutCustomProps &&
                    layoutCustomProps.find((x) => x.bubbleId === bubble.i)
                      .color) ??
                  "black",
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
            >
              <BubbleSeparated
                bubble={bubble}
                bubbleCustomProps={
                  layoutCustomProps &&
                  layoutCustomProps.find((x) => x.bubbleId === bubble.i)
                }
                setBubble={setLayout}
                onChangeColor={handleChangeColor}
                onChangeTitle={handleChangeTitle}
              />
            </div>
          ))}
        </ReactGridLayout>
      </div>
    </div>
  );
};

export default ProjectBoard;

//"use client";
//
//import React, { useState } from "react";
//import IconButton from "@mui/material/IconButton";
//import AddIcon from "@mui/icons-material/Add";
//
//import Navbar from "@/components/navbar";
//import BubbleProject from "@/components/bubble-v2/bubble-project";
//import * as styles from "@/pages/project-board/styles";
//
//import "@/app/globals.css";
//import BubbleSeparated from "@/components/bubble-v2/bubble-separated";
//
//import RGL, { WidthProvider } from "react-grid-layout";
//
//const ReactGridLayout = WidthProvider(RGL);
//
//let idCounter = 0;
//
//const getId = () => {
//  idCounter++;
//  return idCounter.toString();
//};
//
//const ProjectBoard = () => {
//  const [layout, setLayout] = useState([]);
//
//  const handleAddBubble = () => {
//    const newItem = {
//      x: 3,
//      y: 5,
//      w: 2,
//      h: 3,
//      i: getId(),
//      minH: 2,
//      maxH: 7,
//      minW: 2,
//      maxW: 10,
//    };
//    setLayout((prevLayout) => [...prevLayout, newItem]);
//  };
//
//  const handleDragStop = () => {};
//
//  return (
//    <div>
//      <Navbar projectName="Gerenciador de projetos" />
//      <IconButton style={styles.addBubble} onClick={handleAddBubble}>
//        <AddIcon />
//      </IconButton>
//      <BubbleProject
//        isHorizontal={false}
//        stopBubble={false}
//        layout={layout}
//        setLayout={setLayout}
//        onDragStop={handleDragStop}
//      ></BubbleProject>
//    </div>
//  );
//};
//
//export default ProjectBoard;
