import SettingsIcon from "@mui/icons-material/Settings";
import { useRef, useEffect, useState } from "react";
import { TwitterPicker } from "react-color";

export default function ColorConfigModal({ onSelectColor, left }) {
  const pickerRef = useRef();
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const handleColorPickerToggle = () => {
    setIsColorPickerOpen(!isColorPickerOpen);
  };

  const handleClickOutside = (event) => {
    if (pickerRef.current && !pickerRef.current.contains(event.target)) {
      setIsColorPickerOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChangeComplete = (color) => {
    onSelectColor(color.hex);
    setIsColorPickerOpen(false);
  };

  return (
    <div>
      <SettingsIcon
        fontSize="small"
        onClick={handleColorPickerToggle}
        style={{ cursor: "pointer", marginBottom: "10px" }}
      />
      {isColorPickerOpen && (
        <div
          ref={pickerRef}
          style={{
            position: "absolute",
            top: 0,
            left: left,
            marginLeft: "20px",
          }}
        >
          <TwitterPicker onChange={handleChangeComplete} />
        </div>
      )}
    </div>
  );
}
