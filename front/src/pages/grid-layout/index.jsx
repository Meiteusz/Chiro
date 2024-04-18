import Timeline from "@/components/timeline";
import React from "react";

const Divs = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: "10px", right: "10px" }}>
          <button>Meu Botão</button>
        </div>
        <div
          style={{
            flex: 1,
            overflowX: "scroll",
            border: "1px solid black",
            width: "100%",
            minWidth: "100vw",
          }}
        >
          {Array.from({ length: 20 }).map((_, index) => (
            <div
              key={index}
              style={{
                width: "300px",
                height: "100px",
                backgroundColor: "lightblue",
                margin: "10px",
              }}
            ></div>
          ))}
        </div>
        <div
          style={{
            flex: 1,
            overflowX: "scroll",
            border: "1px solid black",
            width: "100%",
            minWidth: "100vw",
          }}
        >
          <div style={{ minWidth: "200%" }}>
            <Timeline />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Divs;
