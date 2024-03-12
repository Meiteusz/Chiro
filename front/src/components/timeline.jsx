"use client";

import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Timeline() {
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const year = new Date().getFullYear();
  const months = Array.from({ length: 12 }, (_, index) => index);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const calendarStyle = {
    width: "100%",
    overflow: "hidden",
    zIndex: "-1",
  };

  const monthStyle = {
    whiteSpace: "nowrap",
  };

  const dayStyle = {
    width: "67.3px",
    height: "40px",
    border: "1px solid #ddd",
    display: "inline-block",
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

export default Timeline;
