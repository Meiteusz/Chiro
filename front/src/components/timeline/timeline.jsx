import { useState, useEffect, useRef } from "react";
import { useDraggable } from "react-use-draggable-scroll";
import RGL, { WidthProvider } from "react-grid-layout";

import {
  calculateDaysQuantity,
  calculateQuantityMonths,
} from "./calendarFunctions";
import {
  initialWidth,
  multiplierWidth,
  initialHeight,
  quantityYears,
} from "./params";
import { renderDays, renderMonths, renderYears } from "./calendarRender";
import Bubble from "@/components/bubble/bubble";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "@/app/globals.css";
import "./styles.css";

const ReactGridLayout = WidthProvider(RGL);

const Timeline = ({ layoutBubble, layoutBubbleProps }) => {
  let widthDays = initialWidth;
  let widthMonths = initialWidth * multiplierWidth;
  let widthYears = widthMonths * multiplierWidth;
  let quantityDays = calculateDaysQuantity();
  let quantityMonths = calculateQuantityMonths();

  const ref = useRef();
  const [view, setView] = useState("days");
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [layout, setLayout] = useState([]);
  const [layoutCustomProps, setLayoutCustomProps] = useState([]);
  const [canDragBubbles, setCanDragBubbles] = useState(true);
  const [currentDayPosition, setCurrentDayPosition] = useState([]);
  const [quantityColumns, setQuantityColumns] = useState(quantityDays);
  const { events } = useDraggable(ref, { isMounted: scrollEnabled });

  const [tasksDelayed, setTasksDelayed] = useState([]);

  useEffect(() => {
    //if (layoutBubble && layoutBubbleProps) {
    //  setLayout((prevLayout) => [...prevLayout, layoutBubble]);
    //  setLayoutCustomProps((prevLayout) => [...prevLayout, layoutBubbleProps]);
    //}

    const newItem = {
      x: 0,
      y: 0,
      w: 2,
      h: 1,
      i: "1",
    };

    const newCustomProps = {
      bubbleId: newItem.i,
      title: "bubble 1",
      color: "yellow",
    };

    const newItem2 = {
      x: 2,
      y: 0,
      w: 2,
      h: 1,
      i: "2",
    };

    const newCustomProps2 = {
      bubbleId: newItem2.i,
      title: "bubble 2",
      color: "blue",
    };

    setLayout((prevLayout) => [...prevLayout, newItem, newItem2]);
    setLayoutCustomProps((prevLayout) => [
      ...prevLayout,
      newCustomProps,
      newCustomProps2,
    ]);
  }, [layoutBubble]);

  useEffect(() => {
    //scrollToCurrentDay();
  }, [view]);

  const getCellWidth = () => {
    if (view === "days") {
      return widthDays;
    } else if (view === "months") {
      return widthMonths;
    } else if (view === "years") {
      return widthYears;
    }
  };

  const scrollToCurrentDay = () => {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 0);
    const diff = today - startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const monthOfYear = today.getMonth();
    const year = today.getFullYear();

    const columnWidth = getCellWidth();
    let currentPosition = 0;

    if (view === "days") {
      currentPosition = columnWidth * (dayOfYear - 1);
    } else if (view === "months") {
      currentPosition = columnWidth * monthOfYear;
    }

    setCurrentDayPosition(currentPosition + columnWidth / 2);

    if (ref.current) {
      ref.current.scrollTo({
        left: currentPosition - dayOfYear * 4,
        //behavior: "smooth",
      });
    }
  };

  const handleZoom = (e) => {
    if (e.deltaY > 0) {
      if (view === "days") {
        // VISAO DE MESES
        setView("months");
        setQuantityColumns(quantityMonths);
      } else if (view === "months") {
        // VISAO DE ANOS
        setView("years");
        setQuantityColumns(quantityYears);
      }
    } else {
      if (view === "years") {
        // VISAO DE MESES
        setView("months");
        setQuantityColumns(quantityMonths);
      } else if (view === "months") {
        // VISAO DE DIAS
        setView("days");
        setQuantityColumns(quantityDays);
      }
    }
  };

  const onBubbleDrop = (layoutItem, _ev) => {
    if (!layout.lg) return;

    const isNearExistingBlock = layout.lg.some((existingLayout) => {
      return (
        Math.abs(existingLayout.x - layoutItem.x) <= 2 &&
        Math.abs(existingLayout.y - layoutItem.y) <= 2
      );
    });

    layoutItem.static = isNearExistingBlock;
  };

  const onBubbleDragStart = () => {
    setScrollEnabled(false);
  };

  const onBubbleResizeStart = () => {
    setScrollEnabled(false);
  };

  const onBubbleDragStop = (newItem, _placeholder, _evt, _element) => {
    // Chamada do endpoint

    setScrollEnabled(true);
    setLayout(newItem);
    return;

    //if (!layout) return;
    //
    //const isNearExistingBlock = layout.some((existingLayout) => {
    //  return (
    //    Math.abs(existingLayout.x - newItem.x) <= 2 &&
    //    Math.abs(existingLayout.y - newItem.y) <= 2
    //  );
    //});
    //
    //newItem.static = isNearExistingBlock;
    //
    //const updateLayout = layout.map((l) => {
    //  if (l.i === newItem.i) {
    //    return { ...l, x: newItem.x, y: newItem.y };
    //  }
    //
    //  return l;
    //});
    //
    //setLayout(updateLayout);
  };

  function adjustLayout(itemList) {
    const newItem =
      itemList.find((item) =>
        layout.some((l) => l.i === item.i && l.w !== item.w && l.y === item.y)
      ) || itemList[0];

    // Função auxiliar para verificar se dois itens colidem
    const isColliding = (item1, item2) => {
      return (
        item1.x < item2.x + item2.w &&
        item1.x + item1.w > item2.x &&
        item1.y < item2.y + item2.h &&
        item1.y + item1.h > item2.y
      );
    };

    // Função para ajustar um item específico e verificar colisions recursivamente
    const adjustItem = (item, items) => {
      for (let i = 0; i < items.length; i++) {
        const currentItem = items[i];
        if (currentItem.i !== item.i && isColliding(item, currentItem)) {
          const overlapWidth = item.x + item.w - currentItem.x;
          currentItem.x += overlapWidth;

          var itemDesatualizado = layout.find(
            (l) => l.i == item.i && l.x == item.x && l.y == item.y
          );

          // FAZER A LOGICA DO ADIANTAMENTO DA TASK PARA FICAR VERDE

          if (itemDesatualizado) {
            const delayedTime = itemDesatualizado.w + itemDesatualizado.x;
            let delay = {
              bubbleId: item.i,
              delayedTime: delayedTime * initialWidth,
            };

            tasksDelayed.push(delay);
          }

          // Recursivamente ajustar o item que foi deslocado
          adjustItem(currentItem, items);
        }
      }
    };

    // Clonar a lista de itens para evitar mutações diretas
    const updatedItemList = itemList.map((item) => ({ ...item }));

    // Ajustar o novo item na lista atualizada
    adjustItem(newItem, updatedItemList);

    // Adicionar ou atualizar o novo item na lista
    const itemIndex = updatedItemList.findIndex((item) => item.i === newItem.i);
    if (itemIndex !== -1) {
      updatedItemList[itemIndex] = newItem;
    } else {
      updatedItemList.push(newItem);
    }

    setTasksDelayed((prevTasksDelayed) => [
      ...prevTasksDelayed,
      ...tasksDelayed,
    ]);

    return updatedItemList;
  }

  const onBubbleResizeStopTeste = (layoutItens) => {
    const updatedLayout = adjustLayout(layoutItens);
    setLayout(updatedLayout);
    setScrollEnabled(true);
  };

  const onBubbleComplete = () => {
    // Chamada do endpoint

    alert(`Bolha completada: ${Date.now()}`);
  };

  return (
    <div
      className="container-timeline"
      onWheel={handleZoom}
      {...events}
      ref={ref}
    >
      <div style={{ position: "absolute" }}>
        <div onWheel={handleZoom} style={{ marginBottom: "5px" }}>
          {view === "days"
            ? renderDays(widthDays, events, ref)
            : view === "months"
            ? renderMonths(widthMonths, events, ref)
            : renderYears(widthYears, events, ref)}
        </div>
        <ReactGridLayout
          style={{
            height: "100%",
          }}
          //onLayoutChange={(newLayout) => setLayout(newLayout)}
          onLayoutChange={onBubbleResizeStopTeste}
          layout={layout}
          isResizable={true}
          margin={[0, 7]}
          rowHeight={50}
          preventCollision={false}
          compactType={"vertical"}
          allowOverlap={true}
          cols={quantityDays}
          onDragStop={onBubbleDragStop}
          onResizeStart={onBubbleResizeStart}
          //onResizeStop={onBubbleResizeStop}
          //onResizeStop={onBubbleResizeStopTeste}
          onDragStart={onBubbleDragStart}
          onDrop={onBubbleDrop}
          containerPadding={[0, 0]}
          maxRows={9}
          resizeHandles={["e"]}
          isDraggable={canDragBubbles}
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
                delayedTime={
                  tasksDelayed.find((x) => x.bubbleId === bubble.i) &&
                  tasksDelayed.find((x) => x.bubbleId === bubble.i).delayedTime
                }
                canComplete
                bubble={bubble}
                bubbleCustomProps={
                  layoutCustomProps &&
                  layoutCustomProps.find((x) => x.bubbleId === bubble.i)
                }
                canDrag={setCanDragBubbles}
                onComplete={onBubbleComplete}
              />
            </div>
          ))}
        </ReactGridLayout>
        <div style={{ marginTop: "5px", whiteSpace: "nowrap" }}>
          {Array.from({ length: 9 }).map((_, rowIndex) => (
            <div key={rowIndex}>
              <div
                className="current-day-timeline"
                style={{
                  left: `${currentDayPosition}px`,
                }}
              ></div>
              {Array.from({ length: quantityColumns }).map((_, colIndex) => (
                <div
                  key={colIndex}
                  className="cell-matriz"
                  style={{
                    width: `${getCellWidth()}px`,
                    height: `${initialHeight}px`,
                  }}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
