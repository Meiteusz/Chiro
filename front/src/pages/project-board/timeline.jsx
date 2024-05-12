import { useState, useEffect, useRef } from "react";
import { useDraggable } from "react-use-draggable-scroll";
import RGL, { WidthProvider } from "react-grid-layout";

import {
  calculateDaysQuantity,
  calculateQuantityMonths,
} from "./calendarFunctions";
import { renderDays, renderMonths, renderYears } from "./calendarRender";
import {
  initialWidth,
  multiplierWidth,
  initialHeight,
  quantityYears,
} from "./params";
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
  const [currentDayPosition, setCurrentDayPosition] = useState([]);
  const [quantityColumns, setQuantityColumns] = useState(quantityDays);
  const { events } = useDraggable(ref, { isMounted: scrollEnabled });

  useEffect(() => {
    if (layoutBubble && layoutBubbleProps) {
      setLayout((prevLayout) => [...prevLayout, layoutBubble]);
      setLayoutCustomProps((prevLayout) => [...prevLayout, layoutBubbleProps]);
    }
  }, [layoutBubble]);

  useEffect(() => {
    scrollToCurrentDay();
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
    } else if (view === "years") {
      currentPosition = (columnWidth * quantityYears) / 2; // AJUSTAR, CASO Q QUANTIDADE DE ANOS SEJA MAIOR QUE 1, A LINHA DO TEMPO NAO FICA CERTA
    }

    if (view === "years") {
      setCurrentDayPosition(currentPosition);
    } else {
      setCurrentDayPosition(currentPosition + columnWidth / 2);
    }

    if (ref.current) {
      ref.current.scrollTo({
        left: currentPosition - dayOfYear * 4,
        behavior: "smooth",
      });
    }
  };

  // FAZER AS OPCOES DA BUBBLE MUDAREM CONFORME ELA ESTA NA TELA DE PROJETOS, BOARD E TIMELINE
  // IMPLEMENTAR TIPO DE BUBBLE (PLAYER, TASK OU LINK)

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
    setScrollEnabled(true);

    if (!layout.lg) return;

    const isNearExistingBlock = layout.lg.some((existingLayout) => {
      return (
        Math.abs(existingLayout.x - newItem.x) <= 2 &&
        Math.abs(existingLayout.y - newItem.y) <= 2
      );
    });

    newItem.static = isNearExistingBlock;

    setLayout((prevLayouts) => {
      const updatedLayouts = { ...prevLayouts };
      const index = prevLayout.lg.findIndex((item) => item.i === newItem.i);
      updatedLayout.lg[index] = newItem;
      return updatedLayouts;
    });
  };

  const onBubbleResizeStop = () => {
    setScrollEnabled(true);
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
          onLayoutChange={(newLayout) => setLayout(newLayout)}
          layout={layout}
          compactType={null}
          isResizable={true}
          margin={[0, 7]}
          rowHeight={50}
          preventCollision={true}
          cols={quantityDays}
          onDragStop={onBubbleDragStop}
          onResizeStart={onBubbleResizeStart}
          onResizeStop={onBubbleResizeStop}
          onDragStart={onBubbleDragStart}
          onDrop={onBubbleDrop}
          containerPadding={[0, 0]}
          maxRows={9}
          resizeHandles={["e"]}
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
