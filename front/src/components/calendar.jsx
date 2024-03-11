"use client";

import React, { Component } from "react";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

class Calendar extends Component {
  render() {
    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const year = new Date().getFullYear();
    const months = Array.from({ length: 12 }, (_, index) => index);

    const settings = {
      infinite: true, // Alterado para true para permitir rolagem infinita
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };

    const calendarStyle = {
      width: "100%",
      overflow: "hidden", // Alterado para 'hidden' para ocultar a barra de rolagem horizontal
    };

    const monthStyle = {
      whiteSpace: "nowrap", // Impede que os dias quebrem para a próxima linha
    };

    const dayStyle = {
      width: "67.3px",
      height: "40px",
      border: "1px solid #ddd",
      display: "inline-block", // Alterado para 'inline-block' para organizar horizontalmente
      textAlign: "center",
    };

    return (
      <div style={calendarStyle}>
        <Slider {...settings}>
          {months.map((month) => (
            <div key={month} style={monthStyle}>
              {Array.from({ length: daysInMonth(year, month) }, (_, index) => (
                <div key={index} style={dayStyle}>
                  {index + 1}
                </div>
              ))}
            </div>
          ))}
        </Slider>
      </div>
    );
  }
}

export default Calendar;
