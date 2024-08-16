"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import RGL, { WidthProvider } from "react-grid-layout";
import AddIcon from "@mui/icons-material/Add";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import Navbar from "@/components/navbar/navbar";
import Timeline from "@/components/timeline/timeline";
import Bubble from "@/components/bubble/bubble";
import StartEndDateModal from "@/components/modal/date/starts-end-date-modal";
import BoardActionService from "@/services/requests/board-action-service";
import ProjectService from "@/services/requests/project-service";
import Loading from "@/components/loading/Loading";

import { BoardActionType } from "@/utils/constants";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useError } from "@/components/context/error-network";

import "@/app/globals.css";
import "./styles.css";

import "../../../node_modules/react-grid-layout/css/styles.css";
import dayjs from "dayjs";

const ReactGridLayout = WidthProvider(RGL);

export default function ProjectBoard() {
  const [loading, setLoading] = useState(false);
  const [selectedIdBubble, setSelectedIdBubble] = useState(null);
  const [dateModalOpened, setDateModalOpened] = useState(false);
  const [currentStartsDate, setCurrentStartsDate] = useState(dayjs());
  const [currentEndsDate, setCurrentEndsDate] = useState(dayjs());
  const [canDragBubbles, setCanDragBubbles] = useState(true);
  const [menuBubbleOptions, setMenuBubbleOptions] = useState(null);
  const bubbleRefs = useRef([]);
  const menuBubbleOptionsOpened = Boolean(menuBubbleOptions);

  const [layout, setLayout] = useState([]);
  const [layoutCustomProps, setLayoutCustomProps] = useState([]);

  const [layoutTimeline, setLayoutTimeline] = useState();
  const [layoutCustomPropsTimeline, setLayoutCustomPropsTimeline] = useState();

  const [bubbleBeingDeleted, setBubbleBeingDeleted] = useState();
  const [bubbleContentChanged, setBubbleContentChanged] = useState();
  const [bubbleColorChanged, setBubbleColorChanged] = useState();
  const [projectName, setProjectName] = useState("");
  const [canPan, setCanPan] = useState(true);
  const { setErrorNetwork } = useError();
  const [bubbleProjectId, setBubbleProjectId] = useState(null);
  const [defaultScale, setDefaultScale] = useState(0.2);
  const [isDragging, setIsDragging] = useState(false);
  const [startTimelinePeriod, setStartTimelinePeriod] = useState(null);

  const router = useRouter();
  const { encryptedProjectBoardId } = router.query;

  useEffect(() => {
    const fetchData = async () => {
      if (encryptedProjectBoardId) {
        try {
          const response = await ProjectService.getDecryptProjectId(
            encryptedProjectBoardId
          );
          setBubbleProjectId(response.data);
        } catch (error) {
          console.error("Falha ao descriptografar token:", error);
        }
      }
    };

    fetchData();
  }, [encryptedProjectBoardId]);

  useEffect(() => {
    if (bubbleProjectId) {
      inicializeBubblesBoard();
    }
  }, [bubbleProjectId]);

  const handleScroll = (e) => {
    setDefaultScale(e.state.scale);
  };

  const inicializeBubblesBoard = () => {
    setLoading(true);
    ProjectService.getProjectName(bubbleProjectId)
      .then((res) => {
        setProjectName(res.data);
        setErrorNetwork(null);
      })
      .catch((error) => {
        console.error("Error fetching project name:", error);
        setErrorNetwork(error.code);
      });

    ProjectService.getById(bubbleProjectId)
      .then((res) => {
        setErrorNetwork(null);
        res.data.boardActions.forEach((boardAction) => {
          const newItem = {
            i: boardAction.id.toString(),
            w: boardAction.width,
            h: boardAction.height,
            x: boardAction.positionX,
            y: boardAction.positionY,
            minW: 4,
            maxW: 100,
            minH: 8,
            maxH: 25,
          };

          const newCustomProps = {
            bubbleId: boardAction.id.toString(),
            title: boardAction.content,
            color: boardAction.color,
            type: boardAction.boardActionType,
            startsDate: boardAction.startDate,
            endsDate: boardAction.endDate,
            trace: boardAction.startDate && boardAction.endDate,
          };

          setLayout((prevLayout) => [...prevLayout, newItem]);
          setLayoutCustomProps((prevCustomProps) => [
            ...prevCustomProps,
            newCustomProps,
          ]);
        });
      })
      .catch((error) => {
        console.error("Error fetching bubbles project:", error);
        setErrorNetwork(error.code);
      });
  };

  const handleOpenMenuBubbleOptions = (event) => {
    setMenuBubbleOptions(event.currentTarget);
  };

  const handleCloseMenuBubbleOptions = () => {
    setMenuBubbleOptions(null);
  };

  const handleAddBubble = async (bubbleType) => {
    const newItem = {
      w: 30,
      h: 20,
      x: 50,
      y: 70,
      minW: 20,
      maxW: 60,
      minH: 10,
      maxH: 40,
    };

    const newCustomProps = {
      bubbleId: newItem.i,
      type: bubbleType,
      title: "",
      color: "white",
      startsDate: null,
      endsDate: null,
      trace: false,
    };

    try {
      var boardActionId = await BoardActionService.create({
        Content: newCustomProps.title,
        BoardActionType: newCustomProps.type,
        PositionY: newItem.y,
        PositionX: newItem.x,
        Width: newItem.w,
        Height: newItem.h,
        Color: newCustomProps.color,
        StartsDate: newCustomProps.startsDate,
        EndsDate: newCustomProps.endsDate,
        ProjectId: bubbleProjectId,
      });
      setErrorNetwork(null);
    } catch (error) {
      setErrorNetwork(error.code);
    }

    newItem.i = boardActionId;
    newCustomProps.bubbleId = boardActionId;

    setLayout((prevLayout) => [...prevLayout, newItem]);
    setLayoutCustomProps((prevCustomProps) => [
      ...prevCustomProps,
      newCustomProps,
    ]);
    handleCloseMenuBubbleOptions();
  };

  const handleDeleteBubble = async (id) => {
    const a = layoutCustomProps.filter((item) => item.bubbleId !== id);
    const b = layout.filter((item) => item.i !== id);
    setLayout((prevLayout) => prevLayout.filter((item) => item.i !== id));
    setLayoutCustomProps((prevCustomProps) =>
      prevCustomProps.filter((item) => item.bubbleId !== id)
    );
    setBubbleBeingDeleted(id);

    try {
      await BoardActionService.deleteAsync(id);
      setErrorNetwork(null);
    } catch (error) {
      setErrorNetwork(error.code);
    }
  };

  const handleChangeColor = (id, color) => {
    setLayoutCustomProps((prevBubble) =>
      prevBubble.map((prevBox) => {
        if (prevBox.bubbleId === id) {
          try {
            BoardActionService.changeColor({ Id: id, Color: color.hex });
            setErrorNetwork(null);
          } catch (error) {
            setErrorNetwork(error.code);
          }

          return {
            ...prevBox,
            color: color.hex,
          };
        }
        return prevBox;
      })
    );

    setBubbleColorChanged({
      id: id,
      color: color,
    });
  };

  const handleChangeTitle = async (id, content, isLeaving = false) => {
    if (isLeaving) {
      try {
        await BoardActionService.changeContent({
          Id: id,
          Content: content,
        });

        setErrorNetwork(null);
      } catch (error) {
        setErrorNetwork(error.code);
      }
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

    setBubbleContentChanged({
      id: id,
      content: content,
    });
  };

  const onBubbleDragStart = () => {
    setCanPan(false);
  };

  const onDragging = () => {
    setIsDragging(true);
  };

  const onDraggingStop = () => {
    setIsDragging(false);
  };

  const onBubbleDragStop = async (e, v) => {
    if (!isDragging) {
      return;
    }

    const changedBubble = e.find((w) => w.i == v.i);

    try {
      await BoardActionService.resize({
        Id: changedBubble.i,
        Width: changedBubble.w,
        Height: changedBubble.h,
        PositionX: changedBubble.x,
        PositionY: changedBubble.y,
      });

      setSelectedIdBubble(v.i);
      setCanPan(true);
      setErrorNetwork(null);
    } catch (error) {
      setErrorNetwork(error.code);
    }

    onDraggingStop();
  };

  const isOverlapping = (bubbleId) => {
    const childElement = document.getElementById(bubbleId);

    if (childElement) {
      const parentElement = childElement.closest(".react-grid-layout");
      if (parentElement) {
        const timelineArea = document
          .getElementById("timeline-body")
          .getBoundingClientRect();
        const bubbleArea = childElement.getBoundingClientRect();

        const overlapArea = calculateOverlapArea(timelineArea, bubbleArea);
        const bubbleAreaTotal = bubbleArea.width * bubbleArea.height;
        return overlapArea >= 0.9 * bubbleAreaTotal;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const handleSendBubbleToTimeline = (id) => {
    if (layoutCustomProps.find((bubble) => bubble.bubbleId === id).trace) {
      return;
    }

    setDateModalOpened(true);
    setSelectedIdBubble(id);
  };

  const calculateOverlapArea = (rect1, rect2) => {
    const x_overlap = Math.max(
      0,
      Math.min(rect1.right, rect2.right) - Math.max(rect1.left, rect2.left)
    );
    const y_overlap = Math.max(
      0,
      Math.min(rect1.bottom, rect2.bottom) - Math.max(rect1.top, rect2.top)
    );
    return x_overlap * y_overlap;
  };

  const onBubbleResizeStop = async (e, v) => {
    if (!isDragging) {
      return;
    }

    const changedBubble = e.find((w) => w.i == v.i);

    try {
      await BoardActionService.resize({
        Id: changedBubble.i,
        Width: changedBubble.w,
        Height: changedBubble.h,
        PositionX: changedBubble.x,
        PositionY: changedBubble.y,
      });

      setErrorNetwork(null);
    } catch (error) {
      setErrorNetwork(error.code);
    }

    setCanPan(true);
    onDraggingStop();
  };

  //#region ConfirmStartEndDate
  const handleConfirmStartEndDate = (boardActionId) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };

    if (currentStartsDate && currentEndsDate) {
      var diferencaEmMilissegundos = Math.abs(
        currentEndsDate - currentStartsDate
      );

      var diferencaEmDias = Math.ceil(
        diferencaEmMilissegundos / (1000 * 60 * 60 * 24) + 1
      );

      var dataInicial = new Date(`${startTimelinePeriod}-01-01`);
      var diasComeco = Math.abs(currentStartsDate - dataInicial);
      var diasDif = Math.floor(diasComeco / (1000 * 60 * 60 * 24));
      var selectedBubbleCustomProps = layoutCustomProps.find(
        (x) => x.bubbleId === boardActionId
      );

      const newItem = {
        x: diasDif,
        y: 0,
        w: diferencaEmDias,
        h: 1,
        i: boardActionId.toString(),
      };

      const newCustomProps = {
        bubbleId: newItem.i,
        type: selectedBubbleCustomProps.type,
        title: selectedBubbleCustomProps.title,
        color: selectedBubbleCustomProps.color,
        startsDate: currentStartsDate,
        endsDate: currentEndsDate,
        trace: false,
      };

      setLayoutTimeline(newItem);
      setLayoutCustomPropsTimeline(newCustomProps);

      var selectedBubbleParaRastro = layout.find((x) => x.i === boardActionId);
      var selectedBubbleCustomPropsParaRastro = layoutCustomProps.find(
        (x) => x.bubbleId === boardActionId
      );

      setLayout((prevLayout) =>
        prevLayout.filter((item) => item.i !== boardActionId)
      );
      setLayoutCustomProps((prevLayout) =>
        prevLayout.filter((item) => item.bubbleId !== boardActionId)
      );

      //#region Criação da bolha de rastro
      const newItemRastro = {
        w: selectedBubbleParaRastro.w,
        h: selectedBubbleParaRastro.h,
        x: selectedBubbleParaRastro.x,
        y: selectedBubbleParaRastro.y,
        i: selectedBubbleParaRastro.i,
        minW: selectedBubbleParaRastro.minW,
        maxW: selectedBubbleParaRastro.maxW,
        minH: selectedBubbleParaRastro.minH,
        maxH: selectedBubbleParaRastro.maxH,
      };

      const newCustomPropsRastro = {
        bubbleId: selectedBubbleParaRastro.i,
        title: selectedBubbleCustomPropsParaRastro.title,
        color: selectedBubbleCustomPropsParaRastro.color,
        startsDate: selectedBubbleCustomPropsParaRastro.startsDate,
        endsDate: selectedBubbleCustomPropsParaRastro.endsDate,
        trace: true,
      };

      setLayout((prevLayout) => [...prevLayout, newItemRastro]);
      setLayoutCustomProps((prevCustomProps) => [
        ...prevCustomProps,
        newCustomPropsRastro,
      ]);

      //#endregion
      setCurrentStartsDate(dayjs());
      setCurrentEndsDate(dayjs());
      setDateModalOpened(false);
    }
  };
  //#endregion

  //#region CloseStartEndDateModal
  const handleCloseStartEndDateModal = (event, reason) => {
    //if (!reason) {
    //  setDateModalOpened(false);
    //  return;
    //}
    //
    //let startsDate = bubbles.find((x) => x.id === selectedIdBubble).startsDate;
    //let endsDate = bubbles.find((x) => x.id === selectedIdBubble).endsDate;
    //
    //if (
    //  !startsDate ||
    //  isNaN(new Date(startsDate)) ||
    //  !endsDate ||
    //  isNaN(new Date(endsDate))
    //) {
    //  const bubbleIndex = bubbles.findIndex(
    //    (bubble) => bubble.id === selectedIdBubble
    //  );
    //
    //  if (bubbleIndex !== -1) {
    //    const bubbleRef = bubbleRefs.current[bubbleIndex];
    //    if (bubbleRef && bubbleRef.current) {
    //      bubbleRef.current.updatePosition({
    //        x:
    //          bubbles.find((x) => x.id === selectedIdBubble).lastPositionX ??
    //          300,
    //        y:
    //          bubbles.find((x) => x.id === selectedIdBubble).lastPositionY ??
    //          20,
    //      });
    //    }
    //  }
    //
    //  setBubbles((prevBoxes) =>
    //    prevBoxes.map((box) =>
    //      box.id === selectedIdBubble
    //        ? {
    //          ...box,
    //          x:
    //            bubbles.find((x) => x.id === selectedIdBubble)
    //              .lastPositionX ?? 300,
    //          y:
    //            bubbles.find((x) => x.id === selectedIdBubble)
    //              .lastPositionY ?? 20,
    //        }
    //        : box
    //    )
    //  );
    //
    //  setCurrentStartsDate(null);
    //  setCurrentEndsDate(null);
    //}

    setCurrentStartsDate(dayjs());
    setCurrentEndsDate(dayjs());
    setDateModalOpened(false);
  };

  //#endregion

  //#region onBubbleLoad
  const onBubbleLoad = (bubbles) => {
    const newLayout = [];
    const newLayoutCustomProps = [];
    bubbles.forEach((bubble) => {
      newLayout.push({
        w: bubble.width,
        h: bubble.height,
        x: bubble.positionX,
        y: bubble.positionY,
        i: bubble.id.toString(),
        minW: 4,
        maxW: 100,
        minH: 8,
        maxH: 25,
      });

      newLayoutCustomProps.push({
        bubbleId: bubble.id.toString(),
        title: bubble.content,
        color: bubble.color,
        startsDate: new Date(bubble.startDate),
        endsDate: new Date(bubble.endDate),
        trace: bubble.timelineRow != null,
        type: bubble.boardActionType,
      });
    });

    setLayout(newLayout);
    setLayoutCustomProps(newLayoutCustomProps);
  };
  //#endregion

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <Navbar showMenu projectName={projectName} projectId={bubbleProjectId} />
      <div className="container-boards">
        <div className="top-board">
          <StartEndDateModal
            open={dateModalOpened}
            onClose={handleCloseStartEndDateModal}
            onConfirm={handleConfirmStartEndDate}
            startDate={currentStartsDate}
            setStartDate={setCurrentStartsDate}
            endDate={currentEndsDate}
            setEndDate={setCurrentEndsDate}
            boardActionId={selectedIdBubble}
          />
          <button className="add-bubble" onClick={handleOpenMenuBubbleOptions}>
            <AddIcon />
          </button>
          <Menu
            anchorEl={menuBubbleOptions}
            open={menuBubbleOptionsOpened}
            onClose={handleCloseMenuBubbleOptions}
          >
            <MenuItem
              className="menu-item"
              onClick={() => handleAddBubble(BoardActionType.Text)}
            >
              Tarefa
            </MenuItem>
            <MenuItem
              className="menu-item"
              onClick={() => handleAddBubble(BoardActionType.Player)}
            >
              Player
            </MenuItem>
            <MenuItem
              className="menu-item"
              onClick={() => handleAddBubble(BoardActionType.Link)}
            >
              Link
            </MenuItem>
          </Menu>

          <TransformWrapper
            defaultScale={defaultScale}
            initialPositionY={1}
            initialPositionX={1}
            panning={{
              disabled: canPan === false,
              velocityDisabled: true,
              excluded: ["input"],
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
                transformScale={defaultScale}
                isResizable
                preventCollision
                onLayoutChange={(newLayout) => setLayout(newLayout)}
                layout={layout}
                compactType={null}
                isDraggable={canDragBubbles}
                margin={[1, 1]}
                rowHeight={10}
                cols={1000}
                maxRows={636.7}
                onDrag={onDragging}
                onDragStop={onBubbleDragStop}
                onDragStart={onBubbleDragStart}
                onResize={onDragging}
                onResizeStop={onBubbleResizeStop}
                onResizeStart={onBubbleDragStart}
                style={{
                  width: "8000px !important",
                  height: "7008px !important",
                  position: "fixed",
                }}
              >
                {layout
                  .filter(
                    (bubble, index, self) =>
                      index === self.findIndex((t) => t.i === bubble.i)
                  )
                  .map((bubble) => {
                    return (
                      <div key={bubble.i} style={{ borderRadius: "5px" }}>
                        <Bubble
                          canChangeColor
                          canDelete
                          onSendBubbleToTimeline={handleSendBubbleToTimeline}
                          onChangeColor={handleChangeColor}
                          onChangeTitle={handleChangeTitle}
                          onDelete={handleDeleteBubble}
                          canDrag={setCanDragBubbles}
                          bubble={bubble}
                          bubbleCustomProps={
                            layoutCustomProps &&
                            layoutCustomProps.find(
                              (x) => x.bubbleId === bubble.i
                            )
                          }
                        />
                      </div>
                    );
                  })}
              </ReactGridLayout>
            </TransformComponent>
          </TransformWrapper>
        </div>
        {bubbleProjectId && (
          <div id="timeline" className="time-line">
            <Timeline
              layoutBubble={layoutTimeline}
              layoutBubbleProps={layoutCustomPropsTimeline}
              bubbleProjectId={bubbleProjectId}
              //onBubbleLoad={onBubbleLoad}
              bubbleBeingDeleted={bubbleBeingDeleted}
              onContentChanged={bubbleContentChanged}
              onColorChanged={bubbleColorChanged}
              setLoading={setLoading}
              setStartTimelinePeriodParam={setStartTimelinePeriod}
            />
          </div>
        )}
      </div>
    </div>
  );
}
