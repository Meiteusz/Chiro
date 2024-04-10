import React, { useState, useEffect } from "react";

import { useRef } from "react";
import { useDraggable } from "react-use-draggable-scroll";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const Timeline = () => {
  const [view, setView] = useState("days");
  const ref = useRef();
  const { events } = useDraggable(ref);
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
                border: "1px solid gray",
                borderRadius: "5px",
                marginTop: "5px",
                width: `${widthDays}px`,
                height: "40px",
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
                  padding: "5px",
                  borderRight: "3px solid white",
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
                  borderRight: "3px solid white",
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
        onScroll={handleScroll}
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
                padding: "5px",
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
        onScroll={handleScroll}
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
            padding: "5px",
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
        onScroll={handleScroll}
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

  const handleScroll = (e) => {
    const diasContainer = document.getElementById("diasContainer");
    diasContainer.scrollTo({
      top: 0,
      left: e.target.scrollLeft,
    });
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

  const cellStyle = {
    width: `${getCellWidth()}px`,
    height: `${initialHeight}px`,
    border: "1px solid rgba(168, 168, 168, 0.4)",
    display: "inline-block",
  };

  const matrixStyle = {
    marginTop: "5px",
    border: "1px solid black",
    overflowX: "auto",
    whiteSpace: "nowrap",
  };

  return (
    <div>
      <div onWheel={handleZoom}>
        {view === "days"
          ? renderDays()
          : view === "months"
          ? renderMonths()
          : renderYears()}
      </div>
      <div
        style={matrixStyle}
        onScroll={handleScroll}
        onWheel={handleZoom}
        {...events}
        ref={ref}
      >
        {Array.from({ length: 9 }).map((_, rowIndex) => (
          <div key={rowIndex}>
            {Array.from({ length: quantityColumns }).map((_, colIndex) => (
              <div key={colIndex} style={cellStyle}></div>
            ))}
          </div>
        ))}
      </div>
      {/*Talvez um caminho seja fazer uma nova lista de bubbles aqui, assim como é no board de cima*/}
    </div>
  );
};

export default Timeline;
