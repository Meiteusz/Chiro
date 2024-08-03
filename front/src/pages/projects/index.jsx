"use client";

import React, { useState, useEffect } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import { useRouter } from "next/router";
import AddIcon from "@mui/icons-material/Add";

import Navbar from "@/components/navbar/navbar";
import Bubble from "@/components/bubble/bubble";
import ProjectService from "@/services/requests/project-service";
import Loading from "@/components/loading/Loading";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import "@/app/globals.css";
import "./styles.css";

const ReactGridLayout = WidthProvider(RGL);

const ProjectBoard = () => {
  const [loading, setLoading] = useState(false);
  const [layout, setLayout] = useState([]);
  const [layoutCustomProps, setLayoutCustomProps] = useState([]);
  const [canDragBubbles, setCanDragBubbles] = useState(true);
  const [defaultScale, setDefaultScale] = useState(1);
  const [canPan, setCanPan] = useState(true);
  const router = useRouter();

  useEffect(() => {
    document.getElementsByClassName(
      "transform-component-module_content__FBWxo"
    )[0].style.transform = "translate(-20000px, -8000px)";
  }, []);

  const handleScroll = (e) => {
    setDefaultScale(e.state.scale);
  };

  useEffect(() => {
    inicializeBubblesLayout();
  }, []);

  const inicializeBubblesLayout = () => {
    setLoading(true);
    ProjectService.getAll()
      .then((res) => {
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
            maxW: 8,
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
      })
      .catch((error) => {
        console.log("Error fetching projects: ", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAddBubble = async () => {
    var projectId = await ProjectService.create({
      Name: "",
      Password: "1234",
      PositionY: 5,
      PositionX: 3,
      Width: 2,
      Height: 3,
      Color: "white",
    });

    const newItem = {
      i: projectId,
      x: 3,
      y: 5,
      w: 2,
      h: 3,
      minW: 2,
      maxW: 10,
      minH: 3,
      maxH: 8,
    };

    const newCustomProps = {
      bubbleId: projectId,
      title: "",
      color: "white",
    };

    setLayout((prevLayout) => [...prevLayout, newItem]);
    setLayoutCustomProps((prevCustomProps) => [
      ...prevCustomProps,
      newCustomProps,
    ]);
  };

  const handleDeleteBubble = (id) => {
    setLayout((prevLayout) => prevLayout.filter((item) => item.i !== id));
    ProjectService.deleteAsync(id);
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

  const handleChangeTitle = (id, content, isLeaving = false) => {
    if (isLeaving) {
      ProjectService.changeName({
        Id: id,
        Name: content,
      });
    }

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
    const url = `project-board?bubbleProjectId=${id}`;
    router.push(url);
  };

  const onUpdateBubble = (e, v) => {
    const changedProject = e.find((w) => w.i == v.i);
    ProjectService.resize({
      Id: changedProject.i,
      Width: changedProject.w,
      Height: changedProject.h,
      PositionX: changedProject.x,
      PositionY: changedProject.y,
    });

    setCanPan(true);
  };

  const onBubbleDragStart = () => {
    setCanPan(false);
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="container-projects">
      <Navbar projectName="Projetos" />
      <button className="add-bubble" onClick={handleAddBubble}>
        <AddIcon />
      </button>
      <div
        style={{
          flex: 1,
        }}
      >
        <TransformWrapper
          defaultScale={defaultScale}
          initialPositionY={1}
          initialPositionX={1}
          panning={{
            disabled: canPan === false,
            velocityDisabled: true,
          }}
          maxScale={5}
          minScale={0.2}
          initialScale={defaultScale}
          onWheel={handleScroll}
          doubleClick={{
            disabled: true,
          }}
          alignmentAnimation={{
            disabled: false,
          }}
          limitToBounds={true}
          centerOnInit={false}
          centerZoomedOut={true}
          disablePadding={false}
        >
          <TransformComponent>
            <ReactGridLayout
              preventCollision
              transformScale={defaultScale}
              className="container-layout"
              onLayoutChange={(newLayout) => setLayout(newLayout)}
              layout={layout}
              compactType={null}
              isResizable={true}
              isDraggable={canDragBubbles}
              margin={[1, 1]}
              rowHeight={10}
              maxRows={636.7}
              cols={1000}
              onDragStop={onUpdateBubble}
              onResizeStop={onUpdateBubble}
              onResizeStart={onBubbleDragStart}
              onDragStart={onBubbleDragStart}
              style={{
                width: "8000px !important",
                height: "7008px !important",
                position: "fixed",
              }}
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
                    onChangeColor={handleChangeColor}
                    onChangeTitle={handleChangeTitle}
                    onDoubleClick={handleDoubleClick}
                    onDelete={handleDeleteBubble}
                    canDrag={setCanDragBubbles}
                    bubble={bubble}
                    bubbleCustomProps={
                      layoutCustomProps &&
                      layoutCustomProps.find((x) => x.bubbleId === bubble.i)
                    }
                  />
                </div>
              ))}
            </ReactGridLayout>
          </TransformComponent>
        </TransformWrapper>
      </div>
    </div>
  );
};

export default ProjectBoard;
