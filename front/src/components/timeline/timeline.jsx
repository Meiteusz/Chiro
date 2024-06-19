import { useState, useEffect, useRef } from "react";
import { useDraggable } from "react-use-draggable-scroll";
import RGL, { WidthProvider } from "react-grid-layout";

import {
  calculateDaysQuantity,
  calculateQuantityMonths,
} from "@/components/timeline/calendarFunctions";
import {
  initialWidth,
  multiplierWidth,
  initialHeight,
  quantityYears,
} from "@/components/timeline/params";
import {
  renderDays,
  renderMonths,
  renderYears,
} from "@/components/timeline/calendarRender";
import Bubble from "@/components/bubble/bubble";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "@/app/globals.css";
import "@/components/timeline/styles.css";
import { timelineViewMode } from "@/components/timeline/timelineViewMode.js";

const ReactGridLayout = WidthProvider(RGL);

const Timeline = ({ layoutBubble, layoutBubbleProps }) => {
  let widthDays = initialWidth;
  let widthMonths = initialWidth * multiplierWidth;
  let widthYears = widthMonths * multiplierWidth;
  let quantityDays = calculateDaysQuantity();
  let quantityMonths = calculateQuantityMonths();

  const ref = useRef();

  const [layout, setLayout] = useState([]);
  const [layoutCustomProps, setLayoutCustomProps] = useState([]);

  const [viewMode, setViewMode] = useState(timelineViewMode.day);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [canDragBubbles, setCanDragBubbles] = useState(true);
  const [currentDayPosition, setCurrentDayPosition] = useState([]);
  const [quantityColumns, setQuantityColumns] = useState(quantityDays);
  const [delayedBubbles, setDelayedBubbles] = useState([]);
  const { events } = useDraggable(ref, { isMounted: scrollEnabled });

  useEffect(() => {
    if (layoutBubble && layoutBubbleProps) {
      setLayout((prevLayout) => [...prevLayout, layoutBubble]);
      setLayoutCustomProps((prevLayout) => [...prevLayout, layoutBubbleProps]);
    }

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
      w: 5,
      h: 1,
      i: "2",
    };

    const newCustomProps2 = {
      bubbleId: newItem2.i,
      title: "bubble 2",
      color: "blue",
      startsDate: new Date(2024, 0, 3),
      endsDate: new Date(2024, 0, 7),
    };

    //setLayout((prevLayout) => [...prevLayout, newItem, newItem2]);
    //setLayoutCustomProps((prevLayout) => [
    //  ...prevLayout,
    //  newCustomProps,
    //  newCustomProps2,
    //]);

    scrollToCurrentDate();
  }, [layoutBubble, viewMode]);

  //#region getCellWidth
  const getCellWidth = () => {
    if (viewMode === timelineViewMode.day) {
      return widthDays;
    } else if (viewMode === timelineViewMode.month) {
      return widthMonths;
    } else if (viewMode === timelineViewMode.year) {
      return widthYears;
    }
  };
  //#endregion

  //#region scrollToCurrentDate
  const scrollToCurrentDate = () => {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 0);
    const diff = today - startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const monthOfYear = today.getMonth();
    const year = today.getFullYear();

    const columnWidth = getCellWidth();
    let currentPosition = 0;

    if (viewMode === timelineViewMode.day) {
      currentPosition = columnWidth * (dayOfYear - 1);
    } else if (viewMode === timelineViewMode.month) {
      currentPosition = columnWidth * monthOfYear;
    }

    setCurrentDayPosition(currentPosition + columnWidth / 2);

    if (ref.current) {
      ref.current.scrollTo({
        left: currentPosition - dayOfYear * 4,
      });
    }
  };
  //#endregion

  //#region isColliding
  const isColliding = (item1, item2) => {
    return (
      item1.x < item2.x + item2.w &&
      item1.x + item1.w > item2.x &&
      item1.y < item2.y + item2.h &&
      item1.y + item1.h > item2.y
    );
  };
  //#endregion

  //#region adjustLayout
  const adjustLayout = (updatedLayout) => {
    const updatedBubble =
      updatedLayout.find((updatedBubble) =>
        layout.some(
          (outdatedBubble) =>
            outdatedBubble.i === updatedBubble.i &&
            outdatedBubble.w !== updatedBubble.w &&
            outdatedBubble.y === updatedBubble.y
        )
      ) || updatedLayout[0];

    const adjustBubble = (bubbleParam, layoutParam) => {
      for (let i = 0; i < layoutParam.length; i++) {
        const currentBubble = layoutParam[i];
        if (
          currentBubble.i !== bubbleParam.i &&
          isColliding(bubbleParam, currentBubble)
        ) {
          const overlapWidth = bubbleParam.x + bubbleParam.w - currentBubble.x;
          currentBubble.x += overlapWidth;

          adjustBubble(currentBubble, layoutParam);
        }

        var outdatedBubble = layout.find(
          (bubble) =>
            bubble.i == currentBubble.i &&
            bubble.x == currentBubble.x &&
            bubble.y == currentBubble.y
        );

        if (outdatedBubble) {
          const delayedTime = outdatedBubble.w * initialWidth;

          if (delayedTime <= 0) return;

          let bubbleDelay = {
            bubbleId: currentBubble.i,
            delayedTime: delayedTime,
          };

          delayedBubbles.push(bubbleDelay);
        }
      }
    };

    const adjustedLayout = updatedLayout.map((bubble) => ({ ...bubble }));

    adjustBubble(updatedBubble, adjustedLayout);

    const bubbleIndex = adjustedLayout.findIndex(
      (bubble) => bubble.i === updatedBubble.i
    );
    if (bubbleIndex !== -1) {
      adjustedLayout[bubbleIndex] = updatedBubble;
    } else {
      adjustedLayout.push(updatedBubble);
    }

    setDelayedBubbles((prevDelayedBubbles) => [
      ...prevDelayedBubbles,
      ...delayedBubbles,
    ]);

    return adjustedLayout;
  };
  //#endregion

  const handleZoom = (e) => {
    if (e.deltaY > 0) {
      if (viewMode === timelineViewMode.day) {
        // Visão de meses
        setViewMode(timelineViewMode.month);
        setQuantityColumns(quantityMonths);
      } else if (viewMode === timelineViewMode.month) {
        // Visao de anos
        setViewMode(timelineViewMode.year);
        setQuantityColumns(quantityYears);
      }
    } else {
      if (viewMode === timelineViewMode.year) {
        // Visão de meses
        setViewMode(timelineViewMode.month);
        setQuantityColumns(quantityMonths);
      } else if (viewMode === timelineViewMode.month) {
        // Visão de dias
        setViewMode(timelineViewMode.day);
        setQuantityColumns(quantityDays);
      }
    }
  };

  const onBubbleDragStop = (updatedLayout) => {
    setScrollEnabled(true);

    const updatedBubble =
      updatedLayout.find((updatedBubble) =>
        layout.some(
          (outdatedBubble) =>
            outdatedBubble.i === updatedBubble.i &&
            (outdatedBubble.x !== updatedBubble.x ||
              outdatedBubble.y !== updatedBubble.y)
        )
      ) || updatedLayout[0];

    const outdatedBubble =
      layout.find((outdatedBubble) =>
        updatedLayout.some(
          (updatedBubble) =>
            updatedBubble.i === outdatedBubble.i &&
            (updatedBubble.x !== outdatedBubble.x ||
              updatedBubble.y !== outdatedBubble.y)
        )
      ) || layout[0];

    const checkCollisionAndUpdateLayout = () => {
      const hasCollision = updatedLayout.some(
        (bubble) =>
          bubble.i !== updatedBubble.i && isColliding(updatedBubble, bubble)
      );

      if (hasCollision) {
        const updatedLayout = updatedLayout.map((bubble) =>
          bubble.i === updatedBubble.i
            ? { ...bubble, x: outdatedBubble.x, y: outdatedBubble.y }
            : bubble
        );
        setLayout(updatedLayout);
      } else {
        setLayout(updatedLayout);
      }
    };

    checkCollisionAndUpdateLayout();

    // Chamada do endpoint
  };

  const onBubbleResizeStop = (updatedLayout) => {
    const adjustedLayout = adjustLayout(updatedLayout);
    setLayout(adjustedLayout);
    setScrollEnabled(true);
  };

  const onBubbleComplete = (id) => {
    //#region calculateProfitDays

    const calculateProfitDays = () => {
      let currentDate = Date.now();
      let endsDate = layoutCustomProps.find(
        (bubble) => bubble.bubbleId === id
      ).endsDate;

      const profitDaysMilisseconds = Math.abs(endsDate - currentDate);

      const profitDays = Math.ceil(
        profitDaysMilisseconds / (1000 * 60 * 60 * 24)
      );

      if (profitDays <= 0) {
        return;
      }

      const newBubbleWidth =
        layout.find((bubble) => bubble.i === id).w - profitDays;

      setLayout((prevBubble) =>
        prevBubble.map((prevBox) =>
          prevBox.i === id
            ? {
                ...prevBox,
                w: newBubbleWidth,
                static: true,
              }
            : prevBox
        )
      );
    };

    //#endregion

    setLayoutCustomProps((prevBubble) =>
      prevBubble.map((prevBox) =>
        prevBox.bubbleId === id
          ? {
              ...prevBox,
              isCompleted: true,
            }
          : prevBox
      )
    );

    // Se for comentar, lembrar de salvar o setLayout com o static: true
    calculateProfitDays();

    // Chamada do endpoint
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
          {viewMode === timelineViewMode.day
            ? renderDays(widthDays, events, ref)
            : viewMode === timelineViewMode.month
            ? renderMonths(widthMonths, events, ref)
            : renderYears(widthYears, events, ref)}
        </div>
        <ReactGridLayout
          isResizable
          allowOverlap
          layout={layout}
          margin={[0, 7]}
          rowHeight={50}
          preventCollision={false}
          cols={quantityDays}
          onDragStop={onBubbleDragStop}
          onDragStart={() => setScrollEnabled(false)}
          onResizeStart={() => setScrollEnabled(false)}
          onResizeStop={onBubbleResizeStop}
          containerPadding={[0, 0]}
          maxRows={9}
          resizeHandles={["e"]}
          isDraggable={canDragBubbles}
          style={{
            height: "100%",
          }}
        >
          {layout.map((bubble) => (
            <div key={bubble.i} style={{ borderRadius: "5px" }}>
              <Bubble
                isTimeline
                canComplete
                canDrag={setCanDragBubbles}
                onComplete={() => onBubbleComplete(bubble.i)}
                bubble={bubble}
                bubbleCustomProps={
                  layoutCustomProps &&
                  layoutCustomProps.find((x) => x.bubbleId === bubble.i)
                }
                delayedTime={
                  delayedBubbles.find((x) => x.bubbleId === bubble.i) &&
                  delayedBubbles.find((x) => x.bubbleId === bubble.i)
                    .delayedTime
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
