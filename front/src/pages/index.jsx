"use client";

import React, { useState, useEffect } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import AddIcon from "@mui/icons-material/Add";

import Navbar from "@/components/navbar";
import Bubble from "@/components/bubble/bubble";

import "@/app/globals.css";
import "./styles.css";
import ProjectService from "@/services/requests/project-service";
import projectService from "@/services/requests/project-service";

const ReactGridLayout = WidthProvider(RGL);

const ProjectBoard = () => {
  const [layout, setLayout] = useState([]);
  const [layoutCustomProps, setLayoutCustomProps] = useState([]);
  const [canDragBubbles, setCanDragBubbles] = useState(true);

  useEffect(() => {
    ProjectService.getAll().then((res) => {
      res.data.map((project) => {
        const newItem = {
          x: project.positionX,
          y: project.positionY,
          w: project.width,
          h: project.height,
          i: project.id.toString(),
          minH: 2,
          maxH: 7,
          minW: 2,
          maxW: 5,
        };

        const newCustomProps = {
          bubbleId: project.id.toString(),
          title: project.name,
          color: project.color,
        };

        setLayout((prevLayout) => [...prevLayout, newItem]);
        setLayoutCustomProps((prevCustomProps) => [
          ...prevCustomProps,
          newCustomProps,
        ]);
      });
    });
  }, []);

  const handleAddBubble = async () => {
    var projectId = await ProjectService.create({
      Name: "Projeto Teste",
      Password: "1234",
      PositionY: 5,
      PositionX: 5,
      Width: 100,
      Height: 100,
      Color: "#FFF"
    });

    const newItem = {
      x: 3,
      y: 5,
      w: 2,
      h: 3,
      i: projectId,
      minH: 2,
      maxH: 7,
      minW: 2,
      maxW: 5,
    };

    const newCustomProps = {
      bubbleId: projectId,
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
    setLayout((prevLayout) => prevLayout.filter((item) => item.i !== id));
    ProjectService.deleteAsync(id)
  };

  const handleChangeColor = (id, color) => {
    setLayoutCustomProps((prevBubble) =>
      prevBubble.map((prevBox) => {
        if (prevBox.bubbleId === id) {
          ProjectService.changeColor({ Id: id, Color: color.hex });
          return {
            ...prevBox,
            color: color.hex,
          };
        }
        return prevBox;
      })
    );
  };

  const handleChangeTitle = (id, content) => {
    ProjectService.changeName({
      Id: id,
      Name: content
    });
    
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

  const onResizeStop = (e, v) => {
    const changedProject = e.find(w => w.i == v.i);
    ProjectService.resize({
      Id: changedProject.i,
      Width: changedProject.w,
      Height: changedProject.h,
      PositionX: changedProject.x,
      PositionY: changedProject.y,
    });
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
          onDragStop={onResizeStop}
          onResizeStop={onResizeStop}
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
