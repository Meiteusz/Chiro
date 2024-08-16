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

const Timeline = ({
  layoutBubble,
  layoutBubbleProps,
  bubbleProjectId,
  //onBubbleLoad,
  bubbleBeingDeleted,
  onContentChanged,
  onColorChanged,
  notAuthenticate,
  setLoading,
  setStartTimelinePeriodParam,
}) => {
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
  const [timelineConfigured, setTimelineConfigured] = useState(false);
  let quantityDays = calculateDaysQuantity(
    startTimelinePeriod,
    quantityYearsPeriod
  );
  let quantityMonths = calculateQuantityMonths(
    startTimelinePeriod,
    quantityYearsPeriod
  );
  const [quantityColumns, setQuantityColumns] = useState(quantityDays);
  const [timelineRow, setTimelineRow] = useState(0);
  const [validateColision, setValidateColision] = useState(false);

  //#region useEffect's

  useEffect(() => {
    getConfiguration();

    if (timelineConfigured) {
      loadBubbles();
      scrollToCurrentDate();
    }
  }, [bubbleProjectId, timelineConfigured]);

  useEffect(() => {
    loadThrowedBubbles();
  }, [layoutBubble]);

  useEffect(() => {
    scrollToCurrentDate();
  }, [viewMode]);

  useEffect(() => {
    if (bubbleBeingDeleted) {
      handleDeleteTimelineBubble(bubbleBeingDeleted);
    }
  }, [bubbleBeingDeleted]);

  useEffect(() => {
    if (onContentChanged) {
      handleContentChanged(onContentChanged);
    }
  }, [onContentChanged]);

  useEffect(() => {
    if (onColorChanged) {
      handleColorChanged(onColorChanged);
    }
  }, [onColorChanged]);

  useEffect(() => {
    if (layout.length < 1) return;

    var adjustedLayout = AdjustLayoutOnLoad(layout);
    if (adjustedLayout) {
      setLayout(adjustedLayout);
    }
  }, [validateColision]);
  //#endregion

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

      BoardActionService.changePeriod({
        Id: layoutBubble.i,
        StartDate: layoutBubbleProps.startsDate,
        EndDate: layoutBubbleProps.endsDate,
        TimelineRow: layoutBubble.y,
      });
    }
  };
  //#endregion

  //#region getConfiguration
  const getConfiguration = () => {
    ProjectService.getTimelineConfiguration(bubbleProjectId)
      .then((res) => {
        let startDateTimelinePeriod = new Date(
          res.data.period.startDate
        ).getFullYear();
        let quantityDateYearsPeriod =
          new Date(res.data.period.endDate).getFullYear() -
          new Date(res.data.period.startDate).getFullYear() +
          1;

        setStartTimelinePeriod(startDateTimelinePeriod);
        setStartTimelinePeriodParam(startDateTimelinePeriod);
        setQuantityYearsPeriod(quantityDateYearsPeriod);
        setTimelineRow(res.data.biggestRow);

        setQuantityColumns(
          calculateDaysQuantity(
            startDateTimelinePeriod,
            quantityDateYearsPeriod
          )
        );
        setTimelineConfigured(true);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  //#endregion

  //#region loadBubbles
  const loadBubbles = () => {
    ProjectService.getById(bubbleProjectId)
      .then((res) => {
        res.data.boardActions.forEach((boardAction) => {
          var data = calculateDifferenceInDays(boardAction);
          var bubbleCompleted =
            boardAction.concludedAt !== undefined &&
            boardAction.concludedAt !== null;

          setLayout((prevLayout) => [
            ...prevLayout,
            {
              x: data.differenceFromStartDate,
              w: data.differenceInDays + boardAction.qtdDelayDays,
              i: boardAction.id.toString(),
              y: boardAction.timelineRow ?? 0,
              h: 1,
              static: bubbleCompleted,
            },
          ]);

          setLayoutCustomProps((prevCustomProps) => [
            ...prevCustomProps,
            {
              bubbleId: boardAction.id.toString(),
              title: boardAction.content,
              color: boardAction.color,
              startsDate: boardAction.startDate,
              endsDate: boardAction.endDate,
              isCompleted: bubbleCompleted,
            },
          ]);

          if (boardAction.qtdDelayDays > 0) {
            setDelayedBubbles((prevDelayedBubbles) => [
              ...prevDelayedBubbles,
              {
                bubbleId: boardAction.id.toString(),
                delayedTime: data.differenceInDays * initialWidth,
              },
            ]);
          }

          //onBubbleLoad(boardAction);
          setValidateColision(!validateColision);

          if (boardAction.concludedAt != undefined) {
            onBubbleComplete(boardAction.id.toString(), false);
          }
        });
      })
      .catch((error) => {
        console.error("Error fetching project:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  //#endregion

  //#region calculateDifferenceInDays
  const calculateDifferenceInDays = (boardAction) => {
    const endDate =
      boardAction.concludedAt != undefined
        ? boardAction.concludedAt
        : boardAction.endDate;
    var differenceInMilliseconds = Math.abs(
      new Date(endDate) - new Date(boardAction.startDate)
    );

    var differenceInDays = Math.ceil(
      differenceInMilliseconds / (1000 * 60 * 60 * 24) + 1
    );

    var initialDate = new Date(`${startTimelinePeriod}-01-01`);
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
    if (new Date().getFullYear() > startTimelinePeriod + quantityYearsPeriod)
      return;

    const today = new Date();
    const startOfYear = new Date(startTimelinePeriod, 0, 0);
    const diff = today - startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const monthOfYear = today.getMonth();

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
        left: currentPosition - columnWidth * 10,
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
      item1.y + item1.h > item2.y &&
      item1.y == item2.y
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

    return adjustedLayout;
  };
  //#endregion

  //#region AdjustLayoutOnLoad
  const AdjustLayoutOnLoad = (initialLayout) => {
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
      }
    };

    const adjustedLayout = initialLayout.map((bubble) => ({ ...bubble }));

    for (let i = 0; i < adjustedLayout.length; i++) {
      adjustBubble(adjustedLayout[i], adjustedLayout);
    }

    return adjustedLayout;
  };
  //#endregion

  //#region handleZoom
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
  //#endregion

  //#region onBubbleDragStop
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

      var data = getStartAndEndDate(newItem);
      BoardActionService.changePeriod({
        Id: newItem.i,
        StartDate: data.startDate,
        EndDate: data.endDate,
        TimelineRow: newItem.y,
      });
    }

    setLayout([...newLayout]);
  };
  //#endregion

  //#region getNumberOfRowsToIncrease
  const getNumberOfRowsToIncrease = (updatedBubble, updatedLayout) => {
    let hasCollision = isNewBubbleColliding(updatedBubble, updatedLayout);
    let increaseBy = 0;
    if (hasCollision) {
      increaseBy++;
      while (hasCollision) {
        hasCollision = isNewBubbleColliding(updatedBubble, updatedLayout);
        if (hasCollision) {
          increaseBy++;
        }
      }
    }

    return increaseBy;
  };
  //#endregion

  //#region isNewBubbleColliding
  const isNewBubbleColliding = (updatedBubble, updatedLayout) => {
    updatedLayout.some(
      (bubble) =>
        bubble.i !== updatedBubble.i && isColliding(updatedBubble, bubble)
    );
  };
  //#endregion

  //#region onBubbleResizeStop
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
      TimelineRow:
        updatedBubble.y +
        getNumberOfRowsToIncrease(updatedBubble, updatedLayout),
    });
  };
  //#endregion

  //#region getStartAndEndDate
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
  //#endregion

  //#region calculateProfitDays

  const calculateProfitDays = (id) => {
    let currentDate = Date.now();
    let endsDate = layoutCustomProps.find(
      (bubble) => bubble.bubbleId === id
    )?.endsDate;

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

  //#region onBubbleComplete
  const onBubbleComplete = (id, update) => {
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
    //calculateProfitDays(id);

    setLayout((prevBubble) =>
      prevBubble.map((prevBox) =>
        prevBox.i === id
          ? {
              ...prevBox,
              static: true,
            }
          : prevBox
      )
    );

    if (update) {
      var bubbleCompleted = layout.find((x) => x.i === id);
      var data = getStartAndEndDate(bubbleCompleted);
      BoardActionService.conclude({
        Id: id,
        EndDate: data.endDate,
      });
    }
  };
  //#endregion

  //#region handleContentChanged
  const handleContentChanged = (bubble) => {
    setLayoutCustomProps((prevBubble) =>
      prevBubble.map((prevBox) =>
        prevBox.bubbleId === bubble.id
          ? {
              ...prevBox,
              title: bubble.content,
            }
          : prevBox
      )
    );
  };
  //#endregion

  //#region handleColorChanged
  const handleColorChanged = (bubble) => {
    setLayoutCustomProps((prevBubble) =>
      prevBubble.map((prevBox) =>
        prevBox.bubbleId === bubble.id
          ? {
              ...prevBox,
              color: bubble.color.hex,
            }
          : prevBox
      )
    );
  };
  //#endregion

  //#region handleDeleteTimelineBubble
  const handleDeleteTimelineBubble = (id) => {
    setLayout((prevLayout) => [...prevLayout.filter((item) => item.i !== id)]);
  };
  //#endregion

  return (
    <div
      className="container-timeline"
      onWheel={handleZoom}
      {...events}
      ref={ref}
    >
      <div
        style={{
          position: "absolute",
          //backgroundColor: "rgba(168, 168, 168, 0.7)",
        }}
      >
        <div
          onWheel={handleZoom}
          style={{
            marginBottom: "5px",
            backgroundColor: "rgba(214, 219, 220)",
          }}
        >
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
          margin={[0, 6]}
          rowHeight={50}
          preventCollision={false}
          cols={quantityDays}
          onDragStop={onBubbleDragStop}
          onDragStart={() => setScrollEnabled(false)}
          onResizeStart={() => setScrollEnabled(false)}
          onResizeStop={onBubbleResizeStop}
          containerPadding={[0, 0]}
          maxRows={timelineRow < 8 ? 8 : timelineRow}
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
                onComplete={() => onBubbleComplete(bubble.i, true)}
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
                notAuthenticate={notAuthenticate}
              />
            </div>
          ))}
        </ReactGridLayout>
        {
          <div
            id="timeline-body"
            style={{ marginTop: "0px", whiteSpace: "nowrap" }}
          >
            {console.log("timelineRow:", timelineRow)}
            {console.log("quantityColumns:", quantityColumns)}
            {console.log("getCellWidth:", getCellWidth())}
            {console.log("initialHeight:", initialHeight)}
            {console.log(
              "Array from rows:",
              Array.from({ length: timelineRow < 8 ? 8 : timelineRow })
            )}
            {Array.from({ length: timelineRow < 8 ? 8 : timelineRow }).map(
              (_, rowIndex) => (
                <div key={rowIndex}>
                  {viewMode !== timelineViewMode.year &&
                    new Date().getFullYear() <=
                      startTimelinePeriod + quantityYearsPeriod && (
                      <div
                        className="current-day-timeline"
                        style={{
                          left: `${currentDayPosition}px`,
                        }}
                      />
                    )}
                  {Array.from({ length: quantityColumns }).map(
                    (_, colIndex) => (
                      <div
                        key={colIndex}
                        className="cell-matriz"
                        style={{
                          width: `${getCellWidth()}px`,
                          height: `${initialHeight}px`,
                        }}
                      ></div>
                    )
                  )}
                </div>
              )
            )}
          </div>
        }
      </div>
    </div>
  );
};

export default Timeline;
