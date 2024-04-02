import React, { useState } from "react";

import { useRef } from "react";
import { useDraggable } from "react-use-draggable-scroll";

const ZoomComponent = () => {
  const [view, setView] = useState("days"); // Estado para controlar a visualização atual: 'days' para dias, 'months' para meses, 'years' para anos
  const [QUANTIDADE_ANOS, setQuantidadeAnos] = useState(3); // Quantidade de anos a serem mostrados
  const [LARGURADIAS, setLarguraDias] = useState(30); // Largura dos dias, meses ou anos
  const [LARGURAMESES, setLarguraMeses] = useState(30); // Largura dos dias, meses ou anos
  const [LARGURAANOS, setLarguraAnos] = useState(30); // Largura dos dias, meses ou anos

  const ref = useRef();
  const { events } = useDraggable(ref);

  // Função para alternar entre as visualizações: dias, meses e anos
  const switchView = () => {
    setView((prevView) => {
      if (prevView === "days") return "months";
      if (prevView === "months") return "years";
      return "days";
    });
  };

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
                padding: `5px ${LARGURADIAS}px`, // Ajuste a largura dos dias aqui
                marginTop: "5px",
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
        className="flex max-w-xl space-x-3 overflow-x-scroll scrollbar-hide"
        {...events}
        ref={ref}
        style={{
          display: "flex",
          overflowX: "auto",
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
        className="flex max-w-xl space-x-3 overflow-x-scroll scrollbar-hide"
        {...events}
        ref={ref}
        style={{
          overflowX: "auto",
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
        className="flex max-w-xl space-x-3 overflow-x-scroll scrollbar-hide"
        {...events}
        ref={ref}
        style={{
          overflowX: "auto",
          whiteSpace: "nowrap",
          border: "1px solid black",
        }}
      >
        {allYears}
      </div>
    );
  };

  ////////
  ////////
  // TA FICANDO LEGAL, PROXIMO PASSO É FAZER A TROCA DE DIAS-MESES-ANOS ATRAVÉS DO SCROLL AO ENVES DOS BOTOES
  // https://chat.openai.com/c/2d2d106d-3b6b-41ed-830c-e6488302ff19
  ////////
  ////////

  return (
    <div>
      {/* Botão para alternar entre visualização de dias, meses e anos */}
      <button onClick={switchView}>
        Trocar visão para{" "}
        {view === "days" ? "meses" : view === "months" ? "anos" : "dias"}
      </button>
      {view === "days"
        ? renderDays()
        : view === "months"
        ? renderMonths()
        : renderYears()}
    </div>
  );
};

export default ZoomComponent;
