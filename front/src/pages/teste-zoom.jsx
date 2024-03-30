import React, { useState } from "react";

const ZoomComponent = () => {
  // Estado para controlar a visualização atual: 0 para dias, 1 para meses, 2 para anos
  const [view, setView] = useState(0);

  // Função para alternar entre as visualizações: dias, meses, anos
  const switchView = (newView) => {
    setView(newView);
  };

  // Função para renderizar os dias do mês atual
  const renderDays = () => {
    const daysInMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0
    ).getDate();

    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(
        <div
          key={i}
          style={{
            border: "1px solid black",
            padding: "5px",
            margin: "5px",
            display: "inline-block",
          }}
        >
          {i}
        </div>
      );
    }
    return days;
  };

  // Função para renderizar os meses do ano
  const renderMonths = () => {
    const months = [];
    for (let i = 0; i < 12; i++) {
      months.push(
        <div
          key={i}
          style={{
            border: "1px solid black",
            padding: "5px",
            margin: "5px",
            display: "inline-block",
          }}
        >
          {new Date(new Date().getFullYear(), i).toLocaleString("default", {
            month: "long",
          })}
        </div>
      );
    }
    return months;
  };

  // Função para renderizar os anos centrados no ano atual
  const renderYears = () => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 10;
    const endYear = currentYear + 10;

    const years = [];
    for (let i = startYear; i <= endYear; i++) {
      years.push(
        <div
          key={i}
          style={{
            border: "1px solid black",
            padding: "5px",
            margin: "5px",
            display: "inline-block",
          }}
        >
          {i}
        </div>
      );
    }
    return years;
  };

  return (
    <div>
      {/* Botões de opções para alternar entre as visualizações */}
      <div>
        <button onClick={() => switchView(0)}>Dias</button>
        <button onClick={() => switchView(1)}>Meses</button>
        <button onClick={() => switchView(2)}>Anos</button>
      </div>

      {/* Renderização condicional baseada no estado de visualização */}
      <div>
        {view === 0 && renderDays()}
        {view === 1 && renderMonths()}
        {view === 2 && renderYears()}
      </div>
    </div>
  );
};

export default ZoomComponent;
