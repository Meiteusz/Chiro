import React from "react";
import { TwitterPicker } from "react-color";

function ColorPicker({ onSelect }) {
  const handleChangeComplete = (color) => {
    onSelect(color.hex);
  };

  return (
    <div style={{ position: "absolute", top: "0px", left: "180px" }}>
      <TwitterPicker onChangeComplete={handleChangeComplete} />
    </div>
  );
}

export default ColorPicker;
