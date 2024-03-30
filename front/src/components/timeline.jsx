import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Timeline() {
  const months = [
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

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const calendarStyle = {
    width: "100%",
    overflow: "hidden",
    cursor: "grab",
  };

  const monthStyle = {
    whiteSpace: "nowrap",
    fontSize: "16px",
    fontWeight: "600",
  };

  const dayStyle = {
    width: "58px",
    height: "40px",
    border: "1px solid #ddd",
    display: "inline-block",
    textAlign: "center",
  };

  let slides = [];

  let currentYear = new Date().getFullYear(); // Inicializar o ano atual

  months.forEach((month, index) => {
    const year = currentYear + Math.floor(index / 12); // Atualizar o ano conforme necessário
    slides.push(
      <div key={`${month}-${year}`}>
        <div style={monthStyle}>{`${month} de ${year}`}</div>
        <div style={monthStyle}>
          {Array.from({ length: daysInMonth(year, index % 12) }, (_, index) => (
            <div key={index} style={dayStyle}>
              {index + 1}
            </div>
          ))}
        </div>
      </div>
    );
  });

  return (
    <div style={calendarStyle}>
      <Slider {...settings}>{slides}</Slider>
    </div>
  );
}

export default Timeline;
