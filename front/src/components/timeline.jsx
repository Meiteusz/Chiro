import React, { useState, useEffect } from "react";

import { useRef } from "react";
import { useDraggable } from "react-use-draggable-scroll";

import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const Timeline = () => {
  const [view, setView] = useState("days");
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const ref = useRef();
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
                    border: "1px solid gray",
                    backgroundColor: "rgba(168, 168, 168, 0.7)",
                    fontWeight: "600",
                    borderRadius: "5px",
                    marginTop: "5px",
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
          border: "1px solid black",
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
            border: "1px solid black",
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
          border: "1px solid black",
        }}
      >
        {allYears}
      </div>
    );
  };

  const handleZoom = (e) => {
    if (e.deltaY > 0) {
      if (view === "days") {
        setView("months");
        setQuantityColumns(quantityMonths);
      } else if (view === "months") {
        setView("years");
        setQuantityColumns(quantityYears);
      }
    } else {
      if (view === "years") {
        setView("months");
        setQuantityColumns(quantityMonths);
      } else if (view === "months") {
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

  const [layouts, setLayouts] = useState({
    lg: _.map(_.range(0, 2), function (item, i) {
      // 2 - quantidade de bubble
      var y = Math.ceil(Math.random() * 4) + 1;
      return {
        x: (_.random(0, 5) * 2) % 12,
        y: Math.floor(i / 6) * y,
        w: 5,
        h: y,
        i: i.toString(),
      };
    }),
  });
  const [currentBreakpoint, setCurrentBreakpoint] = useState("lg");
  const [mounted, setMounted] = useState(false);
  const [toolbox, setToolbox] = useState({
    lg: [],
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const onBreakpointChange = (breakpoint) => {
    setCurrentBreakpoint(breakpoint);
    setToolbox({
      ...toolbox,
      [breakpoint]: toolbox[breakpoint] || toolbox[currentBreakpoint] || [],
    });
  };

  const onLayoutChange = (layout, layouts) => {
    setLayouts({ ...layouts });
  };

  const onDrop = (layoutItem, _ev) => {
    const isNearExistingBlock = layouts.lg.some((existingLayout) => {
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
    const isNearExistingBlock = layouts.lg.some((existingLayout) => {
      return (
        Math.abs(existingLayout.x - newItem.x) <= 2 &&
        Math.abs(existingLayout.y - newItem.y) <= 2
      );
    });

    newItem.static = isNearExistingBlock;

    setLayouts((prevLayouts) => {
      const updatedLayouts = { ...prevLayouts };
      const index = prevLayouts.lg.findIndex((item) => item.i === newItem.i);
      updatedLayouts.lg[index] = newItem;
      return updatedLayouts;
    });
    setScrollEnabled(true);
  };

  const onResizeStop = () => {
    setScrollEnabled(true);
  };

  const generateDOM = () => {
    return _.map(layouts.lg, function (l, i) {
      return (
        <div
          key={i}
          style={{
            background: "green",
          }}
        ></div>
      );
    });
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
        <ResponsiveReactGridLayout
          //className="layout"
          rowHeight={50}
          cols={{ lg: 365, md: 10, sm: 6, xs: 4, xxs: 2 }}
          //</div>cols={{ lg: getCellWidth(), md: 10, sm: 6, xs: 4, xxs: 2 }}
          //breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          containerPadding={[0, 0]}
          style={{
            height: "100%",
          }}
          //measureBeforeMount={false}
          useCSSTransforms={mounted}
          compactType={null}
          onLayoutChange={onLayoutChange}
          //onBreakpointChange={onBreakpointChange}
          onDrop={onDrop}
          margin={[0, 7]}
          onDragStop={onDragStop}
          onDragStart={onDragStart}
          onResizeStop={onResizeStop}
          onResizeStart={onResizeStart}
          isDroppable
        >
          {generateDOM()}
        </ResponsiveReactGridLayout>
        <div style={matrixStyle}>
          {Array.from({ length: 9 }).map((_, rowIndex) => (
            <div key={rowIndex}>
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
