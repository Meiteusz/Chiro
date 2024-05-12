"use client";

import { useState, useRef } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import AddIcon from "@mui/icons-material/Add";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import Navbar from "@/components/navbar";
import Timeline from "@/pages/project-board/timeline";
import Bubble from "@/components/bubble/bubble";
import StartEndDateModal from "@/components/modal/starts-end-date-modal";

import "@/app/globals.css";
import "./styles.css";
import "../styles.css";

const ReactGridLayout = WidthProvider(RGL);

let idCounter = 0;

const getId = () => {
  idCounter++;
  return idCounter.toString();
};

function ProjectBoard() {
  const [selectedIdBubble, setSelectedIdBubble] = useState(null);
  const [dateModalOpened, setDateModalOpened] = useState(false);
  const [currentStartsDate, setCurrentStartsDate] = useState(null);
  const [currentEndsDate, setCurrentEndsDate] = useState(null);
  const [menuBubbleOptions, setMenuBubbleOptions] = useState(null);
  const bubbleRefs = useRef([]);
  const menuBubbleOptionsOpened = Boolean(menuBubbleOptions);

  const [layout, setLayout] = useState([]);
  const [layoutCustomProps, setLayoutCustomProps] = useState([]);

  const [layoutTimeline, setLayoutTimeline] = useState();
  const [layoutCustomPropsTimeline, setLayoutCustomPropsTimeline] = useState();

  const [canDragBubbles, setCanDragBubbles] = useState(true);

  const handleAddBubble = () => {
    const newItem = {
      w: 4,
      h: 2,
      x: 10,
      y: 5,
      i: getId(),
      minW: 4,
      maxW: 10,
      minH: 2,
      maxH: 5,
    };

    const newCustomProps = {
      bubbleId: newItem.i,
      title: "",
      color: "black",
      startsDate: null,
      endsDate: null,
      trace: false,
    };

    setLayout((prevLayout) => [...prevLayout, newItem]);
    setLayoutCustomProps((prevCustomProps) => [
      ...prevCustomProps,
      newCustomProps,
    ]);
    handleCloseMenuBubbleOptions();
  };

  const handleOpenMenuBubbleOptions = (event) => {
    setMenuBubbleOptions(event.currentTarget);
  };

  const handleCloseMenuBubbleOptions = () => {
    setMenuBubbleOptions(null);
  };

  const onBubbleDragStop = (e) => {
    const layoutCopyTimeline = e.find((item) => item.y >= 26); //FOI PRA TIMELINE? (VALIDAR MELHOR) - // PEGA A UNICA BUBBLE QUE FOI PARA TIMELINE POIS SO PODE UMA POR VEZ

    if (!layoutCopyTimeline) return; // APENAS FOI ARRASTADA NO BOARD

    // Explicação da linha de cima (melhorar):
    // Ao fazer essa busca de bubbles que estão com o y >= 26, achamos a bubble que foi para a timeline caso houve
    // por que pegar o index 0? simples, porque não vamos ter mais bubbles nessa lista,
    // o máximo que ela vai trazer, vai ser uma, a mesma que foi movimentada para timeline
    // dessa forma, uma copia da bubble é criada na timeline e essa é apagada pois são dois layouts diferentes
    // (a timeline tem um layout próprio)

    setDateModalOpened(true);
    setSelectedIdBubble(layoutCopyTimeline.i);
  };

  const handleConfirmStartEndDate = () => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };

    if (currentStartsDate && currentEndsDate) {
      var diferencaEmMilissegundos = Math.abs(
        currentEndsDate - currentStartsDate
      );

      var diferencaEmDias = Math.ceil(
        diferencaEmMilissegundos / (1000 * 60 * 60 * 24) + 1
      );

      /////

      var dataInicial = new Date("2024-01-01");

      var diasComeco = Math.abs(currentStartsDate - dataInicial);

      var diasDif = Math.floor(diasComeco / (1000 * 60 * 60 * 24));

      /////

      var selectedBubbleCustomProps = layoutCustomProps.find(
        (x) => x.bubbleId === selectedIdBubble
      );

      const newItem = {
        x: diasDif,
        y: 0,
        w: diferencaEmDias,
        h: 1,
        i: getId(),
      };

      const newCustomProps = {
        bubbleId: newItem.i,
        title: selectedBubbleCustomProps.title,
        color: selectedBubbleCustomProps.color,
        startsDate: currentStartsDate,
        endsDate: currentEndsDate,
        trace: false,
      };

      setLayoutTimeline(newItem);
      setLayoutCustomPropsTimeline(newCustomProps);

      var selectedBubbleParaRastro = layout.find(
        (x) => x.i === selectedIdBubble
      );
      var selectedBubbleCustomPropsParaRastro = layoutCustomProps.find(
        (x) => x.bubbleId === selectedIdBubble
      );

      setLayout((prevLayout) =>
        prevLayout.filter((item) => item.i !== selectedIdBubble)
      );
      setLayoutCustomProps((prevLayout) =>
        prevLayout.filter((item) => item.bubbleId !== selectedIdBubble)
      );

      // --- Criação da bolha de rastro ---

      const newItemRastro = {
        w: selectedBubbleParaRastro.w,
        h: selectedBubbleParaRastro.h,
        x: 10,
        y: 5,
        i: selectedBubbleParaRastro.i,
        minW: selectedBubbleParaRastro.minW,
        maxW: selectedBubbleParaRastro.maxW,
        minH: selectedBubbleParaRastro.minH,
        maxH: selectedBubbleParaRastro.maxH,
      };

      const newCustomPropsRastro = {
        bubbleId: selectedBubbleParaRastro.i,
        title: selectedBubbleCustomPropsParaRastro.title,
        color: selectedBubbleCustomPropsParaRastro.color,
        startsDate: selectedBubbleCustomPropsParaRastro.startsDate,
        endsDate: selectedBubbleCustomPropsParaRastro.endsDate,
        trace: true,
      };

      setLayout((prevLayout) => [...prevLayout, newItemRastro]);
      setLayoutCustomProps((prevCustomProps) => [
        ...prevCustomProps,
        newCustomPropsRastro,
      ]);

      // --- Criação da bolha de rastro ---

      console.log(
        `Informações da bolha: ${JSON.stringify(
          newItem
        )}\nAtividade definida para começar ${new Date(
          currentStartsDate
        ).toLocaleDateString("pt-BR", options)} e terminar ${new Date(
          currentEndsDate
        ).toLocaleDateString("pt-BR", options)}`
      );

      setCurrentStartsDate(null);
      setCurrentEndsDate(null);
      //handleCloseStartEndDateModal();
      setDateModalOpened(false);
    }
  };

  const handleDeleteBubble = (id) => {
    setLayout((prevLayout) => prevLayout.filter((item) => item.i !== id));
  };

  const handleChangeColor = (id, color) => {
    setLayoutCustomProps((prevBubble) =>
      prevBubble.map((prevBox) =>
        prevBox.bubbleId === id
          ? {
              ...prevBox,
              color: color.hex,
            }
          : prevBox
      )
    );
  };

  const handleChangeTitle = (id, content) => {
    setLayoutCustomProps((prevBubble) =>
      prevBubble.map((prevBox) =>
        prevBox.bubbleId === id
          ? {
              ...prevBox,
              title: content,
            }
          : prevBox
      )
    );
  };

  const handleCloseStartEndDateModal = (event, reason) => {
    if (!reason) {
      setDateModalOpened(false);
      return;
    }

    let startsDate = bubbles.find((x) => x.id === selectedIdBubble).startsDate;
    let endsDate = bubbles.find((x) => x.id === selectedIdBubble).endsDate;

    if (
      !startsDate ||
      isNaN(new Date(startsDate)) ||
      !endsDate ||
      isNaN(new Date(endsDate))
    ) {
      const bubbleIndex = bubbles.findIndex(
        (bubble) => bubble.id === selectedIdBubble
      );

      if (bubbleIndex !== -1) {
        const bubbleRef = bubbleRefs.current[bubbleIndex];
        if (bubbleRef && bubbleRef.current) {
          bubbleRef.current.updatePosition({
            x:
              bubbles.find((x) => x.id === selectedIdBubble).lastPositionX ??
              300,
            y:
              bubbles.find((x) => x.id === selectedIdBubble).lastPositionY ??
              20,
          });
        }
      }

      setBubbles((prevBoxes) =>
        prevBoxes.map((box) =>
          box.id === selectedIdBubble
            ? {
                ...box,
                x:
                  bubbles.find((x) => x.id === selectedIdBubble)
                    .lastPositionX ?? 300,
                y:
                  bubbles.find((x) => x.id === selectedIdBubble)
                    .lastPositionY ?? 20,
              }
            : box
        )
      );

      setCurrentStartsDate(null);
      setCurrentEndsDate(null);
    }

    setDateModalOpened(false);
  };

  return (
    <div className="container-boards">
      <Navbar showMenu projectName="Projeto" />
      <div className="top-board">
        <StartEndDateModal
          open={dateModalOpened}
          onConfirm={handleConfirmStartEndDate}
          startdate={currentStartsDate}
          setStartDate={setCurrentStartsDate}
          endDate={currentEndsDate}
          setEndDate={setCurrentEndsDate}
        />
        <button className="add-bubble" onClick={handleOpenMenuBubbleOptions}>
          <AddIcon />
        </button>
        <Menu
          anchorEl={menuBubbleOptions}
          open={menuBubbleOptionsOpened}
          onClose={handleCloseMenuBubbleOptions}
        >
          <MenuItem onClick={handleAddBubble}>Tarefa</MenuItem>
          <MenuItem onClick={handleAddBubble}>Player</MenuItem>
          <MenuItem onClick={handleAddBubble}>Link</MenuItem>
        </Menu>
        <ReactGridLayout
          style={{
            height: "100%",
          }}
          onLayoutChange={(newLayout) => setLayout(newLayout)}
          layout={layout}
          compactType={null}
          isResizable={true}
          isDraggable={canDragBubbles}
          margin={[1, 1]}
          rowHeight={25}
          preventCollision={true}
          cols={50}
          onDragStop={onBubbleDragStop}
          containerPadding={[0, 0]}
          maxRows={46}
        >
          {layout.map((bubble) => (
            <div
              key={bubble.i}
              className="container-bubble"
              style={{
                backgroundColor:
                  (layoutCustomProps &&
                    layoutCustomProps.find((x) => x.bubbleId === bubble.i)
                      .color) ??
                  "black",
                opacity:
                  (layoutCustomProps &&
                  layoutCustomProps.find((x) => x.bubbleId === bubble.i).trace
                    ? "0.7"
                    : "1") ?? "1",
                border:
                  layoutCustomProps &&
                  layoutCustomProps.find((x) => x.bubbleId === bubble.i).trace
                    ? "5px dotted #ddd"
                    : "1px solid",
              }}
            >
              <Bubble
                bubble={bubble}
                bubbleCustomProps={
                  layoutCustomProps &&
                  layoutCustomProps.find((x) => x.bubbleId === bubble.i)
                }
                onChangeColor={handleChangeColor}
                onChangeTitle={handleChangeTitle}
                onDelete={handleDeleteBubble}
                canDrag={setCanDragBubbles}
              />
            </div>
          ))}
        </ReactGridLayout>
      </div>
      <div id="timeline" className="time-line">
        <Timeline
          layoutBubble={layoutTimeline}
          layoutBubbleProps={layoutCustomPropsTimeline}
        />
      </div>
    </div>
  );
}

export default ProjectBoard;
