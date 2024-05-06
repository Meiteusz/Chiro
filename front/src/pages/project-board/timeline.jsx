import { useState, useEffect, useRef } from "react";
import { useDraggable } from "react-use-draggable-scroll";

import BubbleTask from "@/components/bubble-v2/bubble-task";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import "../../components/bubble-v2/styles.css";
import "@/app/globals.css";

const Timeline = ({ layoutBubble, layoutBubbleProps }) => {
  const [view, setView] = useState("days");
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const ref = useRef();
  const daysRef = useRef();
  const { events } = useDraggable(ref, {
    isMounted: scrollEnabled,
  });
  const mouthsPTBR = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  // Parâmetros
  const initialWidth = 80;
  const multiplierWidth = 2;
  const initialHeight = 50;
  const quantityYears = 1;
  // ------------------------

  let widthDays = initialWidth;
  let widthMonths = initialWidth * multiplierWidth;
  let widthYears = widthMonths * multiplierWidth;

  const [layout, setLayout] = useState([]);
  const [layoutCustomProps, setLayoutCustomProps] = useState([]);

  const [currentDayPosition, setCurrentDayPosition] = useState([]);

  useEffect(() => {
    if (layoutBubble && layoutBubbleProps) {
      setLayout((prevLayout) => [...prevLayout, layoutBubble]);
      setLayoutCustomProps((prevLayout) => [...prevLayout, layoutBubbleProps]);
    }
  }, [layoutBubble]);

  useEffect(() => {
    scrollToCurrentDay();
  }, [view]);

  const scrollToCurrentDay = () => {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 0);
    const diff = today - startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    const columnWidth = getCellWidth();
    const currentPosition = columnWidth * (dayOfYear - 1);
    setCurrentDayPosition(currentPosition + columnWidth / 2);

    if (ref.current) {
      ref.current.scrollTo({
        left: currentPosition - dayOfYear * 4,
        behavior: "smooth",
      });
    }
  };

  const calculateDaysQuantity = () => {
    const currentYear = new Date().getFullYear();
    let totalDays = 0;
    for (let year = currentYear; year < currentYear + quantityYears; year++) {
      for (let month = 0; month < 12; month++) {
        totalDays += new Date(year, month + 1, 0).getDate();
      }
    }
    return totalDays;
  };

  const calculateQuantityMonths = () => {
    const currentYear = new Date().getFullYear();
    let totalMonths = 0;

    for (let year = currentYear; year < currentYear + quantityYears; year++) {
      for (let month = 0; month < 12; month++) {
        totalMonths++;
      }
    }

    return totalMonths;
  };

  const [quantityDays, setQuantityDays] = useState(calculateDaysQuantity());

  const [quantityMonths, setQuantityMonths] = useState(
    calculateQuantityMonths()
  );

  const [quantityColumns, setQuantityColumns] = useState(quantityDays);

  useEffect(() => {
    setQuantityDays(calculateDaysQuantity());
  }, [quantityYears]);

  const renderDays = () => {
    const allDays = [];
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year < currentYear + quantityYears; year++) {
      for (let month = 0; month < 12; month++) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const monthDays = [];
        for (let day = 1; day <= daysInMonth; day++) {
          monthDays.push(
            <div
              key={`${year}-${month}-${day}`}
              style={{
                //border: "1px solid gray",
                borderRadius: "5px",
                width: `${widthDays}px`,
                height: "35px",
                textAlign: "center",
                display: "inline-block",
                backgroundColor: "rgba(168, 168, 168, 0.7)",
                padding: "5px",
              }}
            >
              {day}
            </div>
          );
        }
        allDays.push(
          <div key={`${year}-${month}`} style={{ flex: "0 0 auto" }}>
            <div>
              <div
                style={{
                  fontWeight: "600",
                  textAlign: "center",
                  backgroundColor: "#303030",
                  padding: "3px",
                  borderRight: "1px solid white",
                }}
              >
                <label
                  style={{
                    color: "#F0F0F0",
                    marginBottom: "5px",
                  }}
                >
                  {`${mouthsPTBR[month]} | ${year}`}
                </label>
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  fontWeight: "600",
                }}
              >
                {monthDays}
              </div>
            </div>
          </div>
        );
      }
    }

    return (
      <div
        {...events}
        ref={ref}
        id="diasContainer"
        style={{
          display: "flex",
          overflowX: "hidden",
        }}
      >
        {allDays}
      </div>
    );
  };

  const renderMonths = () => {
    const allMonths = [];
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year < currentYear + quantityYears; year++) {
      allMonths.push(
        <div key={year} style={{ display: "inline-block" }}>
          <div>
            <div
              style={{
                fontWeight: "600",
                textAlign: "center",
                backgroundColor: "#303030",
                padding: "3px",
              }}
            >
              <label style={{ color: "#F0F0F0", marginBottom: "5px" }}>
                {year}
              </label>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "nowrap",
                overflowX: "auto",
              }}
            >
              {Array.from({ length: 12 }, (_, month) => (
                <div
                  key={`${year}-${month}`}
                  style={{
                    backgroundColor: "rgba(168, 168, 168, 0.7)",
                    fontWeight: "600",
                    borderRadius: "5px",
                    width: `${widthMonths}px`,
                    height: "40px",
                    textAlign: "center",
                    display: "inline-block",
                  }}
                >
                  {`${mouthsPTBR[month]}`}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    return (
      <div
        {...events}
        ref={ref}
        id="diasContainer"
        style={{
          overflowX: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        {allMonths}
      </div>
    );
  };

  const renderYears = () => {
    const allYears = [];
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year < currentYear + quantityYears; year++) {
      allYears.push(
        <div
          key={year}
          style={{
            marginTop: "5px",
            width: `${widthYears}px`,
            textAlign: "center",
            display: "inline-block",
            fontWeight: "600",
            backgroundColor: "#303030",
            padding: "3px",
          }}
        >
          <label style={{ color: "#F0F0F0", marginBottom: "5px" }}>
            {year}
          </label>
        </div>
      );
    }
    return (
      <div
        id="diasContainer"
        {...events}
        ref={ref}
        style={{
          overflowX: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        {allYears}
      </div>
    );
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

  const getCellWidth = () => {
    if (view === "days") {
      return widthDays;
    } else if (view === "months") {
      return widthMonths;
    } else if (view === "years") {
      return widthYears;
    }
  };

  function isBissexto(ano) {
    return (ano % 4 === 0 && ano % 100 !== 0) || ano % 400 === 0;
  }

  const diasPorMes = [
    31, // Janeiro
    28, // Fevereiro
    31, // Março
    30, // Abril
    31, // Maio
    30, // Junho
    31, // Julho
    31, // Agosto
    30, // Setembro
    31, // Outubro
    30, // Novembro
    31, // Dezembro
  ];

  const onCellClick = (indexColumn, indexRow) => {
    indexColumn++;
    indexRow++;
    let diaDoAno = 0;
    let mes = 0;
    let indexDias = indexColumn;

    if (isBissexto(2024)) {
      diasPorMes[1] = 29;
    }

    for (let i = 0; i < diasPorMes.length; i++) {
      if (indexColumn <= diasPorMes[i]) {
        mes = i + 1;
        diaDoAno = indexColumn;
        break;
      } else {
        indexColumn -= diasPorMes[i];
      }
    }

    alert(
      `Dia ${diaDoAno} de ${
        mouthsPTBR[mes - 1]
      } de 2024\n\nColuna: ${indexDias}\nLinha: ${indexRow}`
    );
  };

  const cellStyle = {
    width: `${getCellWidth()}px`,
    height: `${initialHeight}px`,
    border: "1px solid rgba(168, 168, 168, 0.4)",
    borderRight: "0px",
    display: "inline-block",
  };

  const matrixStyle = {
    marginTop: "5px",
    whiteSpace: "nowrap",
  };

  //------------------------------------------------------

  const onDrop = (layoutItem, _ev) => {
    if (!layout.lg) return;

    const isNearExistingBlock = layout.lg.some((existingLayout) => {
      return (
        Math.abs(existingLayout.x - layoutItem.x) <= 2 &&
        Math.abs(existingLayout.y - layoutItem.y) <= 2
      );
    });

    layoutItem.static = isNearExistingBlock;
  };

  const onDragStart = () => {
    setScrollEnabled(false);
  };

  const onResizeStart = () => {
    setScrollEnabled(false);
  };

  const onDragStop = (newItem, _placeholder, _evt, _element) => {
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
    setScrollEnabled(true);
  };

  const onResizeStop = () => {
    setScrollEnabled(true);
  };

  return (
    <div
      style={{
        paddingBottom: "600px",
        position: "relative",
        overflowX: "auto",
      }}
      onWheel={handleZoom}
      {...events}
      ref={ref}
    >
      <div style={{ position: "absolute" }}>
        <div onWheel={handleZoom} style={{ marginBottom: "5px" }}>
          {view === "days"
            ? renderDays()
            : view === "months"
            ? renderMonths()
            : renderYears()}
        </div>
        {
          <BubbleTask
            layoutProps={layoutCustomProps}
            onLayoutChange={(newLayout) => setLayout(newLayout)}
            isHorizontal={true}
            stopBubble={false}
            layout={layout}
            setLayout={setLayout}
            cols={quantityDays}
            margin={[0, 7]}
            onDragStop={onDragStop}
            onResizeStart={onResizeStart}
            onResizeStop={onResizeStop}
            onDragStart={onDragStart}
            onDrop={onDrop}
            maxRows={9}
            rowHeight={50}
          />
        }
        <div style={matrixStyle}>
          {Array.from({ length: 9 }).map((_, rowIndex) => (
            <div key={rowIndex}>
              {view === "days" && (
                <div
                  style={{
                    position: "absolute",
                    zIndex: "999",
                    left: `${currentDayPosition}px`,
                    width: "3px",
                    height: "60px",
                    borderRadius: "10px",
                    backgroundColor: "red",
                  }}
                ></div>
              )}
              {Array.from({ length: quantityColumns }).map((_, colIndex) => (
                <div
                  key={colIndex}
                  style={cellStyle}
                  onClick={() => onCellClick(colIndex, rowIndex)}
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
