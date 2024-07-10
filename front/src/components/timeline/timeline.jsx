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
} from "@/components/timeline/params";
import {
  renderDays,
  renderMonths,
  renderYears,
} from "@/components/timeline/calendarRender";
import { timelineViewMode } from "@/components/timeline/timelineViewMode.js";

import Bubble from "@/components/bubble/bubble";
import BoardActionService from "@/services/requests/board-action-service";
import ProjectService from "@/services/requests/project-service";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "@/app/globals.css";
import "@/components/timeline/styles.css";

const ReactGridLayout = WidthProvider(RGL);

const Timeline = ({ layoutBubble, layoutBubbleProps, bubbleProjectId }) => {
  let widthDays = initialWidth;
  let widthMonths = initialWidth * multiplierWidth;
  let widthYears = widthMonths * multiplierWidth;

  const ref = useRef();

  const [layout, setLayout] = useState([]);
  const [layoutCustomProps, setLayoutCustomProps] = useState([]);
  const [layoutUpdatedKey, setLayoutUpdatedKey] = useState(0);
  const [viewMode, setViewMode] = useState(timelineViewMode.day);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [canDragBubbles, setCanDragBubbles] = useState(true);
  const [currentDayPosition, setCurrentDayPosition] = useState([]);
  const [delayedBubbles, setDelayedBubbles] = useState([]);
  const { events } = useDraggable(ref, {
    isMounted: scrollEnabled,
  });
  const [startTimelinePeriod, setStartTimelinePeriod] = useState(null);
  const [quantityYearsPeriod, setQuantityYearsPeriod] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timelineFinished, setTimelineFinished] = useState(false);
  let quantityDays = calculateDaysQuantity(
    startTimelinePeriod,
    quantityYearsPeriod
  );
  let quantityMonths = calculateQuantityMonths(
    startTimelinePeriod,
    quantityYearsPeriod
  );
  const [quantityColumns, setQuantityColumns] = useState(quantityDays);

  useEffect(() => {
    loadThrowedBubbles();
  }, [layoutBubble]);

  useEffect(() => {
    scrollToCurrentDate();
  }, [viewMode]);

  useEffect(() => {
    if (bubbleProjectId) {
      getPeriod();

      if (timelineFinished) {
        loadBubbles();
        scrollToCurrentDate();
      }
    }
  }, [bubbleProjectId, timelineFinished]);

  //#region loadThrowedBubbles
  const loadThrowedBubbles = () => {
    if (layoutBubble && layoutBubbleProps) {
      layout.forEach((bubble) => {
        if (isColliding(layoutBubble, bubble)) {
          layoutBubble.y += 1;
        }
      });

      setLayout((prevLayout) => [...prevLayout, layoutBubble]);
      setLayoutCustomProps((prevLayout) => [...prevLayout, layoutBubbleProps]);
    }
  };
  //#endregion

  //#region getPeriod
  const getPeriod = () => {
    setIsLoading(true);

    ProjectService.getTimelinePeriod(bubbleProjectId)
      .then((res) => {
        let startDateTimelinePeriod = new Date(
          res.data.startDate
        ).getFullYear();
        let quantityDateYearsPeriod =
          new Date(res.data.endDate).getFullYear() -
          new Date(res.data.startDate).getFullYear() +
          1;

        setStartTimelinePeriod(startDateTimelinePeriod);
        setQuantityYearsPeriod(quantityDateYearsPeriod);

        setQuantityColumns(
          calculateDaysQuantity(
            startDateTimelinePeriod,
            quantityDateYearsPeriod
          )
        );
        setTimelineFinished(true);
      })
      .catch((error) => {
        console.error(error);
      });

    setIsLoading(false);
  };
  //#endregion

  //#region loadBubbles
  const loadBubbles = () => {
    ProjectService.getById(bubbleProjectId)
      .then((res) => {
        res.data.boardActions.forEach((boardAction) => {
          var data = calculateDifferenceInDays(boardAction);

          setLayout((prevLayout) => [
            ...prevLayout,
            {
              x: data.differenceFromStartDate,
              w: data.differenceInDays,
              i: boardAction.id.toString(),
              y: boardAction.timelineRow?.toString() ?? "0",
              h: 1,
            },
          ]);

          setLayoutCustomProps((prevCustomProps) => [
            ...prevCustomProps,
            {
              bubbleId: boardAction.id.toString(),
              title: boardAction.content,
              color: boardAction.color,
              startsDate: new Date(boardAction.startDate),
              endsDate: new Date(boardAction.endDate),
            },
          ]);
        });
      })
      .catch((error) => {
        console.error("Error fetching project:", error);
      });
  };
  //#endregion

  //#region calculateDifferenceInDays
  const calculateDifferenceInDays = (boardAction) => {
    var differenceInMilliseconds = Math.abs(
      new Date(boardAction.endDate) - new Date(boardAction.startDate)
    );

    var differenceInDays = Math.ceil(
      differenceInMilliseconds / (1000 * 60 * 60 * 24) + 1
    );

    var initialDate = new Date("2024-01-01");
    var daysFromStart = Math.abs(new Date(boardAction.startDate) - initialDate);
    var differenceFromStartDate = Math.floor(
      daysFromStart / (1000 * 60 * 60 * 24)
    );

    return {
      differenceFromStartDate: differenceFromStartDate,
      differenceInDays: differenceInDays,
    };
  };
  //#endregion

  //#region forceUpdate
  const forceUpdate = () => {
    // Usar com cautela!!
    setLayoutUpdatedKey(layoutUpdatedKey + 1);
  };

  //#endregion

  //#region getCellWidth
  const getCellWidth = () => {
    if (viewMode === timelineViewMode.day) {
      return widthDays;
    } else if (viewMode === timelineViewMode.month) {
      return widthMonths / quantityYearsPeriod;
    } else if (viewMode === timelineViewMode.year) {
      return widthYears / quantityYearsPeriod;
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
        setQuantityColumns(quantityYearsPeriod);
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

  const onBubbleDragStop = (updatedLayout, oldItem, newItem) => {
    const hasCollision = updatedLayout.some(
      (bubble) => bubble.i !== newItem.i && isColliding(newItem, bubble)
    );

    let newLayout;
    if (hasCollision) {
      newLayout = updatedLayout.map((item) =>
        item.i === oldItem.i ? oldItem : item
      );
      forceUpdate();
    } else {
      newLayout = updatedLayout.map((item) =>
        item.i === newItem.i ? newItem : item
      );
    }

    setLayout([...newLayout]);

    var data = getStartAndEndDate(newItem);
    BoardActionService.changePeriod({
      Id: newItem.i,
      StartDate: data.startDate,
      EndDate: data.endDate,
      TimelineRow: newItem.y,
    });
  };

  const onBubbleResizeStop = (updatedLayout) => {
    const adjustedLayout = adjustLayout(updatedLayout);
    setLayout(adjustedLayout);
    setScrollEnabled(true);

    const updatedBubble =
      updatedLayout.find((updatedBubble) =>
        layout.some(
          (outdatedBubble) =>
            outdatedBubble.i === updatedBubble.i &&
            outdatedBubble.w !== updatedBubble.w &&
            outdatedBubble.y === updatedBubble.y
        )
      ) || updatedLayout[0];

    var data = getStartAndEndDate(updatedBubble);
    BoardActionService.changePeriod({
      Id: updatedBubble.i,
      StartDate: data.startDate,
      EndDate: data.endDate,
      TimelineRow: updatedBubble.y,
    });
  };

  const getStartAndEndDate = (bubble) => {
    const initialDate = new Date("2024-01-01");
    const newStartDate = new Date(initialDate);
    newStartDate.setDate(initialDate.getDate() + bubble.x);

    const newEndDate = new Date(newStartDate);
    newEndDate.setDate(newStartDate.getDate() + bubble.w - 1);

    return {
      startDate: newStartDate,
      endDate: newEndDate,
    };
  };

  //#region calculateProfitDays

  const calculateProfitDays = () => {
    let currentDate = Date.now();
    let endsDate = layoutCustomProps.find(
      (bubble) => bubble.bubbleId === id
    ).endsDate;

    if (new Date(endsDate) <= currentDate) return;

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

  const onBubbleComplete = (id) => {
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

    BoardActionService.conclude({
      Id: id,
    });
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
            ? renderDays(
                widthDays,
                events,
                ref,
                startTimelinePeriod,
                quantityYearsPeriod
              )
            : viewMode === timelineViewMode.month
            ? renderMonths(
                widthMonths,
                events,
                ref,
                startTimelinePeriod,
                quantityYearsPeriod
              )
            : renderYears(
                widthYears,
                events,
                ref,
                startTimelinePeriod,
                quantityYearsPeriod
              )}
        </div>
        <ReactGridLayout
          key={layoutUpdatedKey}
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
        <div
          id="timeline-body"
          style={{ marginTop: "5px", whiteSpace: "nowrap" }}
        >
          {Array.from({ length: 9 }).map((_, rowIndex) => (
            <div key={rowIndex}>
              {viewMode !== timelineViewMode.year && (
                <div
                  className="current-day-timeline"
                  style={{
                    left: `${currentDayPosition}px`,
                  }}
                />
              )}
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
