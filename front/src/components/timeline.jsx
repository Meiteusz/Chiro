import React, { useState, useEffect } from "react";

import { useRef } from "react";
import { useDraggable } from "react-use-draggable-scroll";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const Timeline = () => {
  const [view, setView] = useState("days"); // Estado para controlar a visualização atual: 'days' para dias, 'months' para meses, 'years' para anos
  const [QUANTIDADE_ANOS, setQuantidadeAnos] = useState(10); // Quantidade de anos a serem mostrados
  const [LARGURADIAS, setLarguraDias] = useState(30); // Largura dos dias, meses ou anos
  const [LARGURAMESES, setLarguraMeses] = useState(30); // Largura dos dias, meses ou anos
  const [LARGURAANOS, setLarguraAnos] = useState(30); // Largura dos dias, meses ou anos

  const ref = useRef();
  const { events } = useDraggable(ref);

  useEffect(() => {
    setQuantidadeDias(calcularQuantidadeDias());
  }, [QUANTIDADE_ANOS]);

  const calcularQuantidadeDias = () => {
    // Lógica para calcular a quantidade de dias com base nos anos
    const currentYear = new Date().getFullYear();
    let totalDias = 0;
    for (let year = currentYear; year < currentYear + QUANTIDADE_ANOS; year++) {
      for (let month = 0; month < 12; month++) {
        totalDias += new Date(year, month + 1, 0).getDate();
      }
    }
    return totalDias;
  };

  // Estado para controlar a quantidade de dias na Timeline
  const [quantidadeDias, setQuantidadeDias] = useState(
    calcularQuantidadeDias()
  );

  // Função para renderizar os dias do mês atual
  const renderDays = () => {
    const allDays = [];
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year < currentYear + QUANTIDADE_ANOS; year++) {
      for (let month = 0; month < 12; month++) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const monthDays = [];
        for (let day = 1; day <= daysInMonth; day++) {
          monthDays.push(
            <div
              key={`${year}-${month}-${day}`}
              style={{
                border: "1px solid black",
                //padding: `5px ${LARGURADIAS}px`, // Ajuste a largura dos dias aqui
                marginTop: "5px",
                width: "72px",
                height: "40px",
                textAlign: "center",
                display: "inline-block",
              }}
            >
              {day}
            </div>
          );
        }
        allDays.push(
          <div key={`${year}-${month}`} style={{ flex: "0 0 auto" }}>
            <div style={{ border: "1px solid black", marginBottom: "10px" }}>
              <div style={{ fontWeight: "bold", textAlign: "center" }}>
                {new Date(year, month).toLocaleString("default", {
                  month: "long",
                })}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
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

  // Função para renderizar os meses do ano
  const renderMonths = () => {
    const allMonths = [];
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year < currentYear + QUANTIDADE_ANOS; year++) {
      allMonths.push(
        <div key={year} style={{ display: "inline-block" }}>
          <div style={{ border: "1px solid black", marginBottom: "10px" }}>
            <div style={{ fontWeight: "bold", textAlign: "center" }}>
              {year}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {Array.from({ length: 12 }, (_, month) => (
                <div
                  key={`${year}-${month}`}
                  style={{
                    border: "1px solid black",
                    padding: `5px ${LARGURAMESES}px`, // Ajuste a largura dos meses aqui
                    display: "inline-block",
                  }}
                >
                  {new Date(year, month).toLocaleString("default", {
                    month: "long",
                  })}
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

  // Função para renderizar os anos
  const renderYears = () => {
    const allYears = [];
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year < currentYear + QUANTIDADE_ANOS; year++) {
      allYears.push(
        <div
          key={year}
          style={{
            border: "1px solid black",
            padding: `5px ${LARGURAANOS}px`, // Ajuste a largura dos anos aqui
            display: "inline-block",
          }}
        >
          {year}
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

  const handleZoom = (e) => {
    if (e.deltaY > 0) {
      if (view === "days") {
        setView("months");
      } else if (view === "months") {
        setView("years");
      }
    } else {
      if (view === "years") {
        setView("months");
      } else if (view === "months") {
        setView("days");
      }
    }
  };

  const divStyle = {
    display: "grid",
    overflowX: "auto",
    gridTemplateColumns: "repeat(366, 72px)", // COLUNAS DOS DIAS / MESES / ANOS
    gridTemplateRows: "repeat(10, 70px)", // LINHAS DOS DIAS / MESES / ANOS
  };

  const cellStyle = {
    backgroundColor: "transparent",
    border: "1px solid black",
  };

  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////

  // https://chat.openai.com/c/2d2d106d-3b6b-41ed-830c-e6488302ff19

  // ESTAMOS REDERIZANDO UMA DIV POR DIA, MAS PROVAVELMENTE QUANDO ALTERAR A VISÃO PARA MES, VAI SER RENDERIZADO UMA DIV POR MES E ASSIM VAI,
  // VAMOS VER COMO VAI SER A LÓGICA DISSO

  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////

  const renderDias = () => {
    const dias = [];
    for (let i = 0; i < quantidadeDias; i++) {
      dias.push(<div style={cellStyle} key={i}></div>);
    }
    return dias;
  };

  const handleScroll = (e) => {
    const diasContainer = document.getElementById("diasContainer");
    diasContainer.scrollTo({
      top: 0,
      left: e.target.scrollLeft,
    });
  };

  return (
    <div>
      {/*<div>
        <button
          onClick={() => setView("days")}
          style={{ border: "1px solid #000", marginRight: "10px" }}
        >
          Alterar visão - Dias
        </button>
        <button
          onClick={() => setView("months")}
          style={{ border: "1px solid #000", marginRight: "10px" }}
        >
          Alterar visão - Dias
        </button>
        <button
          onClick={() => setView("years")}
          style={{ border: "1px solid #000", marginRight: "10px" }}
        >
          Alterar visão - Dias
        </button>
      </div>*/}
      <div onWheel={handleZoom}>
        {view === "days"
          ? renderDays()
          : view === "months"
          ? renderMonths()
          : renderYears()}
      </div>
      <div
        style={divStyle}
        onScroll={handleScroll}
        onWheel={handleZoom}
        {...events}
        ref={ref}
      >
        {renderDias()}
      </div>
      {/*<TransformWrapper
          disablePadding
          onZoom={(e) => console.log(e)}
          //initialScale={1}
          //initialPositionX={200}
          //initialPositionY={100}
        >
          <TransformComponent
            wrapperStyle={{
              width: "100%",
              height: "100%",
              border: "1px solid black",
            }}
            contentStyle={{ width: "100%", height: "100%" }}
          >
            {/**Talvez um caminho seja fazer uma nova lista de bubbles aqui, assim como é no board de cima
            <div style={divStyle}>
              <div style={cellStyle}></div>
              <div style={cellStyle}></div>
              <div style={cellStyle}></div>
              <div style={cellStyle}></div>
              <div style={cellStyle}></div>
              <div style={cellStyle}></div>
              <div style={cellStyle}></div>
              <div style={cellStyle}></div>
              <div style={cellStyle}></div>
              <div style={cellStyle}></div>
              <div style={cellStyle}></div>
              <div style={cellStyle}></div>
              <div style={cellStyle}></div>
              <div style={cellStyle}></div>
              <div style={cellStyle}></div>
              <div style={cellStyle}></div>
              <div style={cellStyle}></div>
              <div style={cellStyle}></div>
              <div style={cellStyle}></div>
              <div style={cellStyle}></div>
              <div style={cellStyle}></div>
              <div style={cellStyle}></div>
              <div style={cellStyle}></div>
              <div style={cellStyle}></div>
              <div style={cellStyle}></div>
              <div style={cellStyle}></div>
              <div style={cellStyle}></div>
              <div style={cellStyle}></div>
            </div>
          </TransformComponent>
        </TransformWrapper>*/}
    </div>
  );
};

export default Timeline;
