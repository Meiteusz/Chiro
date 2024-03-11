import React from "react";
import { SketchPicker } from "react-color";

export default function ColorPicker({ onSelect }) {
  const handleChangeComplete = (color) => {
    onSelect(color.hex);
  };

  return (
    <div style={{ position: "absolute", top: "40px", right: "5px" }}>
      <SketchPicker onChangeComplete={handleChangeComplete} />
    </div>
  );
}
