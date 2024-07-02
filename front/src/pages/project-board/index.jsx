"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from 'next/router';
import RGL, { WidthProvider } from "react-grid-layout";
import AddIcon from "@mui/icons-material/Add";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import Navbar from "@/components/navbar";
import Timeline from "@/components/timeline/timeline";
import Bubble from "@/components/bubble/bubble";
import StartEndDateModal from "@/components/modal/starts-end-date-modal";
import BoardActionService from "@/services/requests/board-action-service";
import ProjectService from "@/services/requests/project-service";

import "@/app/globals.css";
import "./styles.css";
import "../styles.css";


const ReactGridLayout = WidthProvider(RGL);

let idCounter = 0;

const getId = () => {
  idCounter++;
  return idCounter.toString();
};

const boardActionType = {
  Text: 0,
  Link: 1,
  Player: 2,
};

function ProjectBoard() {
  const [selectedIdBubble, setSelectedIdBubble] = useState(null);
  const [dateModalOpened, setDateModalOpened] = useState(false);
  const [currentStartsDate, setCurrentStartsDate] = useState(null);
  const [currentEndsDate, setCurrentEndsDate] = useState(null);
  const [canDragBubbles, setCanDragBubbles] = useState(true);
  const [menuBubbleOptions, setMenuBubbleOptions] = useState(null);
  const bubbleRefs = useRef([]);
  const menuBubbleOptionsOpened = Boolean(menuBubbleOptions);

  const [layout, setLayout] = useState([]);
  const [layoutCustomProps, setLayoutCustomProps] = useState([]);

  const [layoutTimeline, setLayoutTimeline] = useState();
  const [layoutCustomPropsTimeline, setLayoutCustomPropsTimeline] = useState();

  const [loadingBoard, setLoadingBoard] = useState();

  const router = useRouter();
  const { bubbleProjectId } = router.query;

  useEffect(() => {
    if (bubbleProjectId) {
      ProjectService.getById(bubbleProjectId).then((res) => {
        res.data.boardActions.forEach((boardAction) => {
          const newItem = {
            i: boardAction.id.toString(),
            w: boardAction.width,
            h: boardAction.height,
            x: boardAction.positionX,
            y: boardAction.positionY,
            minW: 4,
            maxW: 10,
            minH: 2,
            maxH: 5,
          };

          const newCustomProps = {
            bubbleId: boardAction.id.toString(),
            title: boardAction.content,
            color: boardAction.color,
            startsDate: new Date(boardAction.startDate),
            endsDate: new Date(boardAction.endDate),
            trace: false,
          };

          setLayout((prevLayout) => [...prevLayout, newItem]);
          setLayoutCustomProps((prevCustomProps) => [
            ...prevCustomProps,
            newCustomProps,
          ]);
  }, [bubbleProjectId]);

  const handleOpenMenuBubbleOptions = (event) => {
    setMenuBubbleOptions(event.currentTarget);
  };

  const handleCloseMenuBubbleOptions = () => {
    setMenuBubbleOptions(null);
  };

  const handleAddBubble = async (bubbleType) => {
    const newItem = {
      w: 4,
      h: 2,
      x: 10,
      y: 5,
      minW: 4,
      maxW: 10,
      minH: 2,
      maxH: 5,
    };

    const newCustomProps = {
      bubbleId: newItem.i,
      type: bubbleType,
      title: "",
      color: "black",
      startsDate: null,
      endsDate: null,
      trace: false,
    };

    var boardActionId = await BoardActionService.create({
      Content: `Bolha ${boardActionType}`,
      PositionY: newItem.y,
      PositionX: newItem.x,
      Width: newItem.w,
      Height: newItem.h,
      Color: newCustomProps.color,
      StartsDate: newCustomProps.startsDate,
      EndsDate: newCustomProps.endsDate,
      ProjectId: bubbleProjectId
    });

    newItem.i = boardActionId;
    newCustomProps.bubbleId = boardActionId;

    setLayout((prevLayout) => [...prevLayout, newItem]);
    setLayoutCustomProps((prevCustomProps) => [
      ...prevCustomProps,
      newCustomProps,
    ]);
    handleCloseMenuBubbleOptions();
  };

  const handleDeleteBubble = (id) => {
    console.log("Deletando");
    setLayout((prevLayout) => prevLayout.filter((item) => item.i !== id));
    BoardActionService.deleteAsync(id)
  };

  const handleChangeColor = (id, color) => {
    setLayoutCustomProps((prevBubble) =>
      prevBubble.map((prevBox) => {
        if (prevBox.bubbleId === id) {
          BoardActionService.changeColor({ Id: id, Color: color.hex });
          return {
            ...prevBox,
            color: color.hex,
          }
        }
        return prevBox;
      })
    );
  };

  const handleChangeTitle = (id, content) => {
    BoardActionService.changeContent({
      Id: id,
      Content: content
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

  const onBubbleDragStop = (e, v) => {
    if (!isOverlapping(v.i)) {
      const changedBubble = e.find(w => w.i == v.i);
      BoardActionService.resize({
        Id: changedBubble.i,
        Width: changedBubble.w,
        Height: changedBubble.h,
        PositionX: changedBubble.x,
        PositionY: changedBubble.y,
      });
      return;
    }

    setDateModalOpened(true);
    setSelectedIdBubble(v.i);
  };

  const isOverlapping = (bubbleId) => {
    const childElement = document.getElementById(bubbleId);

    if (childElement) {
      const parentElement = childElement.closest('.react-grid-layout');
      if (parentElement) {
        const timelineArea = document.getElementById("timeline-body").getBoundingClientRect();
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
  }

  const handleSendBubbleToTimeline = (id) => {
    if (layoutCustomProps.find((bubble) => bubble.bubbleId === id).trace) {
      return;
    }

    setDateModalOpened(true);
    setSelectedIdBubble(id);
  };

  const calculateOverlapArea = (rect1, rect2) => {
    const x_overlap = Math.max(0, Math.min(rect1.right, rect2.right) - Math.max(rect1.left, rect2.left));
    const y_overlap = Math.max(0, Math.min(rect1.bottom, rect2.bottom) - Math.max(rect1.top, rect2.top));
    return x_overlap * y_overlap;
  }

  const onBubbleResizeStop = (e, v) => {
    const changedBubble = e.find(w => w.i == v.i);
    BoardActionService.resize({
      Id: changedBubble.i,
      Width: changedBubble.w,
      Height: changedBubble.h,
      PositionX: changedBubble.x,
      PositionY: changedBubble.y,
    });
  }

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

      var dataInicial = new Date("2024-01-01");
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

      var selectedBubbleParaRastro = layout.find(
        (x) => x.i === boardActionId
      );
      var selectedBubbleCustomPropsParaRastro = layoutCustomProps.find(
        (x) => x.bubbleId === boardActionId
      );

      setLayout((prevLayout) =>
        prevLayout.filter((item) => item.i !== boardActionId)
      );
      setLayoutCustomProps((prevLayout) =>
        prevLayout.filter((item) => item.bubbleId !== boardActionId)
      );

      // Chamada do endpoint
      BoardActionService.changePeriod({
        Id: boardActionId,
        StartDate: currentStartsDate,
        EndDate: currentEndsDate,
      });

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
      setCurrentStartsDate(null);
      setCurrentEndsDate(null);
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

    setDateModalOpened(false);
  };

  //#endregion
  const onBubbleLoad = (bubble) => {
    console.log({
      Descartado: bubble
    });

    if (!bubble.startDate && !bubble.endDate) {
      return;
    }

    const newItemRastro = {
      w: bubble.width,
      h: bubble.height,
      x: bubble.positionX,
      y: bubble.positionY,
      i: bubble.id.toString(),
      minW: 4,
      maxW: 10,
      minH: 2,
      maxH: 5,
    };

    const newCustomPropsRastro = {
      bubbleId: newItemRastro.i,
      title: bubble.content,
      color: bubble.color,
      startsDate: new Date(bubble.startDate),
      endsDate: new Date(bubble.endDate),
      trace: true,
    };

    setLayout((prevLayout) => [...prevLayout, newItemRastro]);
    setLayoutCustomProps((prevCustomProps) => [
      ...prevCustomProps,
      newCustomPropsRastro,
    ]);
  };

  return (
    <div className="container-boards">
      <Navbar showMenu projectName="Projeto" />
      <div className="top-board">
        <StartEndDateModal
          open={dateModalOpened}
          onClose={handleCloseStartEndDateModal}
          onConfirm={handleConfirmStartEndDate}
          startdate={currentStartsDate}
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
            onClick={() => handleAddBubble(boardActionType.Text)}
          >
            Tarefa
          </MenuItem>
          <MenuItem
            className="menu-item"
            onClick={() => handleAddBubble(boardActionType.Player)}
          >
            Player
          </MenuItem>
          <MenuItem
            className="menu-item"
            onClick={() => handleAddBubble(boardActionType.Link)}
          >
            Link
          </MenuItem>
        </Menu>
        <ReactGridLayout
          isResizable
          preventCollision
          onLayoutChange={(newLayout) => setLayout(newLayout)}
          layout={layout}
          compactType={null}
          isDraggable={canDragBubbles}
          margin={[1, 1]}
          rowHeight={25}
          cols={50}
          containerPadding={[0, 0]}
          maxRows={23.3}
          //maxRows={46}
          onDragStop={onBubbleDragStop}
          onResizeStop={onBubbleResizeStop}
          style={{
            height: "100%",
          }}
        >
          {layout.map((bubble) => (
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
                  layoutCustomProps.find((x) => x.bubbleId === bubble.i)
                }
              />
            </div>
          ))}
        </ReactGridLayout>
      </div>
      <div id="timeline" className="time-line">
        <Timeline
          layoutBubble={layoutTimeline}
          layoutBubbleProps={layoutCustomPropsTimeline}
          bubbleProjectId={bubbleProjectId}
          onBubbleLoad={onBubbleLoad}
          loadingBoard={loadingBoard}
        />
      </div>
    </div>
  );
};

export default ProjectBoard;
